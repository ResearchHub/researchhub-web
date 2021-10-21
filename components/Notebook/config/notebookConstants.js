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
};
