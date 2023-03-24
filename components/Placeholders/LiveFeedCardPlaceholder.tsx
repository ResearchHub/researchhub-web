import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactElement } from "react";
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
      <div className={css(styles.cardMain)}>
        <div className={css(styles.column)}>
          <div className={css(styles.header)}>

            <div className={css(styles.topLine)}>
              <RoundShape
                color={color}
                style={{ width: 28, height: 28 }}
              />
              <TextBlock
                className={css(styles.textRow)}
                rows={1}
                color={color}
                style={{ width: "100%", marginLeft: 15 }}
              />
            </div>  
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
        </div>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  docFeedCardPlaceholder: {
    borderBottom: "1px solid #EDEDED",
    boxSizing: "border-box",
    display: "flex",
    height: "100%",
    justifyContent: "space-between",
    maxWidth: "100%",
    paddingTop: 15,
    paddingBottom: 15,
    position: "relative",
    width: "100%",
  },
  topLine: {
    display: "flex",
    alignItems: "center",
  },
  header: {
    paddingBottom: 10,
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
    // marginBottom: 15,
  },
  cardMain: {
    display: "flex",
    width: "100%",
  },
  marginBottom: {
    marginBottom: 0,
  },
});
