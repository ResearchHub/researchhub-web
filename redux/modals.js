/**********************************
 *        ACTIONS SECTION         *
 **********************************/

const ModalConstants = {
  UPLOAD_PAPER_MODAL_TOGGLE: "@@modal/UPLOAD_PAPER_MODAL_TOGGLE",
};

export const ModalActions = {
  /**
   * Opens/closes the modal for upload paper modal
   * @param: boolean -- true opens modal false closes modal
   */
  openUploadPaperModal: (openModal) => {
    return (dispatch) => {
      dispatch({
        type: ModalConstants.UPLOAD_PAPER_MODAL_TOGGLE,
        openUploadPaperModal: openModal,
      });
    };
  },
};

/**********************************
 *        REDUCER SECTION         *
 **********************************/

const defaultState = {
  openUploadPaperModal: false,
};

const ModalReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ModalConstants.OPEN_UPLOAD_PAPER_MODAL:
      return {
        ...state,
        ...action,
      };
    default:
      return state;
  }
};

export default ModalReducer;
