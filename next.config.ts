import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'export', // Add this line to export static HTML
  images: {
    unoptimized: true, // Add this line
  },
};

export default nextConfig;
