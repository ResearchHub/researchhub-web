import { FullAuthorProfile } from "~/components/Author/lib/types";
import { AuthorProfile } from "~/config/types/root_types";

export type ineligibleReason =
  | "NOT_OPEN_ACCESS"
  | "NOT_SUPPORTED_TYPE"
  | "NOT_FIRST_AUTHOR"
  | null;

export type RewardsEligibilityInfo = {
  isEligibleForRewards: boolean;
  reason: "NOT_OPEN_ACCESS" | "NOT_SUPPORTED_TYPE" | "NOT_FIRST_AUTHOR" | null;
};

export const getRewardsEligibilityInfo = ({
  authors,
  fullAuthorProfile,
  targetDoc,
  isOpenAccess,
}: {
  authors: AuthorProfile[];
  fullAuthorProfile: FullAuthorProfile;
  targetDoc: any;
  isOpenAccess: boolean;
}): RewardsEligibilityInfo => {
  const isFirstAuthor = authors.find(
    (author) =>
      author?.authorship?.authorPosition === "first" &&
      author.id === fullAuthorProfile.id
  );
  const isSupportedType = ["article", "preprint"].includes(
    targetDoc?.work_type
  );

  let ineligibleReason: ineligibleReason = null;
  if (!isOpenAccess) {
    ineligibleReason = "NOT_OPEN_ACCESS";
  } else if (!isFirstAuthor) {
    ineligibleReason = "NOT_FIRST_AUTHOR";
  } else if (!isSupportedType) {
    ineligibleReason = "NOT_SUPPORTED_TYPE";
  }

  return {
    isEligibleForRewards: Boolean(isFirstAuthor && isSupportedType),
    reason: ineligibleReason,
  };
};
