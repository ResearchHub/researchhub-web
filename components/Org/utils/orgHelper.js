export const getOrgUserCount = (orgUsers) => {
  return (orgUsers?.admins?.length || 0) + (orgUsers?.members?.length || 0);
};

export const getNotePathname = ({ org, noteId }) => {
  return `/${org.slug}/notebook/${noteId ? noteId : ""}`;
};
