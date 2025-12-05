import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  eslint: {
    ignoreDuringBuilds: true,   // ⬅️ Evita que el build falle por reglas de ESLint
  },

  typescript: {
    ignoreBuildErrors: true,    // ⬅️ Evita que los errores TS bloqueen el build
  },

  experimental: {
    // ...tus otros flags si los necesitas
  },
};

export default nextConfig;
