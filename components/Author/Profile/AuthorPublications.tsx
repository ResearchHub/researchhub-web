import {
  PaginatedPublicationResponse,
  fetchAuthorPublications,
  parsePublicationResponse,
  removePublicationFromAuthorProfile,
} from "~/components/Author/lib/api";
import { css, StyleSheet } from "aphrodite";
import { useEffect, useState } from "react";
import {
  UnifiedCard,
} from "~/components/UnifiedDocFeed/utils/getDocumentCard";
import AddPublicationsModal from "~/components/Publication/AddPublicationsModal";
import { ROUTES as WS_ROUTES } from "~/config/ws";
import { useSelector, connect, useDispatch } from "react-redux";
import Button from "~/components/Form/Button";
import { ID, parseAuthorProfile, parseUser } from "~/config/types/root_types";
import { RootState } from "~/redux";
import { filterNull, isEmpty } from "~/config/utils/nullchecks";
import UnifiedDocFeedCardPlaceholder from "~/components/UnifiedDocFeed/UnifiedDocFeedCardPlaceholder";
import withWebSocket from "~/components/withWebSocket";
import {
  Notification,
  parseNotification,
} from "~/components/Notifications/lib/types";
import { authorProfileContext } from "../lib/AuthorProfileContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/pro-light-svg-icons";
import {
  RESEARCHHUB_POST_DOCUMENT_TYPES,
  getFEUnifiedDocType,
} from "~/config/utils/getUnifiedDocType";
import FeedCard from "../Tabs/FeedCard";
import ClaimRewardsModal from "~/components/ResearchCoin/ClaimRewardsModal";
import ClaimRewardsButton from "~/components/shared/ClaimRewardsButton";
import { getRewardsEligibilityInfo } from "~/components/ResearchCoin/lib/rewardsUtil";
import GenericMenu, { MenuOption } from "~/components/shared/GenericMenu";
import IconButton from "~/components/Icons/IconButton";
import { faEllipsis, faWarning } from "@fortawesome/pro-solid-svg-icons";
import colors from "~/config/themes/colors";
import { MessageActions } from "~/redux/message";
import { useAlert } from "react-alert";
import { Tooltip } from "@mui/material";
import VerifyIdentityModal from "~/components/Verification/VerifyIdentityModal";
import LoadMore from "~/components/shared/LoadMore";
import SearchEmpty from "~/components/Search/SearchEmpty";
import { breakpoints } from "~/config/themes/screen";

const AuthorPublications = ({
  initialPaginatedPublicationsResponse,
  wsResponse,
}: {
  initialPaginatedPublicationsResponse: PaginatedPublicationResponse;
  wsResponse: any;
}) => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const auth = useSelector((state: any) => state.auth);
  const currentUser = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [publicationsResponse, setPublicationsResponse] =
    useState<PaginatedPublicationResponse>(
      initialPaginatedPublicationsResponse
    );

  const [rewardsModalState, setRewardsModalState] = useState<{
    isOpen: boolean;
    paperId: string | null;
    paperTitle: string;
  }>({
    isOpen: false,
    paperId: null,
    paperTitle: "",
  });

  const resetRewardsModalState = () => {
    setRewardsModalState({
      isOpen: false,
      paperId: null,
      paperTitle: "",
    });
  };

  const [notificationsReceived, setNotificationsReceived] = useState<
    Notification[]
  >([]);
  const {
    fullAuthorProfile,
    reloadAuthorProfile,
    setFullAuthorProfile,
    setIsLoadingPublications,
    isLoadingPublications,
    summaryStats,
    setSummaryStats,
  } = authorProfileContext();

  useEffect(() => {
    if (!wsResponse) return;

    try {
      const incomingNotification = parseNotification(wsResponse);
      setNotificationsReceived([
        ...notificationsReceived,
        incomingNotification,
      ]);

      if (incomingNotification.type === "PUBLICATIONS_ADDED") {
        fetchAuthorPublications({ authorId: fullAuthorProfile.id })
          .then((response) => {
            setPublicationsResponse(parsePublicationResponse(response));
            setIsLoadingPublications(false);
            reloadAuthorProfile();
          })
          .catch(() => {
            setIsLoadingPublications(false);
          });
      }
    } catch (e) {
      console.error(`Failed to parse notification: ${e}`);
    }
  }, [wsResponse]);

  const unifiedDocumentData = publicationsResponse.results;

  const handleFetchMorePublications = () => {
    setIsFetchingMore(true);
    fetchAuthorPublications({
      authorId: fullAuthorProfile.id,
      nextUrl: publicationsResponse.next,
    })
      .then((response) => {

        const parsedNextResponse = parsePublicationResponse(response);

        parsedNextResponse.results = [
          ...publicationsResponse.results,
          ...parsedNextResponse.results,
        ];

        setPublicationsResponse(parsedNextResponse);
        setIsFetchingMore(false);
      })
      .catch(() => {
        setIsFetchingMore(false);
        dispatch(
          // @ts-ignore
          MessageActions.showMessage({
            error: true,
            show: true,
          })
        );
        dispatch(
          MessageActions.setMessage(
            "Failed to load more publications. Please try again later."
          )
        );
      });
  }

  return (
    <div>
      <ClaimRewardsModal
        paperId={rewardsModalState.paperId}
        isOpen={rewardsModalState.isOpen}
        paperTitle={rewardsModalState.paperTitle}
        closeModal={() => resetRewardsModalState()}
      />

      {isLoadingPublications && (
        <>
          {Array.from({ length: 10 }).map((_, i) => (
            <UnifiedDocFeedCardPlaceholder color="#efefef" key={i} />
          ))}
        </>
      )}

      <div className={css(styles.wrapper)}>
        <div className={css(styles.publicationsHeader)}>
          <div className={css(styles.sectionHeader)}>Publications</div>
          {!currentUser?.isVerified &&
            currentUser?.authorProfile?.id === fullAuthorProfile.id && (
              <>
                <Tooltip
                  componentsProps={{
                    tooltip: {
                      sx: {
                        fontSize: 14,
                        bgcolor: "#F3F3F3",
                        color: colors.BLACK(),
                      },
                    },
                  }}
                  title={
                    <div className={css(styles.addPublicationTooltip)}>
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignContent: "center",
                            alignItems: "center",
                            gap: 15,
                          }}
                        >
                          <FontAwesomeIcon
                            fontSize="26"
                            icon={faWarning}
                            color={colors.MEDIUM_GREY2()}
                          />
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            Identity verification is required to add
                            publications.
                            {/* @ts-ignore */}
                            <VerifyIdentityModal
                              // @ts-ignore legacy
                              wsUrl={WS_ROUTES.NOTIFICATIONS(auth?.user?.id)}
                              // @ts-ignore legacy
                              wsAuth
                            >
                              <div
                                style={{
                                  color: colors.NEW_BLUE(),
                                  textDecoration: "underline",
                                  cursor: "pointer",
                                  marginTop: 5,
                                }}
                              >
                                Learn more
                              </div>
                            </VerifyIdentityModal>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                >
                  <div>
                    <Button disabled={true}>
                      <FontAwesomeIcon
                        icon={faPlus}
                        style={{
                          marginRight: 10,
                          fontWeight: 400,
                          fontSize: 18,
                        }}
                      />
                      Add Publications
                    </Button>
                  </div>
                </Tooltip>
              </>
            )}
          {currentUser?.isVerified &&
            currentUser?.authorProfile?.id === fullAuthorProfile.id && (
              <AddPublicationsModal
                // @ts-ignore legacy hook
                wsUrl={WS_ROUTES.NOTIFICATIONS(auth?.user?.id)}
                wsAuth
              >
                <Button>
                  <FontAwesomeIcon
                    icon={faPlus}
                    style={{ marginRight: 10, fontWeight: 400, fontSize: 18 }}
                  />
                  Add Publications
                </Button>
              </AddPublicationsModal>
            )}
        </div>
        <div className={css(styles.contentWrapper)}>
          {unifiedDocumentData.length === 0 && (
            <div style={{ minHeight: 250, display: "flex", justifyContent: "center", width: "100%" }}>
              <SearchEmpty title={"No publications found."} subtitle={Boolean(currentUser?.authorProfile.id === fullAuthorProfile?.id) ? "Add your publications to see if they are eligible for rewards." : ""} />
            </div>
          )}
          {unifiedDocumentData.length > 0 && (


            <div>
              {filterNull(unifiedDocumentData).map(
                (uniDoc: any, arrIndex: number): UnifiedCard => {
                  const formattedDocType = getFEUnifiedDocType(
                    uniDoc?.document_type ?? null
                  );
                  const docTypeLabel =
                    (uniDoc?.document_type ?? "").toLowerCase() ?? null;
                  const formattedDocLabel =
                    docTypeLabel === "hypothesis"
                      ? "Meta-Study"
                      : docTypeLabel === "discussion"
                        ? "post"
                        : docTypeLabel;


                  const targetDoc = !RESEARCHHUB_POST_DOCUMENT_TYPES.includes(
                    formattedDocType
                  )
                    ? uniDoc.documents
                    : uniDoc.documents[0];
                  const docID = targetDoc.id;


                  const authors = targetDoc.authors.map(parseAuthorProfile);

                  const rewardEligibilityInfo = getRewardsEligibilityInfo({
                    authors,
                    fullAuthorProfile,
                    targetDoc,
                    isOpenAccess: targetDoc.is_open_access,
                  });

                  const showDocControls =
                    currentUser?.authorProfile?.id === fullAuthorProfile.id;

                  const menuOptions = [
                    {
                      label: "Remove",
                      icon: <FontAwesomeIcon icon={faTrash} />,
                      value: "remove-from-feed",
                      onClick: () => {
                        alert.show({
                          // @ts-ignore
                          text: <div>{`Remove paper from your profile?`}</div>,
                          buttonText: "Yes",
                          onClick: async () => {
                            removePublicationFromAuthorProfile({
                              authorId: fullAuthorProfile.id as ID,
                              paperIds: [targetDoc.id] as ID[],
                            })
                              .then((response: any) => {
                                const indexOfPublication =
                                  publicationsResponse.results.findIndex(
                                    (publication) => publication.id === uniDoc.id
                                  );
                                publicationsResponse.results.splice(
                                  indexOfPublication,
                                  1
                                );
                                publicationsResponse.total =
                                  publicationsResponse.total - 1;
                                const updatedResponse = {
                                  ...publicationsResponse,
                                };

                                summaryStats.worksCount = summaryStats.worksCount - 1
                                setPublicationsResponse(updatedResponse);
                                setSummaryStats({ ...summaryStats });
                              })
                              .catch(() => {
                                dispatch(
                                  // @ts-ignore
                                  MessageActions.showMessage({
                                    error: true,
                                    show: true,
                                  })
                                );
                                dispatch(
                                  MessageActions.setMessage(
                                    "Failed to remove publication. Please try again."
                                  )
                                );
                              });
                          },
                        });
                      },
                    },
                  ];

                  return (
                    <div className={css(styles.wrapper)} key={`doc-${docID}`}>
                      {showDocControls && (
                        <div className={css(styles.docControls)}>
                          <ClaimRewardsButton
                            handleClick={() => {
                              setRewardsModalState({
                                paperId: targetDoc.id,
                                paperTitle: targetDoc.title,
                                isOpen: true,
                              });
                            }}
                            rewardEligibilityInfo={rewardEligibilityInfo}
                          />

                          <GenericMenu
                            softHide={true}
                            options={menuOptions}
                            width={200}
                            id={"options-for-doc-" + docID}
                            direction="bottom-right"
                          >
                            <IconButton overrideStyle={styles.btnDots}>
                              <FontAwesomeIcon icon={faEllipsis} />
                            </IconButton>
                          </GenericMenu>
                        </div>
                      )}
                      <FeedCard
                        {...targetDoc}
                        unifiedDocumentId={uniDoc.id}
                        document={targetDoc}
                        documentFilter={uniDoc.document_filter}
                        formattedDocType={formattedDocType}
                        formattedDocLabel={formattedDocLabel}
                        index={arrIndex}
                        twitterScore={targetDoc.twitter_score}
                        key={`${formattedDocType}-${docID}-${arrIndex}`}
                        paper={uniDoc.documents}
                        hubs={uniDoc.hubs}
                        vote={uniDoc.user_vote}
                        score={uniDoc.score}
                        featured={uniDoc.featured}
                        reviews={uniDoc.reviews}
                        hasAcceptedAnswer={uniDoc?.document_filter?.answered}
                        fundraise={uniDoc.fundraise}
                        voteCallback={(
                          arrIndex: number,
                          currPaper: any
                        ): void => {
                          const [currUniDoc, newUniDocs] = [
                            { ...uniDoc },
                            [...unifiedDocumentData],
                          ];
                          currUniDoc.documents.user_vote = currPaper.user_vote;
                          currUniDoc.documents.score = currPaper.score;
                          newUniDocs[arrIndex] = currUniDoc;
                        }}
                        first_preview={undefined}
                      />
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>


        {publicationsResponse.next && (
          <LoadMore
            onClick={() => handleFetchMorePublications()}
            isLoading={isFetchingMore}
          />
        )}
      </div>
    </div>
  );
};


const styles = StyleSheet.create({
  addPublicationTooltip: {
    padding: 6,
    flexDirection: "column",
    display: "flex",
    gap: 10,
    fontSize: 14,
    fontWeight: 400,
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
  docControls: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    marginTop: 15,
  },
  publicationsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profilePage: {
    backgroundColor: "rgb(250, 250, 250)",
  },
  profileContent: {
    width: "1000px",
    margin: "0 auto",
    [`@media only screen and (max-width: ${breakpoints.desktop.str})`]: {
      width: "100%",
    },
  },
  activityWrapper: {
    width: 700,
    marginTop: 20,
  },
  mainContentWrapper: {
    margin: "0 auto",
    backgroundColor: "rgb(255, 255, 255)",
    borderTop: "1px solid #DEDEE6",
    border: "1px solid #F5F5F9",
    padding: 20,

  },
  mainContent: {
    width: "1000px",
    margin: "0 auto",
  },
  tabsWrapper: {
    width: "1000px",
    margin: "0 auto",
    marginTop: 20,
  },
  wrapper: {},
  contentWrapper: {
    display: "flex",
  },
  sectionHeader: {
    color: "rgb(139, 137, 148, 1)",
    textTransform: "uppercase",
    fontWeight: 500,
    letterSpacing: "1.2px",
    fontSize: 12,
    display: "flex",
    alignItems: "center",
    gap: 5,
    marginBottom: 20,
    marginTop: 20,
  },
});

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
});

const mapDispatchToProps = (dispatch) => ({});

export default withWebSocket(
  // @ts-ignore legacy hook
  connect(mapStateToProps, mapDispatchToProps)(AuthorPublications)
);
