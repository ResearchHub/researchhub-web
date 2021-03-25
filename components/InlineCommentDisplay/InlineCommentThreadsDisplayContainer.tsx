import colors from "../..//config/themes/colors";
import ColumnContainer from "../Paper/SideColumn/ColumnContainer";
import React, { ReactElement, useMemo } from "react";
import { StyleSheet, css } from "aphrodite";
import InlineCommentThreadCard from "./InlineCommentThreadCard";
import InlineCommentUnduxStore, {
  InlineComment,
} from "../PaperDraftInlineComment/undux/InlineCommentUnduxStore";

type Props = { blockKey: string };

function InlineCommentThreadsDisplayContainer({
  blockKey,
}: Props): ReactElement<typeof ColumnContainer> {
  const unduxStore = InlineCommentUnduxStore.useStore();
  const targetGroupedInlineComments = unduxStore.get("inlineComments")[
    blockKey
  ];

  const commentThreadCards = useMemo(
    (): Array<ReactElement<typeof InlineCommentThreadCard>> =>
      targetGroupedInlineComments.map(
        (
          inlineComment: InlineComment,
          arrInd: number
        ): ReactElement<typeof InlineCommentThreadCard> => (
          <InlineCommentThreadCard
            inlineComment={inlineComment}
            key={`${blockKey}-${arrInd}`}
          />
        )
      ),
    [targetGroupedInlineComments]
  );

  return (
    <ColumnContainer overrideStyles={styles.container}>
      <div
        className={css(styles.title)}
      >{`Inline Comments KEY: ${blockKey}`}</div>
      {commentThreadCards}
    </ColumnContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    display: "flex",
    alignItems: "center",
    background: "#fff",
    boxSizing: "border-box",
    height: 40,
    fontWeight: 500,
    paddingLeft: 20,
    fontSize: 12,
    letterSpacing: 1.2,
    color: colors.BLACK(0.6),
    textTransform: "uppercase",
  },
  container: {
    marginTop: 20,
    padding: "20px 15px",
    borderLeft: `3px solid ${colors.NEW_BLUE()}`,
  },
  cardWrap: {
    display: "flex",
    flexDirection: "column",
  },
});

export default InlineCommentThreadsDisplayContainer;
