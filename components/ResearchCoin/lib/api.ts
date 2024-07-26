import { ID } from "~/config/types/root_types";
import API, { generateApiUrl } from "~/config/api";

interface Props {
  paperId: ID;
  authorshipId: ID;
  userId: ID;
  preregistrationUrl: string;
  openDataUrl: string;
}

export const submitRewardsClaim = ({ paperId, authorshipId, userId, preregistrationUrl, openDataUrl  }: Props) => {
  const url = generateApiUrl("author_claim_case");
  return fetch(
    url,
    API.POST_CONFIG({
      target_paper_id: paperId,
      authorship_id: authorshipId,
      requestor: userId,
      creator: userId,
      open_data_url: "https://opendata.example.com",
      preregistration_url: "https://preregistration.example.com",
      case_type: "PAPER_CLAIM",
    })
  );  
}