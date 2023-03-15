import Bounty from "~/config/types/bounty";
import { Comment } from "./types";

const hasOpenBounties = ({ comment }: { comment: Comment }) => {
  return comment.bounties.reduce((hasOpenBounties: boolean, curr: Bounty) => hasOpenBounties || curr.isOpen, false);
}

export default hasOpenBounties;