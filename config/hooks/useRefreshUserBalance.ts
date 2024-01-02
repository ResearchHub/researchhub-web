import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Helpers } from "@quantfive/js-web-config";
import API from "~/config/api";
import { RootState } from "../../redux";
import { AuthActions } from "~/redux/auth";
import { isNullOrUndefined } from "../utils/nullchecks";

export const useRefreshUserBalance = (): (() => Promise<string | number>) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const refreshUserBalance = useCallback(() => {
    return new Promise<string | number>((resolve, reject) => {
      if (!isLoggedIn) {
        reject("User is not logged in");
        return;
      }
      fetch(API.WITHDRAW_COIN({}), API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res: any) => {
          if (isNullOrUndefined(res.user)) {
            reject("User data not found");
            return;
          }
          const param = {
            balance: res.user.balance,
          };
          dispatch(AuthActions.updateUser(param));
          resolve(res.user.balance);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }, [dispatch]);

  return refreshUserBalance;
};
