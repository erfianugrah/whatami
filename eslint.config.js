export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        Request: "readonly",
        Response: "readonly",
        Headers: "readonly",
        fetch: "readonly",
        navigator: "readonly",
        document: "readonly",
        setTimeout: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
    },
  },
  {
    ignores: ["node_modules/**"],
  },
];
