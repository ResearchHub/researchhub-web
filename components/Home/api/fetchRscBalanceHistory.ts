import { buildApiUri } from "~/config/utils/buildApiUri";
import { Helpers } from "@quantfive/js-web-config";
import API from "~/config/api";

type Args = {
  onError: (error: Error) => void;
  onSuccess: ({ withdrawals }) => void;
};

export function fetchRscBalanceHistory({ onError, onSuccess }: Args): void {
  fetch(
    buildApiUri({
      apiPath: `transactions`,
    }),
    API.GET_CONFIG()
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then(({ results }: any): void => onSuccess({ withdrawals: results }))
    .catch((error: any): void => onError(error));
}
