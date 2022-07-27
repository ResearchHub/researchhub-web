export type ENV = "development" | "production" | "staging";
export type AppSwitchConfig = {
  development?: boolean;
  production?: boolean;
  staging?: boolean;
};

const KillSwitchApps = [] as const;
export type KillswitchApp = typeof KillSwitchApps[number];

const KillswtichConfigs: Record<KillswitchApp, AppSwitchConfig> = {} as const;

export default KillswtichConfigs;
