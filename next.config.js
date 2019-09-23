const withCSS = require("@zeit/next-css");
const withTM = require("next-transpile-modules");
const withPlugins = require("next-compose-plugins");

module.exports = withPlugins(
  [
    [withCSS],
    [
      withTM,
      {
        transpileModules: ["@quantfive/js-web-config"]
      }
    ]
  ],
  {
    webpack: config => {
      // Fixes npm packages that depend on `fs` module
      config.node = {
        fs: "empty"
      };

      return config;
    }
  }
);
