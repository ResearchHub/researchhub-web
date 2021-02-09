import React from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";

// Components
import BaseModal from "./BaseModal";
import Button from "../Form/Button";

// Redux
import { MessageActions } from "~/redux/message";
import { ModalActions } from "~/redux/modals";

// Config
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

const ClaimAccountModal = (props) => {
  const { openClaimAccountModal, modals } = props;

  const closeModal = () => {
    openClaimAccountModal(false);
  };

  return (
    <BaseModal
      isOpen={modals.openClaimAccountModal}
      closeModal={closeModal}
      title={"Claim Account"}
    >
      <div className={css(styles.content)}>
        <h3 className={css(styles.subheader)}>
          Why is my account here even though I never made one?
        </h3>
        <p className={css(styles.paragraph)}>
          Researchhub creates accounts for authors whose works have either been
          featured or uploaded to the community.
        </p>
        <p className={css(styles.paragraph)}>
          It serves as a way to reward the author and the owner of the published
          work with
          <a
            href={
              "https://www.notion.so/researchhub/ResearchCoin-21d1af8428824915a4d1f7c0b6b77cb4"
            }
            className={css(styles.link)}
            target="_blank"
            rel="noreferrer noopener"
          >
            ResearchCoin, or RSC.
          </a>
        </p>
        <h3 className={css(styles.subheader)}>
          How do I claim my account and RSC?
        </h3>
        <p className={css(styles.paragraph)}>
          To claim this account and receive the RSC awarded to it, please send
          an email to
          <a
            href="mailto:hello@researchhub.com"
            target="_blank"
            rel="noreferrer noopener"
            className={css(styles.link)}
          >
            hello@researchhub.com.
          </a>
        </p>
      </div>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: "0 0 20px 0",
    width: 500,
    "@media only screen and (max-width: 767px)": {
      width: "unset",
    },
    "@media only screen and (max-width: 415px)": {
      width: "85%",
    },
  },
  subheader: {
    margin: "25px 0 0 0",
    "@media only screen and (max-width: 767px)": {
      fontSize: 16,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 15,
    },
  },
  paragraph: {
    marginTop: 10,
    lineHeight: 1.5,
    wordBreak: "normal",
    "@media only screen and (max-width: 767px)": {
      fontSize: 14,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 13,
    },
  },
  link: {
    textDecoration: "unset",
    color: colors.BLUE(),
    marginLeft: 4,
    ":hover": {
      cursor: "pointer",
      textDecoration: "underline",
    },
  },
});

const mapStateToProps = (state) => ({
  modals: state.modals,
});

const mapDispatchToProps = {
  openClaimAccountModal: ModalActions.openClaimAccountModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClaimAccountModal);
