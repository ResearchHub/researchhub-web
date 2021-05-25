import React from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";

// Component
import BaseModal from "./BaseModal";
import Button from "~/components/Form/Button";
import LargeList from "~/components/Form/LargeList";

// Redux
import { ModalActions } from "~/redux/modals";

// Config
import colors from "~/config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

class NewPostModal extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {
      mobileView: false, // TODO: ?
    };

    this.state = {
      ...this.initialState,
    };
  }

  saveAndCloseModal = (e) => {
    e && e.preventDefault();
    this.props.openNewPostModal(false);
    // this.saveAuthorChanges(null, true);
  };

  render() {
    const { modals } = this.props;
    return (
      <BaseModal
        isOpen={modals.openNewPostModal}
        closeModal={this.saveAndCloseModal}
        modalStyle={styles.modalStyle}
        title={"Select your post type"}
        textAlign={"left"}
        removeDefault={true}
        modalContentStyle={styles.modalContentStyles}
      >
        <div className={css(styles.rootContainer)}>
          <img
            src={"/static/icons/close.png"}
            className={css(styles.closeButton)}
            onClick={this.saveAndCloseModal}
            draggable={false}
            alt="Close Button"
          />
          <div className={css(styles.titleContainer)}>
            <div className={css(styles.title)}>{"Select your post type"}</div>
          </div>
          <LargeList
            selectMany={false}
            defaults={[0]}
            useLargeHitbox={true}
            customListStyle={styles.list}
            onChange={() => {}}
          >
            <Media
              header={"Upload a Paper"}
              description={
                "Upload a paper that has already been published. Upload it via a link to the journal, or upload the PDF directly."
              }
              imgSrc={"/static/icons/uploadPaper.png"}
            />
            <Media
              header={"Ask a Question or Start a Discussion"}
              description={
                "All discussions must be scientific in nature. Ideas, theories, questions to the community are all welcome."
              }
              imgSrc={"/static/icons/askQuestion.png"}
            />
            <Media
              header={"Publish a Research Project"}
              description={
                "Publish lab notes, original research, metastudies, etc."
              }
              imgSrc={"/static/icons/publishProject.png"}
            />
          </LargeList>
          <form className={css(styles.form)} onSubmit={this.saveAndCloseModal}>
            <div className={css(styles.buttonContainer)}>
              <Button
                label={"Continue"}
                customButtonStyle={styles.buttonCustomStyle}
                rippleClass={styles.rippleClass}
                type={"submit"}
              />
            </div>
          </form>
        </div>
      </BaseModal>
    );
  }
}

function Media({ header, description, imgSrc }) {
  return (
    <div className={css(styles.mediaContainer)}>
      <div className={css(styles.mediaContent)}>
        <div className={css(styles.mediaHeader)}> {header} </div>
        <div className={css(styles.mediaDescription)}> {description} </div>
      </div>
      <div className={css(styles.mediaImgBox)}>
        <img src={imgSrc} className={css(styles.mediaImg)} draggable={false} />
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  list: {
    width: "544px",
    margin: "31px",
  },
  mediaContainer: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  mediaContent: {
    display: "flex",
    flexDirection: "column",
    width: "373px",
  },
  mediaHeader: {
    display: "flex",
    fontSize: "14px",
    fontWeight: 500,
    fontSize: "18px",
    lineHeight: "21px",
    color: "#241F3A",
  },
  mediaDescription: {
    display: "flex",
    fontWeight: "normal",
    fontSize: "14px",
    lineHeight: "22px",
    color: "#241F3A",
    opacity: 0.7,
  },
  mediaImgBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "75px",
    height: "75px",
    borderRadius: "4px",
    backgroundColor: "rgba(57, 113, 255, 0.07)",
  },
  mediaImg: {},
  modalStyle: {
    maxHeight: "95vh",
    // overflowY: "scroll",
    width: "625px",
    "@media only screen and (max-width: 767px)": {
      width: "100%",
    },
  },
  rootContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 5,
    transition: "all ease-in-out 0.4s",
    boxSizing: "border-box",
    width: "100%",
    "@media only screen and (min-width: 768px)": {
      overflowY: "auto",
    },
    "@media only screen and (max-width: 767px)": {
      padding: 16,
    },
  },
  form: {
    width: "100%",
    position: "relative",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    background: "#FFF",
    zIndex: 2,
  },
  buttonCustomStyle: {
    padding: 16,
    width: "100%",
    "@media only screen and (max-width: 415px)": {
      width: "100%",
    },
  },
  rippleClass: {
    width: "100%",
  },
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
  },
  title: {
    fontWeight: "500",
    height: 30,
    width: "100%",
    fontSize: 26,
    color: "#232038",
    "@media only screen and (max-width: 557px)": {
      fontSize: 24,
    },
    "@media only screen and (max-width: 725px)": {
      width: 450,
    },
    "@media only screen and (max-width: 557px)": {
      width: 380,
    },
    "@media only screen and (max-width: 415px)": {
      width: 300,
      fontSize: 22,
    },
    "@media only screen and (max-width: 321px)": {
      width: 280,
    },
  },
  modalContentStyles: {
    padding: 25,
    overflowX: "hidden",
    "@media only screen and (max-width: 415px)": {
      padding: 25,
    },
  },
});

const mapStateToProps = (state) => ({
  modals: state.modals,
});

const mapDispatchToProps = {
  openNewPostModal: ModalActions.openNewPostModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewPostModal);
