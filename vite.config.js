import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import ObjFileImport from 'unplugin-obj/vite';
import fs from 'fs-extra';

const copyVendorsAndHtaccess = (outputDir) => {
  return {
    name: 'copy-vendors-and-htaccess',
    writeBundle() {
      fs.copySync('vendor', path.join(outputDir, 'vendor'));
      fs.copySync('vendor/.htaccess', path.join(outputDir, '.htaccess'));
    }
  };
};

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  const outputDir = isProduction ? 'demo/dist' : 'demo/dev/dist';

  return {
    plugins: [
      react(),
      ObjFileImport(),
      copyVendorsAndHtaccess(outputDir)
    ],
    babel: {
      presets: ["@babel/preset-env", "@babel/preset-react"],
      plugins: ["@babel/plugin-proposal-class-properties"],
    },

    resolve: {
      alias: {
        "@catalog": path.resolve(__dirname, "src/catalog"),
      },
    },

    build: {
      target: 'esnext',
      outDir: outputDir,
    },
  };
});
