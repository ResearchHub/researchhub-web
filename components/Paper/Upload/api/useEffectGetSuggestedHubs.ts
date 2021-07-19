import {
  emptyFncWithMsg,
  isNullOrUndefined,
  nullthrows,
} from "../../../../config/utils/nullchecks";
import { getSuggestedHubs } from "./getSuggestedHubs";
import { useEffect } from "react";

type Payload = {
  momoizeOn?: any[];
  setSuggestedHubs: (hubs: any) => void;
};

export const useEffectFetchSuggestedHubs = ({
  momoizeOn,
  setSuggestedHubs,
}: Payload): void => {
  useEffect(
    (): void => {
      getSuggestedHubs({
        onError: emptyFncWithMsg,
        onSuccess: (hubs: any): void => setSuggestedHubs(hubs),
      });
    },
    !isNullOrUndefined(momoizeOn) ? nullthrows(momoizeOn) : []
  );
};
