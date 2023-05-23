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
import { breakpoints } from "~/config/themes/screen";
import Link from "next/link";
import PermissionNotificationWrapper from "../PermissionNotificationWrapper";

interface Props {
  document: GenericDocument;
  handleTip: Function;
}

const DocumentStickyHeader = ({ document, handleTip }: Props) => {
  const router = useRouter();
  const basePath = `/doc-v2/${router.query.documentType}/${router.query.documentId}/${router.query.documentSlug}`
  const isRootDocPage = basePath === router.asPath; 

  return (
    <div className={css(styles.stickyWrapper)}>
      <div className={css(styles.titleWrapper)}>
        <DocumentVote document={document} isHorizontal={true} />
        <div className={css(styles.title)}>
          {isRootDocPage
          ? (
            <span onClick={() => window.scroll(0,0)}>{document.title}</span>
          ) : (
            <Link style={{ color: "black", textDecoration: "none"}} href={basePath}>
              {document.title}
            </Link>            
          )}

        </div>
      </div>
      <div className={css(styles.actionWrapper)}>
        <IconButton
          variant="round"
          overrideStyle={[styles.smallScreenVote, styles.btn]}
          >
          <DocumentVote document={document} isHorizontal={true} />
        </IconButton>
        <PermissionNotificationWrapper
          modalMessage="edit document"
          permissionKey="UpdatePaper"
          loginRequired={true}
          onClick={() =>
            handleTip()
          }
          hideRipples={true}
        >
          <IconButton variant="round" overrideStyle={styles.btn}>
            <ResearchCoinIcon version={6} width={21} height={21} />
            <span>Tip</span>
          </IconButton>
        </PermissionNotificationWrapper>
        <Link href={basePath + "/conversation"}>
          <IconButton variant="round" overrideStyle={styles.btn}>
            <FontAwesomeIcon icon={faComments} />
            <span>{document.discussionCount}</span>
          </IconButton>
        </Link>        
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  titleWrapper: {
    display: "flex",
    columnGap: "15px",
    alignItems: "center",
    width: "100%",
    [`@media (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
  },
  title: {
    fontSize: 18,
    fontWeight: 500,
    textTransform: "capitalize",
    ":hover": {
      textDecoration: "underline",
      cursor: "pointer",
    },
  },
  stickyWrapper: {
    display: "flex",
    alignItems: "center",
    maxWidth: config.maxWidth,
    // justifyContent: "space-between",
    margin: "0 auto",
    padding: "15px 15px",
    [`@media (min-width: ${config.maxWidth})`]: {
      padding: "15px 0px",
    },
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
    justifyContent: "flex-end",
    [`@media (max-width: ${breakpoints.small.str})`]: {
      justifyContent: "center",
      width: "100%",
    },
  },
  smallScreenVote: {
    display: "none",
    [`@media (max-width: ${breakpoints.small.str})`]: {
      display: "flex",
    },
  },
  btn: {
    color: colors.BLACK(0.45),
    border: `1px solid ${colors.BLACK(0.45)}`,
  },
});

export default DocumentStickyHeader;
