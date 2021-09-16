export type ENV = "development" | "production" | "staging";
export type SwitchConfigs = {
  [application: string]: {
    development?: boolean;
    production?: boolean;
    staging?: boolean;
    startDate?: string;
  };
};

const KillswtichConfigs: SwitchConfigs = {
  hypothesis: {
    development: true,
    staging: true,
    production: true,
    startDate: '9/15/2021',
  },
};

export default KillswtichConfigs;
