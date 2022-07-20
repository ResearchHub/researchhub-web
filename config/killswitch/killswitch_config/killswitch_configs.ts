export type ENV = "development" | "production" | "staging";
export type AppSwitchConfig = {
  development?: boolean;
  production?: boolean;
  staging?: boolean;
};

const KillSwitchApps = ["bountyQuestion", "peerReview"] as const;
export type KillswitchApp = typeof KillSwitchApps[number];

const KillswtichConfigs: Record<KillswitchApp, AppSwitchConfig> = {
  bountyQuestion: {
    development: true,
    staging: false,
    production: false,
  },
  peerReview: {
    development: false,
    staging: false,
    production: false,
  },
} as const;

export default KillswtichConfigs;
