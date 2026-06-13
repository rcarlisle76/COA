module.exports = function (eleventyConfig) {
  // Pass existing static files through unchanged
  eleventyConfig.addPassthroughCopy("index.html");
  eleventyConfig.addPassthroughCopy("contacts.html");
  eleventyConfig.addPassthroughCopy("styles.css");
  eleventyConfig.addPassthroughCopy("script.js");
  eleventyConfig.addPassthroughCopy("favicon.svg");
  eleventyConfig.addPassthroughCopy("coa-auditing-logo.svg");
  eleventyConfig.addPassthroughCopy("googlea42d3f3530f10f19.html");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("sitemap.xml");

  // Don't process these directories as templates
  eleventyConfig.ignores.add("server/**");
  eleventyConfig.ignores.add("node_modules/**");
  eleventyConfig.ignores.add("_site/**");
  eleventyConfig.ignores.add("api/**");
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("VERCEL_DEPLOYMENT.md");

  eleventyConfig.addFilter("readableDate", (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  eleventyConfig.addFilter("isoDate", (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  });

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
