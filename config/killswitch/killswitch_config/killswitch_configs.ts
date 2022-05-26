export type ENV = "development" | "production" | "staging";
export type AppSwitchConfig = {
  development?: boolean;
  production?: boolean;
  staging?: boolean;
};

const KillSwitchApps = ["paperSummary", "editorDash", "peerReview"] as const;
export type KillswitchApp = typeof KillSwitchApps[number];

const KillswtichConfigs: Record<KillswitchApp, AppSwitchConfig> = {
  paperSummary: {
    development: false,
    staging: false,
    production: false,
  },
  editorDash: {
    development: true,
    staging: true,
    production: true,
  },
  peerReview: {
    development: false,
    staging: false,
    production: false,
  },
} as const;

export default KillswtichConfigs;
