import { css, StyleSheet } from "aphrodite";
import { ReactElement, ReactNode, SyntheticEvent, useState } from "react";
import { AnimatePresence } from "framer-motion";
import colors, { iconColors } from "~/config/themes/colors";

import RhCarouselItem from "./RhCarouselItem";
import { breakpoints } from "~/config/themes/screen";
import { chevronLeft, chevronRight } from "~/config/themes/icons";

type RhCarouselItem = {
  onBodyClick?: (event?: SyntheticEvent) => void;
  title: ReactNode;
  body: ReactNode;
};

type Props = {
  rhCarouselItems: RhCarouselItem[];
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
          {chevronLeft}
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
          {chevronRight}
        </div>
      </div>
      <div className={css(styles.rhCarouselControlPillsContainer)}>{pills}</div>
    </div>
  );
};

export default function RhCarousel({ rhCarouselItems }: Props): ReactElement {
  const totalNumItems = rhCarouselItems.length;
  const shouldDisplayControl = totalNumItems > 1;
  const [displayItemInd, setDisplayItemInd] = useState<number>(0);
  const [direction, setDirection] = useState<string>("right");
  const { onBodyClick, title, body } = rhCarouselItems[displayItemInd];

  return (
    <div className={css(styles.rhCarousel)}>
      <AnimatePresence initial={false} custom={direction}>
        <RhCarouselItem
          body={body}
          direction={direction}
          key={`carousel-${displayItemInd}`}
          onBodyClick={onBodyClick}
          title={title}
        />
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
    minHeight: 200,
    minWidth: "100%",
    width: "100%",
    position: "relative",
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      minHeight: 165,
    },
  },
  rhCarouselControl: {
    alignItems: "center",
    display: "flex",
    height: 13,
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
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      fontSize: 16,
    },
    ":hover": {
      background: iconColors.BACKGROUND,
      borderRadius: 3,
      transition: "0.3s",
    },
  },
});
