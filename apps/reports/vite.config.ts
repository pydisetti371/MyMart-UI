import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import { defineConfig } from "vite";

export default defineConfig({
  base: "http://localhost:5176/",
  plugins: [
    react(),
    federation({
      name: "reports",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/App.tsx",
      },
      shared: {
        react: { singleton: true },
        "react/": { singleton: true },
        "react-dom": { singleton: true },
        "react-dom/": { singleton: true },
      },
    }),
  ],
  server: {
    port: 5176,
    strictPort: true,
    origin: "http://localhost:5176",
  },
});
