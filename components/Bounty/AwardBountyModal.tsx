import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { MessageActions } from "~/redux/message";
import { ReactElement, useState, useEffect } from "react";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import BaseModal from "../Modals/BaseModal";
import Bounty from "~/config/types/bounty";
import Button from "../Form/Button";
import colors from "~/config/themes/colors";
import { WarningIcon } from "~/config/themes/icons";
import ResearchCoinIcon from "../Icons/ResearchCoinIcon";
import FormInput from "../Form/FormInput";
import DiscussionPostMetadata from "../DiscussionPostMetadata";
import ThreadTextEditor from "../Threads/ThreadTextEditor";
import api, { generateApiUrl } from "~/config/api";
import acceptAnswerAPI from "../Document/api/acceptAnswerAPI";
import { useRouter } from "next/router";
import VoteWidget from "../VoteWidget";
import { DOWNVOTE, UPVOTE } from "~/config/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

function AwardUserRow({
  author,
  comment,
  remainingAmount,
  decreaseRemainingAmount,
  awardFullBounty,
  awardedAmount,
}) {
  const [isMaximized, setIsMaximized] = useState(false);

  const fullName = `${author?.first_name ?? author?.firstName ?? ""} ${
    author?.last_name ?? author.lastName ?? ""
  }`;

  let selectedVoteType =
    comment.data.user_vote && comment.data.user_vote.vote_type;

  if (selectedVoteType === 1) {
    selectedVoteType = UPVOTE;
  } else if (selectedVoteType === 2) {
    selectedVoteType = DOWNVOTE;
  }

  return (
    <div className={css(awardUserStyles.voteContainer)}>
      <div className={css(awardUserStyles.votingWidget)}>
        <VoteWidget
          score={comment.data.score}
          disableUpvote
          disableDownvote
          selected={selectedVoteType}
          type={"Discussion"}
          onUpvote={() => {}}
          onDownVote={() => {}}
          small={true}
        />
      </div>
      <div
        className={css(awardUserStyles.container)}
        onClick={() => setIsMaximized(!isMaximized)}
      >
        <div className={css(awardUserStyles.recipientColumn)}>
          <DiscussionPostMetadata
            authorProfile={author}
            isCreatedByEditor={comment?.data?.is_created_by_editor}
            data={comment?.data}
            noShowSupport={true}
            date={comment?.data?.created_date}
            username={fullName}
            dropDownEnabled={true}
          />
          {/* <div className={css(awardUserStyles.arrow)}>
          {isMaximized ? (
            <UpIcon
              withAnimation={false}
              overrideStyle={awardUserStyles.chevron}
            />
          ) : (
            <DownIcon
              withAnimation={false}
              overrideStyle={awardUserStyles.chevron}
            />
          )}
        </div> */}
          <div className={css(awardUserStyles.comment)}>
            {isMaximized ? (
              <ThreadTextEditor
                readOnly={true}
                initialValue={comment?.data?.text}
                focusEditor={true}
                body={true}
                textStyles={styles.contentText}
                // quillContainerStyle={awardUserStyles.quillContainerStyle}
                textEditorId={`thread_${comment?.data.id}`}
                postType={comment?.data?.discussion_post_type}
              />
            ) : (
              <div
                className={"clamp2"}
                style={{
                  wordBreak: "break-word",
                  padding: "12px 15px",
                  borderRadius: 4,
                  border: "1px solid rgb(235, 235, 235)",
                }}
              >
                {comment?.data?.plain_text}
              </div>
            )}
          </div>
        </div>
        <div className={css(awardUserStyles.awardUserRow)}>
          <div
            className={css(awardUserStyles.awardUser)}
            onClick={awardFullBounty}
          >
            Award Full Bounty
          </div>

          <div className={css(awardUserStyles.awardColumn)}>
            <FormInput
              placeholder={remainingAmount}
              id={`${author.user}-${comment?.data.id}-award`}
              type="text"
              onClick={(e) => {
                e.stopPropagation();
              }}
              icon={null}
              value={awardedAmount || 0}
              onChange={decreaseRemainingAmount}
              inputStyle={awardUserStyles.inputStyle}
              containerStyle={awardUserStyles.inputContainer}
            />
            <ResearchCoinIcon
              width={20}
              height={20}
              overrideStyle={awardUserStyles.rscIcon}
            />
            <div className={css(awardUserStyles.rscText)}>{" RSC"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const awardUserStyles = StyleSheet.create({
  voteContainer: {
    display: "flex",
    paddingTop: 16,
  },
  container: {
    width: "100%",
    // display: "flex",
    alignItems: "center",
    position: "relative",
  },
  arrow: {
    color: "#7c7989",
    position: "absolute",
    right: 0,
    top: 0,
    cursor: "pointer",
  },
  chevron: {
    marginLeft: 0,
  },
  rscIcon: {
    marginRight: 7,
    display: "flex",
  },
  rscText: {
    fontWeight: 500,
    fontSize: 18,
  },
  comment: {
    marginTop: 8,
    // marginLeft: 38,
    marginBottom: 16,
    lineHeight: "1.6em",
    overflowWrap: "break-word",
    cursor: "pointer",
  },
  quillContainerStyle: {
    padding: 0,
    border: 0,
  },
  awardUserRow: {
    display: "flex",
    alignItems: "center",

    "@media only screen and (max-width: 767px)": {
      flexDirection: "column-reverse",
      alignItems: "flex-end",
    },
  },
  awardUser: {
    marginRight: "auto",
    cursor: "pointer",
    padding: 8,
    paddingRight: 0,
    paddingLeft: 0,
    color: colors.BLUE(1),
    fontSize: 14,

    "@media only screen and (max-width: 767px)": {
      marginRight: 0,
      marginTop: 4,
    },
  },
  recipientColumn: {
    // width: "60%",
    // display: "flex",
    // justifyContent: "flex-start",
  },
  inputStyle: {
    height: 40,
    boxSizing: "border-box",

    "::placeholder": {
      color: colors.BLACK(0.4),
    },

    "@media only screen and (max-width: 767px)": {
      width: 70,
      padding: 8,
      height: "unset",
    },
  },
  inputContainer: {
    maxWidth: 95,
    margin: 0,
    minHeight: "unset",
    marginRight: 16,
  },
  awardColumn: {
    display: "flex",
    alignItems: "center",
    // marginLeft: 38,
  },
  distributeColumn: {
    marginRight: "auto",
  },
  distribute: {
    fontWeight: 400,
    color: colors.BLUE(1),
    fontSize: 14,
    padding: 4,
    paddingLeft: 0,
    paddingRight: 0,
  },
});

type Props = {
  isOpen: boolean;
  closeModal: () => void;
  threads: [any];
  allBounties: [Bounty];
  bountyAmount: number;
  setMessage: (string) => void;
  showMessage: ({}) => void;
  setHasBounties: (boolean) => void;
  documentType: string;
  auth?: {};
};

function AwardBountyModal({
  isOpen,
  closeModal,
  threads,
  bountyAmount,
  allBounties,
  setMessage,
  showMessage,
  setHasBounties,
  documentType,
  auth,
}: Props): ReactElement {
  const [userAwardMap, setUserAwardMap] = useState({});
  const [bountyAwardLoading, setBountyAwardLoading] = useState(false);
  const [remainingAwardAmount, setRemainingAwardAmount] =
    useState(bountyAmount);

  const router = useRouter();
  const isCommentBounty = (documentType === "paper" || documentType === "post");

  const handleClose = () => {
    closeModal && closeModal();
    setUserAwardMap({});
    setRemainingAwardAmount(bountyAmount);
  };

  useEffect(() => {
    
    if (threads && threads[0]) {
      const author = threads[0]?.data?.created_by?.author_profile;
      const comment = threads[0];
      const key = `${author?.user}-${comment?.data?.id}-award`;
      const awardMapping = {};
      awardMapping[key] = bountyAmount;
      setUserAwardMap(awardMapping);
    }
  }, [threads]);

  const awardBounty = async () => {
    if (round(remainingAwardAmount, 2) > 0) {
      setMessage("Award cannot exceed bounty amount.");
      showMessage({ show: true, error: true });
      return;
    }

    if (round(remainingAwardAmount, 2) !== 0) {
      setMessage("Award your entire bounty to continue.");
      showMessage({ show: true, error: true });
      return;
    }

    setBountyAwardLoading(true);
    const allFetches: Promise<Response>[] = []; // todo: make this a promise array
    const metadataArray: any[] = [];
    const bountiesToAward = router.pathname.includes("/paper/")
      ? allBounties.filter((bounty) => {
          return (
            bounty?.created_by?.author_profile?.id ===
              auth?.user?.author_profile?.id && bounty?.status === "OPEN"
          );
        })
      : allBounties;

    bountiesToAward.forEach(async (bounty) => {
      const keys = Object.keys(userAwardMap);
      const acceptedAnswers = [];
      keys.forEach(async (key) => {
        if (userAwardMap[key]) {
          metadataArray.push({
            recipient_id: key.split("-")[0],
            content_type: isCommentBounty ? "comment" : "thread",
            amount: userAwardMap[key],
            object_id: key.split("-")[1],
          });
          acceptedAnswers.push({
            detail: { threadId: key.split("-")[1] },
          });

          acceptAnswerAPI({
            documentType: documentType,
            ...(isCommentBounty && {commentId: key.split("-")[1]}),
            threadId: 
            isCommentBounty
              ? threads[0]?.data?.parent
              : key.split("-")[1],
            paperId: router.query.paperId,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            documentId: router.query.documentId,
            onSuccess: (response) => {
              return { detail: { threadId: key.split("-")[1] } };
            },
            onError: (error) => {
              setMessage("Failed to set accepted answer");
              showMessage({
                show: true,
                error: true,
              });
            },
          });
        }
      });
      const event = new CustomEvent("answer-accepted", {
        detail: {
          multiAward: acceptedAnswers,
        },
      });
      document.dispatchEvent(event);

      const data = {
        multi_bounty_approval_metadata: metadataArray,
        amount: bountyAmount,
        recipient: true,
        object_id: true,
        multi_approve: true,
        content_type: isCommentBounty ? "comment" : "thread",
      };

      const url = generateApiUrl("bounty") + bounty?.id + "/approve_bounty/";
      const curFetch = fetch(url, api.POST_CONFIG(data));
      allFetches.push(curFetch);
    });

    const promises = await Promise.all(allFetches);
    let succeeded = true;
    if (promises.length) {
      promises.forEach(async (promise) => {
        if (promise.status !== 200) {
          succeeded = false;
          setBountyAwardLoading(false);
          const json = await promise.json();
          const detail = json.detail;
          setMessage(
            detail ? detail : "Something went wrong, please try again"
          );
          showMessage({ show: true, error: true });
        }
      });

      if (succeeded) {
        const multiAward = [];
        metadataArray.forEach((data) => {
          multiAward.push({
            objectId: parseInt(data.object_id, 10),
            amount: data.amount,
          });
        });

        const bountyAward = new CustomEvent("bounty-awarded", {
          detail: {
            multiAward,
            commentBountyAward: isCommentBounty,
            bountyThreadId: isCommentBounty
              ? bountiesToAward[0].item_object_id
              : null,
          },
        });
        document.dispatchEvent(bountyAward);

        setHasBounties && setHasBounties(false);
        setBountyAwardLoading(false);
        setMessage("Bounty awarded!");
        showMessage({ show: true });
        handleClose();
      }
    }
  };

  const decreaseRemainingAmount = (id, value) => {
    // const amount =
    //   parseInt(remainingAwardAmount, 10) - (value ? parseInt(value, 10) : 0);
    // setRemainingAwardAmount(amount);

    const val = parseInt(value, 10);

    if (val < 0 || isNaN(value)) {
      return;
    }

    const userMap = { ...userAwardMap };

    userMap[id] = value ? parseInt(value, 10) : 0;
    setUserAwardMap(userMap);
  };

  function round(value, decimals) {
    const includeE = value.toString().includes("e");
    return includeE
      ? Number(Math.round(value))
      : Number(Math.round(value + "e" + decimals) + "e-" + decimals);
  }

  const distributeOnUpvote = () => {
    const awardMap = {};
    let totalUpvotes = 0;
    threads.forEach((thread) => {
      totalUpvotes += thread.data.score >= 0 ? thread.data.score : 0;
    });
    let total = 0;
    let firstKey = "";
    threads.forEach((thread) => {
      if (thread.data.score > 0) {
        const author = thread?.data?.created_by?.author_profile;
        const mapKey = `${author.user}-${thread?.data.id}-award`;

        if (!firstKey) {
          firstKey = mapKey;
        }
        const amount = round(
          (thread.data.score / totalUpvotes) * bountyAmount,
          2
        );

        awardMap[mapKey] = amount;
        total += amount;
      }
    });

    const remaining = bountyAmount - total;

    awardMap[firstKey] = round(awardMap[firstKey] + remaining, 2);

    setUserAwardMap(awardMap);
  };

  useEffect(() => {
    const userIds = Object.keys(userAwardMap);
    let remainingAmount = bountyAmount;

    if (!userIds.length) {
      return;
    }

    userIds.forEach((id) => {
      remainingAmount -= userAwardMap[id];
    });

    setRemainingAwardAmount(remainingAmount);
  }, [userAwardMap]);

  return (
    <BaseModal
      closeModal={handleClose}
      isOpen={isOpen}
      modalStyle={styles.modalStyle}
      modalContentStyle={styles.modalContentStyle}
      title={<span className={css(styles.modalTitle)}>Award Bounty</span>}
    >
      <ReactTooltip className={css(styles.tooltip)} id="distribute">
        <div>
          <div>Distribute the bounty by a proportion of the total upvotes.</div>
          <br />
          <div>
            If one user has 7 upvotes, another has 3, the first user gets 70% of
            the bounty and the other user gets 30%.
          </div>
        </div>
      </ReactTooltip>
      <div className={css(styles.inner)}>
        <div className={css(styles.description)}>
          Award bounty to a contributor by giving them ResearchCoin (RSC).{" "}
          <a
            target="_blank"
            className={css(styles.link)}
            href="https://docs.researchhub.com/researchcoin/token-overview"
          >
            Learn more about RSC and how it can be used.
          </a>
        </div>

        <div className={css(styles.awardContainer)}>
          <div className={css(styles.row, styles.rowHeader)}>
            <div>Recipient</div>
            {threads?.length >= 1 && (
              <div
                className={css(styles.distribute)}
                onClick={distributeOnUpvote}
              >
                <Image
                  src="/shooting-star.png"
                  alt="Distribute based on Upvote"
                  className={css(styles.shootingStar)}
                  width={15}
                  height={14.93}
                />{" "}
                <span>Distribute based on Upvote</span>
                <FontAwesomeIcon
                  className={css(styles.info)}
                  icon={["fal", "info-circle"]}
                  data-for={"distribute"}
                  data-tip
                />
              </div>
            )}
          </div>

          {threads?.length < 1 ? (
            <div className={css(styles.noThreads)}>
              No recipients to award yet.
            </div>
          ) : (
            <div className={css(styles.userRows)}>
              {threads?.map((thread) => {
                const author = thread?.data?.created_by?.author_profile;
                const mapKey = `${author.user}-${thread?.data.id}-award`;

                return (
                  <div className={css(styles.awardUserRow)}>
                    <AwardUserRow
                      author={author}
                      remainingAmount={bountyAmount}
                      comment={thread}
                      awardedAmount={userAwardMap[mapKey]}
                      decreaseRemainingAmount={decreaseRemainingAmount}
                      awardFullBounty={(e) => {
                        e.stopPropagation();
                        const userMap = {};

                        userMap[mapKey] = bountyAmount;
                        setUserAwardMap(userMap);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className={css(styles.awardAction)}>
        <div className={css(styles.row, styles.remainingAwardRow)}>
          <div className={css(awardUserStyles.distributeColumn)}>
            <div className={css(styles.remainingReward)}>Remaining Award</div>
          </div>

          <div className={css(awardUserStyles.awardColumn)}>
            <div className={css(styles.rscLeft)}>
              {round(remainingAwardAmount, 2)}
            </div>
            <ResearchCoinIcon
              width={20}
              height={20}
              overrideStyle={awardUserStyles.rscIcon}
            />
            <div className={css(awardUserStyles.rscText)}>{" RSC"}</div>
          </div>
        </div>
        <Button
          label={"Award Bounty"}
          customButtonStyle={styles.awardButton}
          rippleClass={styles.awardRipple}
          customLabelStyle={styles.labelStyle}
          onClick={awardBounty}
          disabled={bountyAwardLoading || threads?.length < 1}
        />
        <Button
          label={"Cancel"}
          isWhite={true}
          customButtonStyle={[styles.awardButton, styles.cancelButton]}
          rippleClass={[styles.awardRipple, styles.cancelRipple]}
          customLabelStyle={styles.labelStyle}
          onClick={() => {
            handleClose();
          }}
        />
      </div>
      <div className={css(styles.warningLabel)}>
        <WarningIcon color={"#FF5353"} /> Once awarded, this action cannot be
        undone.
      </div>
    </BaseModal>
  );
}

const styles = StyleSheet.create({
  modalTitle: {
    marginBottom: 25,
    fontSize: 22,
    paddingTop: 35,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    "@media only screen and (max-width: 767px)": {
      paddingTop: 0,
    },
  },
  inner: {
    padding: 35,
    paddingBottom: 0,
    "@media only screen and (max-width: 767px)": {
      paddingTop: 0,
    },
  },
  link: {
    color: colors.NEW_BLUE(1),
  },
  modalStyle: {
    maxWidth: 570,
  },
  noThreads: {
    padding: 35,
    textAlign: "center",
  },
  modalContentStyle: {
    padding: 0,
    height: "100%",
  },
  description: {
    marginTop: 20,
    color: "#7C7989",
    lineHeight: "26px",
    textAlign: "center",

    "@media only screen and (max-width: 767px)": {
      marginTop: 0,
    },
  },
  rscLeft: {
    marginRight: 16,
  },
  row: {
    display: "flex",
    alignItems: "center",
  },
  remainingReward: {
    marginRight: "auto",
  },
  remainingAwardRow: {
    fontWeight: 500,
    fontsize: 18,
    marginBottom: 16,
  },
  awardUserRow: {
    borderBottom: "1px solid rgb(233, 234, 239)",
    paddingBottom: 16,
  },
  awardAction: {
    width: "100%",
    boxShadow: "0px 4px 20px rgba(36, 31, 58, 0.1)",
    padding: 35,
    boxSizing: "border-box",
    marginTop: "auto",
    paddingBottom: 0,
  },
  tooltip: {
    minWidth: 200,
    textAlign: "center",
  },
  awardContainer: {
    width: "100%",
    marginTop: 30,
  },
  recipientColumn: {
    width: "60%",
    // marginRight: "auto",
  },
  rowHeader: {
    borderBottom: "1px solid #E9EAEF",
    paddingBottom: 16,
    fontWeight: 500,
    fontSize: 18,
  },
  userRows: {
    maxHeight: 300,
    overflow: "auto",
    paddingBottom: 16,

    "@media only screen and (max-width: 767px)": {
      maxHeight: "calc(100vh - 370px)",
    },
  },
  awardButton: {
    width: "100%",
  },
  labelStyle: {
    fontWeight: 500,
  },
  awardRipple: {
    width: "100%",
    marginTop: 16,

    "@media only screen and (max-width: 767px)": {
      marginTop: 16,
    },
  },
  cancelRipple: {
    marginTop: 16,
  },
  warningLabel: {
    padding: 12,
    background: "#FAFAFC",
    color: "#FF5353",
    width: "100%",
    boxSizing: "border-box",
    textAlign: "center",
  },
  cancelButton: {
    color: colors.NEW_BLUE(1),
    background: "#fff",
    border: "none",

    ":hover": {
      color: colors.NEW_BLUE(1),
      background: "#fff",
      border: "none",

      opacity: 0.6,
    },
  },
  distribute: {
    color: colors.NEW_BLUE(),
    fontSize: 14,
    fontWeight: 400,
    marginLeft: "auto",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    lineHeight: "18px",
  },
  shootingStar: {
    marginRight: 6,
  },
  info: {
    padding: 6,
    color: "#7C7989",
    whiteSpace: "pre-wrap",
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(AwardBountyModal);
