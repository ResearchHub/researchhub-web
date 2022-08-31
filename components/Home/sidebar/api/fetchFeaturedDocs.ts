import API from "~/config/api";
import { buildApiUri } from "~/config/utils/buildApiUri";
import { Helpers } from "@quantfive/js-web-config";
import { ID, User } from "~/config/types/root_types";

type Args = {
  onError: (error: Error) => void;
  onSuccess: (response: any) => void;
  page?: number;
};

export const fetchFeaturedDocs = ({ onError, onSuccess, page }: Args): void => {
  fetch(
    buildApiUri({
      apiPath: "researchhub_unified_document/get_featured_documents",
    }),
    API.GET_CONFIG()
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((payload: any): void => {
      onSuccess(payload?.results ?? []);
    })
    .catch(onError);
};
