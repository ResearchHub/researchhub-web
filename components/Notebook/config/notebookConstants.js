export const ENTITIES = {
  USER: "USER",
  USER_INVITE: "USER_INVITE",
  ORG: "ORG",
};

export const NOTE_GROUPS = {
  WORKSPACE: "WORKSPACE",
  PRIVATE: "PRIVATE",
  SHARED: "SHARED",
};

export const PERMS = {
  ORG: {
    NO_ACCESS: 0,
    MEMBER: 1,
    ADMIN: 2,
  },
  NOTE: {
    NO_ACCESS: 0,
    VIEWER: 1,
    COMMENTER: 2,
    EDITOR: 3,
    ADMIN: 4,
  },
  getEnumByVal: function ({ value, forEntity }) {
    for (const k in this[forEntity]) {
      if (this[forEntity][k] === value) {
        return k;
      }
    }
  },
  getValByEnum: function ({ permEnum, forEntity }) {
    if (!permEnum) {
      return this.NO_ACCESS;
    }

    for (const k in this[forEntity]) {
      if (k === permEnum) {
        return PERMS[forEntity][k];
      }
    }
  },
};
