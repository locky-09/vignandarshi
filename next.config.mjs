/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // ✅ Add this block to allow cross-origin dev requests
  allowedDevOrigins: ['http://192.168.29.13'], // or your actual dev IP
}

export default nextConfig
