import API from "~/config/api";
import { buildApiUri } from "~/config/utils/buildApiUri";
import { Helpers } from "@quantfive/js-web-config";

type Args = {
  onError: (error: Error) => void;
  onSuccess: (response: any) => void;
  url: string;
};

export const fetchReferenceFromUrl = ({
  onError,
  onSuccess,
  url,
}: Args): void => {
  fetch(
    buildApiUri({
      apiPath: "citation_entry/url_search",
      queryString: `?url=${url}`,
    }),
    API.GET_CONFIG()
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((result: any): void => {
      onSuccess(result);
    })
    .catch(onError);
};
