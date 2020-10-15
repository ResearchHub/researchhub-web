import { useEffect, useState } from "react";
import { css, StyleSheet } from "aphrodite";
import PropTypes from "prop-types";

import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import ReactPlaceholder from "react-placeholder/lib";
import LeaderboardPlaceholder from "../Placeholders/LeaderboardPlaceholder";
import LeaderboardUser from "./LeaderboardUser";
import Link from "next/link";

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
      API.LEADERBOARD({ limit: 10, page: 1, hubId: props.hubId }),
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

      return (
        <div className={css(styles.user)} key={`user_${index}_${user.id}`}>
          <LeaderboardUser
            user={user}
            name={name}
            authorProfile={user.author_profile}
            reputation={user.reputation}
            authorId={authorId}
          />
        </div>
      );
    });
  };

  return (
    <div className={css(styles.container)}>
      <h3 className={css(styles.reputable)}>Most Reputable Users</h3>
      <ReactPlaceholder
        ready={!fetchingUsers}
        customPlaceholder={<LeaderboardPlaceholder color="#efefef" />}
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
    // border: "1px solid #eee",
    background: "#fff",
    // padding: 16,
    borderRadius: 4,
    width: "100%",
  },
  reputable: {
    textTransform: "uppercase",
    fontWeight: 500,
    fontSize: 13,
    letterSpacing: 1.2,
    marginBottom: 15,
    textAlign: "left",
    color: "#a7a6b0",
    transition: "all ease-out 0.1s",
    width: "90%",
    paddingLeft: 35,
    boxSizing: "border-box",
    "@media only screen and (max-width: 1303px)": {
      paddingLeft: 25,
    },
  },
  leaderboardUsers: {
    // opacity: 0,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: "0px 30px",
    paddingLeft: 35,
    "@media only screen and (max-width: 1303px)": {
      padding: "0px 20px",
    },
  },
  user: {
    marginBottom: 16,
    width: "100%",
  },
  link: {
    textDecoration: "none",
    color: "rgba(78, 83, 255)",
    fontWeight: 300,
    textTransform: "capitalize",
    fontSize: 16,
    padding: "3px 5px",
    ":hover": {
      color: "rgba(78, 83, 255, .5)",
      textDecoration: "underline",
    },
  },
  linkContainer: {
    marginTop: 16,
    textAlign: "center",
    paddingBottom: 30,
  },
});

export default LeaderboardContainer;
