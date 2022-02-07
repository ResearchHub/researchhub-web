export type ENV = "development" | "production" | "staging";
export type AppSwitchConfig = {
  development?: boolean;
  production?: boolean;
  staging?: boolean;
};

const KillsiwtchApps = ["paperSummary", "editorDash"] as const;
export type KillswitchApp = typeof KillsiwtchApps[number];

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
} as const;

export default KillswtichConfigs;
