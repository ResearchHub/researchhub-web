import { captureEvent } from "~/config/utils/events";

import { buildSlug } from "../../../../config/utils/document";
import { FormState } from "../types/UploadComponentTypes";
import { ID } from "../../../../config/types/root_types";
import { isNullOrUndefined } from "../../../../config/utils/nullchecks";

type Args = {
  onError: Function;
  onSuccess: Function;
  paperActions: any; // redux
  paperRedux: any;
  payload: FormState;
};

export async function uploadNewPaper({
  onError,
  onSuccess,
  paperActions,
  paperRedux,
  payload,
}: Args): Promise<void> {
  const { title: payloadTitle, paper_title: payloadPaperTitle } = payload;
  const { uploadedPaper } = paperRedux;
  const formattedPayload = {
    ...payload,
    file: uploadedPaper.url ? uploadedPaper.url : uploadedPaper,
    hubs: payload.hubs.map((hub): ID => hub.id),
    title:
      !isNullOrUndefined(payloadTitle) && payloadTitle.length > 0
        ? payloadTitle
        : payloadPaperTitle,
  };
  const response = await paperActions.postPaper(formattedPayload);
  const { payload: resPayload } = response;
  if (resPayload.success) {
    const { postedPaper } = resPayload;
    const { id: paperID, paper_title, slug, title } = postedPaper || {};
    const paperName = !isNullOrUndefined(slug)
      ? slug
      : buildSlug(paper_title ? paper_title : title);
    onSuccess({ paperID, paperName });
  } else {
    captureEvent({
      msg: "Failed to upload paper",
      data: { response, uploadedPaper, payloadTitle, payloadPaperTitle },
    });
    onError(resPayload);
  }
}
