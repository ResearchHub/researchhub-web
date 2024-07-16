import {
  PaginatedPublicationResponse,
  fetchAuthorPublications,
  parsePublicationResponse,
} from "~/components/Author/lib/api";
import { css, StyleSheet } from "aphrodite";
import { useEffect, useState } from "react";
import { getDocumentCard } from "~/components/UnifiedDocFeed/utils/getDocumentCard";
import AddPublicationsModal from "~/components/Publication/AddPublicationsModal";
import { ROUTES as WS_ROUTES } from "~/config/ws";
import { useSelector, connect } from "react-redux";
import Button from "~/components/Form/Button";
import { parseUser } from "~/config/types/root_types";
import { RootState } from "~/redux";
import { isEmpty } from "~/config/utils/nullchecks";
import UnifiedDocFeedCardPlaceholder from "~/components/UnifiedDocFeed/UnifiedDocFeedCardPlaceholder";
import withWebSocket from "~/components/withWebSocket";
import {
  Notification,
  parseNotification,
} from "~/components/Notifications/lib/types";
import { authorProfileContext } from "../lib/AuthorProfileContext";

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
        <div className={css(styles.sectionHeader)}>Publications</div>
        {currentUser?.authorProfile?.id === fullAuthorProfile.id && (
          // @ts-ignore legacy
          <AddPublicationsModal
            // @ts-ignore legacy
            wsUrl={WS_ROUTES.NOTIFICATIONS(auth?.user?.id)}
            // @ts-ignore legacy
            wsAuth
          >
            <Button>Add Publications</Button>
          </AddPublicationsModal>
        )}
        <div className={css(styles.contentWrapper)}>
          <div>
            {
              // @ts-ignore
              getDocumentCard({
                unifiedDocumentData: publicationsResponse.results,
              })
            }
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
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
