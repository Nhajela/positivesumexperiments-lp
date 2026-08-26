// XML rendering for the machine-readable endpoints.
//
// The documents are built from the same serialized objects as the JSON, so the
// two formats stay in step. The element names are the contract; the namespace
// carries the version, which is why it is a fixed canonical URL rather than
// `site.url` (that one moves on preview deploys).

import { site } from "@/lib/site";
import type {
  JsonExperiment,
  JsonHypothesis,
  JsonPost,
  JsonTag,
  JsonTagDetail,
} from "./serialize";
import { API_VERSION } from "./serialize";

const NS = `https://positivesumexperiments.com/ns/${API_VERSION}`;

// -------------------------------------------------------------- the builder

type Attrs = Record<string, string | number | null | undefined>;

export type XmlNode = {
  name: string;
  attrs?: Attrs;
  children?: (XmlNode | null)[];
  /** Escaped inline text. */
  text?: string;
  /** Wrapped in CDATA — for prose that would otherwise need heavy escaping. */
  cdata?: string;
};

function escapeText(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(value: string): string {
  return escapeText(value).replace(/"/g, "&quot;");
}

/** The one sequence CDATA cannot contain: close the section and reopen it. */
function escapeCdata(value: string): string {
  return value.replaceAll("]]>", "]]]]><![CDATA[>");
}

function renderAttrs(attrs: Attrs | undefined): string {
  if (!attrs) return "";
  return Object.entries(attrs)
    .filter(([, v]) => v !== null && v !== undefined)
    .map(([k, v]) => ` ${k}="${escapeAttr(String(v))}"`)
    .join("");
}

function renderNode(node: XmlNode, depth: number): string {
  const pad = "  ".repeat(depth);
  const open = `${pad}<${node.name}${renderAttrs(node.attrs)}`;

  if (node.cdata !== undefined) {
    return `${open}><![CDATA[${escapeCdata(node.cdata)}]]></${node.name}>`;
  }
  if (node.text !== undefined) {
    return `${open}>${escapeText(node.text)}</${node.name}>`;
  }

  const children = (node.children ?? []).filter(
    (child): child is XmlNode => child !== null,
  );
  if (children.length === 0) return `${open} />`;

  const inner = children.map((c) => renderNode(c, depth + 1)).join("\n");
  return `${open}>\n${inner}\n${pad}</${node.name}>`;
}

export function renderDocument(root: XmlNode): string {
  return `<?xml version="1.0" encoding="UTF-8"?>\n${renderNode(root, 0)}\n`;
}

/** An element, dropped entirely when it has nothing to say. */
function text(name: string, value: string | null | undefined): XmlNode | null {
  return value ? { name, text: value } : null;
}

// ------------------------------------------------------------ shared pieces

function tagsNode(tags: JsonTag[]): XmlNode | null {
  if (tags.length === 0) return null;
  return {
    name: "tags",
    children: tags.map((t) => ({
      name: "tag",
      attrs: {
        id: t.id,
        group: t.group.id,
        href: t.url,
        placeholder: t.placeholder ? "true" : null,
      },
      text: t.label,
    })),
  };
}

/** A tag as the subject: same attributes, plus its prose. */
function tagDetailNode(tag: JsonTagDetail): XmlNode {
  return {
    name: "tag",
    attrs: {
      id: tag.id,
      slug: tag.slug,
      group: tag.group.id,
      href: tag.url,
      placeholder: tag.placeholder ? "true" : null,
    },
    children: [text("label", tag.label), bodyNode(tag.body)],
  };
}

function bodyNode(body: JsonExperiment["body"]): XmlNode | null {
  if (!body) return null;
  return { name: "body", attrs: { format: body.format }, cdata: body.source };
}

function rootAttrs(count: number): Attrs {
  return {
    xmlns: NS,
    version: API_VERSION,
    generated: new Date().toISOString(),
    source: site.url,
    count,
  };
}

// ---------------------------------------------------------------- documents

function experimentNode(e: JsonExperiment): XmlNode {
  return {
    name: "experiment",
    attrs: {
      id: e.id,
      slug: e.slug,
      status: e.status,
      href: e.url,
      placeholder: e.placeholder ? "true" : null,
    },
    children: [
      text("title", e.title),
      {
        name: "hypothesis",
        attrs: { id: e.hypothesis.id, href: e.hypothesis.url },
        text: e.hypothesis.title,
      },
      tagsNode(e.tags),
      {
        name: "dates",
        attrs: {
          created: e.dates.created,
          started: e.dates.started,
          ended: e.dates.ended,
          plannedDurationDays: e.dates.plannedDurationDays,
        },
      },
      bodyNode(e.body),
    ],
  };
}

export function experimentsXml(experiments: JsonExperiment[]): string {
  return renderDocument({
    name: "experiments",
    attrs: rootAttrs(experiments.length),
    children: experiments.map(experimentNode),
  });
}

function hypothesisNode(h: JsonHypothesis): XmlNode {
  return {
    name: "hypothesis",
    attrs: {
      id: h.id,
      slug: h.slug,
      href: h.url,
      created: h.dates.created,
      placeholder: h.placeholder ? "true" : null,
    },
    children: [
      text("title", h.title),
      text("statement", h.statement),
      tagsNode(h.tags),
      h.core.length > 0
        ? {
            name: "core",
            children: h.core.map((p) => ({
              name: "principle",
              attrs: { id: p.id, number: p.number, href: p.url },
              text: p.title,
            })),
          }
        : null,
      h.related.length > 0
        ? {
            name: "related",
            children: h.related.map((r) => ({
              name: "hypothesis",
              attrs: { id: r.id, href: r.url },
              text: r.title,
            })),
          }
        : null,
      h.experiments.length > 0
        ? {
            name: "experiments",
            children: h.experiments.map((e) => ({
              name: "experiment",
              attrs: { id: e.id, status: e.status, href: e.url },
              text: e.title,
            })),
          }
        : null,
      bodyNode(h.body),
    ],
  };
}

export function hypothesesXml(items: JsonHypothesis[]): string {
  return renderDocument({
    name: "hypotheses",
    attrs: rootAttrs(items.length),
    children: items.map(hypothesisNode),
  });
}

function postNode(p: JsonPost): XmlNode {
  return {
    name: "post",
    attrs: {
      id: p.id,
      slug: p.slug,
      href: p.url,
      published: p.dates.published,
      updated: p.dates.updated,
      placeholder: p.placeholder ? "true" : null,
    },
    children: [
      text("title", p.title),
      text("summary", p.summary),
      tagsNode(p.tags),
      bodyNode(p.body),
    ],
  };
}

export function postsXml(items: JsonPost[]): string {
  return renderDocument({
    name: "posts",
    attrs: rootAttrs(items.length),
    children: items.map(postNode),
  });
}

/** Everything in one document — the XML twin of /api/graph. */
export function graphXml(input: {
  hypotheses: JsonHypothesis[];
  experiments: JsonExperiment[];
  posts: JsonPost[];
  tagGroups: { id: string; label: string; tags: JsonTagDetail[] }[];
  core: { id: string; number: number; title: string; url: string }[];
}): string {
  return renderDocument({
    name: "positiveSumExperiments",
    attrs: rootAttrs(
      input.hypotheses.length + input.experiments.length + input.posts.length,
    ),
    children: [
      {
        name: "core",
        children: input.core.map((p) => ({
          name: "principle",
          attrs: { id: p.id, number: p.number, href: p.url },
          text: p.title,
        })),
      },
      {
        name: "tagGroups",
        children: input.tagGroups.map((g) => ({
          name: "tagGroup",
          attrs: { id: g.id },
          children: [
            text("label", g.label),
            { name: "tags", children: g.tags.map(tagDetailNode) },
          ],
        })),
      },
      { name: "hypotheses", children: input.hypotheses.map(hypothesisNode) },
      { name: "experiments", children: input.experiments.map(experimentNode) },
      { name: "posts", children: input.posts.map(postNode) },
    ],
  });
}

// --------------------------------------------------------------------- RSS

/** RSS 2.0 for the blog, for readers rather than for programs. */
export function rssFeed(posts: JsonPost[], feedUrl: string): string {
  const latest = posts[0]?.dates.published;

  return renderDocument({
    name: "rss",
    attrs: { version: "2.0", "xmlns:atom": "http://www.w3.org/2005/Atom" },
    children: [
      {
        name: "channel",
        children: [
          text("title", `${site.name} — blog`),
          text("link", `${site.url}/blog`),
          text("description", site.description),
          text("language", "en"),
          latest ? text("lastBuildDate", new Date(latest).toUTCString()) : null,
          {
            name: "atom:link",
            attrs: { href: feedUrl, rel: "self", type: "application/rss+xml" },
          },
          ...posts.map(
            (p): XmlNode => ({
              name: "item",
              children: [
                text("title", p.title),
                text("link", p.url),
                { name: "guid", attrs: { isPermaLink: "true" }, text: p.url },
                text("pubDate", new Date(p.dates.published).toUTCString()),
                p.summary ? { name: "description", cdata: p.summary } : null,
                ...p.tags.map(
                  (t): XmlNode => ({ name: "category", text: t.label }),
                ),
              ],
            }),
          ),
        ],
      },
    ],
  });
}
