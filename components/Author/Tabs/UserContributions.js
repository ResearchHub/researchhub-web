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
import PaperEntryCard from "~/components/Hubs/PaperEntryCard";
import { Comment, Reply } from "~/components/DiscussionComment";

// Config
import API from "../../../config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "../../../config/themes/colors";

class UserContributionsTab extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { author } = this.props;
    let contributions = author.userContributions.contributions.map(
      (contribution, index) => {
        return (
          <div className={css(styles.contributionContainer)}>
            {contribution.type === "paper" ? (
              <PaperEntryCard paper={contribution} index={index} />
            ) : contribution.type === "comment" ? (
              <div className={css(styles.contributionContainer)}>
                <Reply data={contribution} />
              </div>
            ) : (
              <div className={css(styles.contributionContainer)}>
                <Reply data={contribution} />
              </div>
            )}
          </div>
        );
      }
    );
    return (
      <ComponentWrapper>
        <div className={css(styles.container)}>{contributions}</div>
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
  contributionContainer: {
    width: "100%",
  },
});

const mapStateToProps = (state) => ({
  author: state.author,
});

export default connect(mapStateToProps)(UserContributionsTab);
