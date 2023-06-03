import { StyleSheet, css } from "aphrodite";
import { RectShape } from "react-placeholder/lib/placeholders";
import globalColors from "~/config/themes/colors";

type Args = {
  repeatCount?: number;
};

const getRandomRowWidth = () => {
  const [min, max] = [50, 100];
  return Math.floor(Math.random() * max - min + 1) + min + "%";
};

const DocumentPlaceholder = ({ repeatCount = 8 }: Args) => {
  return (
    <div
      style={{
        width: "100%",
        background: "white",
        boxSizing: "border-box",
      }}
    >
      {Array.from(new Array(repeatCount)).map((_, idx) => {
        const rowWidth = getRandomRowWidth();
        return (
          <div
            key={`placeholder-${idx}`}
            className={css(styles.wrapper) + " show-loading-animation"}
          >
            <div className={css(styles.section)}>
              <RectShape
                color={globalColors.PLACEHOLDER_CARD_BACKGROUND}
                style={{ width: "100%", height: "1em" }}
              />
              <RectShape
                color={globalColors.PLACEHOLDER_CARD_BACKGROUND}
                style={{ width: "90%", height: "1em" }}
              />
              <RectShape
                color={globalColors.PLACEHOLDER_CARD_BACKGROUND}
                style={{ width: "95%", height: "1em" }}
              />
              <RectShape
                color={globalColors.PLACEHOLDER_CARD_BACKGROUND}
                style={{ width: "100%", height: "1em" }}
              />
              <RectShape
                color={globalColors.PLACEHOLDER_CARD_BACKGROUND}
                style={{ width: "95%", height: "1em" }}
              />
              <RectShape
                color={globalColors.PLACEHOLDER_CARD_BACKGROUND}
                style={{ width: rowWidth, height: "1em" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    boxSizing: "border-box",
    marginBottom: 25,
  },
  section: {
    marginTop: 15,
    fontSize: 15,
    display: "flex",
    flexDirection: "column",
    rowGap: 8,
    ":first-child": {
      marginTop: 0,
    },
  },
});

export default DocumentPlaceholder;
