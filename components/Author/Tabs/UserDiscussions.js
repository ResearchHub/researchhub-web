import { Component, Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import ReactPlaceholder from "react-placeholder";
import get from "lodash/get";

// Components
import DiscussionThreadCard from "~/components/DiscussionThreadCard";
import PaperPlaceholder from "../../Placeholders/PaperPlaceholder";
import Loader from "~/components/Loader/Loader";
import Ripples from "react-ripples";
import EmptyState from "./EmptyState";

import { AuthorActions } from "~/redux/author";

// Config
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { thread } from "../../../redux/discussion/shims";

class UserDiscussionsTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: false,
    };
  }

  loadMore = () => {
    const { author, updateAuthorByKey } = this.props;
    const { userDiscussions } = author;

    this.setState({ fetching: true }, () => {
      fetch(userDiscussions.next, API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          const newState = { ...userDiscussions };
          const newThreads = res.results.map((result) => thread(result));
          newState.discussions = [...newState.discussions, ...newThreads];
          newState.next = res.next;
          updateAuthorByKey({
            key: "userDiscussions",
            value: newState,
            prevState: {},
          });
          this.setState({ fetching: false });
        });
    });
  };

  renderLoadMoreButton = () => {
    const { author } = this.props;
    const { fetching } = this.state;

    if (author && author.userDiscussions) {
      const { next } = author.userDiscussions;

      if (next !== null) {
        return (
          <div className={css(styles.buttonContainer)}>
            {!fetching ? (
              <Ripples
                className={css(styles.loadMoreButton)}
                onClick={this.loadMore}
              >
                Load More
              </Ripples>
            ) : (
              <Loader
                key={"discussionLoader"}
                loading={true}
                size={25}
                color={colors.BLUE()}
              />
            )}
          </div>
        );
      }
    }
  };

  render() {
    const { author, hostname, maxCardsToRender } = this.props;

    const discussions = [];
    for (
      let i = 0;
      i < get(author, "userDiscussions.discussions.length", 0);
      i++
    ) {
      if (i === maxCardsToRender) break;

      const discussion = author.userDiscussions.discussions[i];
      let path;

      if (discussion.paper) {
        path = `/paper/${discussion.paper.id}/${discussion.paper.slug}`;
      } else {
        path = `/post/${discussion.post.id}/${discussion.post.slug}`;
      }
      discussions.push(
        <DiscussionThreadCard
          data={discussion}
          hostname={hostname}
          path={path}
          paperId={discussion.paper}
          postId={discussion.post}
          mobileView={this.props.mobileView}
          key={`discThread-${discussion.id}-${i}`}
        />
      );
    }

    return (
      <ReactPlaceholder
        ready={
          !!(this.props.author.discussionsDoneFetching && !this.props.fetching) // needs to be boolean, not undefined
        }
        showLoadingAnimation
        customPlaceholder={<PaperPlaceholder color="#efefef" />}
      >
        {discussions.length > 0 ? (
          <Fragment>
            <div className={css(styles.container)}>{discussions}</div>
            {!maxCardsToRender && this.renderLoadMoreButton()}
          </Fragment>
        ) : (
          <EmptyState
            message={"User has not made any comments"}
            icon={icons.comments}
          />
        )}
      </ReactPlaceholder>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    boxSizing: "border-box",
    padding: 0,
  },
  discussionContainer: {
    boxSizing: "border-box",
    padding: "24px 15px",
    width: "100%",
    borderBottom: "1px solid rgba(36, 31, 58, 0.08)",
    ":last-child": {
      borderBottom: 0,
    },
  },
  box: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
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
  icon: {
    fontSize: 50,
    color: colors.BLUE(1),
    height: 50,
    marginBottom: 10,
  },
  buttonContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
    height: 45,
    "@media only screen and (max-width: 768px)": {
      marginTop: 15,
      marginBottom: 15,
    },
  },
  loadMoreButton: {
    fontSize: 14,
    border: `1px solid ${colors.BLUE()}`,
    boxSizing: "border-box",
    borderRadius: 4,
    height: 45,
    width: 155,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: colors.BLUE(),
    cursor: "pointer",
    userSelect: "none",
    ":hover": {
      color: "#FFF",
      backgroundColor: colors.BLUE(),
    },
  },
});

const mapStateToProps = (state) => ({
  author: state.author,
});

const mapDispatchToProps = {
  updateAuthorByKey: AuthorActions.updateAuthorByKey,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserDiscussionsTab);
