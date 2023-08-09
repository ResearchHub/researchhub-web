const isWithinRefManager = ({ router }): boolean => {
  if (router.pathname.includes("reference-manager")) {
    return true;
  }
  return false;
};

export default isWithinRefManager;
