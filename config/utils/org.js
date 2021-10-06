export const getOrgUserCount = (orgUsers) => {
  return (
    (orgUsers?.admins?.length || 0) +
    (orgUsers?.editors?.length || 0) +
    (orgUsers?.viewers?.length || 0) +
    (orgUsers?.invited_users?.length || 0)
  );
};

export const getNotePathname = ({ org, noteId }) => {
  if (org?.id) {
    return `/${org.slug}/notebook/${noteId}`;
  } else {
    return `/me/notebook/${noteId}`;
  }
};
