const getBaseUrl = (): string => {
  if (process.env.REACT_APP_PROXY_API_ROOT) {
    return process.env.REACT_APP_PROXY_API_ROOT;
  }
  if (process.env.REACT_APP_ENV === "staging") {
    return "https://proxy.prod.researchhub.com"; // FIXME: Change to staging after testing!
  }
  if (process.env.NODE_ENV === "production") {
    return "https://proxy.researchhub.com";
  }
  return "https://proxy.staging.researchhub.com";
};

const proxyApi = {
  getBaseUrl,
  generateProxyUrl: (url: string): string => {
    const baseUrl = getBaseUrl();
    return `${baseUrl}/proxy?url=${url}`;
  },
};

export default proxyApi;
