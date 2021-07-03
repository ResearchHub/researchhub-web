import API from "~/config/api";
import PaperPlaceholder from "../../Placeholders/PaperPlaceholder";
import React, { useEffect, useState } from "react";
import ReactPlaceholder from "react-placeholder";
import UserPostCard from "./UserPostCard";
import colors from "~/config/themes/colors";
import { Helpers } from "@quantfive/js-web-config";
import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { isNullOrUndefined } from "~/config/utils/nullchecks";

function useEffectFetchUserPosts({ setIsFetching, setPosts, userID }) {
  useEffect(() => {
    if (!isNullOrUndefined(userID)) {
      setIsFetching(true);
      fetch(API.RESEARCHHUB_POSTS({ created_by: userID }), API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((data) => {
          try {
            setPosts(data.results);
            setIsFetching(false);
          } catch (error) {
            setIsFetching(false);
          }
        })
        .catch(() => {
          setIsFetching(false);
        });
    } else {
      setIsFetching(false);
    }
  }, [userID]);
}

function UserPosts(props) {
  const { author, user, fetching } = props;
  const [isFetching, setIsFetching] = useState(fetching);
  const [posts, setPosts] = useState([]);
  let postCards;
  if (posts.length > 0) {
    postCards = posts.map((post, index) => (
      <UserPostCard
        {...post}
        key={post.id || index}
        style={styles.customUserPostCard}
      />
    ));
  } else {
    postCards = (
      <div className={css(styles.box)}>
        <h2 className={css(styles.noContent)}>
          User has not authored any posts
        </h2>
      </div>
    );
  }

  useEffectFetchUserPosts({ setIsFetching, setPosts, userID: author.user });
  return (
    <ReactPlaceholder
      ready={!isFetching}
      showLoadingAnimation
      customPlaceholder={<PaperPlaceholder color="#efefef" />}
    >
      {postCards}
    </ReactPlaceholder>
  );
}

const styles = StyleSheet.create({
  customUserPostCard: {
    border: 0,
    borderBottom: "1px solid rgba(36, 31, 58, 0.08)",
    marginBottom: 0,
    marginTop: 0,
    paddingTop: 24,
    paddingBottom: 24,
  },
  noContent: {
    color: colors.BLACK(1),
    fontSize: 20,
    fontWeight: 500,
    textAlign: "center",
    "@media only screen and (max-width: 415px)": {
      width: 280,
      fontSize: 16,
    },
  },
});

const mapStateToProps = (state) => ({
  user: state.auth.user,
  author: state.author,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserPosts);
