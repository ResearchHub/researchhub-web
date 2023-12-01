import { StyleSheet, css } from "aphrodite";
import ReactTooltip from "react-tooltip";
import Button from "../Form/Button";
import colors from "../../config/themes/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createVote } from "./api/votes";
import { ID, parseUser } from "~/config/types/root_types";
import { PredictionMarketDetails, PredictionMarketVote } from "./lib/types";
import { ReactElement, useEffect, useState } from "react";
import PermissionNotificationWrapper from "../PermissionNotificationWrapper";
import { captureEvent } from "~/config/utils/events";
import { faCaretDown, faCaretUp } from "@fortawesome/pro-solid-svg-icons";
import { breakpoints } from "~/config/themes/screen";
import { RectShape } from "react-placeholder/lib/placeholders";
import { useSelector } from "react-redux";
import { RootState } from "~/redux";
import { isEmpty } from "~/config/utils/nullchecks";

export type PredictionMarketVoteFormProps = {
  paperId: ID;
  predictionMarket: PredictionMarketDetails;
  onVoteCreated?: (v: PredictionMarketVote) => void;
  onVoteUpdated?: (v: PredictionMarketVote, prev: PredictionMarketVote) => void;
  isCurrentUserAuthor?: boolean;

  isFetching?: boolean;
  allVotes?: PredictionMarketVote[];
};

const PredictionMarketVoteForm = ({
  paperId,
  predictionMarket,
  onVoteCreated,
  onVoteUpdated,
  isCurrentUserAuthor = false,
  isFetching = false,
  allVotes = [],
}: PredictionMarketVoteFormProps): ReactElement => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [vote, setVote] = useState<"YES" | "NO" | null>(null);
  const [prevVote, setPrevVote] = useState<PredictionMarketVote | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const currentUser = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );

  useEffect(() => {
    const vote = allVotes.find(
      (v) =>
        v.createdBy.id === currentUser?.id ||
        v.createdBy.authorProfile?.id === currentUser?.authorProfile?.id
    );
    if (vote) {
      setPrevVote(vote);
      setVote(vote.vote);
    } else {
      setPrevVote(null);
      setVote(null);
    }
  }, [allVotes, currentUser]);

  const handleSubmit = async (vote: "YES" | "NO") => {
    if (vote === null || vote === prevVote?.vote) {
      // don't resubmit if the vote is the same
      return;
    }

    setIsSubmitting(true);
    try {
      const { vote: v } = await createVote({
        paperId,
        predictionMarketId: predictionMarket.id,
        vote,
      });

      if (v !== undefined) {
        setVote(v.vote);

        setSubmitError(null);
        if (prevVote) {
          onVoteUpdated?.(v, prevVote);
        } else {
          onVoteCreated?.(v);
        }

        setPrevVote(v);
      }
    } catch (error) {
      captureEvent({
        error,
        msg: "Failed to create prediction vote",
        data: {
          predictionMarketId: predictionMarket.id,
          vote,
        },
      });
      setSubmitError("Failed to create vote.");
      setVote(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={css(styles.container)}>
      <ReactTooltip
        effect="solid"
        className={css(styles.tooltip)}
        id="link-tooltip"
      />
      <div className={css(styles.header)}>
        <div className={css(styles.title)}>
          Do you think this paper is replicable?
        </div>
        <div className={css(styles.subtitle)}>
          Can an independent researcher/lab produce results that confirm the
          conclusion(s) of the paper?
        </div>
      </div>
      {isCurrentUserAuthor && (
        <div className={css(styles.cantVoteText)}>
          As an author of this paper, you cannot vote on this prediction market.
        </div>
      )}
      {submitError && <div className={css(styles.error)}>{submitError}</div>}
      {!isCurrentUserAuthor && (isFetching || !predictionMarket) && (
        <div className={css(styles.buttons)}>
          <RectShape
            color={colors.PLACEHOLDER_CARD_BACKGROUND}
            style={{
              width: "100%",
              height: "40px",
              margin: "0",
              borderRadius: "4px",
            }}
          />
          <RectShape
            color={colors.PLACEHOLDER_CARD_BACKGROUND}
            style={{
              width: "100%",
              height: "40px",
              margin: "0",
              borderRadius: "4px",
            }}
          />
        </div>
      )}
      {!isCurrentUserAuthor && !isFetching && (
        <div className={css(styles.buttons)}>
          <PermissionNotificationWrapper
            loginRequired
            modalMessage="vote"
            onClick={() => handleSubmit("YES")}
            hideRipples
            styling={styles.button}
          >
            <Button
              label={
                <span>
                  Vote YES&nbsp;&nbsp;
                  <FontAwesomeIcon
                    icon={faCaretUp}
                    style={{ transform: "translateY(1.2px)" }}
                  />
                </span>
              }
              fullWidth
              disabled={isSubmitting}
              variant={vote === "YES" ? "outlined" : "contained"}
              customButtonStyle={[
                styles.button,
                vote === "NO"
                  ? styles.greenButtonUnselected
                  : styles.greenButton,
              ]}
            />
          </PermissionNotificationWrapper>
          <PermissionNotificationWrapper
            loginRequired
            modalMessage="vote"
            onClick={() => handleSubmit("NO")}
            hideRipples
            styling={styles.button}
          >
            <Button
              label={
                <span>
                  Vote NO&nbsp;&nbsp;
                  <FontAwesomeIcon icon={faCaretDown} />
                </span>
              }
              fullWidth
              disabled={isSubmitting}
              variant={vote === "NO" ? "outlined" : "contained"}
              customButtonStyle={[
                styles.button,
                vote === "YES" ? styles.redButtonUnselected : styles.redButton,
              ]}
            />
          </PermissionNotificationWrapper>
        </div>
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: "none",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: 500,
    paddingBottom: 6,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: 400,
    lineHeight: 1.4,
    color: colors.MEDIUM_GREY2(1),
  },
  cantVoteText: {
    fontSize: 14,
    fontWeight: 400,
    color: colors.MEDIUM_GREY2(1),
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    gap: 8,
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      flexDirection: "column",
    },
  },
  button: {
    boxSizing: "border-box",
    width: "100%",
  },
  greenButton: {
    color: "white",
    backgroundColor: colors.PASTEL_GREEN(),
    border: "none",
    ":hover": {
      opacity: 0.8,
    },
  },
  greenButtonUnselected: {
    color: colors.PASTEL_GREEN(),
    backgroundColor: "white",
    border: `solid 1px ${colors.PASTEL_GREEN()}`,
    paddingTop: 5,
    paddingBottom: 5,
  },
  redButton: {
    color: "white",
    backgroundColor: colors.PASTEL_RED(),
    border: "none",
    ":hover": {
      opacity: 0.8,
    },
  },
  redButtonUnselected: {
    color: colors.PASTEL_RED(),
    backgroundColor: "white",
    border: `solid 1px ${colors.PASTEL_RED()}`,
    paddingTop: 5,
    paddingBottom: 5,
  },

  tooltip: {
    width: 300,
  },
  tooltipIcon: {
    cursor: "pointer",
  },

  error: {
    color: colors.RED(),
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    fontSize: 14,
    marginBottom: 16,
  },
});

export default PredictionMarketVoteForm;
