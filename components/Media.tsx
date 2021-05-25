import React from "react";
import { StyleSheet, css } from "aphrodite";

type MediaProps = {
  header: string;
  description: string;
  imgSrc: string;
};

export default function Media({ header, description, imgSrc }: MediaProps) {
  return (
    <div className={css(styles.mediaContainer)}>
      <div className={css(styles.mediaContent)}>
        <div className={css(styles.mediaHeader)}> {header} </div>
        <div className={css(styles.mediaDescription)}> {description} </div>
      </div>
      <div className={css(styles.mediaImgBox)}>
        <img src={imgSrc} className={css(styles.mediaImg)} draggable={false} />
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
});
