import { GrmVoteEnumType, ID, RhDocumentType } from "../types/root_types";
import { buildApiURI } from "./buildApiURI";
import { isNullOrUndefined } from "./nullchecks";

type Args = {
  commentPayload?: {
    commentID?: string;
    commentType?: string;
    replyID?: string;
    threadID?: string;
  };
  documentType: RhDocumentType;
  documentID: ID;
  voteType: GrmVoteEnumType;
};

export function buildGrmVoteApiUri({
  commentPayload,
  documentType,
  documentID,
  voteType,
}: Args): string {
  let apiPath;
  if (isNullOrUndefined(commentPayload)) {
    apiPath = `${documentType}/${documentID}/${voteType}`;
  } else {
    const {
      commentID = undefined,
      commentType = undefined,
      replyID = undefined,
      threadID = undefined,
    } = commentPayload ?? {};
    if (commentType === "thread") {
      apiPath = `${documentType}/${documentID}/discussion/${threadID}/${voteType}`;
    } else if (commentType === "comment") {
      apiPath = `${documentType}/${documentID}/discussion/${threadID}/comment/${commentID}/${voteType}`;
    } else {
      apiPath = `${documentType}/${documentID}/discussion/${threadID}/comment/${commentID}/reply/${replyID}/${voteType}`;
    }
  }
  return buildApiURI({ apiPath });
}
