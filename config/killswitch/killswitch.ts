import { emptyFncWithMsg, isNullOrUndefined } from "../utils/nullchecks";
import switchConfigs, { ENV } from "./killswitch_config/killswitch_configs";

function getCurrServerEnv(): ENV {
  return process.env.REACT_APP_ENV === "staging"
    ? "staging"
    : process.env.NODE_ENV === "production"
    ? "prod"
    : "dev";
}

export default function killswitch(application: string): boolean {
  const switchConfig = switchConfigs[application];
  if (isNullOrUndefined(switchConfig)) {
    emptyFncWithMsg(
      `Attempting to determine killswitch for unknown ${application}`
    );
    return false;
  }
  const currServerEnv = getCurrServerEnv();
  return Boolean(switchConfig[currServerEnv]);
}
