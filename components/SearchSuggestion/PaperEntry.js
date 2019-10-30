import React from "react";
import Link from "next/link";
import { StyleSheet, css } from "aphrodite";
import colors from "../../config/themes/colors";
import moment from "moment";

const PaperEntry = ({
  index,
  paperId,
  title,
  date,
  file,
  selected,
  onClick,
  fileUpload,
  onRemove,
  closeModal,
  mobileStyle,
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
        className={css(
          styles.entry,
          styles.fileUpload,
          mobileStyle && mobileStyle
        )}
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
      <Link
        href={"/paper/[paperId]/[tabName]"}
        as={`/paper/${paperId}/summary`}
      >
        <div
          className={css(styles.entry, selected && styles.selected)}
          onClick={closeModal && closeModal}
        >
          <div className={css(styles.title, styles.text)}>{title && title}</div>
          <div className={css(styles.date, styles.text)}>
            Published: {date && moment(date).format("DD MMMM, YYYY")}
          </div>
        </div>
      </Link>
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
    "@media only screen and (max-width: 415px)": {
      height: 48,
    },
    "@media only screen and (max-width: 378px)": {
      height: 38,
    },
    "@media only screen and (max-width: 321px)": {
      width: 238,
      height: 38,
    },
  },
  title: {
    fontWeight: 500,
    fontSize: 18,
    color: "#241F3A",
    "@media only screen and (max-width: 378px)": {
      fontSize: 15,
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 13,
    },
  },
  date: {
    fontWeight: 400,
    fontSize: 14,
    color: "#8c8b9a",
    "@media only screen and (max-width: 378px)": {
      fontSize: 12,
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 11,
    },
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
    "@media only screen and (max-width: 665px)": {
      width: "80%",
    },
    "@media only screen and (max-width: 415px)": {
      height: 50,
    },
    "@media only screen and (max-width: 321px)": {
      height: 45,
    },
  },
  fileSize: {
    height: 16,
    fontFamily: "Roboto",
    fontSize: 14,
    fontWeight: 400,
    color: "#8c8b9a",
    "@media only screen and (max-width: 665px)": {
      width: "80%",
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 11,
    },
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
    "@media only screen and (max-width: 665px)": {
      width: "80%",
      height: "unset",
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 11,
    },
  },
  pdfIcon: {
    height: 39.91,
    width: 34.92,
  },
  deleteIcon: {
    height: 20,
    width: 13.9,
    cursor: "pointer",
    "@media only screen and (max-width: 321px)": {
      width: 13,
      height: 18.71,
    },
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
