import { FullAuthorProfile } from "~/components/Author/lib/types";
import { AuthorProfile } from "~/config/types/root_types";
import { isNewerThanFiveYearsAgo } from "~/config/utils/dates";

export type ineligibleReason =
  | "NOT_OPEN_ACCESS"
  | "NOT_SUPPORTED_TYPE"
  | "NOT_FIRST_AUTHOR"
  | "OLD_PAPER"
  | null;

export type RewardsEligibilityInfo = {
  isEligibleForRewards: boolean;
  reason: ineligibleReason;
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

  const isPublishedDateWithinFiveYears = isNewerThanFiveYearsAgo(targetDoc?.paper_publish_date);

  let ineligibleReason: ineligibleReason = null;
  if (!isOpenAccess) {
    ineligibleReason = "NOT_OPEN_ACCESS";
  } else if (!isFirstAuthor) {
    ineligibleReason = "NOT_FIRST_AUTHOR";
  } else if (!isSupportedType) {
    ineligibleReason = "NOT_SUPPORTED_TYPE";
  }
  else if (!isPublishedDateWithinFiveYears) {
    ineligibleReason = "OLD_PAPER";
  }

  return {
    isEligibleForRewards: Boolean(isFirstAuthor && isSupportedType && isOpenAccess && isPublishedDateWithinFiveYears),
    reason: ineligibleReason,
  };
};
