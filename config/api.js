import * as config from "@quantfive/js-web-config";

const apiRoot = {
  production: "localhost:8000",
  staging: "localhost:8000",
  dev: "localhost:8000"
};

const extraRoutes = BASE_URL => {
  return {
    SUMMARY: () => {
      let url = BASE_URL + `summary/`;
      return url;
    }
  };
};

console.log(config);
export default {};
