import { formatPaperSlug } from "../../../../config/utils";
import { FormState } from "../types/UploadComponentTypes";
import { ID } from "../../../../config/types/root_types";
import { isNullOrUndefined } from "../../../../config/utils/nullchecks";

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
  /*  NOTE(100): calvinhlee - Making fields multi-purpose based on FE context makes code potentially very buggy. 
      Coding practices like this must stop disregarding js-typing. 
      Referring to authors, hubs & published here.
  */
  const { authors, published, hubs } = payload;
  const formattedPayload: any = {
    ...payload,
    authors: (authors || []).map((author: any): ID => author.id),
    hubs: hubs.map((hub): ID => hub.id),
  };

  if (!isNullOrUndefined(published) && !isNullOrUndefined(published.year)) {
    const { year, month } = published;
    // @ts-ignore (see comment above & below is probably buggy due to how day is handled)
    const [yearValue, monthValue] = [year.value || "01", month.value || "01"];
    formattedPayload.publishDate = `${yearValue}-${monthValue}-01`;
  }
  const response = await paperActions.patchPaper(
    paperID,
    formattedPayload,
    undefined,
    onError
  );
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
