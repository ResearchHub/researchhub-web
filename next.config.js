const withCSS = require("@zeit/next-css");
const withTM = require("next-transpile-modules");
const withPlugins = require("next-compose-plugins");
const path = require("path");
const withSourceMaps = require("@zeit/next-source-maps");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const ANALYZE = process.env.ANALYZE;

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
    webpack: (config, { isServer }) => {
      // Fixes npm packages that depend on `fs` module
      config.node = {
        fs: "empty",
        net: "empty",
        tls: "empty",
      };

      config.resolve.alias["~"] = path.resolve(__dirname);

      if (ANALYZE) {
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
