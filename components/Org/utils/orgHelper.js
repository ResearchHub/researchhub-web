import {
  PERMS,
  ENTITIES,
} from "~/components/Notebook/config/notebookConstants";

export const getOrgUserCount = (orgUsers) => {
  return (orgUsers?.admins?.length || 0) + (orgUsers?.members?.length || 0);
};

export const getNotePathname = ({ org, noteId }) => {
  return `/${org.slug}/notebook/${noteId ? noteId : ""}`;
};

export const isOrgMember = ({ user, org }) => {
  const userPerm = PERMS.getValByEnum({
    permEnum: org?.user_permission?.access_type,
    forEntity: ENTITIES.ORG,
  });
  if (userPerm >= PERMS.ORG.MEMBER) {
    return true;
  }

  return false;
};
