import { ID } from "~/config/types/root_types";
import API from "~/config/api";

type DeclarationType = 
  | "ACCEPT_TERMS_AND_CONDITIONS"
  | "AUTHORIZE_CC_BY_4_0"
  | "CONFIRM_AUTHORS_RIGHTS"
  | "CONFIRM_ORIGINALITY_AND_COMPLIANCE";

interface Declaration {
  declaration_type: DeclarationType;
  accepted: boolean;
}

export interface createPaperProps {
  title: string;
  abstract: string;
  authors: Array<{
    id: ID;
    author_position: "first" | "middle" | "last";
    institution_id: ID;
    is_corresponding: boolean;
  }>;
  hubIds: ID[];
  pdfUrl: string;
  previousPaperId?: ID;
  changeDescription: string;
  declarations?: Declaration[];
}

export const createPaperAPI = ({
  title,
  abstract,
  authors,
  hubIds,
  pdfUrl,
  previousPaperId,
  changeDescription,
  declarations,
}: createPaperProps): Promise<any> => {
  const url = `${API.BASE_URL}paper/create_researchhub_paper/`;

  return fetch(
    url,
    API.POST_CONFIG({
      title,
      abstract,
      authors,
      hub_ids: hubIds,
      pdf_url: pdfUrl,
      previous_paper_id: previousPaperId,
      change_description: changeDescription,
      ...(declarations ? { declarations } : {}),
    })
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("HTTP-Error: " + response.status);
      }
    })
    .then((data) => {
      console.log("data", data);
      return data;
    })
    .catch((error) => {
      console.error("Request Failed:", error);
      return [];
    });
};
