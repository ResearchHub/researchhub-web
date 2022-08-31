import { css, StyleSheet } from "aphrodite";
import { ReactElement } from "react";

export type RhCarouselItemProps = {
  title: string;
  body: string;
};

export default function RhCarouselItem({}: RhCarouselItemProps): ReactElement {
  return <div className={css(styles.rhCarouselItem)}>I am an Item</div>;
}

const styles = StyleSheet.create({
  rhCarouselItem: {
    background: "red",
    height: "100%",
    minWidth: 248,
    width: "100%",
  },
});
