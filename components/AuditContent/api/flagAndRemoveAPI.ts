import { Helpers } from "@quantfive/js-web-config";
import { FLAG_REASON } from "~/components/Flag/config/constants";
import API from "~/config/api";
import { ID } from "~/config/types/root_types";
import { captureEvent } from "~/config/utils/events";
import { KeyOf } from "~/config/types/root_types";

type ContentItem = {
  object_id: ID,
  content_type: ID,
}

type Verdict = {
  verdict_choice: KeyOf<typeof FLAG_REASON>,
  is_content_removed: Boolean,
}

type APIParams = {
  flag: Array<ContentItem>;
  verdict: Verdict;
};

type Args = {
  apiParams: APIParams;
  onSuccess: Function;
  onError: Function;  
}

export const buildParamsForFlagAndRemoveAPI = ({ selected, verdict }):APIParams => {
  selected = Array.isArray(selected) ? selected : [selected];

  const contentItems = selected.map((r):ContentItem => ({
    content_type: r.contentType.id,
    object_id: r.item.id
  }));

  return {
    flag: contentItems,
    verdict: {
      verdict_choice: verdict,
      is_content_removed: true,
    },
  }
}

export default function flagAndRemove({
  apiParams,
  onSuccess,
  onError,
}: Args): void {
  fetch(
    API.FLAG_AND_REMOVE(),
    API.POST_CONFIG(apiParams)
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((response) => onSuccess(response))
    .catch((error: Error) => {
      captureEvent({
        error,
        msg: "Failed to flag + remove",
        data: { apiParams },
      });
      onError(error)
    });
}
