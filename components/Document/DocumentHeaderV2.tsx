import { StyleSheet, css } from "aphrodite";
import DocumentBadges from "./DocumentBadges";
import DocumentLineItems from "./DocumentLineItems";
import IconButton from "../Icons/IconButton";
import ResearchCoinIcon from "../Icons/ResearchCoinIcon";
import colors from "~/config/themes/colors";
import HorizontalTabBar from "~/components/HorizontalTabBar";
import { useRouter } from "next/router";
import { faArrowDownToBracket } from "@fortawesome/pro-solid-svg-icons";
import { faEllipsis } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GenericDocument } from "./lib/types";
import DocumentVote from "./DocumentVote";
import PermissionNotificationWrapper from "../PermissionNotificationWrapper";
import { ModalActions } from "~/redux/modals";
import { useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { getTabs } from "./lib/tabbedNavigation";
import config from "~/components/Document/lib/config";

const PaperTransactionModal = dynamic(() =>
  import("~/components/Modals/PaperTransactionModal")
);

interface Props {
  document: GenericDocument;
}

const DocumentHeader = ({ document }: Props) => {

  const router = useRouter();
  const dispatch = useDispatch();
  const headerWrapperRef = useRef<HTMLDivElement>(null);
  const [stickyVisible, setStickyVisible] = useState(false);
  const tabs = getTabs({ router, document });

  useEffect(() => {
    const handleScroll = () => {
      const headerWrapperBottom = headerWrapperRef.current?.getBoundingClientRect().bottom;
      if (headerWrapperBottom !== undefined && headerWrapperBottom <= 0) {
        setStickyVisible(true);
        console.log('sticky')
      } else {
        console.log('hide sticky')
        setStickyVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div ref={headerWrapperRef} style={{ width: "100%" }}>
      <div className={css(styles.stickyHeader, stickyVisible && styles.stickyVisible)}>
      </div>
      <div className={css(styles.headerWrapper)} >
        <div className={css(styles.headerContentWrapper)} >
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

              <PermissionNotificationWrapper
                modalMessage="edit document"
                permissionKey="UpdatePaper"
                loginRequired={true}
                onClick={() => dispatch(ModalActions.openPaperTransactionModal(true))}
                hideRipples={true}
              >
                <IconButton overrideStyle={styles.btn}>
                  <ResearchCoinIcon version={6} width={21} height={21} />
                  <span>Tip Authors</span>
                </IconButton>
              </PermissionNotificationWrapper>
              <IconButton overrideStyle={styles.btn} onClick={() => null}>
                <FontAwesomeIcon icon={faArrowDownToBracket} />
                <span>PDF</span>
              </IconButton>
              <IconButton overrideStyle={styles.btnDots} onClick={() => null}>
                <FontAwesomeIcon icon={faEllipsis} />
              </IconButton>
            </div>
            <div>
              <HorizontalTabBar tabs={tabs} />
            </div>

          </div>
        </div>

        <PaperTransactionModal
          // @ts-ignore 
          paper={document.raw}
          // @ts-ignore
          updatePaperState={() => alert("Implement me")}
        />
      </div>
    </div>
  )
}

const styles = StyleSheet.create({
  headerWrapper: {
    display: "flex",
    justifyContent: "center",
    borderBottom: `2px solid ${config.border}`,
  },
  headerContentWrapper: {
    width: config.maxWidth,
  },
  badgesWrapper: {
    marginBottom: 10,
    alignItems: "center",
    position: "relative",
  },
  titleWrapper: {
  },
  stickyHeader: {
    position: "fixed",
    display: "none",
    top: 0,
    width: "100%",
    zIndex: 100,
    minHeight: 75,
    background: "red",
    transition: "opacity 0.5s ease-in-out",
  },
  stickyVisible: {
    display: "block",
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

