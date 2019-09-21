import * as config from "q5-web-config";

const apiRoot = {
  production: "localhost:8000",
  staging: "localhost:8000",
  dev: "localhost:8000"
  //dev: 'https://staging.solestage.com/api/',
};

const extraRoutes = BASE_URL => {
  return {
    SUMMARY: () => {
      let url = BASE_URL + `summary/`;
      return url;
    }
  };
};

export default config.API({
  authTokenName: "researchhub_token",
  apiRoot,
  extraRoutes
});
