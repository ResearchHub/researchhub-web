import { css, StyleSheet } from "aphrodite";
import { ReactNode, ReactElement } from "react";

type Props = {
  body: ReactNode;
  header: ReactNode;
  imgSrc: string;
};

export default function SiteWideBanner({
  body,
  header,
  imgSrc,
}: Props): ReactElement<"div"> {
  return (
    <div className={css(styles.siteWideBanner)}>
      <div className={css(styles.contentWrap)}>
        <div className={css(styles.textSection)}>
          <div className={css(styles.headerText)}>{header}</div>
          <div className={css(styles.bodyText)}>{body}</div>
        </div>
        <div className={css(styles.imgWrap)}>
          <img
            className={css(styles.bannerImg)}
            src={imgSrc ? imgSrc : "/static/icons/site-wide-banner.png"}
          />
        </div>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  siteWideBanner: {
    backgroundColor: "rgb(65 114 239)",
    boxSizing: "border-box",
    display: "flex",
    fontFamily: "Roboto",

    "@media only screen and (max-width: 767px)": {
      height: "unset",
    },
  },
  contentWrap: {
    alignItems: "center",
    display: "flex",
    height: "100%",
    justifyContent: "space-between",
    margin: "auto",
    width: "80%",
    "@media only screen and (max-width: 1199px)": {
      margin: "none",
      padding: "0 12px",
      width: "100%",
    },
    "@media only screen and (max-width: 1399px)": {
      width: "90%",
    },
  },
  headerText: {
    color: "#fff",
    fontWeight: 500,
    fontSize: 24,
    marginBottom: 16,
    "@media only screen and (max-width: 1199px)": {
      fontSize: 18,
    },
    "@media only screen and (max-width: 1399px)": {
      fontSize: 22,
    },
  },
  textSection: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "calc(100% - 330px)",
    padding: 12,
    height: "100%",
    boxSizing: "border-box",
    "@media only screen and (max-width: 767px)": {
      width: "100%",
      padding: "12px 0px",
    },
  },
  bannerImg: {
    width: 330,
    objectFit: "contain",
  },
  bodyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: 400,
    "@media only screen and (max-width: 1199px)": {
      fontSize: 14,
    },
    "@media only screen and (max-width: 1399px)": {
      fontSize: 15,
    }
  },
  imgWrap: {
    display: "unset",
    height: "100%",
    "@media only screen and (max-width: 767px)": {
      // ipad-size
      display: "none",
    },
  },
});
