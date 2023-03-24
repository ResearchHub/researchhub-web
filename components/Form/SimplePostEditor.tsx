import { breakpoints } from "~/config/themes/screen";
import { connect } from "react-redux";
import { createQuestion } from "../Question/api/createQuestion";
import { firstImageFromHtml } from "~/config/utils/getFirstImageOfHtml";
import { getPlainTextFromMarkdown } from "~/config/utils/getPlainTextFromMarkdown";
import { StyleSheet, css } from "aphrodite";
import { SyntheticEvent, useState } from "react";
import { useEffectFetchSuggestedHubs } from "../Paper/Upload/api/useEffectGetSuggestedHubs";
import { useRouter } from "next/router";
import Button from "../Form/Button";
import colors from "../../config/themes/colors";
import dynamic from "next/dynamic";
import FormInput from "../Form/FormInput";
import FormSelect from "../Form/FormSelect";

const SimpleEditor = dynamic(() => import("../CKEditor/SimpleEditor"));

type FormFields = {
  hubs: any[];
  text: string;
  title: string;
};

type FormError = {
  hubs: boolean;
  text: boolean;
  title: boolean;
};

const MIN_TITLE_LENGTH = 10;
const MAX_TITLE_LENGTH = 250;

function validateFormField(fieldID: string, value: any): boolean {
  let result: boolean = true;
  switch (fieldID) {
    case "title":
      return (
        value.length >= MIN_TITLE_LENGTH && value.length <= MAX_TITLE_LENGTH
      );
    case "hubs":
      return value && value.length > 0;
    case "text":
      return true;
    default:
      return result;
  }
}

export type SimplePostEditorProps = {
  documentType: string;
  onSuccess: (post: Record<string, unknown>) => void;
  user: any;
  label: string;
  editorCTA: string;
  buttonLabel: string;
  bountyType?: string;
  title: string;
  otherButtons: any; // TODO: list of react elements?
};

function SimplePostEditor({
  documentType,
  label,
  buttonLabel,
  user,
  otherButtons,
  onSuccess,
  bountyType,
  editorCTA,
  title,
}: SimplePostEditorProps) {
  const router = useRouter();
  const [formErrors, setFormErrors] = useState<FormError>({
    hubs: true,
    text: false,
    title: true,
  });
  const [mutableFormFields, setMutableFormFields] = useState<FormFields>({
    hubs: [],
    text: "",
    title: "",
  });
  const [suggestedHubs, setSuggestedHubs] = useState([]);
  const [shouldDisplayError, setShouldDisplayError] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffectFetchSuggestedHubs({ setSuggestedHubs });

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
        document_type: documentType,
        editors: null,
        bounty_type: bountyType,
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
        onSuccess(response);
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

  return (
    <form
      autoComplete={"off"}
      className={css(styles.askQuestionForm)}
      id="askQuestionForm"
      onSubmit={onFormSubmit}
    >
      <FormInput
        containerStyle={[styles.titleInputContainer]}
        placeholder={
          title ? title : "e.g. Are sugar subtitutes safe to consume?"
        }
        error={
          shouldDisplayError && formErrors.title
            ? `Title must be between ${MIN_TITLE_LENGTH} and ${MAX_TITLE_LENGTH} characters`
            : null
        }
        errorStyle={styles.errorText}
        id="title"
        inputStyle={shouldDisplayError && formErrors.title && styles.error}
        label={label}
        labelStyle={styles.label}
        onChange={handleOnChangeFields}
        required
      />
      {/* @ts-ignore */}
      <SimpleEditor
        id="text"
        initialData={mutableFormFields.text}
        label="Additional Details"
        placeholder={
          editorCTA
            ? editorCTA
            : "Include all the information someone would need to fulfill your bounty. Be specific about what you need."
        }
        labelStyle={styles.label}
        onChange={handleOnChangeFields}
        containerStyle={styles.editor}
        required
      />
      <FormSelect
        containerStyle={[styles.chooseHub]}
        error={shouldDisplayError && formErrors.hubs && `Please select a hub`}
        errorStyle={styles.errorText}
        id="hubs"
        inputStyle={shouldDisplayError && formErrors.hubs && styles.error}
        isMulti={true}
        label="Hubs"
        labelStyle={styles.label}
        menu={styles.dropDown}
        onChange={handleOnChangeFields}
        options={suggestedHubs}
        placeholder="Search Hubs"
        required
      />
      <div className={css(styles.buttonsContainer)}>
        {otherButtons && otherButtons}
        <div style={{ marginLeft: "auto" }}>
          <Button
            customButtonStyle={styles.buttonStyle}
            disabled={isSubmitting}
            label={buttonLabel}
            type="submit"
          />
        </div>
      </div>
    </form>
  );
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(SimplePostEditor);

const styles = StyleSheet.create({
  askQuestionForm: {
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    background: "#FFFFFF",
    "@media only screen and (min-width: 1024px)": {
      minWidth: 720,
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
  buttonStyle: {
    marginLeft: "auto",
  },
  editor: {
    width: "721px",
    "@media only screen and (max-width: 900px)": {
      width: "80vw",
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
