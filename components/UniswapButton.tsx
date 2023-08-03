import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRight } from "@fortawesome/pro-solid-svg-icons";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import colors from "~/config/themes/colors";

type Args = {
  variant: "contained" | "text" | "shadow";
  label: string;
};

const UniswapButton = ({ variant, label = "RSC is available on" }: Args) => {
  return (
    (<div
      className={css(
        styles.btn,
        variant === "contained" && styles.containedVariant,
        variant === "shadow" && styles.shadowVariant
      )}
    >
      <Link
        className={css(styles.link, variant === "text" && styles.textVariant)}
        target="_blank"
        href="https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xd101dcc414f310268c37eeb4cd376ccfa507f571"
      >
        <div className={css(styles.rscText)}>{label}</div>
        <img src={"/static/icons/uniswap-with-text.png"} height={25} />
        <div className={css(styles.externalIcon)}>
          {<FontAwesomeIcon icon={faArrowUpRight}></FontAwesomeIcon>}
        </div>
      </Link>
    </div>)
  );
};

const styles = StyleSheet.create({
  containedVariant: {
    border: "1px solid",
    background: colors.WHITE(),
    color: colors.PURE_BLACK(),
    ":hover": {
      cursor: "pointer",
      transition: "0.3s",
      background: colors.VERY_PALE_PINK(),
    },
  },
  rscText: {
    paddingTop: 2,
    marginRight: 3,
  },
  shadowVariant: {
    // filter: `drop-shadow(0px 0px 10px ${colors.PURE_BLACK(0.15)})`,
    boxShadow: `${colors.DARK_GREYISH_BLUE3(0.2)} 0px 0px 15px, 
      ${colors.DARK_GREYISH_BLUE3(0.15)} 0px 0px 3px 1px !important`,
    background: colors.WHITE(),
    ":hover": {
      background: colors.LIGHT_GRAYISH_PINK(),
      cursor: "pointer",
      transition: "0.2s",
    },
  },
  textVariant: {
    ":hover": {
      borderBottom: "1px solid",
      transition: "0.2s",
    },
  },
  link: {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    columnGap: "5px",
    textDecoration: "none",
    color: colors.PURE_BLACK(),
    fontWeight: 500,
  },
  externalIcon: {
    color: "#FE0F7A",
    paddingTop: 3,
    marginLeft: 2,
  },
  btn: {
    display: "flex",
    justifyContent: "center",
    padding: "5px 0 7px 3px",
    borderRadius: "4px",
  },
});

export default UniswapButton;
