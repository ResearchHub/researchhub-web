import { Helpers } from "@quantfive/js-web-config";
import API from "~/config/api";
import { ID } from "~/config/types/root_types";
import { buildApiUri } from "~/config/utils/buildApiUri";

type Args = {
  onError: (error: Error) => void;
  onSuccess: (flag: boolean) => void;
  shouldDisplayRscBalanceHome: boolean;
  targetUserID: ID;
};

export function postShouldDisplayRscBalanceHome({
  onError,
  onSuccess,
  shouldDisplayRscBalanceHome,
  targetUserID,
}: Args): void {
  fetch(
    buildApiUri({
      apiPath: `user/${targetUserID}/set_should_display_rsc_balance`,
    }),
    API.POST_CONFIG({
      target_user_id: targetUserID,
      should_display_rsc_balance_home: shouldDisplayRscBalanceHome,
    })
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((result: any): void =>
      onSuccess(result?.should_display_rsc_balance_home ?? true)
    )
    .catch((error: any): void => {
      onError(error);
    });
}
