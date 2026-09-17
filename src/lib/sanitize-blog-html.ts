const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "strike",
  "a",
  "ul",
  "ol",
  "li",
  "h2",
  "h3",
  "blockquote",
  "hr",
  "code",
  "pre",
]);

const VOID_TAGS = new Set(["br", "hr"]);
const DROP_WITH_CONTENTS = new Set([
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "link",
  "meta",
  "noscript",
  "template",
]);

const TAG_ALIASES: Record<string, string> = {
  b: "strong",
  i: "em",
  strike: "s",
};

type OpenTag = {
  name: string;
  emit: boolean;
};

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function decodeEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(Number(num)));
}

function isSafeHref(href: string): boolean {
  const normalized = decodeEntities(href)
    .trim()
    .replace(/[\u0000-\u001f\u007f]/g, "");
  if (!normalized) return false;

  const lower = normalized.toLowerCase();
  if (lower.startsWith("//")) return false;
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("file:")
  ) {
    return false;
  }
  if (
    lower.startsWith("https:") ||
    lower.startsWith("http:") ||
    lower.startsWith("mailto:")
  ) {
    return true;
  }
  if (
    lower.startsWith("/") ||
    lower.startsWith("#") ||
    lower.startsWith("?")
  ) {
    return true;
  }
  return false;
}

function parseAttributes(raw: string): Array<[string, string]> {
  const attrs: Array<[string, string]> = [];
  const re =
    /([^\s"'>=/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(raw))) {
    attrs.push([
      match[1]!.toLowerCase(),
      match[2] ?? match[3] ?? match[4] ?? "",
    ]);
  }
  return attrs;
}

function hrefFromAttributes(raw: string): string | null {
  for (const [name, value] of parseAttributes(raw)) {
    if (name === "href" && isSafeHref(value)) {
      return decodeEntities(value).trim();
    }
  }
  return null;
}

function emitOpenTag(name: string, attrRaw: string): string | null {
  if (name === "a") {
    const href = hrefFromAttributes(attrRaw);
    if (!href) return null;
    return `<a href="${escapeAttr(href)}" rel="noopener noreferrer nofollow" target="_blank">`;
  }
  if (VOID_TAGS.has(name)) {
    return `<${name}>`;
  }
  return `<${name}>`;
}

/**
 * Allowlisted HTML sanitizer for public blog bodies.
 *
 * Implemented in-repo so `/blogs/[slug]` does not import `sanitize-html`
 * (CJS + serverExternalPackages), which 500s the whole route on Vercel
 * even for unknown slugs.
 */
export function sanitizeBlogHtml(html: string): string {
  if (!html) return "";

  let out = "";
  let index = 0;
  let skipping: string | null = null;
  const open: OpenTag[] = [];

  while (index < html.length) {
    if (html[index] !== "<") {
      const next = html.indexOf("<", index);
      const text = next === -1 ? html.slice(index) : html.slice(index, next);
      if (!skipping) out += text;
      index = next === -1 ? html.length : next;
      continue;
    }

    if (html.startsWith("<!--", index)) {
      const end = html.indexOf("-->", index + 4);
      index = end === -1 ? html.length : end + 3;
      continue;
    }

    if (html.startsWith("<!", index) || html.startsWith("<?", index)) {
      const end = html.indexOf(">", index + 2);
      index = end === -1 ? html.length : end + 1;
      continue;
    }

    const close = html.indexOf(">", index + 1);
    if (close === -1) {
      if (!skipping) out += "&lt;";
      index += 1;
      continue;
    }

    const rawTag = html.slice(index + 1, close);
    index = close + 1;
    const isClose = rawTag.startsWith("/");
    const body = (isClose ? rawTag.slice(1) : rawTag).replace(/\/\s*$/, "").trim();
    const space = body.search(/\s/);
    const rawName = (space === -1 ? body : body.slice(0, space)).toLowerCase();
    const attrRaw = space === -1 ? "" : body.slice(space);
    const name = TAG_ALIASES[rawName] ?? rawName;
    const selfClosing = VOID_TAGS.has(name) || rawTag.trimEnd().endsWith("/");

    if (skipping) {
      if (isClose && rawName === skipping) skipping = null;
      continue;
    }

    if (!isClose && DROP_WITH_CONTENTS.has(rawName)) {
      if (!selfClosing) skipping = rawName;
      continue;
    }

    if (!ALLOWED_TAGS.has(rawName) && !ALLOWED_TAGS.has(name)) {
      continue;
    }

    if (isClose) {
      for (let i = open.length - 1; i >= 0; i -= 1) {
        if (open[i]!.name !== name) continue;
        const closed = open.splice(i);
        for (let j = closed.length - 1; j >= 0; j -= 1) {
          const frame = closed[j]!;
          if (frame.emit && !VOID_TAGS.has(frame.name)) {
            out += `</${frame.name}>`;
          }
        }
        break;
      }
      continue;
    }

    const emitted = emitOpenTag(name, attrRaw);
    if (emitted) out += emitted;

    if (!selfClosing) {
      open.push({ name, emit: Boolean(emitted) });
    }
  }

  for (let i = open.length - 1; i >= 0; i -= 1) {
    const frame = open[i]!;
    if (frame.emit && !VOID_TAGS.has(frame.name)) {
      out += `</${frame.name}>`;
    }
  }

  return out;
}
