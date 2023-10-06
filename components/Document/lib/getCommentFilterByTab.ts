const getCommentFilterByTab = (
  tabName: string
):
  | "BOUNTY"
  | "REVIEW"
  | "DISCUSSION"
  | "REPLICABILITY_COMMENT"
  | null
  | undefined => {
  switch (tabName) {
    case "bounties":
      return "BOUNTY";
    case "reviews":
      return "REVIEW";
    case "conversation":
      return "DISCUSSION";
    case "replicability":
      return "REPLICABILITY_COMMENT";
    default:
      return null;
  }
};

export default getCommentFilterByTab;
