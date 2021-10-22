import { emptyFncWithMsg, isNullOrUndefined } from "../utils/nullchecks";
import { getCurrServerEnv } from "../utils/env";
import switchConfigs, {
  KillswitchApp,
} from "./killswitch_config/killswitch_configs";

export default function killswitch(application: KillswitchApp): boolean {
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
