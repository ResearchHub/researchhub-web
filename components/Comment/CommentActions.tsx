import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faCommentCheck } from "@fortawesome/pro-regular-svg-icons";
import {
  faReply,
  faLinkSimple,
  faPlus,
} from "@fortawesome/pro-solid-svg-icons";
import { css, StyleSheet } from "aphrodite";
import CommentVote from "./CommentVote";
import { parseUser } from "~/config/types/root_types";
import { COMMENT_CONTEXTS, Comment } from "./lib/types";
import Image from "next/image";
import IconButton from "../Icons/IconButton";
import colors from "./lib/colors";
import WidgetContentSupport from "../Widget/WidgetContentSupport";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "~/redux";
import { isEmpty } from "~/config/utils/nullchecks";
import { findOpenRootBounties, getOpenBounties } from "./lib/bounty";
import { CommentTreeContext } from "./lib/contexts";
import { useContext } from "react";
import Bounty, { tallyAmounts } from "~/config/types/bounty";
import { MessageActions } from "~/redux/message";
import { markAsAcceptedAnswerAPI } from "./lib/api";
import { findAllComments } from "./lib/findComment";
import createSharableLinkToComment from "./lib/createSharableLinkToComment";
import ReactTooltip from "react-tooltip";
import { breakpoints } from "~/config/themes/screen";
import CreateBountyBtn from "../Bounty/CreateBountyBtn";
const { setMessage, showMessage } = MessageActions;

type Args = {
  toggleReply: Function;
  comment: Comment;
  onBountyAdd: (bounty) => void;
};

const CommentActions = ({ comment, toggleReply, onBountyAdd }: Args) => {
  const dispatch = useDispatch();
  const {
    context,
    onUpdate,
    document: doc,
    comments,
  } = useContext(CommentTreeContext);
  const { relatedContent } = comment.thread;

  const isQuestion = relatedContent.type === "question";
  const currentUser = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );

  const getTooltipText = () => {
    if (
      context === COMMENT_CONTEXTS.REF_MANAGER &&
      comment.thread.privacy === "PRIVATE"
    ) {
      return "This comment is private. Edit comment privacy to share with others.";
    }

    return undefined;
  };

  const handleAwardBounty = async ({ bounty }: { bounty: Bounty }) => {
    const totalAmount = tallyAmounts({
      bounties: [bounty, ...bounty.children],
    });
    if (
      confirm(
        `Award ${totalAmount} bounty to ${comment.createdBy.firstName} ${comment.createdBy.lastName}?`
      )
    ) {
      try {
        Bounty.awardAPI({
          bountyId: bounty.id,
          recipientUserId: comment.createdBy.id,
          objectId: comment.id,
          amount: totalAmount,
        })
          .then((updatedBounty: Bounty) => {
            const awardedComent = Object.assign({}, comment);
            awardedComent.awardedBountyAmount += totalAmount;

            const updatedCommentBounty = Object.assign(
              {},
              bounty!.relatedItem?.object
            );
            updatedBounty.status = updatedBounty.status;
            updatedBounty.children = bounty.children;
            updatedBounty.relatedItem = bounty.relatedItem;
            updatedBounty.children.map(
              (c) => (c.status = updatedBounty.status)
            );

            const bIdx = updatedCommentBounty.bounties.findIndex(
              (b) => b.id === updatedBounty.id
            );
            if (bIdx > -1) {
              updatedCommentBounty.bounties[bIdx] = updatedBounty;
            }

            onUpdate({ comment: updatedCommentBounty });
            onUpdate({ comment: awardedComent });
          })
          .catch((error: any) => {
            // FIXME: Log to sentry
            dispatch(
              setMessage(
                `Could not award bounty at this time. Error: ${error?.detail}`
              )
            );
            // @ts-ignore
            dispatch(showMessage({ show: true, error: true }));
          });
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  const handleAcceptAnswer = async ({ commentId }) => {
    if (
      confirm(
        `Accept ${comment.createdBy.firstName} ${comment.createdBy.lastName}'s answer ?`
      )
    ) {
      try {
        await markAsAcceptedAnswerAPI({
          commentId,
          documentType: relatedContent.type,
          documentId: relatedContent.id,
        });
        const previouslyAccepted = findAllComments({
          comments: comments,
          conditions: [{ key: "isAcceptedAnswer", value: true }],
        }).map((f) => f.comment);

        previouslyAccepted.map((c) => {
          const updated = Object.assign({}, c, { isAcceptedAnswer: false });
          onUpdate({ comment: updated });
        });

        const newlyAccepted = Object.assign({}, comment, {
          isAcceptedAnswer: true,
        });
        onUpdate({ comment: newlyAccepted });
      } catch (error: any) {
        // FIXME: Log to sentry
        dispatch(
          setMessage(
            `Could not award bounty at this time. Error: ${error?.detail}`
          )
        );
        // @ts-ignore
        dispatch(showMessage({ show: true, error: true }));
      }
    }
  };

  const handleCopyLinkToComment = (e) => {
    e.stopPropagation();

    createSharableLinkToComment({
      comment,
      context,
    });

    dispatch(setMessage(`Link copied`));
    // @ts-ignore
    dispatch(showMessage({ show: true, error: false }));
  };

  // FIXME: Refactor into function
  const openBounties = getOpenBounties({ comment });
  const isAllowedToTip =
    openBounties.length === 0 && comment.createdBy.id !== currentUser?.id;
  let isAllowedToAcceptAnswer = false;

  // Root bounties are bounties that are not contributions.
  // A user can award a bounty if they currently have an open root bounty.
  const openUserOwnedRootBounty: Bounty = findOpenRootBounties({
    comments,
    user: currentUser,
  })[0];
  const isAllowedToAward =
    Boolean(openUserOwnedRootBounty) && openBounties.length === 0;

  if (doc && isQuestion) {
    isAllowedToAcceptAnswer =
      doc!.createdBy!.id == currentUser?.id &&
      !comment.isAcceptedAnswer &&
      comment.bounties.length === 0;
  }

  const disableSocialActions = currentUser?.id === comment.createdBy.id;
  const tooltipText = getTooltipText();

  return (
    <div className={css(styles.wrapper)}>
      <ReactTooltip
        effect="solid"
        className={css(styles.tooltip)}
        id="link-tooltip"
      />
      <div className={css(styles.actionsWrapper)}>
        {doc && context !== COMMENT_CONTEXTS.GENERIC && (
          <div
            className={`${css(
              styles.action,
              disableSocialActions && styles.disabled
            )} vote-btn`}
          >
            <CommentVote
              comment={comment}
              score={comment.score}
              userVote={comment.userVote}
              isHorizontal={true}
              documentType={doc.apiDocumentType}
              documentID={doc.id}
            />
          </div>
        )}

        {![COMMENT_CONTEXTS.ANNOTATION, COMMENT_CONTEXTS.REF_MANAGER].includes(
          context
        ) && (
          <div
            className={`${css(styles.action, styles.actionReply)} reply-btn`}
          >
            <IconButton
              overrideStyle={styles.button}
              onClick={() => toggleReply()}
            >
              <FontAwesomeIcon
                icon={faReply}
                style={{ fontSize: 16, color: colors.secondary.text }}
              />
              <span className={css(styles.actionText)}>Reply</span>
            </IconButton>
          </div>
        )}

        {isAllowedToTip && (
          <div
            className={`${css(
              styles.action,
              disableSocialActions && styles.disabled
            )} tip-btn`}
          >
            <WidgetContentSupport
              data={{
                created_by: comment.createdBy.raw,
              }}
              showAmount={false}
              metaData={{
                contentType: "rhcommentmodel",
                objectId: comment.id,
              }}
            >
              <Image
                src="/static/icons/tip.png"
                height={20}
                width={20}
                alt="Tip"
              />
              <span className={css(styles.actionText)}>Tip</span>
            </WidgetContentSupport>
          </div>
        )}

        {isAllowedToAcceptAnswer && (
          <div className={`${css(styles.action)} accept-btn`}>
            <IconButton
              overrideStyle={styles.button}
              onClick={() => handleAcceptAnswer({ commentId: comment.id })}
            >
              <FontAwesomeIcon icon={faCommentCheck} style={{ fontSize: 18 }} />
              <span className={css(styles.actionText)}>Accept</span>
            </IconButton>
          </div>
        )}

        {isAllowedToAward && (
          <div className={`${css(styles.action)} award-btn`}>
            <IconButton
              overrideStyle={styles.button}
              onClick={() =>
                handleAwardBounty({ bounty: openUserOwnedRootBounty })
              }
            >
              <FontAwesomeIcon icon={faCrown} style={{ fontSize: 18 }} />
              <span className={css(styles.actionText)}>Award</span>
            </IconButton>
          </div>
        )}

        <div
          className={`${css(styles.action, styles.copyLinkAction)} link-btn`}
          data-tip={tooltipText}
          data-for="link-tooltip"
        >
          <IconButton
            overrideStyle={styles.button}
            onClick={handleCopyLinkToComment}
          >
            <FontAwesomeIcon
              icon={faLinkSimple}
              style={{ transform: "rotate(-45deg)" }}
            />
            <span className={css(styles.actionText)}>Link</span>
          </IconButton>
        </div>
        {comment.bounties[0] && comment.bounties[0]?.status === "OPEN" && (
          <div
            className={`${css(styles.action, styles.copyLinkAction)} link-btn`}
            data-tip={tooltipText}
            data-for="link-tooltip"
          >
            <CreateBountyBtn
              onBountyAdd={onBountyAdd}
              withPreview={false}
              relatedItemId={comment.id}
              overrideStyles={styles.button}
              relatedItemContentType={"rhcommentmodel"}
              originalBounty={comment.bounties[0]}
            >
              <FontAwesomeIcon icon={faPlus} />{" "}
              <span className={css(styles.actionText)}>
                Contribute to Bounty
              </span>
            </CreateBountyBtn>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 4,
    ":hover": {
      background: colors.actionBtn.hover,
    },
  },
  tooltip: {
    width: 300,
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
  },
  disabled: {
    "::before": {
      cursor: "not-allowed",
      zIndex: 5,
      content: `""`,
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      width: "100%",
      height: "100%",
    },
  },
  action: {
    display: "flex",
    columnGap: "5px",
    alignItems: "center",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 400,
    position: "relative",
    color: colors.actionBtn.color,
  },
  actionReply: {
    // marginLeft: "auto",
  },
  copyLinkAction: {
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
  },
  editAction: {},
  actionText: {
    color: colors.secondary.text,
  },
  actionsWrapper: {
    columnGap: "10px",
    display: "flex",
  },
});

export default CommentActions;
