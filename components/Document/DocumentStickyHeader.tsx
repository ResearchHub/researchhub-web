import { GenericDocument } from "./lib/types";
import { StyleSheet, css } from "aphrodite";
import { useRouter } from "next/router";
import DocumentVote from "./DocumentVote";
import IconButton from "../Icons/IconButton";
import ResearchCoinIcon from "../Icons/ResearchCoinIcon";
import colors from "~/config/themes/colors";
import config from "./lib/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/pro-solid-svg-icons";

interface Props {
  document: GenericDocument;
}

const DocumentStickyHeader = ({ document }: Props) => {
  const router = useRouter();

  return (
    <div className={css(styles.stickyWrapper)}>
      <div className={css(styles.titleWrapper)}>
        <DocumentVote document={document} isHorizontal={true} />
        <div className={css(styles.title)}>
          {document.title}
        </div>
      </div>
      <div className={css(styles.actionWrapper)}>
        <IconButton overrideStyle={styles.btn}>
          <ResearchCoinIcon version={6} width={21} height={21} />
          <span>Tip</span>
        </IconButton>
        <IconButton overrideStyle={styles.btn}>
          <FontAwesomeIcon icon={faComments} />
          <span>{document.discussionCount}</span>
        </IconButton>
      </div>
    </div>
  )
}

const styles = StyleSheet.create({
  titleWrapper: {
    display: "flex",
    columnGap: "15px",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    textTransform: "capitalize",
    ":hover": {
      textDecoration: "underline",
      cursor: "pointer",
    }
  },  
  stickyWrapper: {
    display: "flex",
    alignItems: "center",
    maxWidth: config.maxWidth,
    justifyContent: "space-between",
    margin: "0 auto",
    padding: "15px 0px",
  },
  tabsWrapper: {
    marginLeft: "25px",
  },
  tab: {
    paddingTop: "1.2rem",
    paddingBottom: "1.2rem",
  },
  navWrapper: {
    display: "flex",
  },
  actionWrapper: {
    display: "flex",
    columnGap: "10px",
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
})

export default DocumentStickyHeader