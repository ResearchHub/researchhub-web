import BaseModal from "./BaseModal";
import Button from "../Form/Button";
import Link from "next/link";
import Modal from "react-modal";
import React, { ReactElement, useState, SyntheticEvent, Fragment } from "react";
import ResearchhubOptionCard from "../ResearchhubOptionCard";
import { StyleSheet, css } from "aphrodite";
import killswitch from "~/config/killswitch/killswitch";

const items = [
  {
    header: "Upload a Paper",
    description:
      "Upload a paper that has already been published. Upload it via a link to the journal, or upload the PDF directly.",
    imgSrc: "/static/icons/uploadPaper.png",
    route: "/paper/upload/info",
  },
  {
    header: "Create a Post",
    description:
      "All posts must be scientific in nature. Ideas, theories, and questions to the community are all welcome.",
    imgSrc: "/static/icons/askQuestion.png",
    route: "/post/create/question",
  },
  {
    header: "Create a Hypothesis",
    description: "TODO: Add copy here.",
    imgSrc: "/static/icons/publishProject.png",
    route: "/hypothesis/create",
  },
  // {
  //   header: "Publish a Research Project",
  //   description: "Publish lab notes, original research, metastudies, etc.",
  //   imgSrc: "/static/icons/publishProject.png",
  //   route: "/notebook",
  // },
];

export type NewPostModalProps = {
  isOpen: boolean;
  setIsOpen: (flag: boolean) => void;
};

export default function NewPostModal({
  isOpen,
  setIsOpen,
}: NewPostModalProps): ReactElement<typeof Modal> {
  let [selected, setSelected] = useState(0);

  const closeModal = (e: SyntheticEvent): void => {
    e && e.preventDefault();
    setIsOpen(false);
  };

  const handleContinue = (e: SyntheticEvent): void => {
    e && e.preventDefault();
    closeModal(e);
  };

  const optionCards = items.map((option, index) => {
    const onSelect = (e: SyntheticEvent) => {
      e.preventDefault();
      setSelected(index);
    };
    return killswitch("hypothesis") || index !== 2 ? (
      <ResearchhubOptionCard
        description={option.description}
        header={option.header}
        imgSrc={option.imgSrc}
        isActive={index === selected}
        isCheckboxSquare={false}
        key={index}
        onSelect={onSelect}
      />
    ) : null;
  });

  return (
    <BaseModal
      children={
        <Fragment>
          <div className={css(styles.rootContainer)}>
            <img
              alt="Close Button"
              className={css(styles.closeButton)}
              draggable={false}
              onClick={closeModal}
              src={"/static/icons/close.png"}
            />
            <div className={css(styles.titleContainer)}>
              <div className={css(styles.title)}>{"Select your post type"}</div>
            </div>
            <div className={css(styles.list)}>{optionCards}</div>
            <div className={css(styles.buttonContainer)}>
              <Button
                customButtonStyle={styles.buttonCustomStyle}
                customLabelStyle={styles.buttonLabel}
                label={
                  <Link href={items[selected].route}>
                    <div className={css(styles.buttonLabel)}>Continue</div>
                  </Link>
                }
                onClick={handleContinue}
                rippleClass={styles.rippleClass}
              />
            </div>
          </div>
        </Fragment>
      }
      closeModal={closeModal}
      isOpen={isOpen}
      modalStyle={styles.modalStyle}
      removeDefault={true}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    margin: "31px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  modalStyle: {
    maxHeight: "95vh",
    "@media only screen and (max-width: 767px)": {
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
    "@media only screen and (max-width: 767px)": {
      overflowY: "auto",
      padding: "40px 10px",
    },
    "@media only screen and (max-width: 415px)": {
      padding: "40px 0px",
    },
  },
  form: {
    width: "100%",
    position: "relative",
  },
  buttonCustomStyle: {
    width: "160px",
    height: "50px",
    "@media only screen and (max-width: 415px)": {
      width: "160px",
      height: "50px",
    },
  },
  buttonContainer: {
    display: "flex",
    width: "auto",
    justifyContent: "center",
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
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
    boxSizing: "border-box",
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
  modalContentStyles: {
    padding: "25px",
    overflowX: "hidden",
    "@media only screen and (max-width: 415px)": {
      padding: "25px",
    },
  },
});
