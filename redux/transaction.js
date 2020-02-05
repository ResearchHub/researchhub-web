import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { AuthActions } from "./auth";

/**********************************
 *        ACTIONS SECTION         *
 **********************************/

export const TransactionConstants = {
  UPDATE_BALANCE: "@@transaction/UPDATE_BALANCE",
  GET_WITHDRAWALS: "@@transaction/GET_WITHDRAWALS",
};

export const TransactionActions = {
  getWithdrawals: (page = 1, prevState) => {
    if (prevState && prevState.grabbedPages[page]) {
      return;
    }
    return async (dispatch) => {
      return fetch(API.WITHDRAW_COIN({ page }), API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          let grabbedPages = { ...prevState.grabbedPages };
          grabbedPages.page;

          return dispatch({
            type: TransactionConstants.GET_WITHDRAWALS,
            payload: {
              userBalance: res.user.balance,
              withdrawals: [...res.results],
              count: res.count,
              next: res.next,
              grabbedPages: grabbedPages,
            },
          });
        })
        .catch((error) => {
          console.log(error);
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
  grabbedPages: {},
};

const TransactionReducer = (state = defaultTransactionState, action) => {
  switch (action.type) {
    case TransactionConstants.UPDATE_BALANCE:
    case TransactionConstants.GET_WITHDRAWALS:
      return {
        ...state,
        ...action.payload,
        withdrawals: [...state.withdrawals, ...action.payload.withdrawals],
      };
    default:
      return state;
  }
};

export default TransactionReducer;
