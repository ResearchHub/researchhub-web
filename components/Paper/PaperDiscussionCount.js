import React from "react";
import { connect } from "react-redux";
import numeral from "numeral";

const DiscussionCount = (props) => {
  const {
    discussion: { threadCount },
  } = props;

  return <span>{numeral(threadCount).format("0a")}</span>;
};

const mapStateToProps = (state) => ({
  discussion: state.discussion,
});

export default connect(mapStateToProps)(DiscussionCount);
