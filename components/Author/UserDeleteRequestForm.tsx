import { bindActionCreators } from "redux";
import { breakpoints } from "~/config/themes/screen";
import { connect } from "react-redux";
import { firstImageFromHtml } from "~/config/utils/getFirstImageOfHtml";
import { formGenericStyles } from "../Paper/Upload/styles/formGenericStyles";
import { getPlainTextFromMarkdown } from "~/config/utils/getPlainTextFromMarkdown";
import { StyleSheet, css } from "aphrodite";
import { Fragment, SyntheticEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ModalActions } from "~/redux/modals";
import { MessageActions } from "~/redux/message";
import { toFormData } from "~/config/utils/toFormData";
import { buildApiUri } from "~/config/utils/buildApiUri";
import { Helpers } from "@quantfive/js-web-config";
import { getCurrentUser } from "~/config/utils/getCurrentUser";
import API from "~/config/api";
import Button from "../Form/Button";
import colors from "../../config/themes/colors";
import dynamic from "next/dynamic";
import FormInput from "../Form/FormInput";
import Ripples from "react-ripples";
import Dropzone from "react-dropzone";


const SimpleEditor = dynamic(() => import("../CKEditor/SimpleEditor"));

type FormFields = {
  details: string;
};

type Args = {
  onError: (error: Error) => void;
  onSuccess: (response: any) => void;
  payload: any;
};

function validateFormField(fieldID: string, value: any): boolean {
  let result: boolean = true;
  switch (fieldID) {
    case "author":
      return value.length > 0;
    default:
      return result;
  }
}

export const createVerificationRequest = ({ onError, onSuccess, payload }: Args): void => {
  fetch(buildApiUri({ apiPath: "user_verification" }), API.POST_FILE_CONFIG(payload))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((res: any) => {
      onSuccess();
    })
    .catch(onError);
};


export type UserDeleteRequestFormProps = {
  author: any;
  modalReduxActions?: any;
  msgReduxActions: any;
  onExit: (event?: SyntheticEvent) => void;
};

function UserDeleteRequestForm({ author, modalReduxActions, msgReduxActions, onExit }: UserDeleteRequestFormProps) {
  const [files, setFiles] = useState([]);
  const [isFileDragged, setIsFiledDragged] = useState<boolean>(false);
  const router = useRouter();
  const [formErrors, setFormErrors] = useState<FormError>({
    details: false,
  });
  const [mutableFormFields, setMutableFormFields] = useState<FormFields>({
    details: "",
  });
  const [shouldDisplayError, setShouldDisplayError] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const currentUser = getCurrentUser();

  const onFormSubmit = (event: SyntheticEvent): void => {
    event.preventDefault();
    if (Object.values(formErrors).some((el: boolean): boolean => el)) {
      setShouldDisplayError(true);
      return;
    } else {
      setShouldDisplayError(false);
      setIsSubmitting(true);
    }

    const payload = toFormData({
      related_author: author.id,
      user: currentUser.id,
      details: mutableFormFields.details,
    });

    files.forEach((file: File) => {
      payload.append("file[]", file)
    });

    createVerificationRequest({
      payload: payload,
      onError: (_err: Error): void => {
        const { response: errorResponse } = _err ?? {};
        const { status: statusCode } = errorResponse ?? {};

        if (statusCode === 413) {
          msgReduxActions.setMessage(
            "The max total file size is 5 MB. Please upload smaller file(s)."
          );
          msgReduxActions.showMessage({ show: true, error: true });
        } else if (statusCode === 429) {
          modalReduxActions.openRecaptchaPrompt(true);
          onExit()
        } else {
          msgReduxActions.setMessage("An error has occured. Please email us for profile deletion");
          msgReduxActions.showMessage({ show: true, error: true });
        }
        setIsSubmitting(false)
      },
      onSuccess: (response: any): void => {
        msgReduxActions.setMessage("Request Submitted");
        msgReduxActions.showMessage({ show: true, error: false });
        onExit();
      },
    });
  };

  const handleOnChangeFields = (fieldID: string, value: string): void => {
    setMutableFormFields({ ...mutableFormFields, [fieldID]: value });
    setFormErrors({
      ...formErrors,
      [fieldID]: !validateFormField(fieldID, value),
    });
    setShouldDisplayError(false);
  };

  const handleFileDrop = async (acceptedFiles) => {
    if (acceptedFiles.length < 1) {
      return;
    }

    setFiles(acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    })));
  };

  const thumbs = files.map(file => (
    <div className={css(styles.thumb)} key={file.name}>
      <div className={css(styles.thumbInner)}>
        <img
          src={file.preview}
          className={css(styles.img)}
          // Revoke data uri after image is loaded
          onLoad={() => { URL.revokeObjectURL(file.preview) }}
        />
      </div>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, []);

  return (
    (<form
      autoComplete={"off"}
      className={css(styles.userDeleteRequestForm)}
      id="userDeleteRequestForm"
      onSubmit={onFormSubmit}
    >
      <FormInput
        containerStyle={[styles.titleInputContainer]}
        value={author.id}
        errorStyle={styles.errorText}
        id="author"
        label={"Author ID"}
        labelStyle={styles.label}
        required
        disabled
      />
      {/* @ts-ignore */}
      <SimpleEditor
        id="details"
        initialData={mutableFormFields.text}
        label="Additional Details"
        placeholder={
          "Include any relevant information to verify your identity to this profile"
        }
        labelStyle={styles.label}
        onChange={handleOnChangeFields}
        containerStyle={styles.editor}
      />
      <div className={css(formGenericStyles.text, styles.label, styles.padding)}>
        {"Additional Images"}
      </div>
      <Ripples className={css(styles.dropzoneContainer)}>
        <Dropzone
          accept="image/*"
          multiple={true}
          onDragEnter={(): void => setIsFiledDragged(true)}
          onDragLeave={(): void => setIsFiledDragged(false)}
          onDrop={handleFileDrop}
        >
          {({ getRootProps, getInputProps }) => (
            <section className={css(styles.fullCanvas)}>
              <div
                {...getRootProps()}
                className={css(
                  styles.dropzone,
                  isFileDragged && styles.dragged
                )}
              >
                <input {...getInputProps()} required={false} />
                <Fragment>
                  <img
                    className={css(styles.uploadImage)}
                    src={"/static/background/homepage-empty-state.png"}
                    alt="Drag N Drop Icon"
                  />
                  <div className={css(styles.instructions)}>
                    {"Drag & drop \n"}
                    <span className={css(styles.subtext)}>
                      {"your file here, or "}
                      <span className={css(styles.browse)} id={"browse"}>
                        {"browse"}
                      </span>
                    </span>
                  </div>
                </Fragment>
              </div>
            </section>
          )}
        </Dropzone>
      </Ripples>
      <aside className={css(styles.thumbContainer)}>
        {thumbs}
      </aside>
      <div className={css(styles.buttonsContainer)}>
        <Button
          customButtonStyle={styles.buttonStyle}
          disabled={isSubmitting}
          label="Submit"
          type="submit"
        />
      </div>
    </form>)
  );
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch) => ({
  modalReduxActions: bindActionCreators(ModalActions, dispatch),
  msgReduxActions: bindActionCreators(MessageActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserDeleteRequestForm);

const styles = StyleSheet.create({
  userDeleteRequestForm: {
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    background: "#FFFFFF",
    "@media only screen and (min-width: 1024px)": {
      minWidth: 720,
    },
    "@media only screen and (max-width: 1209px)": {
      paddingLeft: "5vw",
      paddingRight: "5vw",
    },
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      width: "100%",
    },
  },
  buttonsContainer: {
    width: "auto",
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "30px",
    "@media only screen and (max-width: 767px)": {
      width: "auto",
      justifyContent: "center",
    },
  },
  titleInputContainer: {
    width: "auto",
    maxWidth: "851px",
    height: "55px",
    marginBottom: "35px",
  },
  label: {
    fontWeight: 500,
    fontSize: "19px",
    lineHeight: "21px",
  },
  errorText: {
    marginTop: "5px",
  },
  dropzone: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    boxSizing: "border-box",
    padding: "15px 0px",
    transition: "all ease-out 0.1s",
  },
  dropzoneContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
    height: "100%",
    width: "100%",
    backgroundColor: "#F7F7FB",
    cursor: "pointer",
    borderRadius: 3,
    border: `1px dashed ${colors.BLUE()}`,
    outline: "none",
    ":hover": {
      borderStyle: "solid",
    },
    ":hover #browse": {
      textDecoration: "underline",
    },
  },
  browse: {
    color: colors.BLUE(),
  },
  fullCanvas: {
    height: "100%",
    width: "100%",
  },
  uploadImage: {
    height: 80,
    paddingBottom: 10,
  },
  instructions: {
    fontSize: 18,
    whiteSpace: "pre-wrap",
    textAlign: "center",
  },
  subtext: {
    color: "#757575",
    fontSize: 14,
    marginTop: 15,
  },
  buttonStyle: {
    width: "160px",
    height: "50px",
    "@media only screen and (max-width: 415px)": {
      width: "160px",
      height: "50px",
    },
  },
  editor: {
    width: "721px",
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      width: "80vw",
    },
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      width: "86vw",
    },
  },
  img: {
    display: 'block',
    width: 'auto',
    height: '100%'
  },
  thumbInner: {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
  },
  thumb: {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 125,
    height: 150,
    padding: 4,
    boxSizing: 'border-box'
  },
  thumbContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
  },
  padding: {
    "padding-top": "7px",
    "padding-bottom": "7px",
  }
});
