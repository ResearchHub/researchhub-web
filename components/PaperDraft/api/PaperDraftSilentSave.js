import { Helpers } from "@quantfive/js-web-config";
import { convertToRaw } from "draft-js";

export function savePaperSilentlyHook({
  editorState,
  onError: _onError,
  onSuccess,
  paperDraftSections,
  paperId,
}) {
  fetch(
    API.PAPER({
      paperId,
      hidePublic: true,
      route: "edit_file_extract",
    }),
    API.POST_CONFIG({
      data: convertToRaw(editorState.getCurrentContent()),
      sections: paperDraftSections,
    })
  )
    .then(Helpers.checkStatus)
    .then(() => onSuccess());
}
