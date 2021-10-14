export type GatekeeperConfigs = {
  [application: string]: Set<string>; // a set of strings
};

const gatekeeperConfigs: GatekeeperConfigs = {
  ELN: new Set(["calvinhlee@quantfive.org"]),
};

export default gatekeeperConfigs;
