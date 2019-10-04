/**********************************
 *        ACTIONS SECTION         *
 **********************************/

export const ModalConstants = {
  UPLOAD_PAPER_MODAL_TOGGLE: "@@modal/UPLOAD_PAPER_MODAL_TOGGLE",
  ADD_AUTHOR_MODAL_TOGGLE: "@@modal/ADD_AUTHOR_MODAL_TOGGLE",
  LOGIN_MODAL_TOGGLE: "@@modal/LOGIN_MODAL_TOGGLE",
};

export const ModalActions = {
  /**
   * Opens/closes the modal for upload paper modal
   * @param: boolean -- true opens modal false closes modal
   */
  openUploadPaperModal: (openModal) => {
    return (dispatch) => {
      return dispatch({
        type: ModalConstants.UPLOAD_PAPER_MODAL_TOGGLE,
        payload: {
          openUploadPaperModal: openModal,
        },
      });
    };
  },
  openAddAuthorModal: (openModal) => {
    return (dispatch) => {
      return dispatch({
        type: ModalConstants.ADD_AUTHOR_MODAL_TOGGLE,
        payload: {
          openAddAuthorModal: openModal,
        },
      });
    };
  },
  openLoginModal: (openModal, flavorText) => {
    return (dispatch) => {
      return dispatch({
        type: ModalConstants.LOGIN_MODAL_TOGGLE,
        payload: {
          openLoginModal: openModal,
          loginModal: {
            flavorText,
          },
        },
      });
    };
  },
};

/**********************************
 *        REDUCER SECTION         *
 **********************************/

const defaultModalState = {
  openUploadPaperModal: false,
  openAddAuthorModal: false,
  openLoginModal: false,
  loginModal: {},
};

const ModalReducer = (state = defaultModalState, action) => {
  switch (action.type) {
    case ModalConstants.UPLOAD_PAPER_MODAL_TOGGLE:
      return {
        ...state,
        ...action.payload,
      };
    case ModalConstants.ADD_AUTHOR_MODAL_TOGGLE:
      return {
        ...state,
        ...action.payload,
      };
    case ModalConstants.LOGIN_MODAL_TOGGLE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default ModalReducer;
