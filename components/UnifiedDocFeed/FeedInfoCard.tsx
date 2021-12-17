import { breakpoints } from "~/config/themes/screen";
import { css, StyleSheet } from "aphrodite";
import { isEmpty, nullthrows } from "~/config/utils/nullchecks";
import { ReactElement, ReactNode } from "react";
import colors, { genericCardColors } from "~/config/themes/colors";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faUser } from "@fortawesome/free-solid-svg-icons";

type Props = {
  hub: any;
  hubSubscribeButton?: ReactNode | null;
  isHomePage: Boolean;
  mainHeaderText: string;
};

export default function FeedInfoCard({
  hub,
  hubSubscribeButton,
  isHomePage,
  mainHeaderText,
}: Props): ReactElement<"div"> | null {
  if (isHomePage) {
    return null;
  }
  const { description, hub_image: hubImage, subscriber_count: subCount } = hub;
  console.warn("hub: ", hub);
  return (
    <div className={css(styles.feedInfoCard)}>
      <Image
        height={64}
        layout="fixed"
        objectFit="cover"
        src={hubImage ?? "/static/background/hub-placeholder.svg"}
        width={64}
      />
      <div className={css(styles.bodyContainer)}>
        <div className={css(styles.titleContainer)}>
          <h1 className={css(styles.title) + " clamp2"}>{mainHeaderText}</h1>
          <div className={css(styles.subscribeContainer)}>
            {nullthrows(hubSubscribeButton)}
          </div>
        </div>
        <div className={css(styles.detailRow)}>
          <div className={css(styles.detailRowLabel)}>
            <FontAwesomeIcon icon={faUser} style={{ width: "16px" }} />
          </div>
          <div>
            <span>{"Users "}</span>
            <span>{subCount}</span>
          </div>
        </div>
        <div className={css(styles.detailRow)}>
          <div className={css(styles.detailRowLabel)}>
            <FontAwesomeIcon icon={faStar} style={{ width: "16px" }} />
          </div>
          <div>
            <span>{"Editors "}</span>
            <span>{subCount}</span>
          </div>
        </div>
        <div className={css(styles.detailRow)}>
          <div>{isEmpty(description) ? null : description}</div>
        </div>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  feedInfoCard: {
    display: "flex",
    backgroundColor: "#fff",
    border: `1px solid ${genericCardColors.BORDER}`,
    marginBottom: 32,
    padding: 16,
  },
  bodyContainer: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 16,
    width: "100%",
  },
  detailRow: {
    display: "flex",
    margin: "8px 0",
    fontSize: 16,
  },
  detailRowLabel: {
    color: colors.LIGHT_GREY_TEXT,
    marginRight: 8,
    width: 20,
  },
  subscribeContainer: {
    marginLeft: 16,
    minWidth: 100,
    "@media only screen and (max-width: 767px)": {
      display: "none",
    },
  },
  title: {
    color: "#241F3A",
    fontWeight: 400,
    fontSize: 30,
    padding: 0,
    margin: 0,
    textOverflow: "ellipsis",
    [`@media only screen and max-width: ${breakpoints.large.str}`]: {
      fontSize: 30,
    },
    [`@media only screen and max-width: ${breakpoints.small.str}`]: {
      fontSize: 25,
      textAlign: "center",
      justifyContent: "center",
      whiteSpace: "pre-wrap",
      wordBreak: "normal",
      display: "flex",
    },
    [`@media only screen and max-width: ${breakpoints.xxsmall.str}`]: {
      fontSize: 25,
    },
    [`@media only screen and max-width: ${breakpoints.xxxsmall.str}`]: {
      fontSize: 20,
    },
  },
  titleContainer: { display: "flex", width: "100%" },
});
