import BaseModal from "./BaseModal";
import Button from "../Form/Button";
import Link from "next/link";
import Modal from "react-modal";
import React, { ReactElement, useState, SyntheticEvent, Fragment } from "react";
import ResearchhubOptionCard from "../ResearchhubOptionCard";
import { StyleSheet, css } from "aphrodite";

const items = [
  {
    header: "Upload a Paper",
    description:
      "Upload a paper that has already been published. Upload it via a link to the journal, or upload the PDF directly.",
    imgSrc: "/static/icons/uploadPaper.png",
    route: "/paper/upload/info",
  },
  {
    header: "Ask a Question or Start a Discussion",
    description:
      "All discussions must be scientific in nature. Ideas, theories, questions to the community are all welcome.",
    imgSrc: "/static/icons/askQuestion.png",
    route: "/post/create/question",
  },
  {
    header: "Publish a Research Project",
    description: "Publish lab notes, original research, metastudies, etc.",
    imgSrc: "/static/icons/publishProject.png",
    route: "/notebook",
  },
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
    return (
      <ResearchhubOptionCard
        description={option.description}
        header={option.header}
        imgSrc={option.imgSrc}
        isActive={index === selected}
        isCheckboxSquare={false}
        onSelect={onSelect}
      />
    );
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
    width: "544px",
    margin: "31px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  modalStyle: {
    maxHeight: "95vh",
    width: "625px",
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
    "@media only screen and (min-width: 768px)": {
      overflowY: "auto",
    },
  },
  form: {
    width: "100%",
    position: "relative",
  },
  buttonCustomStyle: {
    width: "180px",
    height: "50px",
    // padding: "16px",
    "@media only screen and (max-width: 415px)": {
      width: "100%",
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
    "@media only screen and (max-width: 557px)": {
      fontSize: "24px",
      width: "380px",
    },
    "@media only screen and (max-width: 725px)": {
      width: "450px",
    },
    "@media only screen and (max-width: 415px)": {
      width: "300px",
      fontSize: "22px",
    },
    "@media only screen and (max-width: 321px)": {
      width: "280px",
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
