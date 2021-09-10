import API from "~/config/api";
import PaperPlaceholder from "../../Placeholders/PaperPlaceholder";
import { useEffect, useState } from "react";
import ReactPlaceholder from "react-placeholder";
import UserPostCard from "./UserPostCard";
import EmptyState from "./EmptyState";
import icons from "~/config/themes/icons";
import { Helpers } from "@quantfive/js-web-config";
import { connect, useStore, useDispatch } from "react-redux";
import { isNullOrUndefined } from "~/config/utils/nullchecks";
import { AuthorActions } from "~/redux/author";

function useEffectFetchUserPosts({
  setIsFetching,
  setPosts,
  authorId,
  store,
  dispatch,
}) {
  useEffect(() => {
    if (!isNullOrUndefined(authorId)) {
      setIsFetching(true);
      fetch(API.USER_POST({ authorId }), API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then(async (data) => {
          try {
            setPosts(data.results);
            setIsFetching(false);

            await dispatch(
              AuthorActions.updateAuthorByKey({
                key: "posts",
                value: data,
                prevState: store.getState().author,
              })
            );
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
  }, [authorId]);
}

function UserPosts(props) {
  const { author, user, fetching, maxCardsToRender } = props;
  const [isFetching, setIsFetching] = useState(fetching);
  const [posts, setPosts] = useState([]);
  const store = useStore();
  const dispatch = useDispatch();

  let postCards;
  if (posts.length > 0) {
    postCards = [];
    for (let i = 0; i < posts.length; i++) {
      if (i === maxCardsToRender) break;

      const post = posts[i];
      postCards.push(
        <UserPostCard
          {...post}
          formattedDocType="post"
          key={post?.id || i}
          styleVariation="noBorderVariation"
        />
      );
    }
  } else {
    postCards = (
      <EmptyState
        message={"User has not created any posts"}
        icon={icons.comments}
      />
    );
  }

  useEffectFetchUserPosts({
    setIsFetching,
    setPosts,
    authorId: author.id,
    store,
    dispatch,
  });
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

const mapStateToProps = (state) => ({
  user: state.auth.user,
  author: state.author,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserPosts);
