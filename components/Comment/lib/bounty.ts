import Bounty, { formatBountyAmount } from "~/config/types/bounty";
import { RHUser } from "~/config/types/root_types";
import { Comment } from "./types";

export const getBountyAmount = ({
  comment,
  formatted = false,
  status = "OPEN",
}: {
  comment: Comment;
  formatted?: boolean;
  status?: "OPEN" | "CLOSED";
}): number => {
  const amount = comment.bounties.reduce((total: number, b: Bounty) => {
    if (status === "OPEN") {
      return total + (b.isOpen ? b.amount : 0);
    } else {
      return total + (b.isExpiredOrClosed ? b.amount : 0);
    }
  }, 0);

  return formatted
    ? formatBountyAmount({ amount, withPrecision: false })
    : amount;
};

export const getOpenBounties = ({
  comment,
}: {
  comment: Comment;
}): Bounty[] => {
  return comment.bounties.filter((b) => b.isOpen);
};

export const getClosedBounties = ({
  comment,
}: {
  comment: Comment;
}): Bounty[] => {
  return comment.bounties.filter((b) => b.isExpiredOrClosed);
};

export const hasOpenBounties = ({ comment }: { comment: Comment }): boolean => {
  return getOpenBounties({ comment }).length > 0;
};

export const getUserOpenBounties = ({
  comment,
  user,
  rootBountyOnly = true,
}: {
  comment: Comment;
  user: RHUser | null;
  rootBountyOnly?: boolean;
}): Bounty[] => {
  return comment.bounties.reduce((bounties: Bounty[], b: Bounty) => {
    const isUserBounty = b.isOpen && b?.createdBy?.id === user?.id;
    const isRootBounty = !Boolean(b.parentId);

    if (isUserBounty && (rootBountyOnly ? isRootBounty : true)) {
      return [...bounties, b];
    }
    return bounties;
  }, []);
};

export const findOpenRootBounties = ({ user, comments }) => {
  return comments.reduce(
    (bounties: Bounty[], c: Comment) => [
      ...bounties,
      ...getUserOpenBounties({ comment: c, user }),
    ],
    []
  );
};
