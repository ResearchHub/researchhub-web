import { Fragment, useEffect, useState } from "react";

// NPM Modules
import { css, StyleSheet } from "aphrodite";
import InfiniteScroll from "react-infinite-scroller";
import { connect, useDispatch, useStore } from "react-redux";
import Error from "next/error";

// Components
import Head from "~/components/Head";
import { Comment } from "~/components/DiscussionComment";
import { CommentEditor } from "~/components/DiscussionCommentEditor";
import Thread from "~/components/DiscussionPageThread";
import TextEditor from "~/components/TextEditor";

// components
import Loader from "~/components/Loader/Loader";
import Message from "~/components/Loader/Message";

// Redux
import DiscussionActions from "~/redux/discussion";
import { MessageActions } from "../../../../redux/message";
import { AuthActions } from "~/redux/auth";

// Utils
import { discussionPageColors } from "~/config/themes/colors";
import { absoluteUrl } from "~/config/utils";
import colors from "../../../../config/themes/colors";

const DiscussionThreadPage = (props) => {
  const dispatch = useDispatch();
  const store = useStore();

  if (props.error) {
    return <Error statusCode={404} />;
  }

  const { discussion, discussionThreadId, hostname, paperId } = props;

  const [thread, setThread] = useState(props.discussion);
  const [pageNumber, setPageNumber] = useState(1);
  const { count, page } = discussion.commentPage;
  const [comments, setComments] = useState([]);
  const [transition, setTransition] = useState(false);
  const [userVote, setUserVote] = useState(
    props.discussion.success && props.discussion.userVote
  );
  const [active, setActive] = useState(true);

  let title = "";
  let body = "";
  let createdBy = "";
  let createdDate = "";
  let score = 0;

  if (thread.success) {
    title = thread.title;
    body = thread.text;
    createdBy = thread.created_by;
    createdDate = thread.created_date;
    score = thread.score;
  }

  useEffect(() => {
    if (thread.success) {
      const currentComments = thread.comments;
      setComments(currentComments);
    }
  }, [thread.success]);

  useEffect(() => {
    async function refetchDiscussion() {
      dispatch(DiscussionActions.fetchThreadPending());
      dispatch(DiscussionActions.fetchCommentsPending());
      await dispatch(
        DiscussionActions.fetchThread(paperId, discussionThreadId)
      );
      await dispatch(
        DiscussionActions.fetchComments(paperId, discussionThreadId, pageNumber)
      );
    }

    refetchDiscussion();
  }, [props.isServer, paperId, discussionThreadId]);

  function renderComments(comments) {
    let commentComponents =
      comments &&
      comments.map((c, i) => {
        if (!c.createdBy) {
          c.createdBy = c.created_by;
        }

        if (!c.createdDate) {
          c.createdDate = c.created_date;
        }
        c.userVote = {};

        let highlight = false;
        let divider = <div className={css(styles.divider)} />;
        if (i === 0) {
          divider = null;
          if (transition) {
            highlight = true;
          }
        }
        return (
          <Fragment key={`${c.id}-${i}`}>
            {divider}
            <Comment
              key={`${c.id}-${i}`}
              data={c}
              commentStyles={styles.commentStyles}
              discussionCardStyle={
                highlight
                  ? styles.newDiscussionCardStyle
                  : styles.discussionCardStyle
              }
            />
          </Fragment>
        );
      });
    return commentComponents;
  }

  function addSubmittedComment(comment) {
    let newComments = [comment];
    props.showMessage({ load: true, show: true });
    newComments = newComments.concat(props.discussion.comments);
    setTransition(true);
    setComments(newComments);
    setActive(false);
    props.showMessage({ show: false });
    props.checkUserFirstTime(!props.auth.user.has_seen_first_coin_modal);
    props.getUser();
    setTransition(false);
  }

  const getNextPage = async (paperId, discussionThreadId, page) => {
    await props.fetchComments(paperId, discussionThreadId, page);
    if (props.state.commentPage.comments) {
      if (props.state.commentPage.comments.length > 0) {
        setComments([...comments, ...props.state.commentPage.comments]);
      }
    }
  };

  return (
    <div>
      <Message />
      <Head
        title={title}
        description={`Discuss on ResearchHub`}
        socialImageUrl={props.paper && props.paper.metatagImage}
      />
      <div className={css(styles.threadContainer)}>
        <Thread
          hostname={hostname}
          title={title}
          body={body}
          createdBy={createdBy}
          date={createdDate}
          vote={userVote}
          score={score}
        />
      </div>
      <div className={css(styles.divider)} />
      <div className={css(styles.contentContainer)}>
        <CommentEditor
          onSubmit={addSubmittedComment}
          active={active}
          commentEditor={true}
        />
        <div
          id="all_comments_container"
          className={css(styles.allCommentsContainer)}
        >
          <InfiniteScroll
            pageStart={page}
            loader={<Loader loading={true} />}
            hasMore={comments && count > comments.length}
            loadMore={() => {
              let paperId = discussion.paper;
              let discussionThreadId = discussion.id;
              getNextPage(paperId, discussionThreadId, page + 1);
            }}
          >
            {renderComments(comments)}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};

DiscussionThreadPage.getInitialProps = async ({ res, req, store, query }) => {
  const { host } = absoluteUrl(req);
  const hostname = host;
  let { discussion } = store.getState();

  const { paperId, discussionThreadId } = query;
  const page = 1;
  try {
    if (typeof paperId !== "number" || typeof discussionThreadId !== "number") {
      throw 404;
    }
    store.dispatch(DiscussionActions.fetchThreadPending());
    store.dispatch(DiscussionActions.fetchCommentsPending());
    await store.dispatch(
      DiscussionActions.fetchThread(paperId, discussionThreadId)
    );
    await store.dispatch(
      DiscussionActions.fetchComments(paperId, discussionThreadId, page)
    );
  } catch (err) {
    if (res) {
      res.statusCode = 404;
    }
    return { error: true };
  }

  discussion = store.getState().discussion;

  return { discussion, discussionThreadId, hostname, paperId };
};

const styles = StyleSheet.create({
  threadContainer: {
    width: "80%",
    margin: "auto",
    "@media only screen and (max-width: 415px)": {
      width: "90%",
    },
  },
  actionBar: {
    marginTop: 8,
    height: 19,
    width: "100%",
    transition: "all ease-in-out 0.3s",
    overflow: "hidden",
  },
  contentContainer: {
    width: "70%",
    padding: "30px 0px",
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    "@media only screen and (max-width: 415px)": {
      width: "90%",
    },
  },
  allCommentsContainer: {
    width: "100%",
  },
  divider: {
    borderBottom: "1px solid",
    display: "block",
    borderColor: discussionPageColors.DIVIDER,
  },
  commentStyles: {
    padding: 0,
  },
  newDiscussionCardStyle: {
    backgroundColor: colors.LIGHT_YELLOW(1),
    margin: 0,
    marginTop: 15,
  },
  discusssionCardStyle: {
    margin: 0,
  },
});

const mapStateToProps = (state) => ({
  state: state.discussion,
  message: state.message,
  auth: state.auth,
});

const mapDispatchToProps = {
  fetchComments: DiscussionActions.fetchComments,
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
  checkUserFirstTime: AuthActions.checkUserFirstTime,
  getUser: AuthActions.getUser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscussionThreadPage);
