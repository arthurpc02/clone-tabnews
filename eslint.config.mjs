import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [
      "**/.next/**",
      "**/node_modules/**",
      "**/coverage/**",
      "**/dist/**",
      "**/build/**",
      "**/package-lock.json",
      "**/*.md",
    ],
  },

  // Combined and fixed JavaScript + React block
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: {
      js,
      react: pluginReact, // explicitly mapping the react plugin
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // ensures the base parser understands JSX syntax
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // Load recommended JS and React rules manually to avoid deep merging conflicts
      ...js.configs.recommended.rules,
      ...pluginReact.configs.flat.recommended.rules,

      // React 17+ / Next.js automatic JSX runtime fixes
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",

      // This enforces that JSX usage clears the no-unused-vars flag
      "react/jsx-uses-vars": "error",
    },
  },

  {
    files: ["**/*.{test,spec}.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },

  {
    files: ["**/*.json"],
    plugins: { json },
    language: "json/json",
    extends: ["json/recommended"],
  },

  {
    files: ["**/*.jsonc"],
    plugins: { json },
    language: "json/jsonc",
    extends: ["json/recommended"],
  },

  {
    files: ["**/*.json5"],
    plugins: { json },
    language: "json/json5",
    extends: ["json/recommended"],
  },

  {
    files: ["**/*.md"],
    plugins: { markdown },
    language: "markdown/gfm",
    extends: ["markdown/recommended"],
  },

  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    extends: ["css/recommended"],
  },
]);
