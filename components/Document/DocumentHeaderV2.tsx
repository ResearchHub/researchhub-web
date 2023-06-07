import { StyleSheet, css } from "aphrodite";
import DocumentBadges from "./DocumentBadges";
import DocumentLineItems from "./DocumentLineItems";
import IconButton from "../Icons/IconButton";
import ResearchCoinIcon from "../Icons/ResearchCoinIcon";
import colors from "~/config/themes/colors";
import HorizontalTabBar from "~/components/HorizontalTabBar";
import { useRouter } from "next/router";
import { faEllipsis } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DocumentMetadata, GenericDocument, isPaper, isPost } from "./lib/types";
import DocumentVote from "./DocumentVote";
import PermissionNotificationWrapper from "../PermissionNotificationWrapper";
import { ModalActions } from "~/redux/modals";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef, useContext } from "react";
import { getTabs } from "./lib/tabbedNavigation";
import config from "~/components/Document/lib/config";
import DocumentStickyHeader from "./DocumentStickyHeader";
import Link from "next/link";
import GenericMenu, { MenuOption } from "../shared/GenericMenu";
import { flagGrmContent } from "../Flag/api/postGrmFlag";
import FlagButtonV2 from "../Flag/FlagButtonV2";
import { breakpoints } from "~/config/themes/screen";
import { LEFT_SIDEBAR_MIN_WIDTH } from "../Home/sidebar/RootLeftSidebar";
import { faPen } from "@fortawesome/pro-solid-svg-icons";
import { parseUser } from "~/config/types/root_types";
import { RootState } from "~/redux";
import { isEmpty } from "~/config/utils/nullchecks";
import { faFlag } from "@fortawesome/pro-solid-svg-icons";
import { Purchase } from "~/config/types/purchase";
import { DocumentContext } from "./lib/DocumentContext";

const PaperTransactionModal = dynamic(
  () => import("~/components/Modals/PaperTransactionModal")
);

interface Props {
  document: GenericDocument;
  metadata: DocumentMetadata | undefined;
}

const DocumentHeader = ({ document: doc, metadata }: Props) => {
  const documentContext = useContext(DocumentContext);
  const router = useRouter();
  const dispatch = useDispatch();
  const headerWrapperRef = useRef<HTMLDivElement>(null);
  const [stickyVisible, setStickyVisible] = useState<boolean>(false);
  const [stickyOffset, setStickyOffset] = useState<number>(0);
  const currentUser = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );

  const tabs = getTabs({
    router,
    document: doc,
    metadata,
  });

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
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const options:Array<MenuOption> = [
    ...(isPaper(doc) ? [{
      label: "Edit metadata",
      icon: <FontAwesomeIcon icon={faPen} />,
      value: "edit-metadata",
      onClick: () => {
        alert('implement me')
      }
    }] : []),
    ...(isPost(doc) && doc.authors.some(author => author.id === currentUser?.authorProfile.id) ? [{
      label: "Edit",
      icon: <FontAwesomeIcon icon={faPen} />,
      value: "edit-content",
      onClick: () => {
        alert('implement me')
      }
    }] : []),    
    {
      value: "flag",
      preventDefault: true,
      html: (
        <FlagButtonV2
          onSubmit={(flagReason, renderErrorMsg, renderSuccessMsg) => {
            flagGrmContent({
              contentID: doc.id,
              contentType: doc.apiDocumentType,
              flagReason,
              onError: renderErrorMsg,
              onSuccess: renderSuccessMsg,
            });
          }}
        >
          <div style={{display: "flex"}}>
            <div style={{width: 30, boxSizing: "border-box"}}><FontAwesomeIcon icon={faFlag} /></div>
            
            <div>Flag content</div>
          </div>
        </FlagButtonV2>
      ),
    },
  ];

  return (
    <div ref={headerWrapperRef} className={css(styles.headerRoot)}>
      <div
        className={css(
          styles.stickyHeader,
          stickyVisible && styles.stickyVisible
        )}
        style={{ width: `calc(100% - ${stickyOffset}px)` }}
      >
        <DocumentStickyHeader
          document={doc}
          metadata={metadata}
          handleTip={() =>
            dispatch(ModalActions.openPaperTransactionModal(true))
          }
        />
      </div>
      <div className={css(styles.headerWrapper)}>
        <div className={css(styles.headerContentWrapper)}>
          <div>
            <div className={css(styles.badgesWrapper)}>
              <DocumentBadges document={doc} metadata={metadata} />
            </div>
            <div className={css(styles.titleWrapper)}>
              <div className={css(styles.voteWrapper)}>
                {/* <DocumentVote document={doc} /> */}
              </div>
              <h1 className={css(styles.title)}>{doc.title}</h1>
            </div>
            <div className={css(styles.lineItemsWrapper)}>
              <DocumentLineItems document={doc} />
            </div>
            <div className={css(styles.btnsWrapper)}>
              <div className={css(styles.voteWrapperForSmallScreen)}>
                <IconButton variant="round">
                  {/* <DocumentVote document={doc} isHorizontal={true} /> */}
                </IconButton>
              </div>

              <div className={css(styles.btnGroup)}>
                <PermissionNotificationWrapper
                  modalMessage="edit document"
                  permissionKey="UpdatePaper"
                  loginRequired={true}
                  onClick={() =>
                    dispatch(ModalActions.openPaperTransactionModal(true))
                  }
                  hideRipples={true}
                >
                  <IconButton variant="round">
                    <ResearchCoinIcon version={6} width={21} height={21} />
                    <span>Tip Authors</span>
                  </IconButton>
                </PermissionNotificationWrapper>
                <GenericMenu options={options} width={150}>
                  <IconButton overrideStyle={styles.btnDots}>
                    <FontAwesomeIcon icon={faEllipsis} />
                  </IconButton>
                </GenericMenu>
              </div>
            </div>
            <div className={css(styles.tabsWrapper)}>
              <HorizontalTabBar tabs={tabs} />
            </div>
          </div>
        </div>

        <PaperTransactionModal
          // @ts-ignore
          paper={doc.raw}
          // @ts-ignore
          onTransactionCreate={(purchase:Purchase) => {
            // @ts-ignore
            documentContext.updateMetadata({
              ...metadata,
              purchases: [...metadata!.purchases, purchase],
            })
          }}
        />
      </div>
    </div>
  );
};

const VOTE_DISTANCE_FROM_LEFT = 50;
const styles = StyleSheet.create({
  headerRoot: {},
  title: {
    textTransform: "capitalize",
  },
  headerWrapper: {
    width: "100%",
    display: "flex",
    boxSizing: "border-box",
    justifyContent: "center",
    borderBottom: `2px solid ${config.border}`,
  },
  lineItemsWrapper: {
    [`@media (max-width: ${config.maxWidth + LEFT_SIDEBAR_MIN_WIDTH}px)`]: {
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
    [`@media (max-width: ${config.maxWidth + LEFT_SIDEBAR_MIN_WIDTH}px)`]: {
      paddingLeft: 15,
      paddingRight: 15,
    },
  },
  tabsWrapper: {
    borderTop: `1px solid #E9EAEF`,
    [`@media (max-width: ${config.maxWidth + LEFT_SIDEBAR_MIN_WIDTH}px)`]: {
      paddingLeft: 15,
      paddingRight: 15,
    },
  },
  titleWrapper: {
    position: "relative",
    [`@media (max-width: ${config.maxWidth + LEFT_SIDEBAR_MIN_WIDTH}px)`]: {
      paddingLeft: 15,
      paddingRight: 15,
    },
  },
  stickyHeader: {
    position: "fixed",
    display: "none",
    // bottom: 0,
    zIndex: 100,
    paddingBottom: 0,
    top: 0,
    // background: "rgb(249, 249, 252)",
    background: "white",
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 6px",
    borderBottom: `1px solid #E9EAEF`,
    // borderTop: `1px solid #E9EAEF`,
  },
  stickyVisible: {
    display: "block",
  },
  voteWrapper: {
    position: "absolute",
    left: -VOTE_DISTANCE_FROM_LEFT,
    top: -28,
  },
  voteWrapperForSmallScreen: {
    display: "none",
    [`@media (max-width: ${
      config.maxWidth + VOTE_DISTANCE_FROM_LEFT + LEFT_SIDEBAR_MIN_WIDTH
    }px)`]: {
      display: "block",
    },
  },
  btnGroup: {
    display: "flex",
    columnGap: "10px",
  },
  btnsWrapper: {
    marginTop: 15,
    marginBottom: 15,
    display: "flex",
    columnGap: "15px",
    justifyContent: "flex-end",
    [`@media (max-width: ${config.maxWidth}px)`]: {
      justifyContent: "flex-start",
      paddingLeft: 15,
      paddingRight: 15,
    },
  },
  btnDots: {
    border: "none",
    fontSize: 22,
    borderRadius: "50px",
    color: colors.BLACK(1.0),
    background: colors.LIGHTER_GREY(),
    padding: "6px 12px",
    ":hover": {
      background: colors.DARKER_GREY(0.2),
      transition: "0.2s"
    }
  },
});

export default DocumentHeader;
