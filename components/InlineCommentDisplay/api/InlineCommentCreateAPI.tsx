/* - calvinhlee: this file utilizes functionalities that are legacy, I'm suppressing some warnings in this file */
// @ts-ignore
import { Helpers } from "@quantfive/js-web-config";
import API from "../../../config/api"; // @ts-ignore
import { sendAmpEvent } from "~/config/fetch";

type saveCommentToBackendArgs = {
  auth: any;
  onError?: (error: Error) => void;
  onSuccess: () => void;
  openRecaptchaPrompt: Function;
  params: any;
  setMessage: Function /* undux functino tied to commenting */;
  showMessage: Function /* undux functino tied to commenting */;
};

export function saveCommentToBackend({
  auth,
  onSuccess,
  openRecaptchaPrompt,
  params,
  setMessage,
  showMessage,
}: saveCommentToBackendArgs): void {
  fetch(
    API.DISCUSSION({ paperId: params.paper, twitter: null }),
    API.POST_CONFIG(params)
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((resp) => {
      showMessage({ show: false });
      setMessage("Successfully Saved!");
      showMessage({ show: true });
      // amp events
      let payload = {
        event_type: "create_thread",
        time: +new Date(),
        user_id: auth.user ? auth.user.id && auth.user.id : null,
        // @ts-ignore
        insert_id: `thread_${resp.id}`,
        event_properties: {
          interaction: "Post Thread",
          paper: params.paper,
          // @ts-ignore
          is_removed: resp.is_removed,
        },
      };
      sendAmpEvent(payload);
      onSuccess();
    })
    .catch((err) => {
      if (err.response.status === 429) {
        showMessage({ show: false });
        return openRecaptchaPrompt(true);
      }
      showMessage({ show: false });
      setMessage("Something went wrong");
      showMessage({ show: true, error: true });
    });
}
