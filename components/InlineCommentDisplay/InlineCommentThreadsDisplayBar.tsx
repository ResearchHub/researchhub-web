import colors from "../../config/themes/colors";
import { css, StyleSheet } from "aphrodite";
import icons from "../../config/themes/icons";
import InlineCommentUnduxStore, {
  cleanupStoreAndCloseDisplay,
  InlineComment,
} from "../PaperDraftInlineComment/undux/InlineCommentUnduxStore";
import InlineCommentThreadCard from "./InlineCommentThreadCard";
import React, { ReactElement } from "react";
import { slide as SlideMenu } from "@quantfive/react-burger-menu";

type Props = { shouldShowContextTitle?: boolean };

const MEDIA_WIDTH_LIMIT = 1023; /* arbitary iPad size */

export default function InlineCommentThreadsDisplayBarWithMediaSize(
  props: Props
): ReactElement<"div"> {
  const curreMediaWidth =
    document.documentElement.clientWidth || document.body.clientWidth;
  const shouldRenderWithSlide = curreMediaWidth <= MEDIA_WIDTH_LIMIT;

  if (shouldRenderWithSlide) {
    return (
      <div className={css(styles.mobile)}>
        <SlideMenu
          right
          width={"100%"}
          isOpen={true}
          styles={burgerMenuStyle}
          customBurgerIcon={false}
        >
          <InlineCommentThreadsDisplayBar
            {...props}
            shouldShowContextTitle={true}
          />
        </SlideMenu>
      </div>
    );
  } else {
    return (
      <div className={css(styles.inlineSticky)}>
        <InlineCommentThreadsDisplayBar
          {...props}
          shouldShowContextTitle={false}
        />
      </div>
    );
  }
}

function InlineCommentThreadsDisplayBar({
  shouldShowContextTitle = true,
}: Props): ReactElement<"div"> {
  const inlineCommentStore = InlineCommentUnduxStore.useStore();
  const displayableInlineComments = inlineCommentStore.get(
    "displayableInlineComments"
  );

  const commentThreadCards = displayableInlineComments.map(
    (
      inlineComment: InlineComment
    ): ReactElement<typeof InlineCommentThreadCard> => (
      <InlineCommentThreadCard
        key={inlineComment.entityKey}
        shouldShowContextTitle={shouldShowContextTitle}
        unduxInlineComment={inlineComment}
      />
    )
  );

  return (
    <div className={css(styles.inlineCommentThreadsDisplayBar)}>
      <div className={css(styles.header)}>
        <div
          className={css(styles.backButton)}
          onClick={(): void =>
            cleanupStoreAndCloseDisplay({ inlineCommentStore })
          }
        >
          {icons.arrowRight}
          <span className={css(styles.marginLeft8)}>Hide</span>
        </div>
      </div>
      {commentThreadCards}
    </div>
  );
}

const burgerMenuStyle = {
  bmBurgerBars: {
    background: "#373a47",
  },
  bmBurgerBarsHover: {
    background: "#a90000",
  },
  bmCrossButton: {
    height: "26px",
    width: "26px",
    color: "#FFF",
    display: "none",
    visibility: "hidden",
  },
  bmCross: {
    background: "#bdc3c7",
    display: "none",
    visibility: "hidden",
  },
  bmMenuWrap: {
    position: "fixed",
    top: 0,
    zIndex: 3147480000,
    overflowY: "auto",
    width: "85%",
  },
  bmMenu: {
    background: "#fff",
    fontSize: "1.15em",
    overflowY: "auto",
    width: "100%",
  },
  bmMorphShape: {
    fill: "#373a47",
  },
  bmItemList: {
    color: "#b8b7ad",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    overflow: "auto",
    borderTop: "1px solid rgba(255,255,255,.2)",
    ":focus": {
      outline: "none",
    },
  },
  bmItem: {
    display: "inline-block",
    margin: "15px 0 15px 0",
    color: "#FFF",
    ":focus": {
      outline: "none",
    },
  },
  bmOverlay: {
    background: "rgba(0, 0, 0, 0.3)",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
};

const styles = StyleSheet.create({
  backButton: {
    display: "flex",
    alignItems: "center",
    color: colors.BLACK(0.5),
    cursor: "pointer",
    ":hover": {
      color: colors.BLACK(1),
    },
    textDecoration: "none",
    "@media only screen and (max-width: 1023px)": {
      paddingLeft: 8,
      width: "100%",
      height: "100%",
    },
    "@media only screen and (max-width: 767px)": {
      top: -118,
      left: 0,
      // width: "100%",
    },
    "@media only screen and (max-width: 415px)": {
      top: -90,
      left: 20,
    },
  },
  header: {
    positioin: "relative",
    alignItems: "center",
    cursor: "pointer",
    display: "flex",
    justifyContent: "flex-start",
    "@media only screen and (max-width: 1023px)": {
      height: 50,
    },
  },
  inlineCommentThreadsDisplayBar: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    maxHeight: 1000,
    width: 400,
    "@media only screen and (max-width: 1023px)": {
      width: "100%",
    },
    ":focus": {
      outline: "none",
    },
  },
  inlineSticky: {
    position: "sticky",
    top: 40,
  },
  marginLeft8: {
    marginLeft: 8,
  },
  mobile: {
    display: "none",
    "@media only screen and (max-width: 1023px)": {
      display: "block",
    },
  },
});
