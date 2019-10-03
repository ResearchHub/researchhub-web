import React from "react";
import { StyleSheet, css } from "aphrodite";
import colors from "../../config/themes/colors";

const PaperEntry = ({
  index,
  title,
  date,
  file,
  selected,
  onClick,
  fileUpload,
  onRemove,
}) => {
  if (fileUpload) {
    let name = "-";
    let fileSize = "-";

    if (file && Object.keys(file).length > 0) {
      name = file.name;
      fileSize = file.size / 1000000;
    }

    return (
      <div
        className={css(styles.entry, styles.fileUpload)}
        onClick={() => onClick && onClick(index)}
      >
        <img src={"/static/icons/pdf.png"} className={css(styles.pdfIcon)} />
        <div className={css(styles.fileDataContainer)}>
          <div className={css(styles.fileName, styles.text)}>
            {name && name}
          </div>
          <div className={css(styles.fileSize, styles.text)}>
            {fileSize && `${fileSize} MB`}
          </div>
        </div>
        <img
          src={"/static/icons/delete.png"}
          className={css(styles.deleteIcon)}
          onClick={onRemove && onRemove}
        />
      </div>
    );
  } else {
    return (
      <div
        className={css(styles.entry, selected && styles.selected)}
        onClick={() => onClick && onClick(index)}
      >
        <div className={css(styles.title, styles.text)}>{title && title}</div>
        <div className={css(styles.date, styles.text)}>{date && date}</div>
      </div>
    );
  }
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
  fileDataContainer: {
    height: 60,
    width: 390,
    flexWrap: "wrap",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    textAlign: "left",
    paddingLeft: 15,
  },
  fileSize: {
    height: 16,
    fontFamily: "Roboto",
    fontSize: 14,
    fontWeight: 400,
    color: "#8c8b9a",
  },
  fileUpload: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "initial",
    cursor: "default",
    borderRadius: 3,
  },
  fileName: {
    height: 41,
    width: 345,
    fontFamily: "Roboto",
    fontSize: 16,
  },
  pdfIcon: {
    height: 39.91,
    width: 34.92,
  },
  deleteIcon: {
    height: 20,
    width: 13.9,
    cursor: "pointer",
  },
  text: {
    fontFamily: "Roboto",
  },
  selected: {
    border: `1px solid ${colors.BLUE(1)}`,
    ":hover": {
      border: `1px solid ${colors.BLUE(1)}`,
    },
  },
});

export default PaperEntry;
