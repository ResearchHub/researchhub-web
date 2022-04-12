import { buildSlug } from "~/config/utils/buildSlug";
import { captureEvent } from "~/config/utils/events";
import { FormState } from "../types/UploadComponentTypes";
import { ID } from "~/config/types/root_types";
import { isNullOrUndefined } from "~/config/utils/nullchecks";

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
  try {
    await paperActions.postPaper(formattedPayload, onError, (response) => {
      const { id: paperID, paper_title, slug, title } = response || {};
      const paperName = !isNullOrUndefined(slug)
        ? slug
        : buildSlug(paper_title ? paper_title : title);
      onSuccess({ paperID, paperName });
    });
  } catch (error) {
    onError(error);
  }
}
