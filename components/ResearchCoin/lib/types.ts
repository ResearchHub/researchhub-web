export type RewardSummary = {
  baseRewards: number;
  openAccessMultiplier: number;
  openDataMultiplier: number;
  preregistrationMultiplier: number;
};

export const parseRewardSummary = (raw: any): RewardSummary => {
  return {
    baseRewards: raw.base_rewards,
    openAccessMultiplier: raw.open_access_multiplier,
    openDataMultiplier: raw.open_data_multiplier,
    preregistrationMultiplier: raw.preregistration_multiplier
  };
};
