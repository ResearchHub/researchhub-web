import { API } from "@quantfive/js-web-config";

const apiRoot = {
  production: "localhost:8000",
  staging: "localhost:8000",
  dev: "localhost:8000",
  //dev: 'https://staging.solestage.com/api/',
};

const routes = (BASE_URL) => {
  return {
    SUMMARY: ({ summaryId }) => {
      let url = BASE_URL + `summary/`;

      if (summaryId) {
        url += `${summaryId}/?`;
      } else {
        url += "?";
      }

      return url;
    },

    PAPER: ({ paperId }) => {
      let url = BASE_URL + `paper/`;

      if (paperId) {
        url += `${paperId}/?`;
      } else {
        url += "?";
      }

      return url;
    },
  };
};

export default API({
  authTokenName: "researchhub_token",
  apiRoot,
  routes,
});
