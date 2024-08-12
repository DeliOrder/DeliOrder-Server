module.exports = {
  extends: ["eslint:recommended"],
  rules: {
    "prefer-arrow-callback": "warn",
    "func-style": ["error", "expression", { allowArrowFunctions: true }],
    "no-console": "warn",
  },
  extends: ["airbnb", "plugin:prettier/recommended"],
  plugins: ["prettier"],
};
