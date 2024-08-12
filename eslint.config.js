module.exports = [
  {
    rules: {
      "prefer-const": "error",
    },
    ignores: [
      "node_modules",
      "dist",
      "build",
      "*.min.js",
      "*.min.css",
      "public/*.html",
      "config.js",
      "src/legacy/**/*.js",
    ],
  },
];
