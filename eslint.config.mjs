import path from "node:path";
import { fileURLToPath } from "node:url";

import js from "@eslint/js";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default tseslint.config(
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "dist/**",
      "coverage/**",
      // Next generated typing shim; don't lint it.
      "next-env.d.ts",
      // Legacy / vendor-like JS blobs (not in TS project).
      "js/**",
      "script.js",
    ],
  },
  js.configs.recommended,
  {
    // JS files: keep it simple (no TS project awareness).
    files: ["**/*.{js,jsx,mjs,cjs}"],
    languageOptions: {
      globals: {
        process: "readonly",
      },
    },
    rules: {
      "no-undef": "off",
    },
  },
  ...tseslint.configs.recommended,
  {
    // TS files: enable project-aware parsing for better checks.
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // Keep lint useful but non-blocking for existing code.
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/triple-slash-reference": "off",
    },
  },
);

