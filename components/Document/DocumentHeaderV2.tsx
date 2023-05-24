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
import { GenericDocument, isPaper } from "./lib/types";
import DocumentVote from "./DocumentVote";
import PermissionNotificationWrapper from "../PermissionNotificationWrapper";
import { ModalActions } from "~/redux/modals";
import { useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { getTabs } from "./lib/tabbedNavigation";
import config from "~/components/Document/lib/config";
import DocumentStickyHeader from "./DocumentStickyHeader";
import Link from "next/link";
import GenericMenu from "../shared/GenericMenu";
import { flagGrmContent } from "../Flag/api/postGrmFlag";
import FlagButtonV2 from "../Flag/FlagButtonV2";

const PaperTransactionModal = dynamic(
  () => import("~/components/Modals/PaperTransactionModal")
);

interface Props {
  document: GenericDocument;
}

const DocumentHeader = ({ document: doc }: Props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const headerWrapperRef = useRef<HTMLDivElement>(null);
  const [stickyVisible, setStickyVisible] = useState<boolean>(false);
  const [stickyOffset, setStickyOffset] = useState<number>(0);
  const tabs = getTabs({ router, document: doc });

  useEffect(() => {
    const handleScroll = () => {
      const sidebarEl = document.querySelector(".root-left-sidebar");
      const offset = sidebarEl?.getBoundingClientRect().right || 0;
      setStickyOffset(offset);

      const headerWrapperBottom =
        headerWrapperRef.current?.getBoundingClientRect().bottom;
      if (headerWrapperBottom !== undefined && headerWrapperBottom <= 0) {
        setStickyVisible(true);
      } else {
        setStickyVisible(false);
        console.log("hide sticky");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const options = [
    {
      label: "Flag content",
      value: "flag",
      html: (
        <FlagButtonV2
          modalHeaderText="Flagging"
          flagIconOverride={styles.flagButton}
          onSubmit={(flagReason, renderErrorMsg, renderSuccessMsg) => {
            flagGrmContent({
              contentID: doc.id,
              contentType: doc.apiDocumentType,
              flagReason,
              onError: renderErrorMsg,
              onSuccess: renderSuccessMsg,
            });
          }}
        />
      ),
    },
  ];

  const pdfUrl = isPaper(doc) && doc.formats.find((f) => f.type === "pdf")?.url;
  return (
    <div ref={headerWrapperRef} className={css(styles.headerRoot)}>
      <div
        className={css(
          styles.stickyHeader,
          stickyVisible && styles.stickyVisible
        )}
        style={{ width: `calc(100% - ${stickyOffset}px)` }}
      >
        <DocumentStickyHeader document={doc} />
      </div>
      <div className={css(styles.headerWrapper)}>
        <div className={css(styles.headerContentWrapper)}>
          <div>
            <div className={css(styles.badgesWrapper)}>
              <DocumentBadges document={doc} />
            </div>
            <div className={css(styles.titleWrapper)}>
              <div className={css(styles.voteWrapper)}>
                <DocumentVote document={doc} />
              </div>
              <h1 className={css(styles.title)}>{doc.title}</h1>
            </div>
            <DocumentLineItems document={doc} />
            <div className={css(styles.btnWrapper)}>
              <PermissionNotificationWrapper
                modalMessage="edit document"
                permissionKey="UpdatePaper"
                loginRequired={true}
                onClick={() =>
                  dispatch(ModalActions.openPaperTransactionModal(true))
                }
                hideRipples={true}
              >
                <IconButton overrideStyle={styles.btn}>
                  <ResearchCoinIcon version={6} width={21} height={21} />
                  <span>Tip Authors</span>
                </IconButton>
              </PermissionNotificationWrapper>
              {pdfUrl && (
                <Link
                  href={pdfUrl}
                  download={true}
                  target="_blank"
                  style={{ textDecoration: "none" }}
                >
                  <IconButton overrideStyle={styles.btn}>
                    <FontAwesomeIcon icon={faArrowDownToBracket} />
                    <span>PDF</span>
                  </IconButton>
                </Link>
              )}
              <GenericMenu options={options}>
                <IconButton overrideStyle={styles.btnDots}>
                  <FontAwesomeIcon icon={faEllipsis} />
                </IconButton>
              </GenericMenu>
            </div>
            <div>
              <HorizontalTabBar tabs={tabs} />
            </div>
          </div>
        </div>

        <PaperTransactionModal
          // @ts-ignore
          paper={doc.raw}
          // @ts-ignore
          updatePaperState={() => alert("Implement me")}
        />
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  headerRoot: {

  },
  title: {
    textTransform: "capitalize",
  },
  headerWrapper: {
    width: "100%",
    display: "flex",
    boxSizing: "border-box",
    justifyContent: "center",
    borderBottom: `2px solid ${config.border}`,
    [`@media (max-width: ${config.maxWidth}px)`]: {
      paddingLeft: 15,
      paddingRight: 15,
    },
  },
  headerContentWrapper: {
    maxWidth: config.maxWidth,
    width: "100%",
  },
  badgesWrapper: {
    marginBottom: 10,
    alignItems: "center",
    position: "relative",
  },
  titleWrapper: {},
  stickyHeader: {
    position: "fixed",
    display: "none",
    top: 0,
    zIndex: 100,
    background: "linear-gradient(to top,rgba(255,255,255,.75) 50%,#fff)",
    borderBottom: `1px solid #E9EAEF`,
    boxShadow: `0px 3px 4px rgba(0, 0, 0, 0.02)`,
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
    border: `1px solid ${colors.LIGHT_GREY()}`,
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
  },
});

export default DocumentHeader;
