import { PERMS, ENTITIES } from "../config/notebookConstants";

// Returns the greatest permission
// e.g. ADMIN over VIEWER if both are present
export const getUserNoteAccess = ({ user, userOrgs, notePerms }) => {
  let userAccess = PERMS.NOTE.NO_ACCESS;

  for (const p of notePerms) {
    if (p.user) {
      if (p.user.id === user.id) {
        userAccess =
          userAccess > PERMS.NOTE[p.access_type]
            ? userAccess
            : PERMS.NOTE[p.access_type];
      }
    }

    if (p.organization) {
      const foundUserOrg = userOrgs.find((o) => p.organization.id === o.id);
      const userOrgAccess = PERMS.getValByEnum({
        permEnum: foundUserOrg?.user_permission?.access_type,
        forEntity: ENTITIES.NOTE,
      });

      // Org members have implicit ADMIN note access
      if ([PERMS.ORG.MEMBER, PERMS.ORG.ADMIN].includes(userOrgAccess)) {
        userAccess = PERMS.NOTE.ADMIN;
      } else {
        userAccess =
          userAccess > PERMS.NOTE[p.access_type]
            ? userAccess
            : PERMS.NOTE[p.access_type];
      }
    }
  }

  return userAccess;
};

export const isNoteSharedWithUser = ({
  email,
  notePerms,
  invitedUsers = [],
}) => {
  const hasAccess = Boolean(notePerms.find((p) => p?.user?.email === email));
  const isInvited = Boolean(
    invitedUsers.find((u) => u.recipient_email === email)
  );
  return hasAccess || isInvited;
};
