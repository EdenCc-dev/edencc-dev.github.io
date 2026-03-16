import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation, useParams } from "react-router-dom";
import { getAdjacentBlogPosts, getBlogPostBySlug, getRelatedBlogPosts } from "@/blog/browser";
import { BlogPostView } from "@/blog/components/BlogPostView";
import { getBlogPagePath, parseOptionalBlogPageParam } from "@/blog/pagination";
import { getBlogSiteLinks, toAbsoluteUrl } from "@/blog/site";
import type { BlogPost } from "@/blog/types";
import "@/blog/static/blog.css";

const BLOG_HEADING_SCROLL_OFFSET = 160;

function scrollToHashTarget(hash: string, behavior: ScrollBehavior = "smooth") {
  const normalizedHash = hash.replace(/^#/, "").trim();
  if (!normalizedHash) {
    return false;
  }

  const target = document.getElementById(decodeURIComponent(normalizedHash));
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  window.requestAnimationFrame(() => {
    target.scrollIntoView({ behavior, block: "start" });
  });

  return true;
}

function getActiveHeadingId(post: BlogPost | null, offset = BLOG_HEADING_SCROLL_OFFSET) {
  if (!post?.headings.length) {
    return undefined;
  }

  let nextActiveHeadingId = post.headings[0]?.id;

  for (const heading of post.headings) {
    const target = document.getElementById(heading.id);
    if (!(target instanceof HTMLElement)) {
      continue;
    }

    if (target.getBoundingClientRect().top - offset <= 0) {
      nextActiveHeadingId = heading.id;
      continue;
    }

    break;
  }

  return nextActiveHeadingId;
}

export default function BlogDetailPage() {
  const { slug = "" } = useParams();
  const location = useLocation();
  const site = getBlogSiteLinks();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [previousPost, setPreviousPost] = useState<BlogPost | undefined>();
  const [nextPost, setNextPost] = useState<BlogPost | undefined>();
  const [activeHeadingId, setActiveHeadingId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const postSlug = post?.meta.slug;
  const fromPage = parseOptionalBlogPageParam(new URLSearchParams(location.search).get("fromPage"));
  const backToBlogPath = getBlogPagePath(fromPage ?? 1);

  useEffect(() => {
    let active = true;

    Promise.all([
      getBlogPostBySlug(slug),
      getRelatedBlogPosts(slug),
      getAdjacentBlogPosts(slug),
    ])
      .then(([currentPost, nextRelatedPosts, adjacent]) => {
        if (!active) {
          return;
        }

        setPost(currentPost || null);
        setActiveHeadingId(currentPost?.headings[0]?.id);
        setRelatedPosts(nextRelatedPosts);
        setPreviousPost(adjacent.previousPost);
        setNextPost(adjacent.nextPost);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    if (!postSlug) {
      return;
    }

    const runHashScroll = () => {
      if (!window.location.hash) {
        return;
      }

      scrollToHashTarget(window.location.hash, "smooth");
    };

    const timer = window.setTimeout(runHashScroll, 0);
    window.addEventListener("hashchange", runHashScroll);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", runHashScroll);
    };
  }, [postSlug]);

  useEffect(() => {
    if (!post?.headings.length) {
      setActiveHeadingId(undefined);
      return;
    }

    let frameId = 0;

    const syncActiveHeading = () => {
      frameId = 0;
      const nextHeadingId = getActiveHeadingId(post);
      setActiveHeadingId((currentHeadingId) => {
        return currentHeadingId === nextHeadingId ? currentHeadingId : nextHeadingId;
      });
    };

    const queueSyncActiveHeading = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(syncActiveHeading);
    };

    queueSyncActiveHeading();
    window.addEventListener("scroll", queueSyncActiveHeading, { passive: true });
    window.addEventListener("resize", queueSyncActiveHeading);
    window.addEventListener("hashchange", queueSyncActiveHeading);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("scroll", queueSyncActiveHeading);
      window.removeEventListener("resize", queueSyncActiveHeading);
      window.removeEventListener("hashchange", queueSyncActiveHeading);
    };
  }, [post]);

  const handleTocNavigate = (headingId: string) => {
    const nextHash = `#${headingId}`;
    setActiveHeadingId(headingId);

    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, "", nextHash);
    }

    scrollToHashTarget(nextHash, "smooth");
  };

  if (loading) {
    return (
      <div className="pt-[7.5rem] lg:pt-[9rem] pb-16 cysic-blog">
        <div className="blog-state-card">
          <h2>Loading article...</h2>
          <p>Preparing the post content and navigation.</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-[7.5rem] lg:pt-[9rem] pb-16 cysic-blog">
        <Helmet>
          <title>Blog Post Not Found | Cysic</title>
          <meta name="robots" content="noindex,nofollow" />
        </Helmet>
        <div className="blog-state-card">
          <h2>Post not found</h2>
          <p>The requested article does not exist in the repository.</p>
          <a href={backToBlogPath} className="blog-button-link">
            Back to blog
          </a>
        </div>
      </div>
    );
  }

  const image = toAbsoluteUrl(post.meta.cover, site.siteUrl);

  return (
    <>
      <Helmet>
        <title>{`${post.meta.title} | Cysic Blog`}</title>
        <meta name="description" content={post.meta.excerpt} />
        <link rel="canonical" href={post.meta.canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.meta.title} />
        <meta property="og:description" content={post.meta.excerpt} />
        <meta property="og:url" content={post.meta.canonicalUrl} />
        <meta property="og:image" content={image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.meta.title} />
        <meta name="twitter:description" content={post.meta.excerpt} />
        <meta name="twitter:image" content={image} />
      </Helmet>
      <div className="pt-[7.5rem] lg:pt-[9rem] pb-16">
        <BlogPostView
          post={post}
          relatedPosts={relatedPosts}
          previousPost={previousPost}
          nextPost={nextPost}
          fromPage={fromPage}
          activeHeadingId={activeHeadingId}
          onTocNavigate={handleTocNavigate}
        />
      </div>
    </>
  );
}
