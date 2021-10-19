export type GatekeeperConfigs = {
  [application: string]: Set<string>; // a set of strings
};

const gatekeeperConfigs: GatekeeperConfigs = {
  ELN: new Set([
    "calvinhlee@quantfive.org",
    "hojinlee9292@gmail.com",
    /* add account emails here */
  ]),
  PERMISSIONS_DASH: new Set([
    "calvinhlee@quantfive.org",
    "hojinlee9292@gmail.com",
  ]),
};

export default gatekeeperConfigs;
