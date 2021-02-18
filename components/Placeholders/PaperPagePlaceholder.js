import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";

import {
  TextBlock,
  MediaBlock,
  TextRow,
  RectShape,
  RoundShape,
} from "react-placeholder/lib/placeholders";

const PaperPagePlaceholder = ({ color }) => {
  const header = (
    <div className={css(styles.header)}>
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
  );

  const actions = (
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
  );

  const metaRow = (width) => (
    <div className={css(styles.row, styles.marginBottom)}>
      <div style={{ width: 100 }}>
        <TextBlock rows={1} color={color} style={{ width, marginRight: 20 }} />
      </div>
      <TextBlock rows={1} color={color} style={{ width: "20%" }} />
    </div>
  );

  const button = (
    <RectShape
      color={color}
      style={{ marginLeft: 35, width: 115, height: 31 }}
    />
  );

  const tag = <RectShape color={color} style={{ width: 115, height: 31 }} />;

  return (
    <div
      className={css(styles.placeholderContainer) + " show-loading-animation"}
    >
      {/* <RoundShape className={css(styles.round)} color={color} /> */}
      <RectShape
        color={color}
        className={css(styles.tag)}
        style={{ width: 115, height: 25 }}
      />
      <div className={css(styles.spaceBetween)}>
        <div className={css(styles.column)}>
          {header}
          {metaRow(81)}
          {metaRow(60)}
          {metaRow(75)}
          {metaRow(58)}
          <div className={css(styles.row, styles.marginBottom, styles.bottom)}>
            {actions}
            {button}
          </div>
        </div>
        <div className={css(styles.columnRight)}>
          <RectShape
            className={css(styles.textRow)}
            color={color}
            style={{ height: 154, width: 119 }}
          />
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  placeholderContainer: {
    paddingTop: 30,
    width: "100%",
    height: "100%",
    position: "relative",
  },
  round: {
    width: 53,
    height: 25,
    position: "absolute",
    top: 32,
    left: -70,
  },
  tag: {
    position: "absolute",
    bottom: 15,
    right: 0,
  },
  header: {
    paddingBottom: 20,
  },
  textRow: {},
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
    margin: "5px 0",
  },
  bottom: {
    marginTop: 20,
  },
  space: {},
  label: {},
});

export default PaperPagePlaceholder;
