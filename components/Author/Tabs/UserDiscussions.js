import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";

// Components
import ComponentWrapper from "~/components/ComponentWrapper";
import DiscussionThreadCard from "~/components/DiscussionThreadCard";

// Config
import colors from "~/config/themes/colors";

class UserDiscussionsTab extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { author, hostname } = this.props;
    let discussions = author.userDiscussions.discussions.map(
      (discussion, index) => {
        let path = `/paper/${discussion.paper}/discussions/${discussion.id}`;
        return (
          <div className={css(styles.discussionContainer)}>
            <DiscussionThreadCard
              data={discussion}
              hostname={hostname}
              path={path}
            />
          </div>
        );
      }
    );
    return (
      <ComponentWrapper>
        {discussions.length > 0 ? (
          <div className={css(styles.container)}>{discussions}</div>
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
      </ComponentWrapper>
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
});

const mapStateToProps = (state) => ({
  author: state.author,
});

export default connect(mapStateToProps)(UserDiscussionsTab);
