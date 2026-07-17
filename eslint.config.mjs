import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Migration/utility scripts — not production code
    "scripts/**",
    // Devin agent hooks — not production code
    ".devin/**",
    // Root-level throwaway exploration scripts
    "extract-page-titles.js",
    "extract-specific-pages.js",
    // Cloned reference repos — read-only design source of truth
    "reference/**",
  ]),
  {
    files: ["**/*.tsx"],

    rules: {
      "max-lines": [
        "error",
        { max: 400, skipBlankLines: true, skipComments: true },
      ],
      "react/no-multi-comp": ["error", { ignoreStateless: false }],
    },
  },
]);

export default eslintConfig;
