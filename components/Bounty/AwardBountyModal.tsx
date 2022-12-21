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
import icons, { WarningIcon } from "~/config/themes/icons";
import numeral from "numeral";
import ReactTooltip from "react-tooltip";
import ResearchCoinIcon from "../Icons/ResearchCoinIcon";
import AuthorAvatar from "../AuthorAvatar";
import FormInput from "../Form/FormInput";

function AwardUserRow({ author, comment, remainingAmount }) {
  return (
    <div className={css(awardUserStyles.container)}>
      <div className={css(awardUserStyles.recipientColumn)}>
        <AuthorAvatar
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
        />
      </div>
      <div className={css(awardUserStyles.awardColumn)}>
        <FormInput
          placeholder={remainingAmount}
          type="number"
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
    display: "flex",
    alignItems: "center",
  },
  rscIcon: {
    marginRight: 7,
    display: "flex",
  },
  rscText: {
    fontWeight: 500,
    fontSize: 18,
  },
  recipientColumn: {
    width: "60%",
    display: "flex",
    justifyContent: "flex-start",
  },
  inputStyle: {
    height: 40,
    boxSizing: "border-box",
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
    marginLeft: "auto",
  },
});

type Props = {
  isOpen: boolean;
  closeModal: () => void;
  threads: [];
  bountyAmount: number;
};

function AwardBountyModal({
  isOpen,
  closeModal,
  threads,
  bountyAmount,
}: Props): ReactElement {
  const handleClose = () => {
    closeModal && closeModal();
  };

  const awardBounty = () => {};

  console.log(threads);

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
          <div className={css(styles.row, styles.rowHeader)}>
            <div className={css(styles.recipientColumn)}>Recipient</div>
            <div>Award</div>
          </div>
          <div className={css(styles.userRows)}>
            {threads.map((thread) => {
              return (
                <AwardUserRow
                  author={thread.data.created_by.author_profile}
                  remainingAmount={bountyAmount}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className={css(styles.awardAction)}>
        <div className={css(styles.row, styles.remainingAwardRow)}>
          <div className={css(styles.remainingReward)}>Remaining Award</div>

          <div className={css(awardUserStyles.awardColumn)}>
            <div className={css(styles.rscLeft)}>{bountyAmount}</div>
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
          onClick={awardBounty}
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
  awardAction: {
    width: "100%",
    marginTop: 20,
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
    paddingBottom: 16,
    fontWeight: 500,
    fontSize: 18,
  },
  userRows: {
    marginTop: 16,
    maxHeight: 300,
    overflow: "auto",
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
