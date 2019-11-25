const withCSS = require("@zeit/next-css");
const withTM = require("next-transpile-modules");
const withPlugins = require("next-compose-plugins");
const path = require("path");
const withSourceMaps = require("@zeit/next-source-maps");

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
    webpack: (config, options) => {
      // Fixes npm packages that depend on `fs` module
      config.node = {
        fs: "empty",
      };

      config.resolve.alias["~"] = path.resolve(__dirname);

      return config;
    },
  }
);
