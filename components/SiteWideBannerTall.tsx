import { css, StyleSheet } from "aphrodite";
import { ReactNode, ReactElement } from "react";
import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";
import { isNullOrUndefined } from "~/config/utils/nullchecks";

type Props = {
  body: ReactNode;
  button?: { label: string; href?: string };
  header: ReactNode;
  imgSrc: string;
};

export default function SiteWideBannerTall({
  body,
  button,
  header,
  imgSrc,
}: Props): ReactElement<"div"> {
  const { label: buttonLabel, href: buttonHref } = button ?? {};
  return (
    <div className={css(styles.siteWideBannerTall)}>
      <div className={css(styles.contentWrap)}>
        <div className={css(styles.textSection)}>
          <div className={css(styles.headerText)}>{header}</div>
          <div className={css(styles.bodyText)}>{body}</div>
          {!isNullOrUndefined(button) ? (
            <a href={buttonHref ?? undefined} target="__blank">
              <div className={css(styles.button)}>{buttonLabel}</div>
            </a>
          ) : null}
        </div>
        <div className={css(styles.imgWrap)}>
          <img
            className={css(styles.bannerImg)}
            src={imgSrc ? imgSrc : "/static/icons/person-lightbulb-hypo.webp"}
          />
        </div>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  siteWideBannerTall: {
    backgroundColor: colors.ICY_BLUE,
    boxSizing: "border-box",
    display: "flex",
    fontFamily: "Roboto",
    // height: 341,
    alignItems: "baseline",
    borderRadius: 4,
    "@media only screen and (max-width: 767px)": {
      height: "unset",
    },
  },
  contentWrap: {
    alignItems: "flex-end",
    display: "flex",
    height: "100%",
    justifyContent: "space-between",
    margin: "auto",
    width: "85%",
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
    fontWeight: 500,
    fontSize: 30,
    marginTop: 16,
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
    justifyContent: "space-around",
    height: "100%",
    boxSizing: "border-box",
    width: 448,
    padding: 16,
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
    fontSize: 14,
    fontWeight: 400,
    color: colors.TEXT_DARKER_GREY,
    opacity: .8,
    marginBottom: 16,
    lineHeight: '20px',
    "@media only screen and (max-width: 1199px)": {
      fontSize: 14,
    },
    "@media only screen and (max-width: 1399px)": {
      fontSize: 15,
    },
  },
  imgWrap: {
    alignItems: "flex-end",
    display: "flex",
    height: "100%",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
  },
  button: {
    height: 45,
    width: 141,
    left: 498,
    top: 497,
    borderRadius: 4,
    backgroundColor: colors.NEW_BLUE(1),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    cursor: "pointer",
  },
});
