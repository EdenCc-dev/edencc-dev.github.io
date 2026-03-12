import dayjs from "dayjs";
import { getBlogPagePath, getBlogPostPath } from "../pagination";
import { getBlogSourceLabel } from "../shared";
import type { BlogPost } from "../types";
import { BlogBreadcrumbs } from "./BlogBreadcrumbs";
import { BlogCard } from "./BlogCard";

interface BlogPostViewProps {
  post: BlogPost;
  relatedPosts?: BlogPost[];
  previousPost?: BlogPost;
  nextPost?: BlogPost;
  fromPage?: number;
  onTocNavigate?: (headingId: string) => void;
}

export function BlogPostView({
  post,
  relatedPosts = [],
  previousPost,
  nextPost,
  fromPage,
  onTocNavigate,
}: BlogPostViewProps) {
  const blogPagePath = getBlogPagePath(fromPage ?? 1);
  const sourceLabel = getBlogSourceLabel(post.meta.sourceType);

  return (
    <article className="cysic-blog blog-post-page">
      <BlogBreadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: blogPagePath, preserveBlogPage: true },
          { label: post.meta.title, current: true },
        ]}
      />

      <section className="blog-post-hero">
        <div className="blog-post-hero__meta">
          <span>{dayjs(post.meta.date).format("MMM DD, YYYY")}</span>
          <span>·</span>
          <span>{post.readingTime} min read</span>
          <span>·</span>
          <span>{post.meta.author}</span>
        </div>
        <h1>{post.meta.title}</h1>
        <p>{post.meta.excerpt}</p>
        {post.meta.tags.length ? (
          <div className="blog-post-hero__tags">
            {post.meta.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        ) : null}
        {post.meta.cover ? (
          <div className="blog-post-hero__cover">
            <img src={post.meta.cover} alt={post.meta.title} />
          </div>
        ) : null}
      </section>

      <section className="blog-post-layout">
        <aside className="blog-post-toc">
          <div className="blog-post-toc__card">
            <span className="blog-post-toc__title">On this page</span>
            {post.headings.length ? (
              <nav>
                {post.headings.map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    className={`depth-${heading.depth}`}
                    onClick={(event) => {
                      if (!onTocNavigate) {
                        return;
                      }

                      event.preventDefault();
                      onTocNavigate(heading.id);
                    }}
                  >
                    {heading.text}
                  </a>
                ))}
              </nav>
            ) : (
              <p>No sections</p>
            )}
            {post.meta.sourceUrl ? (
              <a
                href={post.meta.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="blog-post-toc__source"
              >
                {`Originally published on ${sourceLabel}`}
              </a>
            ) : null}
          </div>
        </aside>

        <div className="blog-post-layout__content">
          <div className="blog-prose" dangerouslySetInnerHTML={{ __html: post.html }} />
        </div>
      </section>

      <section className="blog-post-pagination">
        {previousPost ? (
          <a
            href={getBlogPostPath(previousPost.meta.slug, fromPage)}
            className="blog-pagination-card"
            data-blog-preserve-from-page="true"
          >
            <span>Previous</span>
            <strong>{previousPost.meta.title}</strong>
          </a>
        ) : <div className="blog-pagination-card blog-pagination-card--empty" />}
        {nextPost ? (
          <a
            href={getBlogPostPath(nextPost.meta.slug, fromPage)}
            className="blog-pagination-card blog-pagination-card--align-right"
            data-blog-preserve-from-page="true"
          >
            <span>Next</span>
            <strong>{nextPost.meta.title}</strong>
          </a>
        ) : <div className="blog-pagination-card blog-pagination-card--empty" />}
      </section>

      {relatedPosts.length ? (
        <section className="blog-related-posts">
          <div className="blog-section-heading">
            <span>Related reads</span>
            <h2>Keep exploring Cysic</h2>
          </div>
          <div className="blog-card-grid">
            {relatedPosts.map((relatedPost) => (
              <BlogCard
                key={relatedPost.meta.slug}
                post={relatedPost}
                fromPage={fromPage}
                preserveFromPage
              />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
