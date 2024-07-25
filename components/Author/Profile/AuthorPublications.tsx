import {
  PaginatedPublicationResponse,
  fetchAuthorPublications,
  parsePublicationResponse,
} from "~/components/Author/lib/api";
import { css, StyleSheet } from "aphrodite";
import { useEffect, useState } from "react";
import {
  UnifiedCard,
  getDocumentCard,
} from "~/components/UnifiedDocFeed/utils/getDocumentCard";
import AddPublicationsModal from "~/components/Publication/AddPublicationsModal";
import { ROUTES as WS_ROUTES } from "~/config/ws";
import { useSelector, connect } from "react-redux";
import Button from "~/components/Form/Button";
import { parseUser } from "~/config/types/root_types";
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
import { faPlus } from "@fortawesome/pro-light-svg-icons";
import {
  RESEARCHHUB_POST_DOCUMENT_TYPES,
  getFEUnifiedDocType,
} from "~/config/utils/getUnifiedDocType";
import FeedCard from "../Tabs/FeedCard";
import {
  Authorship,
  parseAuthorship,
  parseGenericDocument,
  parsePaper,
} from "~/components/Document/lib/types";
import { Button as Btn, IconButton } from "@mui/material";
import ResearchCoinIcon from "~/components/Icons/ResearchCoinIcon";
import colors from "~/config/themes/colors";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
const AuthorPublications = ({
  initialPaginatedPublicationsResponse,
  wsResponse,
}: {
  initialPaginatedPublicationsResponse: PaginatedPublicationResponse;
  wsResponse: any;
}) => {
  const auth = useSelector((state: any) => state.auth);
  const currentUser = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );
  const [publicationsResponse, setPublicationsResponse] =
    useState<PaginatedPublicationResponse>(
      initialPaginatedPublicationsResponse
    );
  const [notificationsReceived, setNotificationsReceived] = useState<
    Notification[]
  >([]);
  const {
    fullAuthorProfile,
    reloadAuthorProfile,
    setIsLoadingPublications,
    isLoadingPublications,
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
  return (
    <div>
      {isLoadingPublications && (
        <>
          {Array.from({ length: 10 }).map((_, i) => (
            <UnifiedDocFeedCardPlaceholder color="#efefef" />
          ))}
        </>
      )}

      <div className={css(styles.wrapper)}>
        <div className={css(styles.publicationsHeader)}>
          <div className={css(styles.sectionHeader)}>Publications</div>
          {currentUser?.authorProfile?.id === fullAuthorProfile.id && (
            // @ts-ignore legacy
            <AddPublicationsModal
              // @ts-ignore legacy
              wsUrl={WS_ROUTES.NOTIFICATIONS(auth?.user?.id)}
              // @ts-ignore legacy
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

                const authorships: Authorship[] =
                  targetDoc.authorships.map(parseAuthorship);
                const isFirstAuthor = authorships.find(
                  (authorship) =>
                    authorship.authorPosition === "first" &&
                    authorship.authorId === fullAuthorProfile.id
                );

                return (
                  <div className={css(styles.wrapper)}>
                    <div className={css(styles.docControls)}>
                      {isFirstAuthor && (
                        <>
                          <Button
                            size="small"
                            variant="contained"
                            customButtonStyle={styles.claimButton}
                          >
                            <div
                              style={{
                                color: colors.NEW_GREEN(),
                                display: "flex",
                                alignItems: "center",
                                columnGap: 10,
                              }}
                            >
                              <ResearchCoinIcon
                                version={4}
                                color={colors.NEW_GREEN()}
                              />{" "}
                              Claim rewards
                            </div>
                          </Button>
                          <div style={{ display: "inline-flex" }}>
                            <IconButton
                              aria-label="more"
                              id="long-button"
                              aria-haspopup="true"
                              onClick={() => null}
                            >
                              <MoreHoriz />
                            </IconButton>
                          </div>
                        </>
                      )}
                    </div>
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
                    />
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  docControls: {
    display: "flex",
    justifyContent: "space-between",
  },
  claimButton: {
    background: colors.NEW_GREEN(0.1),
    border: `1px solid ${colors.NEW_GREEN()}`,
    marginTop: 20,
    marginBottom: 5,
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
