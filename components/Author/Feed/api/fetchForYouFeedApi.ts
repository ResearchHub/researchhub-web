import API, { generateApiUrl } from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { parseForYouFeedItem } from "../types/forYouFeedTypes";

export default function fetchForYouFeedApi({
  userId,
  onSuccess,
  onError,
}: {
  userId?: string;
  onSuccess: (response: any) => void;
  onError?: (error: any) => void;
}) {
  const url = generateApiUrl("api/feed", { user_id: userId });

  return fetch(url, API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((response) => {
      const results = (response as any)?.results || [];
      onSuccess(results.map(parseForYouFeedItem));
    })
    .catch((error) => {
      onError && onError(error);
    });
}
