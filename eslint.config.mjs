import { defineConfig, globalIgnores } from "eslint/config"
import js from "@eslint/js"
import astro from "eslint-plugin-astro"
import tseslint from "typescript-eslint"
import globals from "globals"

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    files: ["scripts/**", "astro.config.mjs"],
    languageOptions: { globals: globals.node },
  },
  {
    // TypeScript already reports undefined names, and casts hold escape codes.
    rules: { "no-undef": "off", "no-control-regex": "off" },
  },
  globalIgnores(["out/**", ".astro/**"]),
])
