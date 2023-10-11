import { connect } from "react-redux";
import { createNewNote } from "~/config/fetch";
import {
  filterNull,
  isNullOrUndefined,
  silentEmptyFnc,
} from "~/config/utils/nullchecks";
import { MessageActions } from "~/redux/message";
import { NOTE_GROUPS } from "~/components/Notebook/config/notebookConstants";
import {
  ReactElement,
  useState,
  SyntheticEvent,
  useEffect,
  useContext,
} from "react";
import { StyleSheet, css } from "aphrodite";
import { NextRouter, useRouter } from "next/router";
import {
  DEFAULT_POST_BUTTON_VALUES,
  NewPostButtonContext,
  NewPostButtonContextValues,
} from "~/components/contexts/NewPostButtonContext";
import { getIsOnMobileScreenSize } from "~/config/utils/getIsOnMobileScreenSize";
import BaseModal from "./BaseModal";
import Button from "../Form/Button";
import Link from "next/link";
import Modal from "react-modal";
import PaperUploadWizardContainer from "../Paper/UploadWizard/PaperUploadWizardContainer";
import ResearchhubOptionCard from "../ResearchhubOptionCard";
import UserDeleteRequestForm from "~/components/Author/UserDeleteRequestForm";
import colors from "~/config/themes/colors";
import BountyWizard from "../Bounty/BountyWizard";
import { breakpoints } from "~/config/themes/screen";

export type UserDeleteRequestProps = {
  author: any;
  isOpen: boolean;
  closeModal: func;
};

function UserDeleteRequestModal({
  author,
  isOpen,
  closeModal,
}: UserDeleteRequestProps): ReactElement<typeof Modal> {
  const router = useRouter();
  const { values: buttonValues, setValues: setButtonValues } =
    useContext<NewPostButtonContextType>(NewPostButtonContext);

  // TODO: calvinhlee - reorganize these context values to better represent currently available post-types
  const [modalSelectedItemIndex, setModalSelectedItemIndex] = useState(0);

  return (
    <BaseModal
      isOpen={isOpen}
      closeModal={closeModal}
      title={"Request to Remove Profile"}
      subtitle={
        "Upon successfully verifying your identity, we will remove your public profile from researchhub.com"
      }
    >
      <UserDeleteRequestForm author={author} onExit={closeModal} />
    </BaseModal>
  );
}

const styles = StyleSheet.create({
  header: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
  new: {
    fontSize: 15,
    color: colors.ORANGE_DARK2(),
  },
  newText: {},
  fireIcon: {
    marginRight: 4,
  },
  postOptionslist: {
    display: "flex",
    flex: "0 0 auto",
    flexDirection: "column",
    justifyContent: "flex-start",
    margin: 32,
    maxHeight: "100%",
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      maxHeight: "600px",
      overflowX: "scroll",
      margin: "12px 0px",
    },
  },
  modalStyle: {
    maxHeight: "95vh",
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      maxHeight: "100vh",
      top: "none",
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      maxHeight: "100vh",
      top: "none",
    },
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      minHeight: "100vh",
      top: -68,
      width: "100%",
    },
  },
  buttonLabel: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  rootContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 40,
    borderRadius: 5,
    transition: "all ease-in-out 0.4s",
    boxSizing: "border-box",
    width: "100%",
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      overflowY: "auto",
    },
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      alignItems: "flex-start",
      overflowY: "hidden",
      padding: "40px 8px",
    },
  },
  form: {
    width: "100%",
    position: "relative",
  },
  buttonCustomStyle: {
    width: "160px",
    height: "50px",
    marginLeft: "unset",
    "@media only screen and (max-width: 415px)": {
      width: "160px",
      height: "50px",
    },
  },
  rippleClass: {
    width: "100%",
  },
  closeButton: {
    height: "12px",
    width: "12px",
    position: "absolute",
    top: "6px",
    right: "0px",
    padding: "16px",
    cursor: "pointer",
  },
  titleContainer: {
    alignItems: "center",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    marginLeft: "unset",
    textAlign: "center",
  },
  title: {
    fontWeight: 500,
    height: "30px",
    width: "100%",
    fontSize: "26px",
    color: "#232038",
    "@media only screen and (max-width: 415px)": {
      fontSize: "24px",
    },
  },
  modalContentStyle: {
    position: "static",
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      // position: "fixed",
      // top: 0,
      width: "100%",
    },
  },
});

const mapStateToProps = (state) => ({
  currentUser: state.auth.user,
});

const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserDeleteRequestModal);
