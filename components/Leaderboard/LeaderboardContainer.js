import { useEffect, useState } from "react";
import { css, StyleSheet } from "aphrodite";
import PropTypes from "prop-types";
import ReactPlaceholder from "react-placeholder/lib";
import LeaderboardPlaceholder from "../Placeholders/LeaderboardPlaceholder";
import LeaderboardUser from "./LeaderboardUser";
import Link from "next/link";
import Ripples from "react-ripples";

import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "~/config/themes/colors";

const LeaderboardContainer = (props) => {
  const [users, setUsers] = useState(
    props.initialUsers && props.initialUsers.results
      ? props.initialUsers.results
      : []
  );
  const [fetchingUsers, setFetchingUsers] = useState(
    props.initialUsers ? false : true
  );

  useEffect(() => {
    fetchLeaderboard();
  }, [props.hubId]);

  const fetchLeaderboard = () => {
    setFetchingUsers(true);
    return fetch(
      API.LEADERBOARD({
        limit: 10,
        page: 1,
        hubId: props.hubId,
        timeframe: "past_week",
      }),
      API.GET_CONFIG()
    )
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        setFetchingUsers(false);
        setUsers(res.results);
      });
  };

  const renderLeaderboardUsers = (users) => {
    return users.map((user, index) => {
      let name = "Anonymous";
      let authorId = user.author_profile && user.author_profile.id;
      if (user.author_profile) {
        name =
          user.author_profile.first_name + " " + user.author_profile.last_name;
      }
      let reputation = user.hub_rep ? user.hub_rep : user.reputation;

      return (
        <Ripples className={css(styles.user)} key={`user_${index}_${user.id}`}>
          <LeaderboardUser
            user={user}
            name={name}
            authorProfile={user.author_profile}
            // reputation={reputation}
            authorId={authorId}
          />
        </Ripples>
      );
    });
  };

  return (
    <div className={css(styles.container)}>
      <h3 className={css(styles.title)}>Trending Users</h3>
      <ReactPlaceholder
        ready={false}
        ready={!fetchingUsers}
        customPlaceholder={<LeaderboardPlaceholder color="#efefef" rows={5} />}
      >
        <div className={css(styles.leaderboardUsers)}>
          {renderLeaderboardUsers(users)}
          <div className={css(styles.linkContainer)}>
            <Link href={"/leaderboard/[type]"} as={"/leaderboard/users"}>
              <a className={css(styles.link)}>View Leaderboard</a>
            </Link>
          </div>
        </div>
      </ReactPlaceholder>
    </div>
  );
};

LeaderboardContainer.propTypes = {
  hubId: PropTypes.number,
};

const styles = StyleSheet.create({
  container: {
    background: "#fff",
    display: "block",
    position: "sticky",
    top: 100,
    borderRadius: 4,
    width: "100%",
    border: "1px solid #ededed",
    padding: "15px 0",
    boxSizing: "border-box",
    marginTop: 20,
  },
  title: {
    textTransform: "uppercase",
    fontWeight: 500,
    fontSize: 12,
    letterSpacing: 1.2,
    textAlign: "left",
    color: "#a7a6b0",
    transition: "all ease-out 0.1s",
    width: "100%",
    boxSizing: "border-box",
    margin: "0 0 10px 0",
    padding: "0 0 0 20px",
  },
  leaderboardUsers: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
  },
  user: {
    display: "flex",
    width: "100%",
    boxSizing: "border-box",
    padding: "7px 20px",
    borderLeft: "3px solid #FFF",
    transition: "all ease-out 0.1s",
    ":hover": {
      borderLeft: `3px solid ${colors.NEW_BLUE()}`,
      backgroundColor: "#FAFAFA",
    },
  },
  linkContainer: {
    marginTop: 15,
  },
  link: {
    textDecoration: "none",
    color: "rgba(78, 83, 255)",
    fontWeight: 300,
    textTransform: "capitalize",
    fontSize: 16,
    padding: "3px 5px",
    paddingLeft: 25,
    ":hover": {
      color: "rgba(78, 83, 255, .5)",
      textDecoration: "underline",
    },
  },
});

export default LeaderboardContainer;
