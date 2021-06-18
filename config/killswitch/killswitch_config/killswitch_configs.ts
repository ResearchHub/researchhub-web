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
  algoliaSearch: {
    development: false,
    staging: false,
    production: false,
  },
  elasticSearch: {
    development: true,
    staging: true,
    production: false,
  },
  unifiedDocumentFeed: {
    development: true,
    staging: true,
    production: false,
  },
};

export default KillswtichConfigs;
