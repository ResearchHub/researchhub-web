import API from "~/config/api";
import { sendAmpEvent } from "~/config/fetch";
import { buildApiUri } from "~/config/utils/buildApiUri";
import { Helpers } from "@quantfive/js-web-config";

type Args = {
  onError: (error: Error) => void;
  onSuccess: (response: any) => void;
  payload: any;
};

export const createQuestion = ({ onError, onSuccess, payload }: Args): void => {
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
      onSuccess(res);
    })
    .catch(onError);
};
