import { firstImageFromHtml } from "~/config/utils/getFirstImageOfHtml";
import { getPlainTextFromMarkdown } from "~/config/utils/getPlainTextFromMarkdown";
import { Helpers } from "@quantfive/js-web-config";
import { ID } from "~/config/types/root_types";
import API from "~/config/api";

type UpdateHypothesisArgs = {
  hypothesisID: ID;
  hypothesisTitle: string;
  onError: Function;
  onSuccess: Function;
  updatedMarkdown: any;
};

export function updateHypothesis({
  hypothesisID,
  hypothesisTitle,
  onError,
  onSuccess,
  updatedMarkdown,
}: UpdateHypothesisArgs): void {
  fetch(
    API.HYPOTHESIS({
      hypothesis_id: hypothesisID,
      upsert: true,
    }),
    API.POST_CONFIG({
      document_type: "HYPOTHESIS",
      full_src: updatedMarkdown,
      hypothesis_id: hypothesisID,
      preview_img: firstImageFromHtml(updatedMarkdown),
      renderable_text: getPlainTextFromMarkdown(updatedMarkdown),
      title: hypothesisTitle,
    })
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((result: Object): void => {
      onSuccess(result);
    })
    .catch((error: Error): void => {
      onError(error);
    });
}
