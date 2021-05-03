import React from "react";
import { connect } from "react-redux";
import numeral from "numeral";
import Loader from "~/components/Loader/Loader";

const DiscussionCount = (props) => {
  const { threadCount, isFetching } = props;

  if (isFetching) {
    return (
      <Loader
        loading={true}
        size={2}
        color={"rgba(36, 31, 58, 0.5)"}
        type="beat"
      />
    );
  }

  return <span>{numeral(threadCount).format("0a")}</span>;
};

const mapStateToProps = (state) => ({
  threadCount: state.paper.threadCount,
});

export default connect(mapStateToProps)(DiscussionCount);
