/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        port: "",
        pathname: "/vi/**",
      },
    ],
  },
  // transpilePackages: ["@radix-ui/react-dropdown-menu"],
  // webpack: (config) => {
  //   // Add this line to handle .mjs files
  //   config.resolve.extensions.push(".js", ".jsx", ".ts", ".tsx", ".mjs");

  //   config.module.rules.push({
  //     test: /\.mjs$/,
  //     include: /node_modules/,
  //     type: "javascript/auto",
  //   });

  //   return config;
  // },
  // webpack: (config, options) => {
  //   config.module.rules.push({
  //     test: /\.mjs/,
  //     include: /node_modules/,
  //     type: "javascript/auto",
  //   });
  //   return config;
  // },

  // experimental: {
  //   esmExternals: false,
  // },
};

export default nextConfig;
