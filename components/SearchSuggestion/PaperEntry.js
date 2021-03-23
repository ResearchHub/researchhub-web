import React, { Fragment } from "react";
import Link from "next/link";
import { StyleSheet, css } from "aphrodite";
import colors from "../../config/themes/colors";
import icons from "../../config/themes/icons";
import * as moment from "dayjs";
import { formatPaperSlug } from "~/config/utils";

const PaperEntry = ({
  data,
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
  url,
}) => {
  if (fileUpload) {
    let name = "-";
    let fileSize = "-";

    if (typeof file === "string") {
      return (
        <div
          className={css(
            styles.entry,
            styles.fileUpload,
            mobileStyle && mobileStyle
          )}
          onClick={() => onClick && onClick(index)}
        >
          <img
            src={"/static/icons/pdf.png"}
            className={css(styles.pdfIcon)}
            alt="PDF Icon"
          />
          <div className={css(styles.fileDataContainer)}>
            <div className={css(styles.fileName, styles.text)}>
              {file && file}
            </div>
            <div className={css(styles.fileSize, styles.text)}>Source: URL</div>
          </div>
          <img
            src={"/static/icons/delete.png"}
            className={css(styles.deleteIcon)}
            onClick={onRemove && onRemove}
            alt="Delete Button"
          />
        </div>
      );
    }

    if (file && Object.keys(file).length > 0) {
      name = file.name ? file.name : file.URL;
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
        <img
          src={"/static/icons/pdf.png"}
          className={css(styles.pdfIcon)}
          alt="PDF Icon"
        />
        <div className={css(styles.fileDataContainer)}>
          <div className={css(styles.fileName, styles.text)}>
            {name && name}
          </div>
          <div className={css(styles.fileSize, styles.text)}>
            {url ? "Source: URL" : fileSize && `${fileSize} MB`}
          </div>
        </div>
        <img
          src={"/static/icons/delete.png"}
          className={css(styles.deleteIcon)}
          onClick={onRemove && onRemove}
          alt="Delete Button"
        />
      </div>
    );
  } else {
    return (
      <Link
        href={"/paper/[paperId]/[paperName]"}
        as={`/paper/${paperId}/${formatPaperSlug(title)}`}
      >
        <div
          className={css(
            styles.entry,
            styles.paper,
            selected && styles.selected
          )}
          onClick={closeModal && closeModal}
        >
          <div className={css(styles.title, styles.text)}>
            {title && (
              <Fragment>
                <span className={css(styles.icon)}>{icons.file}</span>
                {title}
              </Fragment>
            )}
          </div>
          <div className={css(styles.date, styles.text)}>
            {date &&
              `Published: ${date && moment(date).format("DD D MMMM, YYYY")}`}
          </div>
        </div>
      </Link>
    );
  }
};

const styles = StyleSheet.create({
  entry: {
    width: "calc(100% - 35px)",
    // minHeight: 58,
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
      minHeight: 48,
    },
    "@media only screen and (max-width: 378px)": {
      minHeight: 38,
    },
    "@media only screen and (max-width: 321px)": {
      width: 238,
      minHeight: 38,
    },
  },
  paper: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
  },
  title: {
    fontWeight: 500,
    fontSize: 16,
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
    paddingTop: 10,
    "@media only screen and (max-width: 378px)": {
      fontSize: 12,
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 11,
    },
  },
  fileDataContainer: {
    minHeight: 60,
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
      minHeight: 50,
    },
    "@media only screen and (max-width: 321px)": {
      minHeight: 45,
    },
  },
  fileSize: {
    height: 16,
    fontFamily: "Roboto",
    fontSize: 14,
    fontWeight: 400,
    color: "#8c8b9a",
    paddingTop: 5,
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
    // borderColor: colors.BLUE(1)
  },
  fileName: {
    minHeight: 41,
    width: 380,
    overflowWrap: "break-word",
    fontFamily: "Roboto",
    fontSize: 16,
    "@media only screen and (max-width: 665px)": {
      width: "80%",
      minHeight: "unset",
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
  icon: {
    color: colors.GREEN(),
    paddingRight: 5,
  },
});

export default PaperEntry;
