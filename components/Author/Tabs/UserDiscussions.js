import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import ReactPlaceholder from "react-placeholder";

// Components
import DiscussionThreadCard from "~/components/DiscussionThreadCard";
import PaperPlaceholder from "../../Placeholders/PaperPlaceholder";
import Loader from "~/components/Loader/Loader";
import Ripples from "react-ripples";

import { AuthorActions } from "~/redux/author";

// Config
import colors from "~/config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { thread } from "../../../redux/discussion/shims";

class UserDiscussionsTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: false,
    };
  }

  loadMore = () => {
    let { author, updateAuthorByKey } = this.props;
    let { userDiscussions } = author;

    this.setState({ fetching: true }, () => {
      fetch(userDiscussions.next, API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          let newState = { ...userDiscussions };
          let newThreads = res.results.map((result) => thread(result));
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
    let { author } = this.props;
    let { fetching } = this.state;

    if (author && author.userDiscussions) {
      let { next } = author.userDiscussions;

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
    let { author, hostname } = this.props;

    let discussions = author.userDiscussions.discussions.map(
      (discussion, index) => {
        let path = `/paper/${discussion.paper}/${discussion.paper_slug}/${discussion.id}`;
        return (
          <div
            className={css(
              styles.discussionContainer,
              index === author.userDiscussions.discussions.length - 1 &&
                styles.noBorder
            )}
          >
            <DiscussionThreadCard
              data={discussion}
              hostname={hostname}
              path={path}
              key={`discThread-${discussion.id}-${index}`}
              mobileView={this.props.mobileView}
            />
          </div>
        );
      }
    );
    return (
      <ReactPlaceholder
        ready={
          this.props.author.discussionsDoneFetching && !this.props.fetching
        }
        showLoadingAnimation
        customPlaceholder={<PaperPlaceholder color="#efefef" />}
      >
        {discussions.length > 0 ? (
          <React.Fragment>
            <div className={css(styles.container)}>{discussions}</div>
            {this.renderLoadMoreButton()}
          </React.Fragment>
        ) : (
          <div className={css(styles.box)}>
            <div className={css(styles.icon)}>
              <i className="fad fa-comments" />
            </div>
            <h2 className={css(styles.noContent)}>
              User has not created any discussions
            </h2>
          </div>
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
  },
  discussionContainer: {
    width: "100%",
    borderBottom: "1px solid rgba(36, 31, 58, 0.08)",
    "@media only screen and (max-width: 415px)": {
      borderBottom: "none",
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
  noBorder: {
    border: "none",
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
