import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import { useStore, useDispatch } from "react-redux";
import Ripples from "react-ripples";

// Component
import BaseModal from "./BaseModal";
import { ScorePill } from "~/components/VoteWidget";
import PaperEntryCard from "~/components/Hubs/PaperEntryCard";

// Redux
import { ModalActions } from "~/redux/modals";

// Config
import colors, { voteWidgetColors } from "~/config/themes/colors";

const PromotionInfoModal = (props) => {
  const store = useStore();
  const dispatch = useDispatch();

  const closeModal = () => {
    dispatch(ModalActions.openPromotionInfoModal(false, {}));
  };

  const openPaperTransactionModal = (e) => {
    e && e.stopPropagation();
    closeModal();
    dispatch(ModalActions.openPaperTransactionModal(true));
  };

  return (
    <BaseModal
      isOpen={store.getState().modals.openPromotionInfoModal.isOpen}
      closeModal={closeModal}
      title={"About Supporting a Paper"} // this needs to
    >
      <div className={css(styles.description)}>
        Papers can be supported using RSC, which gives papers increased
        visibility in the app.{" "}
        <a
          href={
            "https://www.notion.so/researchhub/RSC-Promotion-f3cb4ee4487046d88201062b1d6b1efa"
          }
          className={css(styles.link)}
          target="_blank"
          rel="noreferrer noopener"
        >
          Learn more.
        </a>
      </div>
      <div className={css(styles.card)}>
        <div className={css(styles.scoreContainer)}>
          <div className={css(styles.promotedScore)}>
            <ScorePill
              small={true}
              paper={store.getState().modals.openPromotionInfoModal.props}
              score={
                store.getState().modals.openPromotionInfoModal.props.promoted
              }
              promoted={true}
              type={"Paper"}
            />
          </div>
          <div className={css(styles.divider)} />
          <div className={css(styles.score)}>
            {store.getState().modals.openPromotionInfoModal.props.score}
          </div>
        </div>
        <div className={css(styles.display, styles.title)}>
          <PaperEntryCard
            promotionSummary={true}
            paper={store.getState().modals.openPromotionInfoModal.props}
            mobileView={true}
            style={styles.paper}
          />
        </div>
      </div>
      {store.getState().modals.openPromotionInfoModal.props.showPromotion && (
        <Ripples
          className={css(styles.promotionButton)}
          onClick={openPaperTransactionModal}
        >
          Support
        </Ripples>
      )}
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  paper: {
    border: "none",
    padding: 0,
    margin: 0,
  },
  card: {
    border: "1px solid #E8E8F2",
    padding: "20px 15px",
    borderRadius: 4,
    marginTop: 25,
    marginBottom: 30,
    width: "100%",
    // maxWidth: 500,
    display: "flex",
    alignItems: "flex-start",
    "@media only screen and (max-width: 767px)": {
      maxWidth: 400,
    },
    "@media only screen and (max-width: 415px)": {
      maxWidth: "95%",
    },
  },
  scoreContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginRight: 15,
  },
  description: {
    fontSize: 16,
    fontWeight: 400,
    marginTop: 20,
    maxWidth: 400,
    width: "100%",
    whiteSpace: "pre-wrap",
  },
  link: {
    color: colors.BLUE(),
    textDecoration: "unset",
    cursor: "pointer",
    ":hover": {
      textDecoration: "underline",
    },
  },
  promotedScore: {
    display: "flex",
    alignItems: "center",
  },
  originalScore: {
    display: "flex",
    alignItems: "center",
  },
  scoreLabel: {
    fontSize: 12,
    marginRight: 10,
  },
  score: {
    background: "#EEECEF",
    color: "#93919E",
    fontWeight: "bold",
    borderRadius: 24,
    padding: ".2em .5em",
    minWidth: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 14,
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  label: {
    fontWeight: 400,
    marginRight: 10,
    fontSize: 14,
    "@media only screen and (max-width: 415px)": {
      fontSize: 13,
    },
  },
  title: {
    fontWeight: 500,
    width: "100%",
    fontSize: 15,
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
  abstract: {
    fontWeight: 40,
    fontSize: 13,
    marginTop: 10,
    whiteSpace: "pre-wrap",
  },
  display: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    pointerEvents: "none",
    width: "100%",
  },
  promotionButton: {
    padding: "6px 20px",
    borderRadius: 4,
    backgroundColor: colors.BLUE(),
    color: "#FFF",
    cursor: "pointer",
    ":hover": {
      backgroundColor: "#3E43E8",
    },
  },
  divider: {
    margin: "15px 0",
    backgroundColor: colors.BLACK(),
    height: 2,
    width: "100%",
    width: 20,
  },
});

export default PromotionInfoModal;
