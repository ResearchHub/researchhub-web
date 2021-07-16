import { formatPaperSlug } from "../../../../config/utils";
import { FormState } from "../types/UploadComponentTypes";
import { ID } from "../../../../config/types/root_types";
import {
  isNullOrUndefined,
  nullthrows,
} from "../../../../config/utils/nullchecks";

type Args = {
  onError: Function;
  onSuccess: Function;
  paperActions: any; // redux
  paperID: ID;
  payload: FormState;
};

export async function updateExistingPaper({
  onError,
  onSuccess,
  paperActions,
  paperID,
  payload,
}: Args): Promise<void> {
  const formattedPayload: any = {
    ...payload,
    hubs: payload.hubs.map((hub): ID => hub.id),
  };

  /*  NOTE: calvinhlee - Making fields multi-purpose like below depending on component / situation makes code potentially very buggy. 
      Coding practices like this must to stop disregarding js-typing. */
  const { published } = payload;
  if (!isNullOrUndefined(published) && !isNullOrUndefined(published.year)) {
    const { year, month } = published;
    // @ts-ignore (see comment above)
    const [yearValue, monthValue] = [year.value || "01", month.value || "01"];
    formattedPayload.publishedDate = `${yearValue}-${monthValue}-01`;
  }
  const response = await paperActions.patchPaper(paperID, formattedPayload);
  debugger;
  const { payload: resPayload } = response;
  if (resPayload.success) {
    debugger;
    const { postedPaper } = resPayload;
    const { id: paperID, paper_title, slug, title } = postedPaper || {};
    const paperName = !isNullOrUndefined(slug)
      ? slug
      : formatPaperSlug(paper_title ? paper_title : title);
    onSuccess({ paperID, paperName });
  } else {
    debugger;
    onError(resPayload);
  }
}
