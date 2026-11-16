import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { federation } from "@module-federation/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: "mymart_shell",
      remotes: {
        billing: {
          type: "module",
          name: "billing",
          entry: "http://localhost:5174/remoteEntry.js",
          entryGlobalName: "billing",
          shareScope: "default",
        },
        products: {
          type: "module",
          name: "products",
          entry: "http://localhost:5175/remoteEntry.js",
          entryGlobalName: "products",
          shareScope: "default",
        },
        reports: {
          type: "module",
          name: "reports",
          entry: "http://localhost:5176/remoteEntry.js",
          entryGlobalName: "reports",
          shareScope: "default",
        },
      },
      shared: {
        react: { singleton: true },
        "react/": { singleton: true },
        "react-dom": { singleton: true },
        "react-dom/": { singleton: true },
      },
      dev: { remoteHmr: true },
    }),
  ],
});
