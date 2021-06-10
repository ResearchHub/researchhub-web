export const getCurrServerEnv = () => {
  return process.env.REACT_APP_ENV === "staging"
    ? "staging"
    : process.env.NODE_ENV === "production"
    ? "production"
    : "development";
};
