import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import icons from "~/config/themes/icons";


type Args = {
  variant: "contained" | "text" | "shadow";
}

const UniswapButton = ({ variant }: Args) => {
  return (
    <div className={css(styles.btn, variant === "contained" && styles.containedVariant, variant === "shadow" && styles.shadowVariant)}>
      <Link className={css(styles.link, variant === "text" && styles.textVariant)} target="_blank" href="https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xd101dcc414f310268c37eeb4cd376ccfa507f571">
        <div className={css(styles.rscText)}>{`RSC is available on`}</div>
        <img
          src={"/static/icons/uniswap-with-text.png"}
          height={25}
        />
        <div className={css(styles.externalIcon)}>
          {icons.arrowUpRight}
        </div>
      </Link>
    </div>
  )
}

const styles = StyleSheet.create({
  containedVariant: {
    border: "1px solid",
    background: "white",
    color: "black",
    ":hover": {
      cursor: "pointer",
      transition: "0.3s",
      background: "rgb(255 237 245)",
    }
  },
  rscText: {
    paddingTop: 2,
    marginRight: 3,
  },
  shadowVariant: {
    filter: "drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.15))",
    background: "white",
    border: "1px solid white",
    ":hover": {
      background: "rgb(248 246 247)",
      cursor: "pointer",
      transition: "0.2s",
      border: "1px solid #FE0F7A",
    }    
  },
  textVariant: {
    ":hover": {
      borderBottom: "1px solid",
      transition: "0.2s",
    }
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
    paddingTop:3,
    marginLeft: 2,
  },
  btn: {
    display: "flex",
    justifyContent: "center",
    marginTop: 10,
    padding: "3px 0 5px 3px",
    borderRadius: "4px",
  }
});


export default UniswapButton;