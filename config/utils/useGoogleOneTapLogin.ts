import { AuthActions } from "~/redux/auth";
import { captureEvent } from "~/config/utils/events";
import { Dispatch, useEffect } from "react";
import { emptyFncWithMsg, localError } from "./nullchecks";
import { GOOGLE_CLIENT_ID } from "~/config/constants";
import { MessageActions } from "~/redux/message";
import { useDispatch, useStore } from "react-redux";

function handleError(response: any, dispatcher: Dispatch<any>) {
  switch (response.error) {
    case "popup_closed_by_user": // incognito or if user exits flow voluntarily
    case "idpiframe_initialization_failed": // incognito
      return null;
    default:
      localError(response);
      dispatcher(MessageActions.setMessage("Login failed"));
      // @ts-ignore wrong ts inferrance
      dispatcher(MessageActions.showMessage({ show: true, error: true }));
  }
}

/* 
This function triggers Google's OneTap to be triggered
NOTE: when a user dismisses google's login prompt, it has its own "cooldown" until it shows up the next time.
*/
export function useGoogleOneTapLogin() {
  const { isLoggedIn, authChecked } = useStore()?.getState()?.auth ?? {
    isLoggedIn: false,
    authChecked: false,
  };
  const reduxDispatcher = useDispatch();

  useEffect((): void => {
    if (!isLoggedIn && authChecked) {
      (window as any).google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (data: any): Promise<void> => {
          await reduxDispatcher(AuthActions.googleYoloLogin(data)).then(
            (action: any) => {
              if (action.loginFailed) {
                captureEvent(action);
                handleError(action, reduxDispatcher);
              }
            }
          );
        },
      });
      (window as any).google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          emptyFncWithMsg("Google OneTap dismissed");
        }
      });
    }
  }, [authChecked, isLoggedIn]);
}
