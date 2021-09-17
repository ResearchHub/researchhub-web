export type ENV = "development" | "production" | "staging";
export type SwitchConfigs = {
  [application: string]: {
    development?: boolean;
    production?: boolean;
    staging?: boolean;
  };
};

const KillswtichConfigs: SwitchConfigs = {
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
  hypothesis: {
    development: true,
    staging: true,
    production: true,
  },
};

export default KillswtichConfigs;
