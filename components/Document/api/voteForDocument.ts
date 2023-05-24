import API, { generateApiUrl, buildQueryString } from "~/config/api";
import { ApiDocumentType } from "../lib/types";
import { ID } from "~/config/types/root_types";
import { parseVote, Vote } from "~/config/types/vote";
import Helpers from "~/config/api/helpers";

export const voteForDocument = async ({
  voteType,
  documentType,
  documentId,
}: {
  voteType: "upvote" | "downvote" | "neutralvote";
  documentType: ApiDocumentType;
  documentId: ID;
}): Promise<Vote> => {
  const url = generateApiUrl(`${documentType}/${documentId}/${voteType}`);

  try {
    const response = await fetch(url, API.POST_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON);

    return parseVote(response);
  } catch (error: any) {
    if (error.response.status === 401 || error.response.status === 403) {
      throw "Cannot vote on own's post";
    } else {
      throw "Unexpected error while casting vote";
    }
  }
};
