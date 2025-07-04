const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const ANALYZE = process.env.ANALYZE;
const path = require("path");
const withTM = require("next-transpile-modules")(["@quantfive/js-web-config"]);
// const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  experimental: {
    forceSwcTransforms: true,
    largePageDataBytes: 500 * 100000,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // experimental: {
  //   runtime: "experimental-edge", // 'node.js' (default) | 'experimental-edge'
  // },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "researchhub-paper-dev1.s3.amazonaws.com",
      "researchhub-paper-prod.s3.amazonaws.com",
      "researchhub.com",
      "lh3.googleusercontent.com",
      "lh5.googleusercontent.com",
      "d2ogkcqdn9wsvr.cloudfront.net",
    ],
  },
  env: {
    SENTRY_RELEASE: process.env.SENTRY_RELEASE,
    REACT_APP_ENV: process.env.REACT_APP_ENV,
    HOST: process.env.HOST,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    ORCID_CLIENT_ID: process.env.ORCID_CLIENT_ID,
    ORCID_KID: process.env.ORCID_KID,
    RECAPTCHA_CLIENT_KEY: process.env.RECAPTCHA_CLIENT_KEY,
    SIFT_BEACON_KEY: process.env.SIFT_BEACON_KEY,
    GA_TRACKING_ID: process.env.GA_TRACKING_ID,
    WEB3_INFURA_API_KEY: process.env.WEB3_INFURA_API_KEY,
    WEB3_WALLET_CONNECT_PROJECT_ID: process.env.WEB3_WALLET_CONNECT_PROJECT_ID,
    WITH_PERSONA_ENVIRONMENT_ID: process.env.WITH_PERSONA_ENVIRONMENT_ID,
    WITH_PERSONA_TEMPLATE_ID: process.env.WITH_PERSONA_TEMPLATE_ID,
    STORAGE_DOMAIN: process.env.STORAGE_DOMAIN,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Load Markdown Configuration
    config.module.rules.push({
      test: /\.md$/,
      use: "raw-loader",
    });

    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      http: false,
      https: false,
      stream: false,
      crypto: false,
    };

    if (ANALYZE && !isServer) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "server",
          analyzerPort: isServer ? 8888 : 8889,
          openAnalyzer: true,
          generateStatsFile: true,
        })
      );
    }

    config.resolve.alias["~"] = path.resolve(__dirname);
    config.resolve.extensions = [".js", ".json", ".ts", ".tsx"];
    return config;
  },
  async redirects() {
    return [
      {
        source: "/bounty/:id/:title",
        destination: "/post/:id/:title",
        permanent: true,
      },
      {
        source: "/all",
        destination: "/",
        permanent: true,
      },
      {
        source: "/user/:authorId",
        destination: "/author/:authorId",
        permanent: true,
      },
      {
        source: "/user/:authorId/overview",
        destination: "/author/:authorId",
        permanent: true,
      },
      {
        source: "/user/:authorId/discussions",
        destination: "/author/:authorId/comments",
        permanent: true,
      },
      {
        source: "/user/:authorId/authored-papers",
        destination: "/author/:authorId/publications",
        permanent: true,
      },
      {
        source: "/user/:authorId/bounties",
        destination: "/author/:authorId/bounties",
        permanent: true,
      },
      {
        source: "/author/:authorId/bounties",
        destination: "/author/:authorId/grants",
        permanent: true,
      },
      {
        source: "/paper/:paperId/:slug/bounties",
        destination: "/paper/:paperId/:slug/grants",
        permanent: true,
      },
      {
        source: "/post/:postId/:slug/bounties",
        destination: "/post/:postId/:slug/grants",
        permanent: true,
      },
      {
        source: "/question/:postId/:slug/bounties",
        destination: "/question/:postId/:slug/grants",
        permanent: true,
      },
      {
        source: "/referral",
        destination: "/",
        permanent: true,
      },
      {
        source: "/referral/:id",
        destination: "/",
        permanent: true,
      },
      {
        source: "/my-hubs",
        destination: "/for-you",
        permanent: true,
      },
      {
        source: "/bounties",
        destination: "/grants",
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/robots.txt",
        destination: "/api/robots",
      },
    ];
  },
};

// module.exports = withTM({ ...nextConfig });

// Kobe 12-07-22: Temporarily turning this off to see
// If it is necessary given vercel has a dashboard integration
const SentryWebpackPluginOptions = {
  silent: true,
  disableClientWebpackPlugin: false,
  hideSourceMaps: true,
};

module.exports = withTM({ ...nextConfig });

// module.exports = withSentryConfig(
//   withTM({ ...nextConfig }),
//   SentryWebpackPluginOptions
// );
