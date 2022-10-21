import { emptyFncWithMsg } from "~/config/utils/nullchecks";
import { Helpers } from "@quantfive/js-web-config";
import API from "~/config/api";

/**********************************
 *        ACTIONS SECTION         *
 **********************************/

export const TransactionConstants = {
  UPDATE_BALANCE: "@@transaction/UPDATE_BALANCE",
  GET_WITHDRAWALS: "@@transaction/GET_WITHDRAWALS",
  UPDATE_STATE: "@@transaction/UPDATE_STATE",
};

export const TransactionActions = {
  getWithdrawals: (page = 1, prevState) => {
    return async (dispatch, getState) => {
      return fetch(API.TRANSACTIONS({ page }), API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          return dispatch({
            type: TransactionConstants.GET_WITHDRAWALS,
            payload: {
              // userBalance: res.user.balance,
              withdrawals: [...res.results],
              count: res.count,
              next: res.next,
            },
          });
        })
        .catch((err) => {
          emptyFncWithMsg(err);
          return dispatch({
            type: TransactionConstants.GET_WITHDRAWALS,
            payload: {
              userBalance: 0,
              withdrawals: [],
            },
          });
        });
    };
  },
  updateState: (newState) => {
    return (dispatch) => {
      return dispatch({
        type: TransactionConstants.UPDATE_STATE,
        payload: {
          ...newState,
        },
      });
    };
  },
};

/**********************************
 *        REDUCER SECTION         *
 **********************************/

const defaultTransactionState = {
  userBalance: null,
  withdrawals: [],
  count: null,
  next: null,
  grabbedPages: {},
};

const TransactionReducer = (state = defaultTransactionState, action) => {
  switch (action.type) {
    case TransactionConstants.UPDATE_BALANCE:
    case TransactionConstants.GET_WITHDRAWALS:
    case TransactionConstants.UPDATE_STATE:
      return {
        ...action.payload,
      };
    default:
      return state;
  }
};

export default TransactionReducer;
