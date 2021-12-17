import { Helpers } from "@quantfive/js-web-config";
import { ID } from "~/config/types/root_types";
import API from "../../../config/api";

type HubEditorCreateArgs = {
  editorEmail: any;
  onError: (error: Error) => void;
  onSuccess: () => void;
  selectedHubID: NonNullable<ID>;
};

export function hubEditorCreate({
  editorEmail,
  onError,
  onSuccess,
  selectedHubID,
}: HubEditorCreateArgs): void {
  fetch(
    API.HUB_EDITOR,
    API.POST_CONFIG({
      editor_email: editorEmail,
      selected_hub_id: selectedHubID,
    })
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((response: any): void => {
      onSuccess();
    })
    .catch((err) => {
      onError(err);
    });
}
