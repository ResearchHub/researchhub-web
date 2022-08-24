import API from "~/config/api";
import { sendAmpEvent } from "~/config/fetch";
import { buildApiUri } from "~/config/utils/buildApiUri";
import { Helpers } from "@quantfive/js-web-config";

type Args = {
  onError: (error: Error) => void;
  onSuccess: (response: any) => void;
  page?: number;
};

export const fetchOpenBounties = ({ onError, onSuccess, page }: Args): void => {
  fetch(
    buildApiUri({ apiPath: "bounty/get_bounties/?status=OPEN" }),
    API.GET_CONFIG()
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((res: any): void => onSuccess({ res }))
    .catch(onError);
};
