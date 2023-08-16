const getCommentFilterByTab = (
  tabName: string
): "BOUNTY" | "REVIEW" | "DISCUSSION" | null | undefined => {
  switch (tabName) {
    case "bounties":
      return "BOUNTY";
    case "reviews":
      return "REVIEW";
    case "conversation":
      return "DISCUSSION";
    default:
      return null;
  }
};

export default getCommentFilterByTab;
