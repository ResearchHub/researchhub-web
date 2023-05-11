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
import { GenericDocument } from "./lib/types";
import DocumentVote from "./DocumentVote";


interface Props {
  document: GenericDocument;
}

const DocumentHeader = ({ document }: Props) => {
  return (
    <div>
      <div className={css(styles.badgesWrapper)}>
        <DocumentBadges document={document} />
      </div>
      <div className={css(styles.titleWrapper)}>
        <div className={css(styles.voteWrapper)}>
          <DocumentVote document={document} />
        </div>
        <h1>{document.title}</h1>
      </div>
      <DocumentLineItems document={document} />
      <div className={css(styles.btnWrapper)}>
        <IconButton overrideStyle={styles.btn} onClick={() => null}>
          <ResearchCoinIcon version={6} width={21} height={21} />
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
  titleWrapper: {
    position: "relative",
  },
  voteWrapper: {
    position: "absolute",
    left: -48,
    top: -28,
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

