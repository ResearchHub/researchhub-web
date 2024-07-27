export type ineligibleReason = "NOT_SUPPORTED_TYPE" | "NOT_FIRST_AUTHOR" | null;

export type RewardsEligibilityInfo = {
  isEligibleForRewards: boolean;
  reason: "NOT_SUPPORTED_TYPE" | "NOT_FIRST_AUTHOR" | null;
}

export const getRewardsEligibilityInfo = ({ authorships, fullAuthorProfile, targetDoc }):RewardsEligibilityInfo  => {
  const isFirstAuthor = authorships.find(
    (authorship) =>
      authorship.authorPosition === "first" &&
      authorship.authorId === fullAuthorProfile.id
  );
  const isSupportedType = ["article", "preprint"].includes(targetDoc?.work_type);

  let ineligibleReason:ineligibleReason = null;
  if (!isFirstAuthor) {
    ineligibleReason = "NOT_FIRST_AUTHOR";
  }
  else if (!isSupportedType) {
    ineligibleReason = "NOT_SUPPORTED_TYPE";
  }

  return {
    isEligibleForRewards: isFirstAuthor && isSupportedType,
    reason: ineligibleReason
  }
}
