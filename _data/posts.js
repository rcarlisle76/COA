const { createClient } = require("@sanity/client");

const client = createClient({
  projectId: "pbgk36lr",
  dataset: "production",
  useCdn: true,
  apiVersion: "2024-01-01",
});

function portableTextToHtml(blocks) {
  if (!blocks || !Array.isArray(blocks)) return "";
  return blocks
    .map((block) => {
      if (block._type !== "block") return "";
      const tagMap = {
        h1: "h1", h2: "h2", h3: "h3", h4: "h4",
        blockquote: "blockquote", normal: "p",
      };
      const tag = tagMap[block.style] || "p";
      const html = (block.children || [])
        .map((span) => {
          let text = (span.text || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
          const marks = span.marks || [];
          if (marks.includes("strong")) text = `<strong>${text}</strong>`;
          if (marks.includes("em")) text = `<em>${text}</em>`;
          if (marks.includes("code")) text = `<code>${text}</code>`;
          return text;
        })
        .join("");
      return `<${tag}>${html}</${tag}>`;
    })
    .filter(Boolean)
    .join("\n");
}

function getExcerpt(body, length = 160) {
  if (!body || !Array.isArray(body)) return "";
  const text = body
    .filter((b) => b._type === "block")
    .map((b) => (b.children || []).map((c) => c.text || "").join(""))
    .join(" ");
  return text.length > length ? text.slice(0, length).trim() + "..." : text;
}

module.exports = async function () {
  try {
    const posts = await client.fetch(`
      *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
        _id,
        title,
        slug,
        publishedAt,
        body,
        "author": author->name
      }
    `);
    return posts.map((post) => ({
      ...post,
      bodyHTML: portableTextToHtml(post.body),
      excerpt: getExcerpt(post.body),
    }));
  } catch (err) {
    console.error("Sanity fetch error:", err.message);
    return [];
  }
};
