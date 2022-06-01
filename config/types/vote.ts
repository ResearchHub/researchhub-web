import { userVoteToConstant } from "../constants"
import { ID } from "./root_types"


export type Vote = {
  voteType: "downvote" | "upvote" | "neutralvote" | null,
  id: ID,
  createdDate: string,
}

export const parseVote = (raw: any):Vote => {
  return {
    voteType:  userVoteToConstant(raw),
    id: raw.id,
    createdDate: raw.created_date
  }
}
