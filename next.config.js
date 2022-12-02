const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const ANALYZE = process.env.ANALYZE;
const path = require("path");
const withTM = require("next-transpile-modules")(["@quantfive/js-web-config"]);
const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  experimental: {
    forceSwcTransforms: true,
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
      "researchhub-paper-dev1.s3.amazonaws.com",
      "researchhub-paper-prod.s3.amazonaws.com",
      "researchhub.com",
    ],
  },
  env: {
    SENTRY_RELEASE: process.env.SENTRY_RELEASE,
    REACT_APP_ENV: process.env.REACT_APP_ENV,
    HOST: process.env.HOST,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    ORCID_CLIENT_ID: process.env.ORCID_CLIENT_ID,
    ORCID_KID: process.env.ORCID_KID,
    WEB3_INFURA_PROJECT_ID: process.env.WEB3_INFURA_PROJECT_ID,
    RECAPTCHA_CLIENT_KEY: process.env.RECAPTCHA_CLIENT_KEY,
    SIFT_BEACON_KEY: process.env.SIFT_BEACON_KEY,
    ELASTIC_APM_URL: process.env.ELASTIC_APM_URL,
    GA_TRACKING_ID: process.env.GA_TRACKING_ID,
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
    config.resolve.extensions = [".ts", ".tsx", ".js"];
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
        source: "/scicon2022",
        destination: "https://researchhubevents.wixsite.com/scicon2022",
        permanent: true,
        basePath: false,
      },
      {
        source: "/all",
        destination: "/",
        permanent: true,
      },
      {
        source: "/user/:authorId",
        destination: "/user/:authorId/overview",
        permanent: true,
      },
    ];
  },
};

module.exports = withTM({ ...nextConfig });

const SentryWebpackPluginOptions = {
  silent: true,
  disableClientWebpackPlugin: false,
};

module.exports = withSentryConfig(
  withTM({ ...nextConfig }),
  SentryWebpackPluginOptions
);
