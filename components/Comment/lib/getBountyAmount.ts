import Bounty, { formatBountyAmount } from "~/config/types/bounty";
import { Comment } from "./types";

const getBountyAmount = ({ comment, formatted = false }: { comment: Comment, formatted: boolean }):number => {
  const amount = comment.bounties.reduce((total: number, b: Bounty) => total + (b.isOpen ? b.amount : 0), 0);

  return formatted ? formatBountyAmount({ amount, withPrecision: false }) : amount;
}

export default getBountyAmount;