/**********************************
 *        ACTIONS SECTION         *
 **********************************/

export const TestConstants = {
  SET_TEST_TRUE: "@@test/SET_TEST_TRUE",
  SET_TEST_FALSE: "@@test/SET_TEST_FALSE"
};

export const MessageActions = {
  setTrue: () => {
    return dispatch => {
      return dispatch({
        type: TestConstants.SET_TEST_TRUE,
        test: true
      });
    };
  },

  setTrue: () => {
    return dispatch => {
      return dispatch({
        type: TestConstants.SET_TEST_FALSE,
        test: false
      });
    };
  },
};

/**********************************
 *        REDUCER SECTION         *
 **********************************/

const defaultMessageState = {
  test: false
};

const MessageReducer = (state = defaultMessageState, action) => {
  switch (action.type) {
    case TestConstants.SET_TEST_TRUE:
    case TestConstants.SET_TEST_FALSE:
      return {
        ...state,
        ...action
      };
    default:
      return state;
  }
};

export default MessageReducer;