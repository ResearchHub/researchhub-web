const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const ANALYZE = process.env.ANALYZE;
const path = require("path");
const withPlugins = require("next-compose-plugins");
const withSourceMaps = require("@zeit/next-source-maps");
const withTM = require("next-transpile-modules")(["@quantfive/js-web-config"]);

module.exports = withPlugins([[withTM], [withSourceMaps]], {
  webpack5: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
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
    return config;
  },
  env: {
    SENTRY_RELEASE: process.env.SENTRY_RELEASE,
    REACT_APP_ENV: process.env.REACT_APP_ENV,
  },
});
