/* eslint-disable react-refresh/only-export-components */
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { BlogHomeView } from "../components/BlogHomeView";
import { BlogPostView } from "../components/BlogPostView";
import { getBlogPageCanonical } from "../pagination";
import { toAbsoluteUrl, type BlogSiteLinks } from "../site";
import type { BlogPost } from "../types";

export interface BuiltAppAssets {
  modulePreloads: string[];
  stylesheets: string[];
  moduleScripts: string[];
}

function getPageMeta({
  site,
  post,
  currentPage = 1,
}: {
  site: BlogSiteLinks;
  post?: BlogPost;
  currentPage?: number;
}) {
  if (!post) {
    return {
      title: currentPage > 1 ? `${site.siteName} Blog | Page ${currentPage}` : `${site.siteName} Blog`,
      description: "Technical deep dives, product updates, and research from the Cysic team.",
      canonicalUrl: getBlogPageCanonical(site.siteUrl, currentPage),
      image: `${site.siteUrl}/landing_bg.png`,
    };
  }

  return {
    title: `${post.meta.title} | ${site.siteName} Blog`,
    description: post.meta.excerpt,
    canonicalUrl: post.meta.canonicalUrl,
    image: toAbsoluteUrl(post.meta.cover, site.siteUrl),
  };
}

function ArticleJsonLd({ site, post }: { site: BlogSiteLinks; post: BlogPost }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.meta.title,
    description: post.meta.excerpt,
    author: {
      "@type": "Organization",
      name: post.meta.author,
    },
    publisher: {
      "@type": "Organization",
      name: site.siteName,
      logo: {
        "@type": "ImageObject",
        url: `${site.siteUrl}/logo.svg`,
      },
    },
    datePublished: post.meta.date,
    dateModified: post.meta.date,
    mainEntityOfPage: post.meta.canonicalUrl,
    image: [toAbsoluteUrl(post.meta.cover, site.siteUrl)],
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

interface BlogDocumentProps {
  site: BlogSiteLinks;
  posts: BlogPost[];
  assets: BuiltAppAssets;
  currentPage?: number;
  post?: BlogPost;
  relatedPosts?: BlogPost[];
  previousPost?: BlogPost;
  nextPost?: BlogPost;
}

function BlogDocument({
  site,
  posts,
  assets,
  currentPage = 1,
  post,
  relatedPosts,
  previousPost,
  nextPost,
}: BlogDocumentProps) {
  const page = getPageMeta({ site, post, currentPage });

  return (
    <html lang="en" data-theme="dark" className="new-year">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={page.description} />
        <meta name="robots" content="index,follow" />
        <meta name="theme-color" content="#000000" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={site.twitterHandle} />
        <meta name="twitter:creator" content={site.twitterHandle} />
        <meta name="twitter:title" content={page.title} />
        <meta name="twitter:description" content={page.description} />
        <meta name="twitter:image" content={page.image} />
        <meta property="og:type" content={post ? "article" : "website"} />
        <meta property="og:site_name" content={site.siteName} />
        <meta property="og:title" content={page.title} />
        <meta property="og:description" content={page.description} />
        <meta property="og:url" content={page.canonicalUrl} />
        <meta property="og:image" content={page.image} />
        <link rel="canonical" href={page.canonicalUrl} />
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&family=Teachers:ital,wght@0,400..800;1,400..800&family=Unbounded:wght@200..900&display=swap"
          rel="stylesheet"
        />
        {assets.modulePreloads.map((href) => (
          <link key={href} rel="modulepreload" href={href} crossOrigin="" />
        ))}
        {assets.stylesheets.map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
        <title>{page.title}</title>
        {post ? <ArticleJsonLd site={site} post={post} /> : null}
      </head>
      <body>
        <div id="root">
          {post ? (
            <div className="pt-[7.5rem] lg:pt-[9rem] pb-16">
              <BlogPostView
                post={post}
                relatedPosts={relatedPosts}
                previousPost={previousPost}
                nextPost={nextPost}
              />
            </div>
          ) : (
            <div className="pt-[7.5rem] lg:pt-[9rem] pb-16">
              <BlogHomeView posts={posts} currentPage={currentPage} />
            </div>
          )}
        </div>
        {assets.moduleScripts.map((src) => (
          <script key={src} type="module" src={src} crossOrigin=""></script>
        ))}
      </body>
    </html>
  );
}

export function renderBlogDocument(props: BlogDocumentProps): string {
  return `<!DOCTYPE html>${renderToStaticMarkup(<BlogDocument {...props} />)}`;
}
