import colors from "../../config/themes/colors";
import { css, StyleSheet } from "aphrodite";
import icons from "../../config/themes/icons";
import InlineCommentUnduxStore, {
  cleanupStoreAndCloseDisplay,
  InlineComment,
} from "../PaperDraftInlineComment/undux/InlineCommentUnduxStore";
import InlineCommentThreadCard from "./InlineCommentThreadCard";
import React, { ReactElement } from "react";
// @ts-ignore
import { slide as SlideMenu } from "@quantfive/react-burger-menu";

type Props = { isShown: boolean };

export default function InlineCommentThreadsDisplayBar({
  isShown,
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
        unduxInlineComment={inlineComment}
      />
    )
  );

  return (
    <SlideMenu
      top
      isOpen={isShown}
      styles={burgerMenuStyle}
      customBurgerIcon={false}
    >
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
    </SlideMenu>
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
  },
  bmCross: {
    background: "#bdc3c7",
  },
  bmMenuWrap: {
    position: "fixed",
    width: "100%",
    zIndex: 3147480000,
    height: "unset",
  },
  bmMenu: {
    background: "#fff",
    fontSize: "1.15em",
    padding: "2.5em .6em 32px",
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
    height: "100%",
    overflow: "auto",
    borderTop: "1px solid rgba(255,255,255,.2)",
    paddingTop: 16,
  },
  bmItem: {
    display: "inline-block",
    margin: "15px 0 15px 0",
    color: "#FFF",
  },
  bmOverlay: {
    background: "#fff",
  },
};

const styles = StyleSheet.create({
  backButton: {
    color: colors.BLACK(0.5),
    cursor: "pointer",
    ":hover": {
      color: colors.BLACK(1),
    },
    textDecoration: "none",
    "@media only screen and (max-width: 767px)": {
      top: -118,
      left: 0,
    },
    "@media only screen and (max-width: 415px)": {
      top: -90,
      left: 20,
    },
  },
  closeButton: {
    width: 16,
  },
  header: {
    alignItems: "center",
    cursor: "pointer",
    display: "flex",
    height: "100%",
    justifyContent: "flex-start",
    width: "100%",
  },
  inlineCommentThreadsDisplayBar: {
    height: "100%",
    maxHeight: 1000,
    width: 350,
  },
  marginLeft8: {
    marginLeft: 8,
  },
});
