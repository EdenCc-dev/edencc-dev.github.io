import { getBlogSiteLinks } from "../site";
import { getBlogPagePath, paginateBlogPosts } from "../pagination";
import type { BlogPost } from "../types";
import { BlogBreadcrumbs } from "./BlogBreadcrumbs";
import { BlogCard } from "./BlogCard";

interface BlogHomeViewProps {
  posts: BlogPost[];
  isLoading?: boolean;
  currentPage?: number;
}

export function BlogHomeView({ posts, isLoading = false, currentPage = 1 }: BlogHomeViewProps) {
  const site = getBlogSiteLinks();
  const pagination = paginateBlogPosts(posts, currentPage);
  const pageNumbers = Array.from({ length: pagination.pageCount }, (_, index) => index + 1);
  const fromPage = pagination.currentPage > 1 ? pagination.currentPage : undefined;

  return (
    <div className="cysic-blog">
      <BlogBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", current: true }]} />

      <section className="blog-home-hero">
        <span className="blog-home-hero__eyebrow">Cysic Blog</span>
        <h1>Insights from the frontier of ZK compute.</h1>
        <p>
          Technical deep dives, ecosystem updates, product launches, and research notes from the Cysic team.
        </p>
      </section>

      {isLoading ? (
        <section className="blog-state-card">
          <h2>Loading articles...</h2>
          <p>Preparing the latest posts from the repository.</p>
        </section>
      ) : null}

      {!isLoading && pagination.featuredPost ? (
        <section className="blog-featured-grid">
          <BlogCard post={pagination.featuredPost} featured fromPage={fromPage} />
        </section>
      ) : null}

      {!isLoading && !pagination.featuredPost && pagination.currentPage === 1 ? (
        <section className="blog-state-card">
          <h2>No posts yet</h2>
          <p>
            Save article HTML files into <code>content/html</code>, run <code>yarn blog:import</code>, and the
            generated Markdown posts will show up here.
          </p>
          <div className="blog-empty-actions">
            <a href={site.mediumUrl} target="_blank" rel="noreferrer" className="blog-button-link">
              Open Medium
            </a>
            <a href={site.hackmdUrl} target="_blank" rel="noreferrer" className="blog-button-link">
              Open HackMD
            </a>
          </div>
        </section>
      ) : null}

      {!isLoading && pagination.pagePosts.length > 0 ? (
        <section className="blog-card-grid">
          {pagination.pagePosts.map((post) => (
            <BlogCard key={post.meta.slug} post={post} fromPage={fromPage} />
          ))}
        </section>
      ) : null}

      {!isLoading && pagination.pageCount > 1 ? (
        <section className="blog-list-pagination" aria-label="Blog pagination">
          <div className="blog-list-pagination__summary">
            <span>Page</span>
            <strong>{`${pagination.currentPage} / ${pagination.pageCount}`}</strong>
          </div>
          <nav className="blog-list-pagination__nav">
            {pagination.currentPage > 1 ? (
              <a href={getBlogPagePath(pagination.currentPage - 1)} className="blog-list-pagination__link">
                Previous
              </a>
            ) : (
              <span className="blog-list-pagination__link blog-list-pagination__link--disabled" aria-disabled="true">
                Previous
              </span>
            )}

            {pageNumbers.map((pageNumber) => {
              if (pageNumber === pagination.currentPage) {
                return (
                  <span
                    key={pageNumber}
                    className="blog-list-pagination__link blog-list-pagination__link--current"
                    aria-current="page"
                  >
                    {pageNumber}
                  </span>
                );
              }

              return (
                <a key={pageNumber} href={getBlogPagePath(pageNumber)} className="blog-list-pagination__link">
                  {pageNumber}
                </a>
              );
            })}

            {pagination.currentPage < pagination.pageCount ? (
              <a href={getBlogPagePath(pagination.currentPage + 1)} className="blog-list-pagination__link">
                Next
              </a>
            ) : (
              <span className="blog-list-pagination__link blog-list-pagination__link--disabled" aria-disabled="true">
                Next
              </span>
            )}
          </nav>
        </section>
      ) : null}
    </div>
  );
}
