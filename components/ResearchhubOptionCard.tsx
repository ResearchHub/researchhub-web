import React, { ReactElement } from "react";
import { StyleSheet, css } from "aphrodite";
import CheckBox from "./Form/CheckBox";

export type ResearchhubOptionCardProps = {
  header: string;
  description: string;
  imgSrc: string;
  isCheckboxSquare: boolean;
  isActive: boolean;
  onSelect: Function;
};

export default function ResearchhubOptionCard({
  header,
  description,
  imgSrc,
  isCheckboxSquare,
  isActive,
  onSelect,
}: ResearchhubOptionCardProps): ReactElement<"div"> {
  return (
    <div
      className={css(styles.largeListItem, styles.clickable)}
      onClick={onSelect}
    >
      <div className={css(styles.checkboxAligner)}>
        <CheckBox isSquare={isCheckboxSquare} active={isActive} />
      </div>
      <div className={css(styles.mediaContainer)}>
        <div className={css(styles.mediaContent)}>
          <div className={css(styles.mediaHeader)}> {header} </div>
          <div className={css(styles.mediaDescription)}> {description} </div>
        </div>
        <div className={css(styles.mediaImgBox)}>
          <img
            src={imgSrc}
            className={css(styles.mediaImg)}
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  mediaContainer: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  mediaContent: {
    display: "flex",
    flexDirection: "column",
    width: "373px",
  },
  mediaHeader: {
    display: "flex",
    fontWeight: 500,
    fontSize: "18px",
    lineHeight: "21px",
    color: "#241F3A",
  },
  mediaDescription: {
    display: "flex",
    fontWeight: "normal",
    fontSize: "14px",
    lineHeight: "22px",
    color: "#241F3A",
    opacity: 0.7,
    marginTop: "10px",
    width: "373px",
  },
  mediaImgBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "75px",
    height: "75px",
    borderRadius: "4px",
    backgroundColor: "rgba(57, 113, 255, 0.07)",
  },
  mediaImg: {},
  largeListItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignSelf: "stretch",
    borderRadius: "4px",
    backgroundColor: "#FAFAFA",
    border: "1.5px solid #F0F0F0",
    margin: "5px 0px",
    padding: "20px",
  },
  clickable: {
    cursor: "pointer",
    userSelect: "none",
  },
  checkboxAligner: {
    display: "flex",
    alignSelf: "stretch",
    paddingRight: "15px",
  },
  contentAligner: {
    display: "flex",
  },
});
