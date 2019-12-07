/***
 * Action / Reducer file for handling user displayed messaged
 * @craiglu
 */

/**********************************
 *        ACTIONS SECTION         *
 **********************************/

export const MessageConstants = {
  SET_MESSAGE: "@@message/SET_MESSAGE",
  SHOW_MESSAGE: "@@message/SHOW_MESSAGE",
};

export const MessageActions = {
  /***
   * Sets message in redux
   * @param {String} message -- string to set as message
   */
  setMessage: (message) => {
    return (dispatch) => {
      return dispatch({
        type: MessageConstants.SET_MESSAGE,
        message: message,
      });
    };
  },

  /***
   * Show or hide message
   * @param {Boolean} show -- whether to show or hide message
   * @param {Boolean} error -- whether or not the message is an error
   * @param {Boolean} clickoff -- whether or not to have the message "click off"
   */
  showMessage: ({
    show,
    error = false,
    clickoff = false,
    load = false,
    timeout = 2000,
  }) => {
    return (dispatch) => {
      return dispatch({
        type: MessageConstants.SHOW_MESSAGE,
        show,
        error,
        clickoff,
        load,
        timeout,
      });
    };
  },
};

/**********************************
 *        REDUCER SECTION         *
 **********************************/

const defaultMessageState = {
  message: "",
  show: false,
  error: false,
  load: false,
  timeout: 2000,
};

const MessageReducer = (state = defaultMessageState, action) => {
  switch (action.type) {
    case MessageConstants.SET_MESSAGE:
    case MessageConstants.SHOW_MESSAGE:
      return {
        ...state,
        ...action,
      };
    default:
      return state;
  }
};

export default MessageReducer;
