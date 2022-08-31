const useEffectForOutsideMenuClick = ({ handleDismissTagMenu }) => {
  const _handleOutsideClick = (e) => {
    const isTypeFilterClicked = e.target.closest(".typeFilter");
    if (!isTypeFilterClicked) {
      handleDismissTagMenu(null);
    }

    // if ((hubsDownRef.current.contains(e.target) && isHubSelectOpen) || !hubsDownRef.current.contains(e.target)) {
    //   setIsHubSelectOpen(false);
    // }
  };

  document.addEventListener("click", _handleOutsideClick);

  return () => {
    document.removeEventListener("click", _handleOutsideClick);
  };
};

export default useEffectForOutsideMenuClick;
