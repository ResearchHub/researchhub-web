import { css, StyleSheet } from "aphrodite";
import PaperDraftInlineCommentSlideButton from "./PaperDraftInlineCommentSlideButton";
import { ReactChildren, ReactElement } from "react";

type Props = { children: ReactChildren };

export default function PaperDraftInlineCommentRelativeWrap({
  children,
}: Props): ReactElement<"div"> {
  return (
    <div className={css(styles.PaperDraftInlineCommentRelativeWrap)}>
      <PaperDraftInlineCommentSlideButton />
      {children}
    </div>
  );
}

const styles = StyleSheet.create({
  PaperDraftInlineCommentRelativeWrap: {
    height: "100%",
    position: "relative",
    width: "100%",
  },
});
