const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const ANALYZE = process.env.ANALYZE;
const path = require("path");
const withPlugins = require("next-compose-plugins");
const withSourceMaps = require("@zeit/next-source-maps");
const withTM = require("next-transpile-modules")(["@quantfive/js-web-config"]);
const { withSentryConfig } = require("@sentry/nextjs");

const moduleExports = withPlugins([[withTM], [withSourceMaps]], {
  webpack5: true,
  // hmr: false,
  typescript: {
    ignoreBuildErrors: true,
  },
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
  env: {
    SENTRY_RELEASE: process.env.SENTRY_RELEASE,
    REACT_APP_ENV: process.env.REACT_APP_ENV,
    HOST: process.env.HOST,
    RECAPTCHA_CLIENT_KEY: process.env.RECAPTCHA_CLIENT_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    SENTRY_DSN: process.env.SENTRY_DSN,
    GA_TRACKING_ID: process.env.GA_TRACKING_ID,
    ELASTIC_APM_URL: process.env.ELASTIC_APM_URL,
    ORCID_CLIENT_ID: process.env.ORCID_CLIENT_ID,
    ORCID_KID: process.env.ORCID_KID,
    WEB3_INFURA_PROJECT_ID: process.env.WEB3_INFURA_PROJECT_ID,
    SIFT_BEACON_KEY: process.env.SIFT_BEACON_KEY,
  },
  async redirects() {
    return [
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
});

const SentryWebpackPluginOptions = {
  silent: true,
};

module.exports = withSentryConfig(moduleExports, SentryWebpackPluginOptions);
