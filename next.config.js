const withCSS = require("@zeit/next-css");
const withTM = require("next-transpile-modules");
const withPlugins = require("next-compose-plugins");
const path = require("path");

module.exports = withPlugins(
  [
    [withCSS],
    [
      withTM,
      {
        transpileModules: ["@quantfive/js-web-config"],
      },
    ],
  ],
  {
    webpack: (config) => {
      // Fixes npm packages that depend on `fs` module
      config.node = {
        fs: "empty",
      };

      config.resolve.alias["~"] = path.resolve(__dirname);

      return config;
    },
  }
);
