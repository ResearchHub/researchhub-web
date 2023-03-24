import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// @ts-nocheck
import { genericCardColors } from "~/config/themes/colors";
import { ReactElement } from "react";
import { StyleSheet, css } from "aphrodite";
import CheckBox from "./Form/CheckBox";
import TabNewFeature from "~/components/NewFeature/TabNewFeature";

export type ResearchhubOptionCardProps = {
  description: string;
  header: string;
  icon: any;
  isActive: boolean;
  isCheckboxSquare: boolean;
  newFeature: boolean;
  onSelect: Function;
  whiteStyle?: boolean;
};

export default function ResearchhubOptionCard({
  description,
  header,
  icon,
  isActive,
  isCheckboxSquare,
  newFeature,
  onSelect,
  whiteStyle,
}: ResearchhubOptionCardProps): ReactElement<"div"> {
  return (
    <div
      className={css(
        Boolean(whiteStyle) ? styles.largeListItemWhite : styles.largeListItem,
        styles.clickable
      )}
      onClick={onSelect}
    >
      {!whiteStyle && (
        <div className={css(styles.checkboxAligner)}>
          <CheckBox isSquare={isCheckboxSquare} active={isActive} />
        </div>
      )}
      <div className={css(styles.mediaContainer)}>
        <div className={css(styles.mediaContent)}>
          <div className={css(styles.mediaHeader)}>
            {header}
            {newFeature && <TabNewFeature overrideStyles={styles.newFeature} />}
          </div>
          <div className={css(styles.mediaDescription)}> {description} </div>
        </div>
        <div className={css(styles.mediaImgBox)}>{icon}</div>
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
    "@media only screen and (max-width: 767px)": {
      width: "100%",
    },
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
    "@media only screen and (max-width: 767px)": {
      width: "100%",
    },
  },
  mediaImgBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "75px",
    height: "75px",
    borderRadius: "8px",
    backgroundColor: "#eee",
    marginLeft: "25px",
  },
  mediaImg: {},
  largeListItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignSelf: "stretch",
    // height: '100%',
    // height: 500,
    borderRadius: "4px",
    background: genericCardColors.BACKGROUND,
    border: "1.5px solid #F0F0F0",
    margin: "5px 0px",
    padding: "20px",
  },
  largeListItemWhite: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignSelf: "stretch",
    borderRadius: "4px",
    backgroundColor: "#FFF",
    border: "none",
    padding: "20px 20px 20px 36px",
    ":hover": {
      background: genericCardColors.BACKGROUND,
    },
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
  newFeature: {
    marginLeft: 10,
    padding: "0px 6px",
  },
});
