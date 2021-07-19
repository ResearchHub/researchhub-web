import { formatPaperSlug } from "../../../../config/utils";
import { FormState } from "../types/UploadComponentTypes";
import { ID } from "../../../../config/types/root_types";
import { isNullOrUndefined } from "../../../../config/utils/nullchecks";

type Args = {
  onError: Function;
  onSuccess: Function;
  paperActions: any; // redux
  payload: FormState;
};

export async function uploadNewPaper({
  onError,
  onSuccess,
  paperActions,
  payload,
}: Args): Promise<void> {
  const response = await paperActions.postPaper({
    ...payload,
    hubs: payload.hubs.map((hub): ID => hub.id),
  });
  const { payload: resPayload } = response;
  if (resPayload.success) {
    const { postedPaper } = resPayload;
    const { id: paperID, paper_title, slug, title } = postedPaper || {};
    const paperName = !isNullOrUndefined(slug)
      ? slug
      : formatPaperSlug(paper_title ? paper_title : title);
    onSuccess({ paperID, paperName });
  } else {
    onError(resPayload);
  }
}
