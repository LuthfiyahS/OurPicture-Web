/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"],
  },
  env: {
    ourpicture_api_url: process.env.OURPICTURE_API_URL,
    ourpicture_api_file_url: process.env.OURPICTURE_FILE_URL,
  },
  swcMinify: true,
}

module.exports = nextConfig
