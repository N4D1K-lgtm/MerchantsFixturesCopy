// vite.config.js
import { defineConfig } from "file:///C:/Users/Kidan/Documents/GitHub/Merchants-Fixture-3D-App/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Kidan/Documents/GitHub/Merchants-Fixture-3D-App/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
import ObjFileImport from "file:///C:/Users/Kidan/Documents/GitHub/Merchants-Fixture-3D-App/node_modules/unplugin-obj/dist/vite.mjs";
import fs from "file:///C:/Users/Kidan/Documents/GitHub/Merchants-Fixture-3D-App/node_modules/fs-extra/lib/index.js";
var __vite_injected_original_dirname = "C:\\Users\\Kidan\\Documents\\GitHub\\Merchants-Fixture-3D-App";
var copyVendorsAndHtaccess = (outputDir) => {
  return {
    name: "copy-vendors-and-htaccess",
    writeBundle() {
      fs.copySync("vendor", path.join(outputDir, "vendor"));
      fs.copySync("vendor/.htaccess", path.join(outputDir, ".htaccess"));
    }
  };
};
var vite_config_default = defineConfig(({ mode }) => {
  const isProduction = mode === "production";
  const outputDir = isProduction ? "demo/dist" : "demo/dev";
  return {
    plugins: [
      react(),
      ObjFileImport(),
      copyVendorsAndHtaccess(outputDir)
    ],
    babel: {
      presets: ["@babel/preset-env", "@babel/preset-react"],
      plugins: ["@babel/plugin-proposal-class-properties"]
    },
    resolve: {
      alias: {
        "@catalog": path.resolve(__vite_injected_original_dirname, "src/catalog")
      }
    },
    build: {
      target: "esnext",
      outDir: outputDir
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxLaWRhblxcXFxEb2N1bWVudHNcXFxcR2l0SHViXFxcXE1lcmNoYW50cy1GaXh0dXJlLTNELUFwcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcS2lkYW5cXFxcRG9jdW1lbnRzXFxcXEdpdEh1YlxcXFxNZXJjaGFudHMtRml4dHVyZS0zRC1BcHBcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0tpZGFuL0RvY3VtZW50cy9HaXRIdWIvTWVyY2hhbnRzLUZpeHR1cmUtM0QtQXBwL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgT2JqRmlsZUltcG9ydCBmcm9tICd1bnBsdWdpbi1vYmovdml0ZSc7XHJcbmltcG9ydCBmcyBmcm9tICdmcy1leHRyYSc7XHJcblxyXG5jb25zdCBjb3B5VmVuZG9yc0FuZEh0YWNjZXNzID0gKG91dHB1dERpcikgPT4ge1xyXG4gIHJldHVybiB7XHJcbiAgICBuYW1lOiAnY29weS12ZW5kb3JzLWFuZC1odGFjY2VzcycsXHJcbiAgICB3cml0ZUJ1bmRsZSgpIHtcclxuICAgICAgZnMuY29weVN5bmMoJ3ZlbmRvcicsIHBhdGguam9pbihvdXRwdXREaXIsICd2ZW5kb3InKSk7XHJcbiAgICAgIGZzLmNvcHlTeW5jKCd2ZW5kb3IvLmh0YWNjZXNzJywgcGF0aC5qb2luKG91dHB1dERpciwgJy5odGFjY2VzcycpKTtcclxuICAgIH1cclxuICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xyXG4gIGNvbnN0IGlzUHJvZHVjdGlvbiA9IG1vZGUgPT09ICdwcm9kdWN0aW9uJztcclxuICBjb25zdCBvdXRwdXREaXIgPSBpc1Byb2R1Y3Rpb24gPyAnZGVtby9kaXN0JyA6ICdkZW1vL2Rldic7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgIHJlYWN0KCksXHJcbiAgICAgIE9iakZpbGVJbXBvcnQoKSxcclxuICAgICAgY29weVZlbmRvcnNBbmRIdGFjY2VzcyhvdXRwdXREaXIpXHJcbiAgICBdLFxyXG4gICAgYmFiZWw6IHtcclxuICAgICAgcHJlc2V0czogW1wiQGJhYmVsL3ByZXNldC1lbnZcIiwgXCJAYmFiZWwvcHJlc2V0LXJlYWN0XCJdLFxyXG4gICAgICBwbHVnaW5zOiBbXCJAYmFiZWwvcGx1Z2luLXByb3Bvc2FsLWNsYXNzLXByb3BlcnRpZXNcIl0sXHJcbiAgICB9LFxyXG5cclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgYWxpYXM6IHtcclxuICAgICAgICBcIkBjYXRhbG9nXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL2NhdGFsb2dcIiksXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG5cclxuICAgIGJ1aWxkOiB7XHJcbiAgICAgIHRhcmdldDogJ2VzbmV4dCcsXHJcbiAgICAgIG91dERpcjogb3V0cHV0RGlyLFxyXG4gICAgfSxcclxuICB9O1xyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFzVyxTQUFTLG9CQUFvQjtBQUNuWSxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sbUJBQW1CO0FBQzFCLE9BQU8sUUFBUTtBQUpmLElBQU0sbUNBQW1DO0FBTXpDLElBQU0seUJBQXlCLENBQUMsY0FBYztBQUM1QyxTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixjQUFjO0FBQ1osU0FBRyxTQUFTLFVBQVUsS0FBSyxLQUFLLFdBQVcsUUFBUSxDQUFDO0FBQ3BELFNBQUcsU0FBUyxvQkFBb0IsS0FBSyxLQUFLLFdBQVcsV0FBVyxDQUFDO0FBQUEsSUFDbkU7QUFBQSxFQUNGO0FBQ0Y7QUFFQSxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUN4QyxRQUFNLGVBQWUsU0FBUztBQUM5QixRQUFNLFlBQVksZUFBZSxjQUFjO0FBRS9DLFNBQU87QUFBQSxJQUNMLFNBQVM7QUFBQSxNQUNQLE1BQU07QUFBQSxNQUNOLGNBQWM7QUFBQSxNQUNkLHVCQUF1QixTQUFTO0FBQUEsSUFDbEM7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNMLFNBQVMsQ0FBQyxxQkFBcUIscUJBQXFCO0FBQUEsTUFDcEQsU0FBUyxDQUFDLHlDQUF5QztBQUFBLElBQ3JEO0FBQUEsSUFFQSxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxZQUFZLEtBQUssUUFBUSxrQ0FBVyxhQUFhO0FBQUEsTUFDbkQ7QUFBQSxJQUNGO0FBQUEsSUFFQSxPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsTUFDUixRQUFRO0FBQUEsSUFDVjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
