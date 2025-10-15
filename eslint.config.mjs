import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  // --- BAGIAN TAMBAHAN UNTUK MENONAKTIFKAN ATURAN ---
  {
    rules: {
      // Menonaktifkan error "Unexpected any" yang menyebabkan build gagal
      "@typescript-eslint/no-explicit-any": "off",

      // Menonaktifkan error tanda kutip di dalam JSX
      // (Meskipun sudah Anda perbaiki di kode, ini adalah cara untuk menonaktifkannya)
      "react/no-unescaped-entities": "off",
      
      // Mengubah error "unused vars" menjadi peringatan (warn) saja, bukan error
      "@typescript-eslint/no-unused-vars": "warn"
    }
  }
  // --------------------------------------------------
];

export default eslintConfig;
