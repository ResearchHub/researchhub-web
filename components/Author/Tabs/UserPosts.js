import API from "~/config/api";
import PaperPlaceholder from "../../Placeholders/PaperPlaceholder";
import React, { useEffect, useState } from "react";
import ReactPlaceholder from "react-placeholder";
import UserPostCard from "./UserPostCard";
import EmptyState from "./EmptyState";
import icons from "~/config/themes/icons";
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
      <EmptyState
        message={"User has not created any posts"}
        icon={icons.comments}
      />
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
