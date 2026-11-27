import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "table/index": "src/table/index.ts",
  },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  splitting: true,
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "tailwindcss",
    "radix-ui",
    "@radix-ui/react-slot",
    "@tanstack/react-table",
    "class-variance-authority",
    "cmdk",
    "cn",
    "lucide-react",
    "react-hook-form",
    "solar-icon-set",
    "sonner",
    "zod",
  ],
});
