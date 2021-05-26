import { createAuthorClaimCase } from "./api/authorClaimCaseCreate";
import { css, StyleSheet } from "aphrodite";
import { connect } from "react-redux";

import colors from "../../config/themes/colors";
import Loader from "../Loader/Loader";
import Modal from "react-modal";
import React, { Fragment, ReactElement, SyntheticEvent, useState } from "react";

// Components
import Button from "../Form/Button";
import FormInput from "../Form/FormInput";
import BaseModal from "../Modals/BaseModal";

// Redux
import { ModalActions } from "../../redux/modals";

// export type AuthorClaimDataProps = {
//   auth: any;
//   author: any;
//   isOpen: boolean;
//   : Function; // TODO: redux dispatcher?
//   modals: any; // TODO: Object?
//   setIsOpen: (flag: boolean) => void;
//   user: any;
// };

// type FormFields = {
//   eduEmail: null | string;
// };

// type FormError = {
//   eduEmail: boolean;
// };

function validateEmail(email: string): boolean {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const splitted = email.split(".");
  return (
    re.test(String(email).toLowerCase()) &&
    splitted[splitted.length - 1] === ".edu"
  );
}

function validateFormField(fieldID: string, value: any): boolean {
  let result: boolean = true;
  switch (fieldID) {
    case "eduEmail":
      return typeof value === "string" && validateEmail(value);
    default:
      return result;
  }
}

class AuthorClaimModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: props.step,
    };
  }

  prompts = [
    // First Prompt (0)
    <Fragment>
      <div className={css(styles.titleContainer)}>
        <div className={css(styles.title)}>{"Author Claiming Steps"}</div>
      </div>
      <Button
        label={"Next"}
        customButtonStyle={styles.buttonCustomStyle}
        rippleClass={styles.rippleClass}
        onClick={this.handleContinue}
      />
    </Fragment>,
    // Second Prompt (1)
    <Fragment>
      <div className={css(styles.titleContainer)}>
        <div className={css(styles.title)}>{"Enter your .edu email"}</div>
      </div>
      <Button
        label={"Next"}
        customButtonStyle={styles.buttonCustomStyle}
        rippleClass={styles.rippleClass}
        onClick={this.handleContinue}
      />
    </Fragment>,
  ];

  saveAndCloseModal = (e) => {
    e && e.preventDefault();
    this.props.openAuthorClaimModal(false);
  };

  handleChange = ({ index }) => {
    this.setState({
      selected: index,
    });
  };

  handleContinue = () => {
    this.setState((prev) => ({
      step: prev.step + 1,
    }));
  };

  render() {
    const { modals } = this.props;
    const { step } = this.state;
    console.log(modals, step, this.prompts);
    return (
      <BaseModal
        isOpen={modals.openAuthorClaimModal}
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
          {this.prompts[step]}
        </div>
      </BaseModal>
    );
  }
}
const mapStateToProps = (state) => ({
  modals: state.modals,
  step: state.modals.authorClaimStep,
});

const mapDispatchToProps = {
  openAuthorClaimModal: ModalActions.openAuthorClaimModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthorClaimModal);

// function _AuthorClaimModal({
//   auth,
//   author,
//   isOpen,
//   setIsOpen,
//   user,
// }: AuthorClaimDataProps): ReactElement<typeof Modal> {
//   const [formErrors, setFormErrors] = useState<FormError>({
//     eduEmail: false,
//   });
//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
//   const [mutableFormFields, setMutableFormFields] = useState<FormFields>({
//     eduEmail: null,
//   });
//   const [shouldDisplayError, setShouldDisplayError] = useState<boolean>(false);

//   const handleOnChangeFields = (fieldID: string, value: string): void => {
//     setMutableFormFields({ ...mutableFormFields, [fieldID]: value });
//     setFormErrors({
//       ...formErrors,
//       [fieldID]: validateFormField(fieldID, value),
//     });
//   };

//   const handleValidationAndSubmit = (e: SyntheticEvent): void => {
//     e.preventDefault();
//     if (Object.values(formErrors).every((el: boolean): boolean => !el)) {
//       setShouldDisplayError(true);
//     } else {
//       setShouldDisplayError(false);
//       setIsSubmitting(true);
//       createAuthorClaimCase({
//         eduEmail: mutableFormFields.eduEmail,
//         onError: (): void => {
//           setIsSubmitting(false);
//         },
//         onSuccess: (): void => {
//           setIsSubmitting(false);
//           setIsOpen(false);
//         },
//         targetAuthorID: author.id,
//         userID: auth.user.id,
//       });
//     }
//   };

//   return (
//     <Modal
//       children={
//         <div className={css(modalBodyStyles.modalBody)}>
//           <form
//             encType="multipart/form-data"
//             className={css(modalBodyStyles.form)}
//             onSubmit={handleValidationAndSubmit}
//           >
//             <FormInput
//               containerStyle={modalBodyStyles.containerStyle}
//               disabled
//               id="user_name"
//               label="Your name"
//               labelStyle={modalBodyStyles.labelStyle}
//               placeholder="your name"
//               required
//               value={`${user.first_name} ${user.last_name}`}
//             />
//             <FormInput
//               containerStyle={modalBodyStyles.containerStyle}
//               disabled
//               id="author_name"
//               label="Claiming author's name"
//               labelStyle={modalBodyStyles.labelStyle}
//               placeholder="academic email address"
//               required
//               value={`${author.first_name} ${author.last_name}`}
//             />
//             <FormInput
//               containerStyle={modalBodyStyles.containerStyle}
//               disable={isSubmitting}
//               id="eduEmail"
//               label="Your .edu email address"
//               labelStyle={modalBodyStyles.labelStyle}
//               inputStyle={shouldDisplayError && modalBodyStyles.error}
//               onChange={handleOnChangeFields}
//               placeholder="academic email address"
//               required
//             />
//             <div>
//               <Button
//                 customButtonStyle={modalBodyStyles.buttonStyle}
//                 disable={isSubmitting}
//                 label={
//                   !isSubmitting ? (
//                     "Request"
//                   ) : (
//                     <Loader
//                       size={8}
//                       loading
//                       containerStyle={modalBodyStyles.loaderStyle}
//                       color="#fff"
//                     />
//                   )
//                 }
//                 type="submit"
//               />
//               <Button
//                 customButtonStyle={modalBodyStyles.cancelButtonStyle}
//                 disabled={isSubmitting}
//                 label="Cancel"
//                 onClick={(e: SyntheticEvent): void => {
//                   e.preventDefault();
//                   setIsOpen(false);
//                 }}
//               />
//             </div>
//           </form>
//         </div>
//       }
//       isOpen={isOpen}
//       style={customModalStyle}
//     />
//   );
// }

// const modalBodyStyles = StyleSheet.create({
//   buttonStyle: {
//     height: 45,
//     width: 140,
//   },
//   cancelButtonStyle: {
//     backgroundColor: colors.RED(1),
//     height: 45,
//     marginLeft: 16,
//     width: 140,
//     ":hover": {
//       backgroundColor: colors.RED(1),
//     },
//   },
//   containerStyle: {
//     "@media only screen and (max-width: 665px)": {
//       width: 380,
//     },
//     "@media only screen and (max-width: 415px)": {
//       width: 338,
//     },
//     "@media only screen and (max-width: 321px)": {
//       width: 270,
//       marginBottom: 5,
//     },
//   },
//   error: {
//     border: `1px solid ${colors.RED(1)}`,
//   },
//   form: {
//     alignItems: "center",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "flex-start",
//   },
//   labelStyle: {
//     "@media only screen and (max-width: 321px)": {
//       fontSize: 13,
//     },
//   },
//   loaderStyle: {
//     display: "unset",
//   },
//   modalBody: {
//     alignItems: "center",
//     backgroundColor: "#fff",
//     border: `1px solid ${colors.GREY(1)}`,
//     borderRadius: 4,
//     display: "flex",
//     justifyContent: "center",
//     width: 640,
//     padding: "16px 0",
//     "@media only screen and (max-width: 665px)": {
//       width: 420,
//     },
//     "@media only screen and (max-width: 415px)": {
//       width: 360,
//     },
//     "@media only screen and (max-width: 321px)": {
//       width: 320,
//     },
//   },
// });

// const customModalStyle = {
//   content: {
//     alignItems: "center",
//     backgroundColor: "transparent",
//     display: "flex",
//     justifyContent: "center",
//     left: 0,
//     maxHeight: "80%",
//     overflow: "auto",
//     width: "100%",
//   },
//   overlay: {
//     zIndex: 2,
//   },
// };

const styles = StyleSheet.create({
  list: {
    width: "544px",
    margin: "31px",
  },
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
