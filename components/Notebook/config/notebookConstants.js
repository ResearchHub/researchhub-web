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
  NO_ACCESS: 0,
  VIEWER: 1,
  COMMENTER: 2,
  EDITOR: 3,
  ADMIN: 4,
  getEnumByVal: function (val) {
    for (const k in this) {
      if (this[k] === val) {
        return k;
      }
    }
  },
  getValByEnum: function (permEnum) {
    if (!permEnum) {
      return this.NO_ACCESS;
    }

    for (const k in this) {
      if (k === permEnum) {
        return PERMS[k];
      }
    }
  },
};
