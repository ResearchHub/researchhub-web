import { Fragment, useState, useEffect } from "react";
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
    fetch(
      API.USER({ route: "has_seen_first_coin_modal" }),
      API.PATCH_CONFIG(config)
    )
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
    enableParentScroll();
  }

  function enableParentScroll() {
    document.body.style.overflow = "scroll";
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
      title={"Welcome to ResearchHub!"}
      modalContentStyle={styles.modalContentStyle}
      subtitle={() => {
        return (
          <div className={css(styles.row)}>
            Here's a ResearchCoin
            <img
              className={css(styles.coinIcon)}
              src={"/static/icons/coin-filled.png"}
            />
          </div>
        );
      }}
    >
      <div className={css(styles.modalBody)}>
        <Confetti
          recycle={recycle}
          numberOfPieces={300}
          width={584}
          height={469}
        />
        <div className={css(styles.text)}>
          For the first month, all major actions you take on the site will help
          you earn ResearchCoin (up to 200 RSC). After the month is over, you
          will still earn coins on major actions, but not every single one.
        </div>
        <div className={css(styles.text)}>
          Our goal with ResearchCoin is to help incentivize and reward great
          content and great research.
        </div>
        <div className={css(styles.body, reveal && styles.reveal)}>
          <div className={css(styles.hyperlink)} onClick={openLinkInTab}>
            Click here to learn more about RSC.
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
    maxWidth: 469,
  },
});

export default FirstVoteModal;
