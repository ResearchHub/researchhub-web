export type ENV = "dev" | "prod" | "staging";
export type SwitchConfigs = {
  [application: string]: {
    dev?: boolean;
    prod?: boolean;
    staging?: boolean;
  };
};

const KillswtichConfigs: SwitchConfigs = {
  authorClaim: {
    dev: true,
    prod: false,
    staging: false,
  },
};

export default KillswtichConfigs;
