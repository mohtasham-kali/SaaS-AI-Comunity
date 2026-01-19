import type { NextConfig } from 'next';

const nextConfig: NextConfig = {

  /* config options here */
  experimental: {
    turbo: {
      resolveAlias: {
        handlebars: 'handlebars/dist/handlebars.js',
      },
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  serverExternalPackages: ['@genkit-ai/ai', '@genkit-ai/core', '@genkit-ai/flow', 'genkit', 'genkitx-anthropic', 'genkitx-mistral'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      handlebars: 'handlebars/dist/handlebars.js',
    };
    return config;
  },
};

export default nextConfig;
