import { buildApiUri } from "~/config/utils/buildApiUri";
import { Helpers } from "@quantfive/js-web-config";
import API from "~/config/api";

type Args = {
  onError: (error: Error) => void;
  onSuccess: ({ withdrawals }) => void;
};

export function fetchRscBalanceHistory({
  onError,
  onSuccess,
}: Args): Promise<boolean> {
  return fetch(
    buildApiUri({
      apiPath: `transactions`,
    }),
    API.GET_CONFIG()
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then(({ results }: any): boolean => {
      onSuccess({ withdrawals: results });
      return true;
    })
    .catch((error: any): boolean => {
      onError(error);
      return true;
    });
}
