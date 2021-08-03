export type ENV = "development" | "production" | "staging";
export type SwitchConfigs = {
  [application: string]: {
    development?: boolean;
    production?: boolean;
    staging?: boolean;
  };
};

const KillswtichConfigs: SwitchConfigs = {
  paperUploadV2: {
    development: true,
    staging: true,
    production: true,
  },
};

export default KillswtichConfigs;
