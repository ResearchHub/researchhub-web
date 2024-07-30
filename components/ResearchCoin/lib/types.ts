import { ID } from "~/config/types/root_types";

export type PaperReward = {
  paperId: ID;
  citationCount: number;
  citationChange: number;
  rewardAmount: number;
  isPreregistered: boolean;
  isOpenData: boolean;
};

export type RewardSummary = {
  baseRewards: number;
  openAccessMultiplier: number;
  openDataMultiplier: number;
  preregistrationMultiplier: number;
};

export const parsePaperReward = (raw: any): PaperReward => {
  return {
    paperId: raw.paper,
    citationCount: raw.citation_count,
    citationChange: raw.citation_change,
    rewardAmount: raw.rsc_value,
    isPreregistered: raw.is_preregistered,
    isOpenData: raw.is_open_data,
  };
};

export const parseRewardSummary = (raw: any): RewardSummary => {
  return {
    baseRewards: raw.base_rewards,
    openAccessMultiplier: raw.open_access_multiplier,
    openDataMultiplier: raw.open_data_multiplier,
    preregistrationMultiplier: raw.preregistration_multiplier,
  };
};
