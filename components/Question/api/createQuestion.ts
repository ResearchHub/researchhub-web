import API from "~/config/api";
import { sendAmpEvent } from "~/config/fetch";
import { buildApiUri } from "~/config/utils/buildApiUri";
import { Helpers } from "@quantfive/js-web-config";

type Args = {
  onSuccess: (response: any) => void;
  payload: any;
  onError: (error: Error) => void;
};

export const createQuestion = ({ onSuccess, payload, onError }: Args): void => {
  fetch(buildApiUri({ apiPath: "researchhub_posts" }), API.POST_CONFIG(payload))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((res: any) => {
      sendAmpEvent({
        event_type: "create_question",
        time: +new Date(),
        user_id: payload?.created_by,
        insert_id: `question_${res?.id ?? ""}`,
        event_properties: {
          interaction: "Question Created",
        },
      });
      return res;
    })
    .catch(onError);
};
