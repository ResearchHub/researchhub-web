import { emptyFncWithMsg } from "../../../../config/utils/nullchecks";
import { getSuggestedHubs } from "./getSuggestedHubs";
import { useEffect } from "react";

type Payload = {
  setSuggestedHubs: (hubs: any) => void;
};

export const useEffectFetchSuggestedHubs = ({
  setSuggestedHubs,
}: Payload): void => {
  useEffect((): void => {
    getSuggestedHubs({
      onError: emptyFncWithMsg,
      onSuccess: (hubs: any): void => setSuggestedHubs(hubs),
    });
  }, []);
};
