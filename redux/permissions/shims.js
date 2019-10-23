export const permissions = (permissionsList) => {
  const permissionsObject = {};
  permissionsList.map((p) => {
    permissionsObject[p.key] = p;
  });
  return permissionsObject;
};
