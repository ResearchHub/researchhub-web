/* - calvinhlee: this file utilizes functionalities that are legacy, I'm suppressing some warnings in this file */
import { connect } from "react-redux";
import colors from "../../config/themes/colors";
import { InlineComment } from "../PaperDraftInlineComment/undux/InlineCommentUnduxStore";
import { StyleSheet, css } from "aphrodite";
import DiscussionPostMetadata from "../DiscussionPostMetadata.js";
import React, { ReactElement } from "react";
import InlineCommentComposer from "./InlineCommentComposer";

// Redux: TODO: calvinhlee Auth shouldn't really be dependent on the redux. Need to revist and remove.
import { emptyFunction } from "../PaperDraft/util/PaperDraftUtils";

type Props = { auth: any /* redux */; inlineComment: InlineComment };

function InlineCommentThreadCard({
  auth,
  inlineComment,
}: Props): ReactElement<"div"> {
  return (
    <div className={css(styles.root)}>
      <DiscussionPostMetadata
        authorProfile={auth.user.author_profile} // @ts-ignore
        data={{ created_by: auth.user }}
        smaller={true}
      />
      <div className={css(styles.container)}>
        <InlineCommentComposer
          onCancel={emptyFunction /* api call & update undux store */}
          onChange={emptyFunction}
          onSubmit={emptyFunction /* api call & update undux store */}
          value={""}
        />
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingLeft: 3,
  },
  container: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingTop: 5,
  },
  contentBody: {
    fontSize: 14,
    lineHeight: 2,
    maxHeight: 150,
    overflow: "hidden",
    position: "relative",
    width: "100%",
  },
  showMore: {
    overflow: "visible",
    maxHeight: "none",
  },
  blur: {
    background:
      "linear-gradient(180deg, rgba(250, 250, 250, 0) 0%, #FCFCFC 85%)",
    height: "100%",
    position: "absolute",
    zIndex: 3,
    top: 0,
    width: "100%",
  },
  buttonContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    position: "absolute",
    bottom: -10,
    right: 0,
    zIndex: 3,
  },
  button: {
    background: colors.BLUE(),
    color: "#FFF",
    padding: "0px 10px",
    fontSize: 12,
    cursor: "pointer",
    borderRadius: 3,
    ":hover": {
      background: colors.BLUE(),
    },
  },
  bottomRow: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    paddingTop: 10,
  },
  action: {
    color: colors.BLACK(0.6),
    cursor: "pointer",
    fontSize: 14,
    textDecoration: "underline",
    ":hover": {
      color: colors.BLUE(),
    },
  },
  left: {
    marginRight: 15,
  },
  existingCommentsContainer: {
    display: "flex",
    minHeight: 40,
  },
});

const mapStateToProps = ({ auth }: any) => ({
  auth,
});

export default connect(
  mapStateToProps,
  {} // mapDispatchToProps
)(InlineCommentThreadCard);
