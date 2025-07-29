import path from 'path';
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true, // Opcional, pero recomendado
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
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

export default nextConfig;
