import { StyleSheet, css } from "aphrodite";
import DocumentBadges from "./DocumentBadges";
import DocumentLineItems from "./DocumentLineItems";
import IconButton from "../Icons/IconButton";
import ResearchCoinIcon from "../Icons/ResearchCoinIcon";
import colors from "~/config/themes/colors";
import HorizontalTabBar from "~/components/HorizontalTabBar";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  DocumentMetadata,
  GenericDocument,
  Paper,
  isPaper,
  isPost,
} from "./lib/types";
import DocumentVote from "./DocumentVote";
import PermissionNotificationWrapper from "../PermissionNotificationWrapper";
import { ModalActions } from "~/redux/modals";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef, useContext } from "react";
import { getTabs } from "./lib/tabbedNavigation";
import config from "~/components/Document/lib/config";
import DocumentStickyHeader from "./DocumentStickyHeader";
import { LEFT_SIDEBAR_MIN_WIDTH } from "../Home/sidebar/RootLeftSidebar";
import { faPen } from "@fortawesome/pro-light-svg-icons";
import { parseUser } from "~/config/types/root_types";
import { RootState } from "~/redux";
import { isEmpty, isNullOrUndefined } from "~/config/utils/nullchecks";
import { Purchase } from "~/config/types/purchase";
import { DocumentContext } from "./lib/DocumentContext";
import useCacheControl from "~/config/hooks/useCacheControl";
import PaperMetadataModal from "./PaperMetadataModal";
import DocumentOptions from "./DocumentOptions";
import DocumentHubs from "./lib/DocumentHubs";
import SaveToRefManager from "./lib/SaveToRefManager";
import {
  ReferenceProjectsUpsertContextProvider,
  useReferenceProjectUpsertContext,
} from "~/components/ReferenceManager/references/reference_organizer/context/ReferenceProjectsUpsertContext";
import DocumentPageTutorial from "./lib/DocumentPageTutorial";
import FundraiseCard from "../Fundraise/FundraiseCard";
import LinkToPublicPage from "../LinkToPublicPage";
import { breakpoints } from "~/config/themes/screen";
const PaperTransactionModal = dynamic(
  () => import("~/components/Modals/PaperTransactionModal")
);

interface Props {
  document: GenericDocument;
  metadata: DocumentMetadata;
  noLineItems?: boolean;
  noHorizontalTabBar?: boolean;
  headerContentWrapperClass?: any;
  referenceManagerView?: boolean;
}

const DocumentHeader = ({
  document: doc,
  metadata,
  noLineItems,
  noHorizontalTabBar,
  headerContentWrapperClass,
  referenceManagerView,
}: Props) => {
  const documentContext = useContext(DocumentContext);
  const router = useRouter();
  const dispatch = useDispatch();
  const { revalidateDocument } = useCacheControl();
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

  return (
    <div ref={headerWrapperRef} className={css(styles.headerRoot)}>
      <DocumentPageTutorial />
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
        <div
          className={
            css(styles.headerContentWrapper) + " " + headerContentWrapperClass
          }
        >
          <div>
            <div className={css(styles.badgesWrapper)}>
              <DocumentBadges document={doc} metadata={metadata} />
            </div>
            <div className={css(styles.titleWrapper)}>
              <div className={css(styles.voteWrapper)}>
                <DocumentVote
                  id={doc?.id}
                  metadata={metadata}
                  score={metadata?.score}
                  apiDocumentType={doc.apiDocumentType}
                  userVote={metadata.userVote}
                />
              </div>
              <h1 className={css(styles.title)}>{doc.title}</h1>
            </div>
            {metadata.hubs.length > 0 && (
              <div className={css(styles.hubsWrapper)}>
                <DocumentHubs
                  hubs={metadata.hubs}
                  containerStyle={styles.hubsContainerOverride}
                />
              </div>
            )}
            {
              <div className={css(styles.lineItemsWrapper)}>
                <div className={css(styles.lineItems)}>
                  <DocumentLineItems
                    document={doc}
                    id={doc?.id}
                    slug={doc?.raw?.slug}
                  />
                </div>

                {!noLineItems && (
                  <div
                    className={css(
                      styles.actionWrapper,
                      styles.largeScreenActions
                    )}
                  >
                    <ReferenceProjectsUpsertContextProvider>
                      <SaveToRefManager
                        contentType={"paper"}
                        doc={doc}
                        contentId={doc?.unifiedDocument?.document?.id}
                        unifiedDocumentId={doc?.unifiedDocument?.id}
                      />
                    </ReferenceProjectsUpsertContextProvider>
                    {/* Don't show "Tip" if it's a preregistration */}
                    {!(isPost(doc) && doc.postType === "preregistration") && (
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
                          <span>Tip</span>
                        </IconButton>
                      </PermissionNotificationWrapper>
                    )}
                    <DocumentOptions document={doc} metadata={metadata} />
                  </div>
                )}
                {referenceManagerView && (
                  <div
                    className={css(
                      styles.actionWrapper,
                      styles.largeScreenActions
                    )}
                  >
                    <LinkToPublicPage
                      type={doc?.unifiedDocument?.documentType}
                      id={doc?.id}
                      target={"_blank"}
                      slug={doc?.unifiedDocument?.document?.slug}
                    />
                  </div>
                )}
              </div>
            }
            <div className={css(styles.smallScreenActions)}>
              <div className={css(styles.voteWrapperForSmallScreen)}>
                <DocumentVote
                  id={doc?.id}
                  metadata={metadata}
                  score={metadata?.score}
                  iconButton={true}
                  apiDocumentType={doc?.apiDocumentType}
                  userVote={metadata?.userVote}
                  isHorizontal={true}
                />
              </div>
              {!noLineItems && (
                <div className={css(styles.actionWrapper)}>
                  {/* Don't show "Tip" if it's a preregistration */}
                  {!(isPost(doc) && doc.postType === "preregistration") && (
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
                        <span>Tip</span>
                      </IconButton>
                    </PermissionNotificationWrapper>
                  )}
                  <ReferenceProjectsUpsertContextProvider>
                    <SaveToRefManager
                      contentType={"paper"}
                      doc={doc}
                      contentId={doc.unifiedDocument.document?.id}
                      unifiedDocumentId={doc.unifiedDocument.id}
                    />
                  </ReferenceProjectsUpsertContextProvider>
                  <DocumentOptions document={doc} metadata={metadata} />
                </div>
              )}
              {referenceManagerView && (
                <div
                  className={css(styles.actionWrapper, styles.linkToPublicPage)}
                >
                  <LinkToPublicPage
                    type={doc?.unifiedDocument?.documentType}
                    id={doc?.id}
                    target={"_blank"}
                    slug={doc?.unifiedDocument?.document?.slug}
                  />
                </div>
              )}
            </div>
            {!isNullOrUndefined(metadata.fundraise) && (
              <div className={css(styles.fundraiseWrapper)}>
                <FundraiseCard
                  fundraise={metadata.fundraise!}
                  onUpdateFundraise={(f) => {
                    documentContext.updateMetadata({
                      ...metadata,
                      fundraise: {
                        ...metadata.fundraise!,
                        ...f,
                      },
                    });

                    revalidateDocument();
                  }}
                />
              </div>
            )}
            {!noHorizontalTabBar && (
              <div className={css(styles.tabsWrapper)}>
                <HorizontalTabBar tabs={tabs} />
              </div>
            )}
          </div>
        </div>

        <PaperTransactionModal
          // @ts-ignore
          paper={isPaper(doc) ? doc.raw : undefined}
          // @ts-ignore
          post={isPost(doc) ? doc.raw : undefined}
          // @ts-ignore
          onTransactionCreate={(purchase: Purchase) => {
            // @ts-ignore
            documentContext.updateMetadata({
              ...metadata,
              purchases: [...metadata!.purchases, purchase],
            });

            revalidateDocument();
          }}
        />
      </div>
    </div>
  );
};

const VOTE_DISTANCE_FROM_LEFT = 50;
const BUFFER = 40;
const SMALL_SCREEN_BREAKPOINT =
  config.width + VOTE_DISTANCE_FROM_LEFT + LEFT_SIDEBAR_MIN_WIDTH + BUFFER;
const styles = StyleSheet.create({
  hubsContainerOverride: {
    flexWrap: "wrap",
  },
  headerRoot: {},
  title: {
    textTransform: "capitalize",
    marginBottom: 0,
  },
  lineItems: {},
  headerWrapper: {
    width: "100%",
    display: "flex",
    boxSizing: "border-box",
    justifyContent: "center",
    borderBottom: `1px solid ${config.border}`,

    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      paddingBottom: 25,
    },

    [`@media only screen and (min-width: ${breakpoints.desktop.str})`]: {
      minHeight: 130,
    },
  },
  lineItemsWrapper: {
    display: "flex",
    justifyContent: "space-between",
    [`@media (max-width: ${SMALL_SCREEN_BREAKPOINT}px)`]: {
      paddingLeft: 15,
      paddingRight: 15,
    },
  },
  fundraiseWrapper: {
    marginTop: 20,
  },
  headerContentWrapper: {
    maxWidth: config.width,
    width: "100%",
  },
  badgesWrapper: {
    marginBottom: 10,
    alignItems: "center",
    position: "relative",
    [`@media (max-width: ${SMALL_SCREEN_BREAKPOINT}px)`]: {
      paddingLeft: 15,
      paddingRight: 15,
    },
  },
  tabsWrapper: {
    borderTop: `1px solid #E9EAEF`,
    marginTop: 20,
    [`@media (max-width: ${SMALL_SCREEN_BREAKPOINT}px)`]: {
      paddingLeft: 15,
      paddingRight: 15,
    },
  },
  hubsWrapper: {
    marginBottom: 10,
    [`@media (max-width: ${SMALL_SCREEN_BREAKPOINT}px)`]: {
      paddingLeft: 15,
      paddingRight: 15,
    },
  },
  titleWrapper: {
    marginBottom: 10,
    position: "relative",
    [`@media (max-width: ${SMALL_SCREEN_BREAKPOINT}px)`]: {
      paddingLeft: 15,
      paddingRight: 15,
    },
  },
  stickyHeader: {
    position: "fixed",
    display: "none",
    // bottom: 0,
    zIndex: 100,
    padding: "6.5px 0px",
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
    top: 0,
    [`@media (max-width: ${SMALL_SCREEN_BREAKPOINT}px)`]: {
      display: "none",
    },
  },
  voteWrapperForSmallScreen: {},
  actionWrapper: {
    display: "flex",
    columnGap: "10px",
    alignItems: "flex-end",
  },
  linkToPublicPage: {
    alignItems: "center",
    marginLeft: "auto",
  },
  smallScreenActions: {
    marginTop: 15,
    columnGap: "10px",
    justifyContent: "flex-end",
    display: "none",
    [`@media (max-width: ${SMALL_SCREEN_BREAKPOINT}px)`]: {
      display: "flex",
      justifyContent: "flex-start",
      paddingLeft: 15,
      paddingRight: 15,
    },
  },
  largeScreenActions: {
    display: "flex",
    [`@media (max-width: ${SMALL_SCREEN_BREAKPOINT}px)`]: {
      display: "none",
    },
  },
  btnDots: {
    fontSize: 22,
    borderRadius: "50px",
    color: colors.BLACK(1.0),
    background: colors.LIGHTER_GREY(),
    border: `1px solid ${colors.LIGHTER_GREY()}`,
    padding: "6px 12px",
    ":hover": {
      background: colors.DARKER_GREY(0.2),
      transition: "0.2s",
    },
  },
});

export default DocumentHeader;
