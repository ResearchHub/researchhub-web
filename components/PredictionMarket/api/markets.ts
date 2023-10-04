import { Helpers } from "@quantfive/js-web-config";
import API from "~/config/api";
import { ID } from "~/config/types/root_types";
import { captureEvent } from "~/config/utils/events";

interface Props {
  marketId: ID;
}

const fetchPredictionMarket = ({ marketId }: Props): Promise<any> => {
  return fetch(API.PREDICTION_MARKET({ marketId }), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((resp) => {
      return resp;
    })
    .catch((error) => {
      captureEvent({
        data: { marketId },
        error,
        msg: `Error fetching prediction market: ${marketId}`,
      });
      throw error;
    });
};

export default fetchPredictionMarket;
