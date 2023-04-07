import API from "~/config/api";
import { buildApiUri } from "~/config/utils/buildApiUri";
import { Helpers } from "@quantfive/js-web-config";

type Args = {
  doi: string;
  onError: (error: Error) => void;
  onSuccess: (response: any) => void;
};

export const fetchReferenceFromDoi = ({
  doi,
  onError,
  onSuccess,
}: Args): void => {
  fetch(
    buildApiUri({
      apiPath: "citation_entry/doi_search",
      queryString: `?doi=${doi}`,
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
