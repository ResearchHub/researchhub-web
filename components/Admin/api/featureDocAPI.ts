import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { captureEvent } from "~/config/utils/events";
import { ID } from "~/config/types/root_types";

type Params = {
  featureInHomepage: boolean;
  featureInHubs: boolean;
};

type Args = {
  unifiedDocumentId: ID;
  params: Params;
  onError?: Function;
  onSuccess: Function;
};

export default function featureDoc({
  unifiedDocumentId,
  params,
  onError,
  onSuccess,
}: Args) {
  const { featureInHomepage, featureInHubs } = params;

  return fetch(
    API.FEATURE_DOCUMENT({ unifiedDocumentId }),
    API.POST_CONFIG({
      feature_in_homepage: featureInHomepage,
      feature_in_hubs: featureInHubs,
    })
  )
    .then(Helpers.checkStatus)
    .then((response) => onSuccess(response))
    .catch((error) => {
      captureEvent({
        error,
        msg: "Failed to feature document",
        data: { unifiedDocumentId, params },
      });
      onError && onError(error);
    });
}
