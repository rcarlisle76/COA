module.exports = {
  layout: "base.njk",
  eleventyComputed: {
    title: (data) => (data.post ? data.post.title : data.title || "Blog"),
    description: (data) =>
      data.post ? data.post.excerpt : data.description || "",
  },
};
