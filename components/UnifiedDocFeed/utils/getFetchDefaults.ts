export const getFetchDefaults = ({ query, authToken }) => {
  const defaultProps = {
    feed: 0,
    home: true,
    initialFeed: null,
    initialHubList: null,
    leaderboardFeed: null,
    loggedIn: authToken !== undefined,
    page: 1,
    query,
  };

  return defaultProps;
};
