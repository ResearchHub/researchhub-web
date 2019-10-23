import { Fragment } from "react";
import Link from "next/link";
import Router, { withRouter } from "next/router";
import { StyleSheet, css } from "aphrodite";
import { EditorState, convertFromRaw } from "draft-js";
import dynamic from "next/dynamic";
import { Value } from "slate";
import { connect, useDispatch, useStore } from "react-redux";

// Components
import ComponentWrapper from "~/components/ComponentWrapper";
import DiscussionThreadCard from "~/components/DiscussionThreadCard";

// Config
import API from "../../../config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "../../../config/themes/colors";

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
        <div className={css(styles.container)}>{discussions}</div>
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
});

const mapStateToProps = (state) => ({
  author: state.author,
});

export default connect(mapStateToProps)(UserDiscussionsTab);
