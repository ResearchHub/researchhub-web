import { StyleSheet, css } from "aphrodite";
import Link from "next/link";

import ResearchCoinIcon from "./Icons/ResearchCoinIcon";

type Args = {
  variant: "contained" | "text" | "shadow";
  label: string;
};

const UniswapButton = ({ variant, label = "RSC is available on" }: Args) => {
  return (
    <div
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
          {<i className="fa-solid fa-arrow-up-right"></i>}
        </div>
      </Link>
    </div>
  );
};

const styles = StyleSheet.create({
  containedVariant: {
    border: "1px solid",
    background: "white",
    color: "black",
    ":hover": {
      cursor: "pointer",
      transition: "0.3s",
      background: "rgb(255 237 245)",
    },
  },
  rscText: {
    paddingTop: 2,
    marginRight: 3,
  },
  shadowVariant: {
    // filter: "drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.15))",
    boxShadow:
      "rgb(101 119 134 / 20%) 0px 0px 15px, rgb(101 119 134 / 15%) 0px 0px 3px 1px !important",
    background: "white",
    ":hover": {
      background: "rgb(248 246 247)",
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
    color: "black",
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
