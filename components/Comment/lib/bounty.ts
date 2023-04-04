import Bounty, { formatBountyAmount } from "~/config/types/bounty";
import { RHUser } from "~/config/types/root_types";
import { Comment } from "./types";

export const getBountyAmount = ({
  comment,
  formatted = false,
}: {
  comment: Comment;
  formatted?: boolean;
}): number => {
  const amount = comment.bounties.reduce(
    (total: number, b: Bounty) => total + (b.isOpen ? b.amount : 0),
    0
  );

  return formatted
    ? formatBountyAmount({ amount, withPrecision: false })
    : amount;
};

export const hasOpenBounties = ({ comment }: { comment: Comment }): boolean => {
  return comment.bounties.reduce(
    (hasOpenBounties: boolean, curr: Bounty) => hasOpenBounties || curr.isOpen,
    false
  );
};

export const getOpenBounties = ({
  comment,
}: {
  comment: Comment;
}): Bounty[] => {
  return comment.bounties.filter((b) => b.isOpen);
};

export const getUserOpenBounties = ({ comment, user, rootBountyOnly = true }: { comment: Comment, user: RHUser | null, rootBountyOnly?: boolean }): Bounty[] => {
  return comment.bounties.reduce(
    (bounties: Bounty[], b: Bounty) => {
      const isUserBounty = b.isOpen && b?.createdBy?.id === user?.id;
      const isRootBounty = !Boolean(b.parentId);

      if (isUserBounty && (rootBountyOnly ? isRootBounty : true)) {
        return [...bounties, b];
      }
      return bounties;
    }, []);
};

