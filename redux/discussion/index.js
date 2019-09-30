import * as actions from "./actions";

export const DiscussionActions = {
  fetchThread: () => {
    return (dispatch) => {
      const result = fetch();

      if (result) {
        dispatch(actions.setThread(result));
      } else {
        dispatch(actions.setThreadFailure());
      }
    };
  },

  fetchComments: (threadId) => {
    return (dispatch) => {
      const result = fetch();

      if (result) {
        dispatch(actions.setComments(result));
      } else {
        dispatch(actions.setCommentsFailure());
      }
    };
  },
};
