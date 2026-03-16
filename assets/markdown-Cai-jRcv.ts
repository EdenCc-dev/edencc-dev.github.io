import GithubSlugger from "github-slugger";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import type { Element, Root as HastRoot } from "hast";
import type { Heading, Root as MdastRoot } from "mdast";
import type { BlogHeading } from "./types";

const defaultAnchorAttributes = defaultSchema.attributes?.a || [];

const sanitizeSchema = {
  ...defaultSchema,
  clobberPrefix: "",
  tagNames: [...(defaultSchema.tagNames || []), "img", "figure", "figcaption", "span"],
  attributes: {
    ...defaultSchema.attributes,
    a: [
      ...defaultAnchorAttributes.filter((attribute) => {
        return !(Array.isArray(attribute) && attribute[0] === "className");
      }),
      ["className", "data-footnote-backref", "blog-heading-anchor"],
      "target",
      "rel",
      "aria-label",
    ],
    img: [...(defaultSchema.attributes?.img || []), "src", "alt", "title", "loading", "width", "height", "className"],
    span: [...(defaultSchema.attributes?.span || []), "className"],
    code: [...(defaultSchema.attributes?.code || []), "className"],
    pre: [...(defaultSchema.attributes?.pre || []), "className"],
    h1: [...(defaultSchema.attributes?.h1 || []), "id", "className"],
    h2: [...(defaultSchema.attributes?.h2 || []), "id", "className"],
    h3: [...(defaultSchema.attributes?.h3 || []), "id", "className"],
    h4: [...(defaultSchema.attributes?.h4 || []), "id", "className"],
    h5: [...(defaultSchema.attributes?.h5 || []), "id", "className"],
    h6: [...(defaultSchema.attributes?.h6 || []), "id", "className"],
    div: [...(defaultSchema.attributes?.div || []), "className"],
  },
};

type MarkdownNode = {
  type?: string;
  value?: string;
  children?: MarkdownNode[];
};

function rehypeExternalLinks() {
  return (tree: HastRoot) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "a") {
        return;
      }

      const href = String(node.properties?.href || "");
      if (!href || href.startsWith("/") || href.startsWith("#")) {
        return;
      }

      node.properties = {
        ...node.properties,
        target: "_blank",
        rel: "noopener noreferrer",
      };
    });
  };
}

function extractText(node: MarkdownNode | undefined): string {
  if (!node) {
    return "";
  }

  if (node.type === "text" || node.type === "inlineCode") {
    return String(node.value || "");
  }

  if (!Array.isArray(node.children)) {
    return "";
  }

  return node.children.map((child) => extractText(child)).join("");
}

function normalizeMathMarkdown(markdown: string): string {
  return markdown.replace(/\$\$([\s\S]*?)\$\$/g, (_match, content: string) => {
    const normalizedContent = content
      .replace(/\\cases\{([\s\S]*?)\n\s*\}/g, (_casesMatch, casesContent: string) => {
        return `\\begin{cases}${casesContent}\n\\end{cases}`;
      })
      .replace(/\$([^$]+)\$/g, "$1")
      .replace(/，/g, ",");

    return `$$${normalizedContent}$$`;
  });
}

export async function renderBlogMarkdown(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: "wrap",
      properties: { className: ["blog-heading-anchor"] },
    })
    .use(rehypeSanitize, sanitizeSchema)
    .use(rehypeKatex, {
      throwOnError: false,
      strict: "ignore",
    })
    .use(rehypeHighlight, { ignoreMissing: true })
    .use(rehypeExternalLinks)
    .use(rehypeStringify)
    .process(normalizeMathMarkdown(markdown));

  return String(result);
}

export async function extractBlogHeadings(markdown: string): Promise<BlogHeading[]> {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown) as MdastRoot;
  const slugger = new GithubSlugger();
  const headings: BlogHeading[] = [];

  visit(tree, "heading", (node: Heading) => {
    if (node.depth < 2 || node.depth > 3) {
      return;
    }

    const text = extractText(node as unknown as MarkdownNode).trim();
    if (!text) {
      return;
    }

    headings.push({
      depth: node.depth,
      text,
      id: slugger.slug(text),
    });
  });

  return headings;
}
