/* eslint-disable react-refresh/only-export-components */
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { BlogHomeView } from "../components/BlogHomeView";
import { BlogPostView } from "../components/BlogPostView";
import { toAbsoluteUrl, type BlogSiteLinks } from "../site";
import { buildStaticFooterNavs, buildStaticHeaderNavs, type StaticNavItem } from "./navigation";
import type { BlogPost } from "../types";

function SocialLinks({ site }: { site: BlogSiteLinks }) {
  return (
    <div className="blog-social-links">
      <a href={site.discordUrl} target="_blank" rel="noreferrer">
        Discord
      </a>
      <a href={site.telegramUrl} target="_blank" rel="noreferrer">
        Telegram
      </a>
      <a href={site.twitterUrl} target="_blank" rel="noreferrer">
        X
      </a>
      <a href={site.mediumUrl} target="_blank" rel="noreferrer">
        Medium
      </a>
    </div>
  );
}

function StaticNavTree({ items }: { items: StaticNavItem[] }) {
  return (
    <>
      {items.map((item) => {
        if (item.children?.length) {
          return (
            <div key={item.content} className="blog-static-nav__item blog-static-nav__item--group">
              <button type="button">{item.content}</button>
              <div className="blog-static-nav__dropdown">
                <StaticNavTree items={item.children} />
              </div>
            </div>
          );
        }

        return (
          <a
            key={item.content}
            href={item.href}
            target={item.href?.startsWith("http") ? "_blank" : undefined}
            rel={item.href?.startsWith("http") ? "noreferrer" : undefined}
            className="blog-static-nav__item-link"
          >
            {item.content}
            {item.label ? <span className="blog-nav-badge">{item.label}</span> : null}
          </a>
        );
      })}
    </>
  );
}

function StaticMobileNav({ items }: { items: StaticNavItem[] }) {
  return (
    <div className="blog-static-mobile-nav" data-blog-mobile-nav hidden>
      {items.map((item) => {
        if (item.children?.length) {
          return (
            <details key={item.content} className="blog-static-mobile-nav__group">
              <summary>{item.content}</summary>
              <div className="blog-static-mobile-nav__children">
                <StaticMobileNav items={item.children} />
              </div>
            </details>
          );
        }

        return (
          <a
            key={item.content}
            href={item.href}
            target={item.href?.startsWith("http") ? "_blank" : undefined}
            rel={item.href?.startsWith("http") ? "noreferrer" : undefined}
          >
            {item.content}
          </a>
        );
      })}
    </div>
  );
}

function StaticShell({ site, children }: { site: BlogSiteLinks; children: React.ReactNode }) {
  const headerNavs = buildStaticHeaderNavs(site);
  const footerNavs = buildStaticFooterNavs(site);

  return (
    <div className="blog-static-shell">
      <header className="blog-static-header">
        <div className="blog-shell-container blog-static-header__inner">
          <a href="/" className="blog-static-header__brand" aria-label="Cysic home">
            <img src="/cysic-logo/white.svg" alt="Cysic" />
          </a>
          <nav className="blog-static-nav" aria-label="Primary navigation">
            <StaticNavTree items={headerNavs} />
          </nav>
          <a href={site.appUrl} target="_blank" rel="noreferrer" className="blog-static-header__cta">
            Get Started
          </a>
          <button
            type="button"
            className="blog-static-header__menu"
            data-blog-menu-toggle
            aria-expanded="false"
          >
            Menu
          </button>
        </div>
        <div className="blog-shell-container">
          <StaticMobileNav items={headerNavs} />
        </div>
      </header>

      <main className="blog-static-main">{children}</main>

      <footer className="blog-static-footer">
        <div className="blog-shell-container blog-static-footer__inner">
          <a href="/" className="blog-static-footer__brand">
            <img src="/cysic-logo/white.svg" alt="Cysic" />
          </a>
          <div className="blog-static-footer__links">
            {footerNavs.map((item) => (
              <a
                key={item.content}
                href={item.href}
                target={item.href?.startsWith("http") ? "_blank" : undefined}
                rel={item.href?.startsWith("http") ? "noreferrer" : undefined}
              >
                {item.content}
              </a>
            ))}
          </div>
          <SocialLinks site={site} />
        </div>
      </footer>
    </div>
  );
}

function getPageMeta({ site, post }: { site: BlogSiteLinks; post?: BlogPost }) {
  if (!post) {
    return {
      title: `${site.siteName} Blog`,
      description: "Technical deep dives, product updates, and research from the Cysic team.",
      canonicalUrl: `${site.siteUrl}/blog/`,
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
  post?: BlogPost;
  relatedPosts?: BlogPost[];
  previousPost?: BlogPost;
  nextPost?: BlogPost;
}

function BlogDocument({ site, posts, post, relatedPosts, previousPost, nextPost }: BlogDocumentProps) {
  const page = getPageMeta({ site, post });

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={page.description} />
        <meta name="robots" content="index,follow" />
        <meta name="theme-color" content="#090a09" />
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&family=Teachers:ital,wght@0,400..800;1,400..800&family=Unbounded:wght@200..900&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/blog-assets/blog.css" />
        <title>{page.title}</title>
        {post ? <ArticleJsonLd site={site} post={post} /> : null}
      </head>
      <body className="blog-static-body">
        <StaticShell site={site}>
          {post ? (
            <BlogPostView
              post={post}
              relatedPosts={relatedPosts}
              previousPost={previousPost}
              nextPost={nextPost}
            />
          ) : (
            <BlogHomeView posts={posts} />
          )}
        </StaticShell>
        <script src="/blog-assets/blog.js" defer></script>
      </body>
    </html>
  );
}

export function renderBlogDocument(props: BlogDocumentProps): string {
  return `<!DOCTYPE html>${renderToStaticMarkup(<BlogDocument {...props} />)}`;
}
