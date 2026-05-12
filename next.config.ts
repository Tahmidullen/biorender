import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

/** Keeps Turbopack from treating the parent `Biorender/` folder as the app root when multiple lockfiles exist. */
const appRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: appRoot,
  },
};

export default nextConfig;
