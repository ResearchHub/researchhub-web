import { css, StyleSheet } from "aphrodite";
import { ReactElement, useState } from "react";
import RhCarouselItem, { RhCarouselItemProps } from "./RhCarouselItem";

type Props = {
  rhCarouselItemProps: RhCarouselItemProps[];
};

const RhCarouselControl = ({
  currIndex,
  setIndex,
  totalItems,
}: {
  currIndex: number;
  setIndex: (ind: number) => void;
  totalItems: number;
}): ReactElement => {
  return <div>I'm control</div>;
};

export default function RhCarousel({
  rhCarouselItemProps,
}: Props): ReactElement {
  const totalNumItems = rhCarouselItemProps.length;
  const shouldDisplayControl = totalNumItems > 1;
  const [displayItemInd, setDisplayItemInd] = useState<number>(0);

  return (
    <div className={css(styles.rhCarousel)}>
      {<RhCarouselItem {...rhCarouselItemProps[displayItemInd]} />}
      {shouldDisplayControl ? (
        <RhCarouselControl
          currIndex={displayItemInd}
          setIndex={setDisplayItemInd}
          totalItems={totalNumItems}
        />
      ) : null}
    </div>
  );
}

const styles = StyleSheet.create({
  rhCarousel: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "space-between",
    minWidth: "100%",
    width: "100%",
  },
});
