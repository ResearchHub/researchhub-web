const getBaseUrl = (): string => {
  if (process.env.REACT_APP_PROXY_API_ROOT) {
    return process.env.REACT_APP_PROXY_API_ROOT;
  }
  if (process.env.REACT_APP_ENV === "staging") {
    return "https://staging-proxy.researchhub.com";
  }
  if (process.env.NODE_ENV === "production") {
    return "https://proxy.researchhub.com";
  }
  return "https://staging-proxy.researchhub.com";
};

const proxyApi = {
  getBaseUrl,
  generateProxyUrl: (url: string): string => {
    const baseUrl = getBaseUrl();
    return `${baseUrl}/proxy?url=${url}`;
  },
};

export default proxyApi;
