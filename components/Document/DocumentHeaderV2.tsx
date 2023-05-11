import { StyleSheet, css } from "aphrodite";
import DocumentBadges from "./DocumentBadges";
import DocumentLineItems from "./DocumentLineItems";
import IconButton from "../Icons/IconButton";
import ResearchCoinIcon from "../Icons/ResearchCoinIcon";
import colors from "~/config/themes/colors";
import Image from "next/image";
import { faArrowDownToBracket } from "@fortawesome/pro-solid-svg-icons";
import {  faEllipsis } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GenericDocument, Paper } from "./lib/types";


interface Props {
  document: GenericDocument;
}

const DocumentHeader = ({ document }: Props) => {
  return (
    <div>
      <div className={css(styles.badgesWrapper)}>
        <DocumentBadges document={document} />
      </div>
      <h1>{document.title}</h1>
      <DocumentLineItems document={document} />
      <div className={css(styles.btnWrapper)}>
        <IconButton overrideStyle={styles.btn} onClick={() => null}>
          <Image
            src="/static/icons/tip.png"
            height={21}
            width={21}
            alt="Tip"
          />
          <span>Tip</span>
        </IconButton>
        <IconButton overrideStyle={styles.btn} onClick={() => null}>
          <FontAwesomeIcon icon={faArrowDownToBracket} />
          <span>PDF</span>
        </IconButton>
        <IconButton overrideStyle={styles.btnDots} onClick={() => null}>
          <FontAwesomeIcon icon={faEllipsis} />
        </IconButton>        
        
      </div>
    </div>
  )
}

const styles = StyleSheet.create({
  badgesWrapper: {
    marginBottom: 10,
    alignItems: "center",
  },
  btn: {
    display: "inline-flex",
    fontWeight: 500,
    columnGap: "7px",
    alignItems: "center",
    padding: "6px 12px",
    height: 36,
    boxSizing: "border-box",
    borderRadius: "50px",
    border: `1px solid ${colors.LIGHT_GREY()}`
  },
  btnWrapper: {
    marginTop: 15,
    display: "flex",
    columnGap: "10px",
    justifyContent: "flex-end",
  },
  btnDots: {
    border: "none",
    fontSize: 22,
    borderRadius: "50px",
    color: colors.BLACK(1.0),
    padding: "6px 12px",
  }
})

export default DocumentHeader;

