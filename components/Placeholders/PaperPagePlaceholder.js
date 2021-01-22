import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";

import {
  TextBlock,
  MediaBlock,
  TextRow,
  RectShape,
  RoundShape,
} from "react-placeholder/lib/placeholders";

const PaperPagePlaceholder = ({ color }) => (
  <div className={css(styles.placeholderContainer) + " show-loading-animation"}>
    <div className={css(styles.spaceBetween)}>
      <div className={css(styles.column)}>
        <div className={css(styles.marginBottom)}>
          <TextBlock
            className={css(styles.textRow)}
            rows={1}
            color={color}
            style={{ width: "90%" }}
          />
          <TextBlock
            className={css(styles.textRow)}
            rows={1}
            color={color}
            style={{ width: "90%" }}
          />
        </div>
        <div className={css(styles.marginBottom)}>
          <TextBlock
            className={css(styles.textRow)}
            rows={1}
            color={color}
            style={{ width: "80%" }}
          />
          <TextBlock
            className={css(styles.textRow)}
            rows={1}
            color={color}
            style={{ width: "80%" }}
          />
          <TextBlock
            className={css(styles.textRow)}
            rows={1}
            color={color}
            style={{ width: "80%" }}
          />
        </div>
        <div className={css(styles.marginBottom)}>
          <TextBlock
            className={css(styles.textRow)}
            rows={1}
            color={color}
            style={{ width: "20%" }}
          />
        </div>
        <div className={css(styles.marginBottom)}>
          <TextBlock
            className={css(styles.textRow)}
            rows={1}
            color={color}
            style={{ width: "20%" }}
          />
        </div>
        <div className={css(styles.marginBottom)}>
          <div className={css(styles.row)}>
            <TextBlock
              className={css(styles.tag)}
              rows={1}
              color={color}
              style={{ width: "15%" }}
            />
            <TextBlock
              className={css(styles.tag)}
              rows={1}
              color={color}
              style={{ width: "18%", margin: "0 10px" }}
            />
            <TextBlock
              className={css(styles.tag)}
              rows={1}
              color={color}
              style={{ width: "13%" }}
            />
          </div>
        </div>
      </div>
      <div className={css(styles.columnRight)}>
        <div className={css(styles.row)}>
          <RoundShape
            className={css(styles.actions)}
            color={color}
            style={{ width: 30, height: 30 }}
          />
          <RoundShape
            className={css(styles.actions)}
            color={color}
            style={{ width: 30, height: 30, margin: "0px 10px" }}
          />
          <RoundShape
            className={css(styles.actions)}
            color={color}
            style={{ width: 30, height: 30, marginRight: 10 }}
          />
          <RoundShape
            className={css(styles.actions)}
            color={color}
            style={{ width: 30, height: 30, marginRight: 10 }}
          />
        </div>
        <RectShape
          className={css(styles.textRow)}
          color={color}
          style={{ width: 180, height: 250 }}
        />
      </div>
    </div>
  </div>
);

const styles = StyleSheet.create({
  placeholderContainer: {
    width: "100%",
    height: "100%",
  },
  textRow: {},
  tag: {
    height: 25,
  },
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
  spaceBetween: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  marginBottom: {
    marginBottom: 16,
  },
  space: {},
  label: {},
});

export default PaperPagePlaceholder;
