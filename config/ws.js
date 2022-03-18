export const BASE_URL = setBaseUrl();

export const ROUTES = {
  NOTE: (orgSlug) => `${BASE_URL}${orgSlug}/notebook/`,
  NOTIFICATIONS: (userId) => `${BASE_URL}notifications/${userId}/`,
  PAPER_SUBMISSION: (id) => `${BASE_URL}${id}/paper_submissions/`,
};

function setBaseUrl() {
  if (process.env.REACT_APP_ENV === "staging") {
    return "wss://staging-ws.researchhub.com/ws/";
  } else if (process.env.NODE_ENV === "production") {
    return "wss://ws.researchhub.com/ws/";
  } else {
    return "ws://localhost:8000/ws/";
  }
}
