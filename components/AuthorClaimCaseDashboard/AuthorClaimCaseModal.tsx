import { Fragment, ReactElement, SyntheticEvent, useContext, useState } from "react";
import { css, StyleSheet } from "aphrodite";
import Modal from "react-modal";

import {
  AUTHOR_CLAIM_ACTION_LABEL,
  AUTHOR_CLAIM_STATUS,
} from "./constants/AuthorClaimStatus";
import Button from "../Form/Button";
import { updateCaseStatus } from "./api/AuthorClaimCaseUpdateCase";
import { ValueOf } from "../../config/types/root_types";
import { breakpoints } from "../../config/themes/screen";

// Dynamic modules
import dynamic from "next/dynamic";
import { NavbarContext } from "~/pages/Base";
const BaseModal = dynamic(() => import("../Modals/BaseModal"));

export type AuthorClaimCaseProps = {
  caseID: any;
  openModalType: ValueOf<typeof AUTHOR_CLAIM_STATUS>;
  profileImg: string;
  requestorName: string;
  setOpenModalType: (flag: any) => void;
  setLastFetchTime: Function;
};

export default function AuthorClaimModal({
  caseID,
  openModalType,
  profileImg,
  requestorName,
  setLastFetchTime,
  setOpenModalType,
}: AuthorClaimCaseProps): ReactElement<typeof Modal> {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { setNumNavInteractions, numNavInteractions } = useContext(NavbarContext);

  const createAcceptReject = (actionType) => {
    return (event: SyntheticEvent) => {
      event.stopPropagation(); /* prevents card collapse */
      setIsSubmitting(true);
      updateCaseStatus({
        payload: { caseID, updateStatus: actionType },
        onSuccess: () => {
          setNumNavInteractions(numNavInteractions + 1)
          setIsSubmitting(false);
          setLastFetchTime(Date.now());
          closeModal(event);
        },
      });
    };
  };

  const closeModal = (e: SyntheticEvent): void => {
    e && e.preventDefault();
    setOpenModalType("");
  };

  const verb = openModalType
    ? AUTHOR_CLAIM_ACTION_LABEL[openModalType].toLowerCase()
    : "";

  return (
    <BaseModal
      children={
        <Fragment>
          <img
            src="/static/icons/close.png"
            className={css(customModalStyle.closeButton)}
            onClick={closeModal}
            draggable={false}
            alt="Close Button"
          />
          <div className={css(acceptRejectStyles.rootContainer)}>
            <div className={css(acceptRejectStyles.titleContainer)}>
              <div className={css(acceptRejectStyles.title)}>
                {`Are you sure you want to ${verb} the following user?`}
              </div>
            </div>
            <div className={css(acceptRejectStyles.userMediaContianer)}>
              <div className={css(acceptRejectStyles.requestorContainer)}>
                <img
                  className={css(acceptRejectStyles.requestorFaceImg)}
                  src={profileImg}
                />
                <span className={css(acceptRejectStyles.requestorName)}>
                  {requestorName}
                </span>
              </div>
            </div>
            <div className={css(acceptRejectStyles.buttonContainer)}>
              <Button
                label={`${verb} User`}
                disabled={isSubmitting}
                customButtonStyle={acceptRejectStyles.buttonCustomStyle}
                rippleClass={acceptRejectStyles.rippleClass}
                onClick={createAcceptReject(openModalType)}
              />
            </div>
          </div>
        </Fragment>
      }
      closeModal={closeModal}
      isOpen={!!openModalType}
      modalStyle={customModalStyle.modalStyle}
      removeDefault={true}
      modalContentStyle={customModalStyle.modalContentStyle}
    />
  );
}

const customModalStyle = StyleSheet.create({
  closeButton: {
    height: 12,
    width: 12,
    position: "absolute",
    top: 6,
    right: 0,
    padding: 16,
    cursor: "pointer",
  },
  modalStyle: {
    maxHeight: "95vh",
    width: "625px",
    "@media only screen and (max-width: 767px)": {
      width: "100%",
    },
  },
  modalContentStyle: {
    overflowY: "visible",
    overflow: "visible",
  },
});

const acceptRejectStyles = StyleSheet.create({
  userMediaContianer: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    width: "525px",
    height: "110px",
    background: "#FAFAFA",
    border: "1.5px solid #F0F0F0",
    boxSizing: "border-box",
    borderRadius: "4px",

    marginTop: 52,
  },
  requestorContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  requestorFaceImg: {
    borderRadius: "50%",
    height: 60,
    marginRight: 20,
    width: 60,
  },
  requestorName: {
    fontWeight: 500,
    fontSize: "18px",
    lineHeight: "21px",
    color: "#241F3A",
  },
  rootContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "40px 50px",
    borderRadius: 5,
    transition: "all ease-in-out 0.4s",
    boxSizing: "border-box",
    width: "100%",

    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      padding: 16,
    },
  },
  form: {
    width: "auto",
    position: "relative",
  },
  labelStyle: {
    "@media only screen and (max-width: 321px)": {
      fontWeight: 500,
      fontSize: "14px",
      lineHeight: "16px",
      color: "#241F3A",
    },
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    width: "auto",
    zIndex: 2,
    marginTop: 32,
  },
  buttonCustomStyle: {
    padding: "18px 21px",
    width: "258px",
    height: "55px",
    fontSize: "16px",
    lineHeight: "19px",
    "@media only screen and (max-width: 415px)": {
      width: "100%",
    },
    textTransform: "capitalize",
  },
  rippleClass: {},
  closeButton: {
    height: 12,
    width: 12,
    position: "absolute",
    top: 6,
    right: 0,
    padding: 16,
    cursor: "pointer",
  },
  titleContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
    boxSizing: "border-box",
    marginBottom: "7px",
  },
  title: {
    fontWeight: 500,
    height: 30,
    width: "100%",
    fontSize: 26,
    color: "#232038",
    "@media only screen and (max-width: 557px)": {
      fontSize: 24,
      width: 380,
    },
    "@media only screen and (max-width: 725px)": {
      width: 450,
    },
    "@media only screen and (max-width: 415px)": {
      width: 300,
      fontSize: 22,
    },
    "@media only screen and (max-width: 321px)": {
      width: 280,
    },
  },
  modalContentStyles: {},
});
