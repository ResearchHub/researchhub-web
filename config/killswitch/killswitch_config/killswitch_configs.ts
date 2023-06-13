export type ENV = "development" | "production" | "staging";
export type AppSwitchConfig = {
  development?: boolean;
  production?: boolean;
  staging?: boolean;
};

const KillSwitchApps = ["reference-manager"] as const;
export type KillswitchApp = typeof KillSwitchApps[number];

const KillswtichConfigs: Record<KillswitchApp, AppSwitchConfig> = {
  "reference-manager": {
    development: true,
    production: true,
    staging: true,
  },
};

export default KillswtichConfigs;
