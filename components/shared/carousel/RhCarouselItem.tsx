import { css, StyleSheet } from "aphrodite";
import { ReactElement, ReactNode } from "react";
import colors from "~/config/themes/colors";
import { NullableString } from "~/config/types/root_types";


export type RhCarouselItemProps = {
  title?: ReactNode;
  body: ReactNode;
  onBodyClick?: Function;
};

export default function RhCarouselItem({
  title,
  body,
  onBodyClick,
}: RhCarouselItemProps): ReactElement {
  return (
    <div className={css(styles.rhCarouselItemRoot)}>
      {title}
      <div className={css(onBodyClick && DEFAULT_ITEM_STYLE.clickableBody)} onClick={() => onBodyClick ? onBodyClick() : null}>{body}</div>
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
  }
});

export const DEFAULT_ITEM_STYLE = StyleSheet.create({
  rhCarouselItemTitle: {
    alignItems: "center",
    display: "flex",
    fontSize: 16,
    fontWeight: 500,
    height: "100%",
    marginBottom: 10,
    textOverflow: "ellipsis",
    width: "100%",
  },
  emphasized: {
    fontWeight: 600,
  },
  emphasizedBlue: {
    // one-off gitcoin color
    color: "#00a37c",
    fontWeight: 600,
  },
  clickableBody: {
    cursor: "pointer",
  },
  rhCarouselItemBody: {
    display: "block",
    width: "100%",
    height: "100%",
    fontSize: 14,
    color: colors.BLACK(),
    lineHeight: "20px",
    textOverflow: "ellipsis",
  },
});
