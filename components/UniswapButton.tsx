import { StyleSheet, css } from "aphrodite";
import Link from "next/link";

const UniswapButton = ({ }) => {
  return (
    <div className={css(styles.btn)}>
      <Link className={css(styles.link)} target="_blank" href="https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xd101dcc414f310268c37eeb4cd376ccfa507f571">
        {`RSC is available on Uniswap`}
        <img
          src={"/static/icons/uniswap.svg"}
          height={30}
        />
      </Link>
    </div>
  )
}

const styles = StyleSheet.create({
  link: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    columnGap: "5px",
    textDecoration: "none",
    color: "#FE0F7A",
  },
  btn: {
    color: "#FE0F7A",
    marginTop: 10,
    background: "white",
    border: "1px solid",
    padding: 3,
    borderRadius: "4px",
    ":hover": {
      cursor: "pointer",
      background: "rgb(255 237 245)",
    }
  }
});


export default UniswapButton;