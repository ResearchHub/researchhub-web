export type ENV = "development" | "production" | "staging";
export type SwitchConfigs = {
  [application: string]: {
    development?: boolean;
    production?: boolean;
    staging?: boolean;
  };
};

const KillswtichConfigs: SwitchConfigs = {
  newPostTypes: {
    development: true,
    staging: true,
    production: true,
  },
  unifiedDocumentFeed: {
    development: true,
    staging: true,
    production: true,
  },
  paperUploadV2: {
    development: true,
    staging: true,
    production: false,
  },
};

export default KillswtichConfigs;
