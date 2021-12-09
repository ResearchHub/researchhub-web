export type ENV = "development" | "production" | "staging";
export type AppSwitchConfig = {
  development?: boolean;
  production?: boolean;
  staging?: boolean;
};

const KillsiwtchApps = ["paperSummary", "paperUploadV2"] as const;
export type KillswitchApp = typeof KillsiwtchApps[number];

const KillswtichConfigs: Record<KillswitchApp, AppSwitchConfig> = {
  paperSummary: {
    development: false,
    staging: false,
    production: false,
  },
  paperUploadV2: {
    development: true,
    staging: true,
    production: true,
  },
} as const;

export default KillswtichConfigs;
