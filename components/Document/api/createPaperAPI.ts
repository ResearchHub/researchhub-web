import { ID } from "~/config/types/root_types";
import API from "~/config/api";

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
}

export const createPaperAPI = ({
  title,
  abstract,
  authors,
  hubIds,
  pdfUrl,
  previousPaperId,
  changeDescription,
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
    })
    .catch((error) => {
      console.error("Request Failed:", error);
      return [];
    });
};
