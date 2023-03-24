import API from "~/config/api";
import { buildApiUri } from "~/config/utils/buildApiUri";
import { Helpers } from "@quantfive/js-web-config";
import { UnifiedDocument } from "~/config/types/root_types";
import { getFEUnifiedDocType } from "~/config/utils/getUnifiedDocType";

type Args = {
  onError: (error: Error) => void;
  onSuccess: (response: any) => void;
  page?: number;
};

export const fetchFeaturedDocs = ({ onError, onSuccess, page }: Args): void => {
  fetch(
    buildApiUri({
      apiPath: "researchhub_unified_document/get_featured_documents",
    }),
    API.GET_CONFIG()
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((payload: any): void => {
      onSuccess(
        (payload?.results ?? [])?.map((result: any): UnifiedDocument => {
          const { id, documents, document_type, is_removed } = result ?? {};
          const isDocPaper = !Array.isArray(documents);
          const targetDoc = (!isDocPaper ? documents[0] : documents) ?? {};
          return {
            createdBy: isDocPaper ? targetDoc?.uploaded_by ?? {} : targetDoc?.created_by,
            document: targetDoc,
            documentType: getFEUnifiedDocType(document_type ?? ""),
            id,
            isRemoved: Boolean(is_removed),
          };
        })
      );
    })
    .catch(onError);
};
