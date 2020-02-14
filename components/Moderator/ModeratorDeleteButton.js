import React from "react";
import { connect, useStore } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import Ripples from "react-ripples";

class ModeratorDeleteButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  performAction = () => {
    switch (this.props.actionType) {
      case "page":
        return this.deletePaperPage();
      case "pdf":
        return this.deletePaperPDF();
      case "post":
        return this.deletePost();
      default:
        return null;
    }
  };

  /**
   * Used to delete a paper page
   */
  deletePaperPage = () => {};

  /**
   * Used to delete a paper's pdf
   */
  deletePaperPDF = () => {};

  /**
   * Used to delete a user's post, comment, reply, thread, etc.
   */
  deletePost = () => {};

  render() {
    let { isModerator, styles } = this.props;

    if (isModerator) {
      return (
        <Ripples onClick={false}>
          <div className={css(styles.deleteButton, styles && styles)}>{}</div>
        </Ripples>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  deleteButton: {},
});
