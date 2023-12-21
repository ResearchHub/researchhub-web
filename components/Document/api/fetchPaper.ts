import { Helpers } from "@quantfive/js-web-config";
import API from "~/config/api";
import { ID } from "~/config/types/root_types";
import { captureEvent } from "~/config/utils/events";

interface Props {
  paperId: ID;
}

const fetchPaper = ({ paperId }: Props): Promise<any> => {
  const url = API.PAPER({ paperId });
  return fetch(url, API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((resp) => {
      return resp;
    })
    .catch((error) => {
      captureEvent({
        data: { paperId },
        error,
        msg: `Error fetching paper: ${paperId}`,
      });
      throw error;
    });
};

export default fetchPaper;
