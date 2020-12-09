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
import { MessageActions } from "../../../../../redux/message";
import { AuthActions } from "~/redux/auth";

// Utils
import { discussionPageColors } from "~/config/themes/colors";
import { absoluteUrl } from "~/config/utils";
import colors from "../../../../../config/themes/colors";
import API from "../../../../../config/api";
import * as utils from "../../../../../redux/utils";

const DiscussionThreadPage = (props) => {
  if (props.error) {
    return <Error statusCode={404} />;
  }

  const { discussion, hostname, paperId, threadId } = props;

  let initialThread = {
    createdBy: {
      author_profile: { first_name: "", last_name: "" },
    },
  };
  const [thread, setThread] = useState(initialThread);
  const [comments, setComments] = useState([]);
  const [transition, setTransition] = useState(false);
  const [active, setActive] = useState(true);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const fetchComments = async () => {
    return fetch(API.THREAD_COMMENT(paperId, threadId, page), API.GET_CONFIG())
      .then(async (response) => {
        if (response.ok) {
          const body = await response.json();
          const comments = body;
          comments.page = page;
          if (comments.length > 0) {
            setComments([...comments, ...comments.results]);
          } else {
            setComments(comments.results);
          }
          setPage(page + 1);
          setCount(body.count);
        } else {
          utils.logFetchError(response);
        }
      })
      .catch(utils.handleCatch);
  };

  const initialize = async () => {
    await fetchComments();
    setThread(props.thread);
  };

  useEffect(() => {
    initialize();
  }, []);

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
    newComments = newComments.concat(comments);
    setTransition(true);
    setComments(newComments);
    setActive(false);
    props.showMessage({ show: false });
    props.checkUserFirstTime(!props.auth.user.has_seen_first_coin_modal);
    props.getUser();
    setTransition(false);
  }

  const getNextPage = async (paperId, discussionThreadId, page) => {
    fetchComments();
  };

  return (
    <div>
      <Message />
      <Head
        title={thread.title}
        description={`Discuss on ResearchHub`}
        socialImageUrl={props.paper && props.paper.metatagImage}
      />
      <div className={css(styles.threadContainer)}>
        {thread.text && (
          <Thread
            data={thread}
            hostname={hostname}
            body={thread.text}
            createdBy={thread.created_by}
            date={thread.created_date}
            vote={thread.user_vote}
            score={thread.score}
          />
        )}
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
              getNextPage(paperId, discussionThreadId, page);
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

  const { paperId, discussionThreadId } = query;
  let thread;

  try {
    if (
      typeof parseInt(paperId, 10) !== "number" ||
      typeof parseInt(discussionThreadId, 10) !== "number"
    ) {
      throw 404;
    }
    const response = await fetch(
      API.THREAD(paperId, discussionThreadId),
      API.GET_CONFIG()
    );
    thread = await response.json();
    if (!thread.id) throw 404;
  } catch (err) {
    if (res) {
      res.statusCode = 404;
    }
    return { error: true };
  }

  return {
    discussionThreadId,
    hostname,
    paperId,
    threadId: discussionThreadId,
    thread,
  };
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
