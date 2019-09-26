import React from "react";
import { StyleSheet, css } from "aphrodite";

const PaperEntry = ({ title, date, onClick }) => {
  return (
    <div className={css(styles.entry)} onClick={onClick && onClick}>
      <div className={css(styles.title, styles.text)}>{title && title}</div>
      <div className={css(styles.date, styles.text)}>{date && date}</div>
    </div>
  );
};

const styles = StyleSheet.create({
  entry: {
    width: "calc(100% - 35px)",
    height: 58,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#F7F7FB",
    textAlign: "left",
    cursor: "pointer",
    marginBottom: 10,
    border: "solid 1px #F7F7FB",
    ":hover": {
      border: "solid 1px #D2D2E6",
    },
  },
  title: {
    fontWeight: 500,
    fontSize: 18,
    color: "#241F3A",
  },
  date: {
    fontWeight: 400,
    fontSize: 14,
    color: "#8c8b9a",
  },
  text: {
    fontFamily: "Roboto",
  },
});

export default PaperEntry;
