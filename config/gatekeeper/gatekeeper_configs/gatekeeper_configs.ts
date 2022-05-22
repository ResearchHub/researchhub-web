export type GatekeeperConfigs = {
  [application: string]: Set<string>; // a set of strings
};

const gatekeeperConfigs: GatekeeperConfigs = {};

export default gatekeeperConfigs;
