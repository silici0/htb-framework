/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Allow importing .json files
    config.module.rules.push({
      test: /\.json$/,
      type: 'json',
    });

    return config;
  },
};

module.exports = nextConfig;
