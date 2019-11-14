import React from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";

// Redux
import { MessageActions } from "~/redux/message";

class SearchEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthor: false,
      hidden: false,
    };
  }

  componentDidMount() {
    this.configureComponent();
  }

  componentDidUpdate(prevProp) {
    if (
      prevProp.meta.index !== this.props.meta.index &&
      prevProp.meta.id !== this.props.meta.id
    ) {
      this.configureComponent();
    }
  }

  configureComponent() {
    // create link
  }

  /**
   * We want to take the user to the appropriate page when they click a search result
   */
  handleClick = () => {
    /**
     * 1. check the index name to determine which link needs to be made
     * 2. show a loader
     * 3. push route
     * 4. after a set timeout, hide the loader
     */
  };

  render() {
    let { isAuthor } = this.props;
    let {
      authors,
      discussion,
      doi,
      hubs, // array
      id,
      meta, // doc_type, highlight (title: array ), id, index, score
      paper_publish_date,
      publication_type,
      score,
      title,
      url,
    } = this.props.result;

    let highlight = meta.highlight.title[0]; // part of data that matched the search query
    let index = meta.index; // author, discussion_thread, hub, paper, university

    return (
      <div className={css(styles.searchEntryCard)} onClick={this.handleClick}>
        <div className={css(styles.column, isAuthor && styles.isAuthor)}>
          {isAuthor ? (
            <div className={css(styles.avatarDisplay)}></div>
          ) : (
            <div className={css(styles.voteDisplay)}></div>
          )}
        </div>
        <div className={css(styles.column, styles.right)}>
          <div className={css(styles.mainText)}></div>
          <div className={css(styles.metaDataOne)}></div>
          <div className={css(styles.metaDataTwo)}></div>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  searchEntryCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  right: {
    justifyContent: "space-between",
  },
  avatarDisplay: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  voteDisplay: {},
});

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchEntry);
