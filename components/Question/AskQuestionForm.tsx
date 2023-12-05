import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { breakpoints } from "~/config/themes/screen";
import { connect } from "react-redux";
import { createQuestion } from "./api/createQuestion";
import { firstImageFromHtml } from "~/config/utils/getFirstImageOfHtml";
import { formGenericStyles } from "../Paper/Upload/styles/formGenericStyles";
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
import HubSelect from "../Hubs/HubSelect";
import { Switch } from "@mui/material";
import { BountyInput } from "../Bounty/BountyModal";

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
  const result = true;
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

export type AskQuestionFormProps = {
  documentType: string;
  onExit: (event?: SyntheticEvent) => void;
  user: any;
};

function AskQuestionForm({ documentType, user, onExit }: AskQuestionFormProps) {
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
  const [withBounty, setWithBounty] = useState<boolean>(false);
  const [bountyOffered, setBountyOffered] = useState<number>(0);
  const [bountyError, setBountyError] = useState<any>(null);

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
        router.push(`/question/${id}/${slug}`);
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

  const handleBountyInputChange = ({ hasError, errorMsg, value }) => {
    setBountyOffered(value);
    setBountyError(errorMsg);
  };

  return (
    <form
      autoComplete={"off"}
      className={css(styles.askQuestionForm)}
      id="askQuestionForm"
      onSubmit={onFormSubmit}
    >
      <div className={css(formGenericStyles.text, styles.header)}>
        {"Ask a Question"}
        <a
          className={css(formGenericStyles.authorGuidelines)}
          style={{ color: colors.BLUE(1) }}
          href="https://www.notion.so/researchhub/Paper-Submission-Guidelines-a2cfa1d9b53c431a91c9816e17f212e1"
          target="_blank"
          rel="noreferrer noopener"
        >
          {"Submission Guidelines"}
        </a>
        <span className={css(styles.close)} onClick={onExit}>
          {<FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>}
        </span>
      </div>
      <FormInput
        containerStyle={[styles.titleInputContainer]}
        placeholder={"e.g. Are there limits to human knowledge?"}
        error={
          shouldDisplayError && formErrors.title
            ? `Title must be between ${MIN_TITLE_LENGTH} and ${MAX_TITLE_LENGTH} characters`
            : null
        }
        errorStyle={styles.errorText}
        id="title"
        inputStyle={shouldDisplayError && formErrors.title && styles.error}
        label={"Question"}
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
          "Include all the information someone would need to answer your question. Be specific about what you need."
        }
        labelStyle={styles.label}
        onChange={handleOnChangeFields}
        containerStyle={styles.editor}
        required
      />
      <div className={css(styles.hubsContainer)}>
        <HubSelect
          selectedHubs={mutableFormFields.hubs}
          labelStyle={styles.label}
          onChange={(hubs) => {
            handleOnChangeFields("hubs", hubs);
          }}
          menuPlacement="top"
        />
      </div>
      <div className={css(styles.researchcoinContainer)}>
        <div
          className={css(styles.label, styles.rscLabel)}
          onClick={() => setWithBounty(!withBounty)}
        >
          ResearchCoin Bounty
          <Switch
            sx={{
              "& .MuiSwitch-switchBase": {
                "&.Mui-checked": {
                  color: colors.NEW_BLUE(),
                },
                "&.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: colors.NEW_BLUE(),
                },
              },
            }}
            onChange={(event) => {
              setWithBounty(event.target.checked);
            }}
          />
        </div>
        <p style={{ fontSize: 16 }}>
          Incentivize the community to answer your question by adding RSC.
        </p>
        {withBounty && (
          <>
            <div style={{ border: `1px solid rgb(232, 232, 242)` }}>
              <BountyInput handleBountyInputChange={handleBountyInputChange} />
            </div>
          </>
        )}
      </div>
      <div
        className={css(
          styles.buttonsContainer,
          withBounty && bountyError && styles.buttonRowWithErrorText
        )}
      >
        {withBounty && bountyError && (
          <div className={css(styles.errorText)}>{bountyError}</div>
        )}
        <Button
          customButtonStyle={styles.buttonStyle}
          disabled={isSubmitting}
          label="Ask Question"
          type="submit"
        />
      </div>
    </form>
  );
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(AskQuestionForm);

const styles = StyleSheet.create({
  hubsContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  errorText: {
    color: colors.RED(),
    fontSize: 14,
    textAlign: "left",
  },
  buttonRowWithErrorText: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  researchcoinContainer: {},
  rscLabel: {
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    fontWeight: 500,
    marginBottom: 10,
    color: "#232038",
  },
  askQuestionForm: {
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
    height: 19,
    fontWeight: 500,
    fontSize: "18px",
    lineHeight: "21px",
  },
  error: {
    border: `1px solid ${colors.RED(1)}`,
  },
  dropDown: {
    zIndex: 999,
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
