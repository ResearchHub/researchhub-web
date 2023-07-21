import {
  DocumentMetadata,
  GenericDocument,
  isPaper,
  isPost,
} from "./lib/types";
import { StyleSheet, css } from "aphrodite";
import { useRouter } from "next/router";
import DocumentVote from "./DocumentVote";
import IconButton from "../Icons/IconButton";
import ResearchCoinIcon from "../Icons/ResearchCoinIcon";
import colors from "~/config/themes/colors";
import config from "./lib/config";
import { breakpoints } from "~/config/themes/screen";
import Link from "next/link";
import PermissionNotificationWrapper from "../PermissionNotificationWrapper";
import HorizontalTabBar from "../HorizontalTabBar";
import { getTabs } from "./lib/tabbedNavigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/pro-regular-svg-icons";
import BackBtn from "../shared/BackBtn";

interface Props {
  document: GenericDocument;
  handleTip: Function;
  metadata: DocumentMetadata;
}

const DocumentStickyHeader = ({ document, handleTip, metadata }: Props) => {
  const router = useRouter();
  const tabs = getTabs({ router, document, metadata });

  return (
    <div className={css(styles.stickyWrapper)}>
      <div className={css(styles.backBtnWrapper)}>
        <BackBtn label={isPaper(document) ? "Paper" : "Post"} href="/" />
      </div>
      <div className={css(styles.sticky)}>
        <DocumentVote
          id={document.id}
          metadata={metadata}
          score={metadata.score}
          apiDocumentType={document.apiDocumentType}
          userVote={metadata.userVote}
          isHorizontal={true}
        />
        <div className={css(styles.tabsWrapper)}>
          <HorizontalTabBar tabs={tabs} />
        </div>
        <div className={css(styles.actionWrapper)}>
          <PermissionNotificationWrapper
            modalMessage="edit document"
            permissionKey="UpdatePaper"
            loginRequired={true}
            onClick={() => handleTip()}
            hideRipples={true}
          >
            <IconButton variant="round" overrideStyle={styles.btn}>
              <ResearchCoinIcon version={6} width={21} height={21} />
              <span>Tip</span>
            </IconButton>
          </PermissionNotificationWrapper>
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  backBtnWrapper: {
    position: "absolute",
    left: 28,
    top: 10,
    fontWeight: 500,
    fontSize: 22,
    [`@media (max-width: ${breakpoints.bigDesktop.str})`]: {
      display: "none",
    },
  },
  stickyWrapper: {
    position: "relative",
  },
  backButton: {
    border: 0,
    marginRight: 3,
  },
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
  sticky: {
    display: "flex",
    alignItems: "center",
    maxWidth: config.width,
    margin: "0 auto",
    [`@media (max-width: ${config.width}px)`]: {
      padding: "5px 5px 0px 10px",
      maxWidth: "100vw",
    },
  },
  tabsWrapper: {
    marginLeft: "25px",
    overflowX: "scroll",
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
    marginLeft: "auto",
    justifyContent: "flex-end",
    [`@media (max-width: ${breakpoints.small.str})`]: {
      display: "none",
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
  },
});

export default DocumentStickyHeader;
