import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { breakpoints } from "~/config/themes/screen";
import { connect } from "react-redux";
import { firstImageFromHtml } from "~/config/utils/getFirstImageOfHtml";
import { formGenericStyles } from "../Paper/Upload/styles/formGenericStyles";
import { getPlainTextFromMarkdown } from "~/config/utils/getPlainTextFromMarkdown";
import { StyleSheet, css } from "aphrodite";
import { Fragment, SyntheticEvent, useState } from "react";
import { useEffectFetchSuggestedHubs } from "../Paper/Upload/api/useEffectGetSuggestedHubs";
import { useRouter } from "next/router";
import Button from "../Form/Button";
import colors from "../../config/themes/colors";
import dynamic from "next/dynamic";
import FormInput from "../Form/FormInput";
import FormSelect from "../Form/FormSelect";
import HubSelect from "../Hubs/HubSelect";
import Ripples from "react-ripples";
import Dropzone from "react-dropzone";


const SimpleEditor = dynamic(() => import("../CKEditor/SimpleEditor"));

type FormFields = {
  reason: string;
  author: string;
};

type FormError = {
  reason: boolean;
  author: boolean;
};

const MIN_TITLE_LENGTH = 10;
const MAX_TITLE_LENGTH = 250;

function validateFormField(fieldID: string, value: any): boolean {
  let result: boolean = true;
  switch (fieldID) {
    case "author":
      return value.length > 0;
    default:
      return result;
  }
}

export type UserDeleteRequestFormProps = {
  onExit: (event?: SyntheticEvent) => void;
  user: any;
};

function UserDeleteRequestForm({ user, onExit }: UserDeleteRequestFormProps) {
  const [isFileDragged, setIsFiledDragged] = useState<boolean>(false);
  const router = useRouter();
  const [formErrors, setFormErrors] = useState<FormError>({
    reason: true,
    author: true,
  });
  const [mutableFormFields, setMutableFormFields] = useState<FormFields>({
    reason: "",
    author: "",
  });
  const [shouldDisplayError, setShouldDisplayError] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onFormSubmit = (event: SyntheticEvent): void => {
    event.preventDefault();
    if (Object.values(formErrors).some((el: boolean): boolean => el)) {
      setShouldDisplayError(true);
      return;
    } else {
      setShouldDisplayError(false);
      setIsSubmitting(true);
    }

    createQuestion({
      payload: {
        admins: null,
        created_by: user.id,
        document_type: "QUESTION",
        editors: null,
        full_src: mutableFormFields.text,
        hubs: mutableFormFields.hubs.map((hub) => hub.id),
        is_public: true,
        preview_img: firstImageFromHtml(mutableFormFields.text),
        renderable_text: getPlainTextFromMarkdown(mutableFormFields.text),
        title: mutableFormFields.title,
        viewers: null,
      },
      onError: (_err: Error): void => setIsSubmitting(false),
      onSuccess: (response: any): void => {
        const { id, slug } = response ?? {};
        router.push(`/post/${id}/${slug}`);
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

    const targetFile = acceptedFiles[0];
    const { name, type, path } = targetFile ?? {};
  };

  return (
    (<form
      autoComplete={"off"}
      className={css(styles.userDeleteRequestForm)}
      id="userDeleteRequestForm"
      onSubmit={onFormSubmit}
    >
      <FormInput
        containerStyle={[styles.titleInputContainer]}
        value={user.id}
        errorStyle={styles.errorText}
        id="title"
        label={"Author ID"}
        labelStyle={styles.label}
        disabled
        required
      />
      {/* @ts-ignore */}
      <SimpleEditor
        id="text"
        initialData={mutableFormFields.text}
        label="Additional Details"
        placeholder={
          "Include any relevant information to verify your identity to this profile"
        }
        labelStyle={styles.label}
        onChange={handleOnChangeFields}
        containerStyle={styles.editor}
      />
      <div className={css(formGenericStyles.text, styles.label)}>
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
                <input {...getInputProps()} required={true} />
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

export default connect(mapStateToProps)(UserDeleteRequestForm);

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
  close: {
    cursor: "pointer",
    fontSize: 18,
    position: "absolute",
    right: 0,
    top: -12,
    opacity: 0.6,
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      fontSize: 20,
      top: -32,
      right: -14,
    },
  },
  header: {
    alignItems: "center",
    borderBottom: `1px solid ${colors.GREY_BORDER}`,
    display: "flex",
    fontSize: 26,
    fontWeight: 500,
    justifyContent: "space-between",
    paddingBottom: 8,
    paddingTop: 20,
    position: "relative",
    width: "100%",
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      fontSize: 18,
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
  buttonSpacer: {
    width: "100%",
    maxWidth: "31px",
  },
  chooseHub: {
    width: "100%",
    minHeight: "55px",
    marginBottom: "21px",
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
  error: {
    border: `1px solid ${colors.RED(1)}`,
  },
  errorText: {
    marginTop: "5px",
  },
  dropDown: {
    zIndex: 999,
  },
  dropzone: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    boxSizing: "border-box",
    padding: "20px 0px",
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
  supportText: {
    marginTop: 6,
    opacity: 0.6,
    fontSize: 14,
    letterSpacing: 0.7,
    fontStyle: "italic",
    marginBottom: 6,
  },
});
