import {
  BOUNTY_DEFAULT_AMOUNT,
  BOUNTY_RH_PERCENTAGE,
  MAX_RSC_REQUIRED,
  MIN_RSC_REQUIRED,
} from "./config/constants";
import { captureEvent } from "@sentry/browser";
import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { getCurrentUser } from "~/config/utils/getCurrentUser";
import { Hub } from "~/config/types/hub";
import { MessageActions } from "~/redux/message";
import { ReactElement, useState, useEffect, SyntheticEvent } from "react";
import { trackEvent } from "~/config/utils/analytics";
import BaseModal from "../Modals/BaseModal";
import Bounty from "~/config/types/bounty";
import BountySuccessScreen from "./BountySuccessScreen";
import Button from "../Form/Button";
import colors from "~/config/themes/colors";
import icons, { DownIcon, UpIcon, WarningIcon } from "~/config/themes/icons";
import numeral from "numeral";
import ReactTooltip from "react-tooltip";
import ResearchCoinIcon from "../Icons/ResearchCoinIcon";
import AuthorAvatar from "../AuthorAvatar";
import FormInput from "../Form/FormInput";
import DiscussionPostMetadata from "../DiscussionPostMetadata";
import { getNestedValue } from "~/config/utils/misc";
import ThreadTextEditor from "../Threads/ThreadTextEditor";
import api, { generateApiUrl } from "~/config/api";
import acceptAnswerAPI from "../Document/api/acceptAnswerAPI";
import { useRouter } from "next/router";

function AwardUserRow({
  author,
  comment,
  remainingAmount,
  decreaseRemainingAmount,
}) {
  const [isMaximized, setIsMaximized] = useState(false);

  const fullName = `${author?.first_name ?? author?.firstName ?? ""} ${
    author?.last_name ?? author.lastName ?? ""
  }`;

  return (
    <div
      className={css(awardUserStyles.container)}
      onClick={() => setIsMaximized(!isMaximized)}
    >
      <div className={css(awardUserStyles.recipientColumn)}>
        {/* <AuthorAvatar
          author={author}
          boldName={true}
          border={`2px solid ${colors.LIGHT_GREY(1)}`}
          onClick={(event: SyntheticEvent) => {
            event.stopPropagation();
            event.preventDefault();
          }}
          margin
          size={36}
          fontSize={16}
          withAuthorName={true}
        /> */}
        <DiscussionPostMetadata
          authorProfile={author}
          isCreatedByEditor={comment?.data?.is_created_by_editor}
          data={comment?.data}
          noShowSupport={true}
          date={comment?.data?.created_date}
          username={fullName}
          dropDownEnabled={true}
        />
        <div className={css(awardUserStyles.arrow)}>
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
        </div>
        <div className={css(awardUserStyles.comment)}>
          {isMaximized ? (
            <ThreadTextEditor
              readOnly={true}
              initialValue={comment?.data?.text}
              focusEditor={true}
              body={true}
              textStyles={styles.contentText}
              quillContainerStyle={awardUserStyles.quillContainerStyle}
              textEditorId={`thread_${comment?.data.id}`}
              postType={comment?.data?.discussion_post_type}
            />
          ) : (
            <div className={"clamp2"} style={{ wordBreak: "break-word" }}>
              {comment?.data?.plain_text}
            </div>
          )}
        </div>
      </div>
      <div className={css(awardUserStyles.awardColumn)}>
        <FormInput
          placeholder={remainingAmount}
          id={`${author.user}-${comment?.data.id}-award`}
          type="number"
          onClick={(e) => {
            e.stopPropagation();
          }}
          icon={null}
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
  );
}

const awardUserStyles = StyleSheet.create({
  container: {
    width: "100%",
    // display: "flex",
    alignItems: "center",
    position: "relative",
    marginTop: 16,
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
    marginLeft: 38,
    marginBottom: 16,
    lineHeight: "1.6em",
    overflowWrap: "break-word",
    cursor: "pointer",
  },
  quillContainerStyle: {
    padding: 0,
    border: 0,
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
    marginLeft: 38,
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
}: Props): ReactElement {
  const [userAwardMap, setUserAwardMap] = useState({});
  const [bountyAwardLoading, setBountyAwardLoading] = useState(false);
  const [remainingAwardAmount, setRemainingAwardAmount] =
    useState(bountyAmount);

  const router = useRouter();

  const handleClose = () => {
    closeModal && closeModal();
    setUserAwardMap({});
    setRemainingAwardAmount(bountyAmount);
  };

  const awardBounty = async () => {
    if (remainingAwardAmount !== 0) {
      setMessage("Award your entire bounty to continue.");
      showMessage({ show: true, error: true });
      return;
    }

    setBountyAwardLoading(true);
    const allFetches: Promise<Response>[] = []; // todo: make this a promise array
    allBounties.forEach((bounty) => {
      const keys = Object.keys(userAwardMap);
      const metadataArray: any[] = [];
      keys.forEach((key) => {
        metadataArray.push({
          recipient_id: key.split("-")[0],
          content_type: "thread",
          amount: userAwardMap[key],
          object_id: key.split("-")[1],
        });

        acceptAnswerAPI({
          documentType: documentType,
          threadId: key.split("-")[1],
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          documentId: router.query.documentId,
          onSuccess: (response) => {
            const event = new CustomEvent("answer-accepted", {
              detail: {
                threadId: key.split("-")[1],
              },
            });
            document.dispatchEvent(event);
          },
          onError: (error) => {
            setMessage("Failed to set accepted answer");
            showMessage({
              show: true,
              error: true,
            });
          },
        });
      });

      const data = {
        multi_bounty_approval_metadata: metadataArray,
        amount: bountyAmount,
        recipient: true,
        object_id: true,
        multi_approve: true,
        content_type: "thread",
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

    const userMap = { ...userAwardMap };

    userMap[id] = value ? parseInt(value, 10) : 0;
    setUserAwardMap(userMap);
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
      <div className={css(styles.inner)}>
        <div className={css(styles.description)}>
          Award the bounty to a contributor, by giving them ResearchCoin, or
          RSC.{" "}
          <a
            target="_blank"
            className={css(styles.link)}
            href="https://researchhub.notion.site/ResearchCoin-RSC-1e8e25b771ec4b92b9095e060c4095f6"
          >
            Learn more about RSC and how it can be used.
          </a>
        </div>
        <div className={css(styles.awardContainer)}>
          <div className={css(styles.row, styles.rowHeader)}></div>
          <div className={css(styles.userRows)}>
            {threads?.map((thread) => {
              return (
                <div className={css(styles.awardUserRow)}>
                  <AwardUserRow
                    author={thread.data.created_by.author_profile}
                    remainingAmount={bountyAmount}
                    comment={thread}
                    decreaseRemainingAmount={decreaseRemainingAmount}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className={css(styles.awardAction)}>
        <div className={css(styles.row, styles.remainingAwardRow)}>
          <div className={css(styles.remainingReward)}>Remaining Award</div>

          <div className={css(awardUserStyles.awardColumn)}>
            <div className={css(styles.rscLeft)}>{remainingAwardAmount}</div>
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
  },
  inner: {
    padding: 35,
    paddingBottom: 0,
  },
  link: {
    color: colors.NEW_BLUE(1),
  },
  modalStyle: {
    maxWidth: 570,
  },
  modalContentStyle: {
    padding: 0,
  },
  description: {
    marginTop: 20,
    color: "#7C7989",
    lineHeight: "26px",
    textAlign: "center",
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
    opacity: 0.6,
    borderBottom: "1px solid #E9EAEF",
    // paddingBottom: 16,
    fontWeight: 500,
    fontSize: 18,
  },
  userRows: {
    maxHeight: 300,
    overflow: "auto",
    paddingBottom: 16,
  },
  awardButton: {
    width: "100%",
  },
  labelStyle: {
    fontWeight: 500,
  },
  awardRipple: {
    width: "100%",
    marginTop: 32,
  },
  cancelRipple: {
    marginTop: 16,
  },
  warningLabel: {
    padding: 12,
    background: "#FAFAFC",
    color: colors.BLACK(0.6),
    width: "100%",
    boxSizing: "border-box",
    textAlign: "center",
  },
  cancelButton: {
    ":hover": {
      background: "#fff",
      color: colors.NEW_BLUE(1),
      borderColor: colors.NEW_BLUE(1),
      opacity: 0.6,
    },
  },
});

const mapDispatchToProps = {
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};

export default connect(null, mapDispatchToProps)(AwardBountyModal);
