import { StyleSheet, css } from "aphrodite";

import PreviewPlaceholder from "./PreviewPlaceholder";
import colors from "~/config/themes/colors";

const CitationPreviewPlaceholder = () => (
  <div className={css(styles.container)}>
    <div className={css(styles.header)}>
      <div className={css(styles.citationTitle)}>Cited By</div>
    </div>
    <div
      className={css(styles.placeholderContainer) + " show-loading-animation"}
    >
      <div className={css(styles.previewPlaceholder)}>
        <PreviewPlaceholder
          hideAnimation={false}
          color={colors.PLACEHOLDER_CARD_BACKGROUND}
        />
      </div>
      <div className={css(styles.previewPlaceholder)}>
        <PreviewPlaceholder
          hideAnimation={false}
          color={colors.PLACEHOLDER_CARD_BACKGROUND}
        />
      </div>
      <div className={css(styles.previewPlaceholder)}>
        <PreviewPlaceholder
          hideAnimation={false}
          color={colors.PLACEHOLDER_CARD_BACKGROUND}
        />
      </div>
      <div className={css(styles.previewPlaceholder)}>
        <PreviewPlaceholder
          hideAnimation={false}
          color={colors.PLACEHOLDER_CARD_BACKGROUND}
        />
      </div>
    </div>
  </div>
);

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    padding: 50,
    background: colors.WHITE(),
    border: `1.5px solid ${colors.VERY_LIGHT_GREY()}`,
  },
  placeholderContainer: {
    display: "flex",
    overflow: "auto",
  },
  citationTitle: {
    fontSize: 22,
    fontWeight: 500,
    "@media only screen and (max-width: 415px)": {
      fontSize: 20,
    },
  },
  previewPlaceholder: {
    marginRight: 60,
    width: 160,
    height: 220,
    minWidth: 160,
  },
  header: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
});

export default CitationPreviewPlaceholder;
