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
    production: false,
    staging: false,
  },
  search: {
    development: true,
    production: false,
    staging: true,
  },
};

export default KillswtichConfigs;
