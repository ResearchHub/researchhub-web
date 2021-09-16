import { emptyFncWithMsg, isNullOrUndefined } from "../utils/nullchecks";
import configs, { ENV } from "./configs/newFeatureConfigs";
import { getCurrServerEnv } from "../utils/env";

export default function newFeature(feature: string): boolean {
  const switchConfig = configs[feature];
  if (isNullOrUndefined(switchConfig)) {
    emptyFncWithMsg(
      `Attempting to determine new feature for unknown ${feature}`
    );
    return false;
  }
  const currServerEnv = getCurrServerEnv();
  if (switchConfig.startDate) {
    const startDate = new Date(switchConfig['startDate'])
    const twoWeeks = 1000 * 60 * 60 * 24 * 14;
    const today = new Date();

    const twoWeeksDate = startDate.getTime() + twoWeeks;
    if (today.getTime() > twoWeeksDate) {
      return false;
    }
  }
  return Boolean(switchConfig[currServerEnv]);
}
