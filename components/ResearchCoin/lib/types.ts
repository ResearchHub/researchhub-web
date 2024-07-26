export type RewardSummary = {
  baseRewards: number;
};

export const parseRewardSummary = (raw: any): RewardSummary => {
  return {
    baseRewards: raw.base_rewards,
  };
};
