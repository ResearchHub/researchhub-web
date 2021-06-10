import { emptyFncWithMsg, isNullOrUndefined } from "../utils/nullchecks";
import switchConfigs, { ENV } from "./killswitch_config/killswitch_configs";
import { getCurrServerEnv } from "../utils/env";

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
