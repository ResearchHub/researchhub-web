const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const ANALYZE = process.env.ANALYZE;
const path = require("path");
const withCSS = require("@zeit/next-css");
const withPlugins = require("next-compose-plugins");
const withSourceMaps = require("@zeit/next-source-maps");
const withTM = require("next-transpile-modules");

module.exports = withPlugins(
  [
    [withCSS],
    [withSourceMaps],
    [
      withTM,
      {
        transpileModules: ["@quantfive/js-web-config"],
      },
    ],
  ],
  {
    productionBrowserSourceMaps: true,
    webpack: (config, { isServer }) => {
      // Fixes npm packages that depend on `fs` module
      config.node = {
        fs: "empty",
        net: "empty",
        tls: "empty",
      };

      config.resolve.alias["~"] = path.resolve(__dirname);

      if (ANALYZE && !isServer) {
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: "server",
            analyzerPort: isServer ? 8888 : 8889,
            openAnalyzer: true,
          })
        );
      }
      return config;
    },
    env: {
      SENTRY_RELEASE: process.env.SENTRY_RELEASE,
      REACT_APP_ENV: process.env.REACT_APP_ENV,
    },
  }
);
