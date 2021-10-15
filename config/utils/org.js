export const getOrgUserCount = (orgUsers) => {
  return (
    (orgUsers?.admins?.length || 0) +
    (orgUsers?.members?.length || 0) +
    (orgUsers?.invited_users?.length || 0)
  );
};

export const getNotePathname = ({ org, noteId }) => {
  if (org?.id) {
    return `/${org.slug}/notebook/${noteId ? noteId : ""}`;
  } else {
    return `/me/notebook/${noteId ? noteId : ""}`;
  }
};
