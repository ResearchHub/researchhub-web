import Button from "./Form/Button";
import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import { DownloadIcon } from "../config/themes/icons";
import colors from "../config/themes/colors";

export default function DownloadPDFButton({ paper, style, showing }) {
  const downloadPDF = () => {
    let file = paper.file;
    window.open(file, "_blank");
  };

  if (!showing) {
    return null;
  }

  const label = () => (
    <div className={css(styles.labelContainer)}>
      <DownloadIcon />
      <span className={css(styles.labelText)}>Download PDF</span>
    </div>
  );

  return (
    <Button
      label={label}
      onClick={downloadPDF}
      customButtonStyle={[styles.downloadButton, style]}
    />
  );
}

const styles = StyleSheet.create({
  downloadButton: {
    // fontFamily: "Roboto",
    // fontStyle: "normal",
    // fontWeight: "normal",
    width: "138px",
    height: "30px",
    padding: "2px 12px",
    color: "#fff",
    backgroundColor: colors.BLUE(),
    borderColor: colors.BLUE(),
    borderRadius: "4px",
    ":hover": {
      backgroundColor: "#3E43E8",
      color: "#fff",
      borderColor: "#3E43E8",
    },
  },
  labelText: {
    fontSize: "14px",
    lineHeight: "26px",
    marginLeft: "6px",
    color: "#FFFFFF",
  },
  labelContainer: {
    display: "flex",
    alignItems: "center",
  },
});
