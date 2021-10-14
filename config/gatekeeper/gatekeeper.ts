import { emptyFncWithMsg, isNullOrUndefined } from "../utils/nullchecks";
import gatekeeperConfigs from "./gatekeeper_configs/gatekeeper_configs";

export default function gatekeeper(
  application: string,
  accountEmail: string
): boolean {
  const gateKeeperConfig = gatekeeperConfigs[application];
  if (isNullOrUndefined(gateKeeperConfig)) {
    emptyFncWithMsg(
      `Attempting to determine gatekeeper for unknown ${application} for account ${accountEmail}`
    );
    return false;
  }
  return gateKeeperConfig.has(accountEmail);
}
