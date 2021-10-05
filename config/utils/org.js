export const getOrgUserCount = (orgUsers) => {
  return (
    (orgUsers?.admins?.length || 0) +
    (orgUsers?.editors?.length || 0) +
    (orgUsers?.viewers?.length || 0) +
    (orgUsers?.invited_users?.length || 0)
  );
};

export const getNotePathname = ({ org, note }) => {
  if (org?.id) {
    return `/${org.slug}/notebook/${note.id}`;
  } else {
    return `/me/notebook/${note.id}`;
  }
};
