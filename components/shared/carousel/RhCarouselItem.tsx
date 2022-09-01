import { css, StyleSheet } from "aphrodite";
import { ReactElement, ReactNode } from "react";
import { NullableString } from "~/config/types/root_types";

export type RhCarouselItemProps = {
  title?: ReactNode;
  body: ReactNode;
};

export default function RhCarouselItem({
  title,
  body,
}: RhCarouselItemProps): ReactElement {
  return (
    <div className={css(styles.rhCarouselItemRoot)}>
      {title}
      {body}
    </div>
  );
}

const styles = StyleSheet.create({
  rhCarouselItemRoot: {
    background: "transparent",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minWidth: 248,
    width: "100%",
  },
});

export const DEFAULT_ITEM_STYLE = StyleSheet.create({
  rhCarouselItemTitle: {
    alignItems: "center",
    display: "flex",
    fontSize: 16,
    fontWeight: 500,
    height: "100%",
    marginBottom: 4,
    textOverflow: "ellipsis",
    width: "100%",
  },
  rhCarouselItemBody: {
    display: "flex",
    width: "100%",
    height: "100%",
    fontSize: 12,
    textOverflow: "ellipsis",
  },
});
