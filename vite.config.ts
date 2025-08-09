import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@assets", replacement: path.resolve(__dirname, "./src/assets") },
      {
        find: "@components",
        replacement: path.resolve(__dirname, "./src/components"),
      },
      {
        find: "@configs",
        replacement: path.resolve(__dirname, "./src/configs"),
      },
      {
        find: "@contexts",
        replacement: path.resolve(__dirname, "./src/contexts"),
      },
      { find: "@hooks", replacement: path.resolve(__dirname, "./src/hooks") },
      { find: "@pages", replacement: path.resolve(__dirname, "./src/pages") },
      {
        find: "@services",
        replacement: path.resolve(__dirname, "./src/services"),
      },
      { find: "@state", replacement: path.resolve(__dirname, "./src/state") },
      { find: "@utils", replacement: path.resolve(__dirname, "./src/utils") },
      { find: "@", replacement: path.resolve(__dirname, "./src") },
    ],
  },
});
