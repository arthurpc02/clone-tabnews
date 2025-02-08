import globals from "globals";
import pluginJs from "@eslint/js";
// import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
        require: "readonly",
        exports: "readonly",
        process: "readonly",
        module: "readonly",
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  pluginJs.configs.recommended,
  // pluginReact.configs.flat.recommended,
  {
    ignores: ["*.next/*"],
  },
];
