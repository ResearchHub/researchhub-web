// @ts-nocheck
import { genericCardColors } from "~/config/themes/colors";
import { ReactElement } from "react";
import { StyleSheet, css } from "aphrodite";
import TabNewFeature from "~/components/NewFeature/TabNewFeature";
import { breakpoints } from "~/config/themes/screen";
import colors from "~/config/themes/colors";

export type ResearchhubOptionCardProps = {
  description: string;
  header: string;
  icon: any;
  isActive?: boolean;
  newFeature: boolean;
  onSelect: Function;
  whiteStyle?: boolean;
};

export default function ResearchhubOptionCard({
  description,
  header,
  icon,
  isActive,
  newFeature,
  onSelect,
  whiteStyle,
}: ResearchhubOptionCardProps): ReactElement<"div"> {
  return (
    <div
      className={css(
        Boolean(whiteStyle) ? styles.largeListItemWhite : styles.largeListItem,
        styles.clickable,
        isActive && styles.active
      )}
      onClick={onSelect}
    >
      <div className={css(styles.mediaContainer)}>
        <div className={css(styles.mediaImgBox)}>{icon}</div>
        <div className={css(styles.mediaContent)}>
          <div className={css(styles.mediaHeader)}>
            {header}
            {newFeature && <TabNewFeature overrideStyles={styles.newFeature} />}
          </div>
          <div className={css(styles.mediaDescription)}> {description} </div>
        </div>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  active: {
    border: `1px solid ${colors.NEW_BLUE()}`,
    backgroundColor: colors.NEW_BLUE(0.1),
  },
  mediaContainer: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "stretch",
    gap: 25,
    width: "100%",
    alignItems: "center",
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      flexDirection: "row-reverse",
    },
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
    lineHeight: "20px",
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
    borderRadius: "4px",
    backgroundColor: "#eee",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: 100,
    },
  },
  mediaImg: {},
  largeListItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignSelf: "stretch",
    borderRadius: "4px",
    background: genericCardColors.BACKGROUND,
    border: "1.5px solid #F0F0F0",
    margin: "8px 0px",
    padding: "15px",
  },
  largeListItemWhite: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignSelf: "stretch",
    borderRadius: "4px",
    backgroundColor: "#FFF",
    border: "none",
    padding: 20,
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
