import { Fragment, ReactElement } from "react";
import { StyleSheet, css } from "aphrodite";

import { TextBlock, RoundShape } from "react-placeholder/lib/placeholders";

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
      <div className={css(styles.voteContainer)}>
        <RoundShape
          color={color}
          style={{ width: 48, height: 28, marginBottom: 10 }}
        />
      </div>
      <div className={css(styles.cardMain)}>
        <div className={css(styles.column)}>
          <div className={css(styles.header)}>
            <TextBlock
              className={css(styles.textRow)}
              rows={1}
              color={color}
              style={{ width: "100%" }}
            />
            <TextBlock
              className={css(styles.textRow)}
              rows={1}
              color={color}
              style={{ width: "100%" }}
            />
            <TextBlock
              className={css(styles.textRow, styles.paddingTop)}
              rows={1}
              color={color}
              style={{ width: "100%" }}
            />
          </div>
          <div className={css(styles.row)}>
            <div style={{ width: "35%" }}>
              <TextBlock
                rows={1}
                color={color}
                style={{ width: "100%", paddingRight: 50 }}
              />
            </div>
            <TextBlock
              rows={1}
              color={color}
              style={{ paddingLeft: 30, width: "50%" }}
            />
          </div>
          <div className={css(styles.row, styles.marginBottom)}>
            <div className={css(styles.row)}>
              <RoundShape color={color} style={{ width: 30, height: 30 }} />
              <RoundShape
                color={color}
                style={{ width: 30, height: 30, margin: "0px 10px" }}
              />
              <RoundShape
                color={color}
                style={{ width: 30, height: 30, marginRight: 10 }}
              />
              <RoundShape
                color={color}
                style={{ width: 30, height: 30, marginRight: 10 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  docFeedCardPlaceholder: {
    backgroundColor: "#FFF",
    border: "1px solid #EDEDED",
    boxSizing: "border-box",
    display: "flex",
    height: "100%",
    justifyContent: "space-between",
    marginBottom: 12,
    maxWidth: "100%",
    padding: 12,
    paddingTop: 24,
    position: "relative",
    width: "100%",
  },
  voteContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginRight: 16,
  },
  header: {
    paddingBottom: 20,
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
    marginBottom: 15,
  },
  cardMain: {
    display: "flex",
    width: "100%",
  },
  marginBottom: {
    marginBottom: 0,
  },
});
