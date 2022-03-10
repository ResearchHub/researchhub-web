import {
  emptyFncWithMsg,
  isNullOrUndefined,
  nullthrows,
} from "../../../../config/utils/nullchecks";
import { getSuggestedTags } from "./getSuggestedTags";
import { useEffect } from "react";

type Payload = {
  momoizeOn?: any[];
  setSuggestedTags: (hubs: any) => void
};

export const useEffectFetchSuggestedTags = ({
  momoizeOn,
  setSuggestedTags
}: Payload): void => {
  useEffect(
    (): void => {
      getSuggestedTags({
        onError: emptyFncWithMsg,
        onSuccess: (tags: any): void => setSuggestedTags(tags),
        searchString: '',
      });
    },
    !isNullOrUndefined(momoizeOn) ? nullthrows(momoizeOn) : []
  );
};
