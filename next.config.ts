import path from 'path';
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Configuración de fallbacks para módulos de Node.js no disponibles en el navegador
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false, // Ignorar 'fs' en el cliente
        path: false,
        os: false,
      };

      // Evitar errores con 'brotli'
      config.externals = {
        ...config.externals,
        brotli: 'brotli',
        turbo: false,
      };
    }

    // Handle SVG files
    const fileLoaderRule = config.module.rules.find((rule: any) => rule.test?.test?.('.svg'));
    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule?.issuer,
        resourceQuery: { not: [...(fileLoaderRule?.resourceQuery?.not || []), /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      }
    );

    // Exclude SVG from the existing rule
    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    return config;
  },
};

export default nextConfig;
