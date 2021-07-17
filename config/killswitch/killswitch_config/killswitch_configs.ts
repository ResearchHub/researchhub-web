export type ENV = "development" | "production" | "staging";
export type SwitchConfigs = {
  [application: string]: {
    development?: boolean;
    production?: boolean;
    staging?: boolean;
  };
};

const KillswtichConfigs: SwitchConfigs = {
  authorClaim: {
    development: true,
    staging: false,
    production: false,
  },
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
};

export default KillswtichConfigs;
