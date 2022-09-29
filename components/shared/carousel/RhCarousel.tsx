import { css, StyleSheet } from "aphrodite";
import { ReactElement, SyntheticEvent, useState } from "react";
import { AnimatePresence } from "framer-motion";

import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import RhCarouselItem from "./RhCarouselItem";

type Props = {
  rhCarouselItem: [];
};

const RhCarouselControl = ({
  currIndex,
  setIndex,
  setDirection,
  totalNumItems,
}: {
  currIndex: number;
  setIndex: (ind: number) => void;
  setDirection: (direction: string) => void;
  totalNumItems: number;
}): ReactElement => {
  const pills = Array.apply(null, Array(totalNumItems)).map(
    (_null, ind: number): ReactElement => {
      return (
        <div
          style={{
            height: 4,
            borderRadius: 4,
            width: `calc((100% / ${totalNumItems}) - 4px)`,
            background:
              ind === currIndex ? colors.NEW_BLUE(0.7) : colors.GREY(0.5),
          }}
          key={`pill-${ind}`}
        />
      );
    }
  );

  return (
    <div className={css(styles.rhCarouselControl)}>
      <div className={css(styles.rhCarouselControlIconsWrap)}>
        <div
          className={css(styles.rhCarouselControlIcon)}
          onClick={(event: SyntheticEvent): void => {
            event.preventDefault();
            const newIndex = currIndex - 1;
            setDirection("left");
            setIndex(newIndex < 0 ? totalNumItems - 1 : newIndex);
          }}
          role="button"
        >
          {icons.chevronLeft}
        </div>
        <div
          className={css(styles.rhCarouselControlIcon)}
          onClick={(event: SyntheticEvent): void => {
            event.preventDefault();
            setDirection("right");
            setIndex((currIndex + 1) % totalNumItems);
          }}
          role="button"
        >
          {icons.chevronRight}
        </div>
      </div>
      <div className={css(styles.rhCarouselControlPillsContainer)}>{pills}</div>
    </div>
  );
};

export default function RhCarousel({ rhCarouselItem }: Props): ReactElement {
  const totalNumItems = rhCarouselItem.length;
  const shouldDisplayControl = totalNumItems > 1;
  const [displayItemInd, setDisplayItemInd] = useState<number>(0);
  const [direction, setDirection] = useState<string>("right");

  console.log(direction);

  const { onBodyClick, title, body } = rhCarouselItem[displayItemInd];

  return (
    <div className={css(styles.rhCarousel)}>
      <AnimatePresence initial={false} custom={direction}>
        {
          <RhCarouselItem
            onBodyClick={onBodyClick}
            title={title}
            body={body}
            key={`carousel-${displayItemInd}`}
            direction={direction}
          />
        }
      </AnimatePresence>
      {shouldDisplayControl ? (
        <RhCarouselControl
          currIndex={displayItemInd}
          setDirection={setDirection}
          setIndex={setDisplayItemInd}
          totalNumItems={totalNumItems}
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
    minHeight: 210,
    minWidth: "100%",
    width: "100%",
    position: "relative",
  },
  rhCarouselControl: {
    alignItems: "center",
    display: "flex",
    height: 24,
    justifyContent: "space-between",
    marginTop: "auto",
    width: "100%",
  },
  rhCarouselControlPillsContainer: {
    alignItems: "center",
    display: "flex",
    height: "100%",
    justifyContent: "space-between",
    width: "25%",
  },
  rhCarouselControlIconsWrap: {
    alignItems: "center",
    display: "flex",
    height: "100%",
    justifyContent: "space-between",
    marginLeft: -8,
  },
  rhCarouselControlIcon: {
    color: colors.TEXT_GREY(0.7),
    padding: 8,
    cursor: "pointer",
    fontSize: 12,
  },
});
