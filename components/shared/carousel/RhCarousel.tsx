import { css, StyleSheet } from "aphrodite";
import { ReactElement, useState } from "react";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import RhCarouselItem from "./RhCarouselItem";

type Props = {
  rhCarouselItem: ReactElement<typeof RhCarouselItem>[];
};

const RhCarouselControl = ({
  currIndex,
  setIndex,
  totalNumItems,
}: {
  currIndex: number;
  setIndex: (ind: number) => void;
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
        <div className={css(styles.rhCarouselControlIcon)}>
          {icons.chevronLeft}
        </div>
        <div className={css(styles.rhCarouselControlIcon)}>
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

  return (
    <div className={css(styles.rhCarousel)}>
      {rhCarouselItem[displayItemInd]}
      {shouldDisplayControl ? (
        <RhCarouselControl
          currIndex={displayItemInd}
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
    justifyContent: "space-between",
    minWidth: "100%",
    width: "100%",
  },
  rhCarouselControl: {
    alignItems: "center",
    display: "flex",
    height: 24,
    justifyContent: "space-between",
    marginTop: 8,
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
    maxWidth: 200,
    width: "12%",
  },
  rhCarouselControlIcon: {
    color: colors.TEXT_GREY(.7),
    cursor: "pointer",
    fontSize: 12,
  },
});
