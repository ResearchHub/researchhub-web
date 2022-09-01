import { css, StyleSheet } from "aphrodite";
import { ReactElement, useState } from "react";
import RhCarouselItem from "./RhCarouselItem";

type Props = {
  rhCarouselItem: ReactElement<typeof RhCarouselItem>[];
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
  return (
    <div className={css(styles.rhCarouselControl)}>
      <div>I'm control</div>
      <div>I'm pills</div>
    </div>
  );
};

export default function RhCarousel({ rhCarouselItem }: Props): ReactElement {
  const totalNumItems = rhCarouselItem.length;
  const shouldDisplayControl = totalNumItems > 1;
  const [displayItemInd, setDisplayItemInd] = useState<number>(0);

  return (
    <div className={css(styles.rhCarousel)}>
      {rhCarouselItem[displayItemInd]}
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
  rhCarouselControl: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: 24,
  },
});
