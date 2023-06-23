import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faCommentCheck } from "@fortawesome/pro-regular-svg-icons";
import { css, StyleSheet } from "aphrodite";
import CommentVote from "./CommentVote";
import { parseUser } from "~/config/types/root_types";
import { GenericDocument } from "../Document/lib/types";
import { Comment } from "./lib/types";
import Image from "next/image";
import IconButton from "../Icons/IconButton";
import colors from "./lib/colors";
import WidgetContentSupport from "../Widget/WidgetContentSupport";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "~/redux";
import { isEmpty } from "~/config/utils/nullchecks";
import {
  findOpenRootBounties,
  getOpenBounties,
  getUserOpenBounties,
} from "./lib/bounty";
import { CommentTreeContext } from "./lib/contexts";
import { useContext } from "react";
import Bounty, { tallyAmounts } from "~/config/types/bounty";
import { MessageActions } from "~/redux/message";
import { markAsAcceptedAnswerAPI } from "./lib/api";
import findComment, { findAllComments } from "./lib/findComment";
const { setMessage, showMessage } = MessageActions;

type Args = {
  toggleReply: Function;
  comment: Comment;
  document: GenericDocument;
};

const CommentActions = ({ comment, document, toggleReply }: Args) => {
  const dispatch = useDispatch();
  const commentTreeState = useContext(CommentTreeContext);
  const isQuestion = document.unifiedDocument.documentType === "question";
  const currentUser = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );

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

            commentTreeState.onUpdate({ comment: updatedCommentBounty });
            commentTreeState.onUpdate({ comment: awardedComent });
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
          documentType: document.apiDocumentType,
          documentId: document.id,
        });
        const previouslyAccepted = findAllComments({
          comments: commentTreeState.comments,
          conditions: [{ key: "isAcceptedAnswer", value: true }],
        }).map((f) => f.comment);

        previouslyAccepted.map((c) => {
          const updated = Object.assign({}, c, { isAcceptedAnswer: false });
          commentTreeState.onUpdate({ comment: updated });
        });

        const newlyAccepted = Object.assign({}, comment, {
          isAcceptedAnswer: true,
        });
        commentTreeState.onUpdate({ comment: newlyAccepted });
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

  // FIXME: Refactor into function
  const openBounties = getOpenBounties({ comment });
  const isAllowedToTip =
    openBounties.length === 0 && comment.createdBy.id !== currentUser?.id;
  let isAllowedToAcceptAnswer = false;

  // Root bounties are bounties that are not contributions.
  // A user can award a bounty if they currently have an open root bounty.
  const openUserOwnedRootBounty: Bounty = findOpenRootBounties({
    comments: commentTreeState.comments,
    user: currentUser,
  })[0];
  const isAllowedToAward =
    Boolean(openUserOwnedRootBounty) && openBounties.length === 0;

  if (isQuestion) {
    isAllowedToAcceptAnswer =
      document!.createdBy!.id == currentUser?.id &&
      !comment.isAcceptedAnswer &&
      comment.bounties.length === 0;
  }

  const disableSocialActions = currentUser?.id === comment.createdBy.id;

  return (
    <div className={css(styles.wrapper)}>
      <div className={css(styles.actionsWrapper)}>
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
            documentType={document.apiDocumentType}
            documentID={document.id}
          />
        </div>
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
              onClick={() =>
                handleAwardBounty({ bounty: openUserOwnedRootBounty })
              }
            >
              <FontAwesomeIcon icon={faCrown} style={{ fontSize: 16 }} />
              <span className={css(styles.actionText)}>Award</span>
            </IconButton>
          </div>
        )}

        <div className={`${css(styles.action, styles.actionReply)} reply-btn`}>
          <IconButton onClick={() => toggleReply()}>
            <Image
              src="/static/icons/reply.png"
              height={13}
              width={15}
              alt="Reply"
            />
            <span className={css(styles.actionText)}>Reply</span>
          </IconButton>
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
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
    fontWeight: 500,
    position: "relative",
  },
  actionReply: {
    marginLeft: "auto",
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
