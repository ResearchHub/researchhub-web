import { ENV } from "../killswitch/killswitch_config/killswitch_configs";

export const getCurrServerEnv = (): ENV => {
  return process.env.REACT_APP_ENV === "staging"
    ? "staging"
    : process.env.NODE_ENV === "production"
    ? "production"
    : "development";
};

export const isDevEnv = (): boolean => {
  return getCurrServerEnv() === "development";
};
