import Button from "./Form/Button";
import React, { ReactElement } from "react";
import colors from "../config/themes/colors";
import { DownloadIcon } from "../config/themes/icons";
import { StyleSheet, css } from "aphrodite";

export type DownloadPDFButtonProps = {
  file: string;
  style: StyleSheet;
};

export default function DownloadPDFButton({
  file,
  style,
}: DownloadPDFButtonProps): ReactElement<"div"> | null {
  const downloadPDF = () => {
    window.open(file, "_blank");
  };

  const label = () => (
    <div className={css(styles.labelContainer)}>
      <DownloadIcon style={styles.downloadIcon} />
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
  downloadIcon: {},
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
