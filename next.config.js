// const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
// const ANALYZE = process.env.ANALYZE;
const path = require("path");
// // const withCSS = require("@zeit/next-css");
// const withPlugins = require("next-compose-plugins");
// const withSourceMaps = require("@zeit/next-source-maps");
const withTM = require("next-transpile-modules")(["@quantfive/js-web-config"]);

// module.exports = withPlugins(
//   [
//     [withTM, {transpileModules: ["@quantfive/js-web-config"]}]
//   ],
//   {
//    webpack: (config, options) => {
//
//      config.resolve.fallback = {
//           fs: false,
//           net: false,
//           tls: false,
//      }
//
//       config.resolve.alias["~"] = path.resolve(__dirname);
//
//
//
//      return config;
//    }
//   },
// );

//
// module.exports =
//   {
//    webpack: (config, options) => {
//
//      config.resolve.fallback = {
//           fs: false,
//           net: false,
//           tls: false,
//      }
//
//       config.resolve.alias["~"] = path.resolve(__dirname);
//
//
//
//      return config;
//    }
//   }

module.exports = withTM({
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.fallback = {
      // fs: false,
      // net: false,
      // tls: false,
    };

    config.resolve.alias["~"] = path.resolve(__dirname);
    return config;
  },
});

// module.exports = withPlugins(
//   [
//     // [withCSS],
//     // [withSourceMaps],
//      // [
//        // withTM,
//        // {
//        //   transpileModules: ["@quantfive/js-web-config"],
//        // },
//      // ],
//   ],
//   {
//     productionBrowserSourceMaps: true,
//     webpack: (config, { isServer }) => {
//       // Fixes npm packages that depend on `fs` module
//       // config.node = {
//       //   fs: "empty",
//       //   net: "empty",
//       //   tls: "empty",
//       // };
//
//       // config.mode = REACT_APP_ENV === "production" ? "production" : "development";
//
//        config.resolve.alias["~"] = path.resolve(__dirname);
//
//       // if (ANALYZE && !isServer) {
//       //   config.plugins.push(
//       //     new BundleAnalyzerPlugin({
//       //       analyzerMode: "server",
//       //       analyzerPort: isServer ? 8888 : 8889,
//       //       openAnalyzer: true,
//       //     })
//       //   );
//       // }
//       return config;
//     },
//     env: {
//       SENTRY_RELEASE: process.env.SENTRY_RELEASE,
//       REACT_APP_ENV: process.env.REACT_APP_ENV,
//     },
//   }
// );

//  const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')
//  module.exports = (phase, { defaultConfig }) => {
//   console.log("sdd");
//   console.log("sdd");
//   console.log("sdd");
//   console.log("sdd");
//   webpack: (config, options) => {
//
//     config.resolve.alias["~"] = path.resolve(__dirname);
// console.log("YOO");
//     return config;
//   }
//  }
