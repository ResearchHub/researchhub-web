const getCommentFilterByTab = (tabName) => {
  switch (tabName) {
    case "bounties":
      return "BOUNTY";
    case "reviews":
      return "REVIEW";
    case "conversation":
    default:
      return "DISCUSSION";
  }
};

export default getCommentFilterByTab;
