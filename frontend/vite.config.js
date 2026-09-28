import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr({
      // Cho phép import SVG dưới dạng React component bằng cách thêm hậu tố ?react (Ví dụ: import Logo from "./logo.svg?react")
      svgrOptions: {
        icon: true,
      },
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  build: {
    rolldownOptions: {
      output: {
        // Tách vendor libraries thành các chunk riêng
        advancedChunks: {
          groups: [
            { name: "vendor-react", test: /node_modules\/(react|react-dom|react-router)/ },
            { name: "vendor-icons", test: /node_modules\/lucide-react/ },
            { name: "vendor-three", test: /node_modules\/(three|@react-three)/ },
            { name: "vendor-motion", test: /node_modules\/framer-motion/ },
            { name: "vendor-axios", test: /node_modules\/axios/ },
          ],
        },
      },
    },
    // Tăng giới hạn warning lên 600KB
    chunkSizeWarningLimit: 600,
  },
});

