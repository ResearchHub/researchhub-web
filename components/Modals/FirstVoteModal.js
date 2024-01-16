import { useState, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";
import { useDispatch, useStore } from "react-redux";
import Confetti from "react-confetti";

// Component
import BaseModal from "./BaseModal";
import Button from "../Form/Button";

// Redux
import { AuthActions } from "~/redux/auth";
import { ModalActions } from "~/redux/modals";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "~/config/themes/colors";

const FirstVoteModal = (props) => {
  const dispatch = useDispatch();
  const store = useStore();
  const [userFirstVote, setFirstVote] = useState(
    store.getState().auth.user.has_seen_first_coin_modal
  );
  const [recycle, setRecycle] = useState(true);
  const [reveal, toggleReveal] = useState(false);
  const [showButton, toggleButton] = useState(false);

  const getBalance = () => {
    const { auth, updateUser } = props;
    if (!auth.isLoggedIn) {
      return;
    }
    return fetch(API.WITHDRAW_COIN({}), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        let param = {
          balance: res.user.balance,
        };
        updateUser(param);
      });
  };

  useEffect(() => {
    if (store.getState().modals.openFirstVoteModal) {
      getBalance();
      let firstTime = !store.getState().auth.user.has_seen_first_coin_modal;
      firstTime && userHasFirstSeen();
      toggleReveal(true);
      toggleButton(true);
      recycle && setRecycle(false);
    }
  }, [store.getState().modals.openFirstVoteModal]);

  function userHasFirstSeen() {
    let config = {
      has_seen_first_coin_modal: true,
    };
    fetch(API.USER_FIRST_COIN, API.PATCH_CONFIG(config))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        if (res.has_seen_first_coin_modal) {
          let newUserObj = { ...res };
          dispatch(AuthActions.updateUser(newUserObj));
        }
      });
  }

  function closeModal() {
    dispatch(ModalActions.openFirstVoteModal(false));
    let firstTime = !store.getState().auth.user.has_seen_first_coin_modal;
    firstTime && userHasFirstSeen();
    setRecycle(true);
    toggleReveal(false);
    toggleButton(false);
  }

  function openLinkInTab(e) {
    e.stopPropagation();
    let url =
      "https://www.notion.so/researchhub/ResearchCoin-21d1af8428824915a4d1f7c0b6b77cb4";
    let win = window.open(url, "_blank");
    win.focus();
  }

  return (
    <BaseModal
      isOpen={store.getState().modals.openFirstVoteModal}
      closeModal={closeModal}
      title={"Your contributions earn you ResearchCoin"}
      modalContentStyle={styles.modalContentStyle}
    >
      <div className={css(styles.modalBody)}>
        <div className={css(styles.text)}>
          Major actions that contribute valuable scientific content or advance
          open science on ResearchHub will earn you ResearchCoin.
        </div>
        <div className={css(styles.text)}>
          Our goal with ResearchCoin is to help incentivize and reward great
          content, great research and open science.
        </div>
        <div className={css(styles.body, reveal && styles.reveal)}>
          <div className={css(styles.hyperlink)} onClick={openLinkInTab}>
            Learn more about RSC
          </div>
          <div className={css(styles.button, styles.showButton)}>
            <Button label={"Close"} onClick={closeModal} />
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  coinIcon: {
    height: 20,
    marginLeft: 8,
  },
  row: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBody: {
    height: "100%",
    width: "100%",
    overflow: "hidden",
    zIndex: 9999999,
    padding: 16,
    paddingTop: 40,
    boxSizing: "border-box",
  },
  body: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    whiteSpace: "pre-wrap",
    marginTop: 15,
    transition: "all ease-in-out 0.3s",
    opacity: 0,
    height: 0,
  },
  hyperlink: {
    color: colors.BLUE(1),
    cursor: "pointer",
    ":hover": {
      textDecoration: "underline",
    },
  },
  reveal: {
    opacity: 1,
    height: 90,
    zIndex: 3,
  },
  text: {
    lineHeight: 1.4,
    margin: "16px 0px",
  },
  button: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginTop: 20,
    transition: "all ease-in-out 0.3s",
    opacity: 0,
  },
  showButton: {
    opacity: 1,
  },
  modalContentStyle: {
    overflow: "hidden",
    maxWidth: 500,
  },
});

export default FirstVoteModal;
