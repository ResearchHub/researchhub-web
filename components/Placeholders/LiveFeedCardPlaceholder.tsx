import { ReactElement } from "react";
import { StyleSheet, css } from "aphrodite";

import {
  TextBlock,
  RoundShape,
  RectShape,
} from "react-placeholder/lib/placeholders";
import colors from "~/config/themes/colors";

type Props = {
  color: string;
};

export default function UnifiedDocFeedCardPlaceholder({
  color,
}: Props): ReactElement<"div"> {
  return (
    <div
      className={css(styles.docFeedCardPlaceholder) + " show-loading-animation"}
    >
      <div className={css(styles.cardMain)}>
        <div className={css(styles.column)}>
          <div className={css(styles.header)}>
            <div className={css(styles.topLine)}>
              <RoundShape className={css(styles.avatar)} color={color} />
              <div className={css(styles.detailsWrapper)}>
                <RectShape
                  color={color}
                  style={{ width: "80%", height: "1em" }}
                />
                <RectShape
                  color={color}
                  style={{ width: "70%", height: "1em" }}
                />
                <RectShape
                  color={color}
                  style={{ width: "10%", height: "1em" }}
                />
              </div>
            </div>
          </div>

          <div className={css(styles.row)}>
            <TextBlock rows={1} color={color} style={{ width: "30%" }} />
            <TextBlock rows={1} color={color} style={{ width: "70%" }} />
          </div>

          <div className={css(styles.row)}>
            <TextBlock rows={1} color={color} style={{ width: "50%" }} />
            <TextBlock rows={1} color={color} style={{ width: "30%" }} />
          </div>
          <div className={css(styles.row)}>
            <TextBlock rows={1} color={color} style={{ width: "20%" }} />
            <TextBlock rows={1} color={color} style={{ width: "70%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  avatar: {
    height: 38,
    width: 38,
  },
  detailsWrapper: {
    marginLeft: 15,
    display: "flex",
    flexDirection: "column",
    rowGap: 6,
    fontSize: 9,
    width: "100%",
  },
  docFeedCardPlaceholder: {
    border: `1px solid ${colors.GREY_LINE(1.0)}`,
    borderRadius: "4px",
    marginBottom: 16,
    boxSizing: "border-box",
    display: "flex",
    height: "100%",
    justifyContent: "space-between",
    maxWidth: "100%",
    paddingTop: 15,
    paddingBottom: 15,
    position: "relative",
    width: "100%",
    background: "white",
    padding: "25px 25px 25px 25px",
  },
  topLine: {
    display: "flex",
    alignItems: "center",
  },
  header: {
    paddingBottom: 10,
    marginBottom: 15,
  },
  paddingTop: {
    paddingTop: 8,
  },
  textRow: { width: "100%" },
  column: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  columnRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  row: {
    display: "flex",
    marginBottom: 10,
  },
  cardMain: {
    display: "flex",
    width: "100%",
    maxWidth: "100%",
  },
  marginBottom: {
    marginBottom: 0,
  },
});
