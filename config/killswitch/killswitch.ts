import { emptyFncWithMsg, isNullOrUndefined } from "../utils/nullchecks";
import switchConfigs, { ENV } from "./killswitch_config/killswitch_configs";

type Args = { application: string; env: ENV };

function getCurrServerEnv(): ENV {
  return process.env.REACT_APP_ENV === "staging"
    ? "staging"
    : process.env.NODE_ENV === "production"
    ? "prod"
    : "dev";
}

export function killswitch({ application, env = "dev" }: Args): boolean {
  const switchConfig = switchConfigs[application];
  if (isNullOrUndefined(switchConfig)) {
    emptyFncWithMsg(
      `Attempting to determine killswitch for unknown ${application}-${env}`
    );
    return false;
  }
  const currServerEnv = getCurrServerEnv();
  return Boolean(switchConfig[currServerEnv]);
}
