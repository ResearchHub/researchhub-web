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

// Returns the greatest permission
// e.g. ADMIN over VIEWER if both are present
export const getUserNoteAccess = ({ user, userOrgs, notePerms }) => {
  let userAccess = PERMS.NO_ACCESS;

  for (const p of notePerms) {
    if (p.user) {
      if (p.user.author_profile.id === user.author_profile.id) {
        userAccess =
          userAccess > PERMS[p.access_type] ? userAccess : PERMS[p.access_type];
      }
    } else if (p.organization) {
      const foundOrg = userOrgs.find((o) => p.organization.id === o.id);
      if (foundOrg) {
        userAccess =
          userAccess > PERMS[p.access_type] ? userAccess : PERMS[p.access_type];
      }
    }
  }

  return userAccess;
};
