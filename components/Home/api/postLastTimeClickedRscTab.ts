import { buildApiUri } from "~/config/utils/buildApiUri";
import { Helpers } from "@quantfive/js-web-config";
import API from "~/config/api";

type Args = {
  onError: (error: Error) => void;
  onSuccess: () => void;
};

export function postLastTimeClickedRscTab({ onError, onSuccess }: Args): void {
  fetch(
    buildApiUri({
      apiPath: `user/update_balance_history_clicked`,
    }),
    API.POST_CONFIG({})
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((): void => onSuccess())
    .catch((error: any): void => {
      onError(error);
    });
}
