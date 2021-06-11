import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { Helpers } from "@quantfive/js-web-config";
import API from "~/config/api";
import PaperPlaceholder from "../../Placeholders/PaperPlaceholder";
import React, { useEffect, useState } from "react";
import ReactPlaceholder from "react-placeholder";
import UserPostCard from "./UserPostCard";

function useEffectFetchUserPosts({ setIsFetching, setPosts, userID }) {
  useEffect(() => {
    setIsFetching(true);
    fetch(API.RESEARCHHUB_POSTS({ created_by: userID }), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((data) => {
        try {
          console.log(data.results);
          setPosts(data.results);
          setIsFetching(false);
        } catch (error) {
          setIsFetching(false);
        }
      })
      .catch(() => {
        setIsFetching(false);
      });
  }, [userID]);
}

function UserPosts(props) {
  const { user, fetching } = props;
  const [isFetching, setIsFetching] = useState(fetching);
  const [posts, setPosts] = useState([]);
  const postCards = posts.map((post, index) => (
    <UserPostCard
      {...post}
      key={post.id || index}
      style={styles.customUserPostCard}
    />
  ));
  useEffectFetchUserPosts({ setIsFetching, setPosts, userID: user.id });
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
