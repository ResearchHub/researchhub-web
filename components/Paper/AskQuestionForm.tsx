import { connect } from "react-redux";
import { firstImageFromHtml } from "~/config/utils/getFirstImageOfHtml";
import { Helpers } from "@quantfive/js-web-config";
import { useRouter } from "next/router";
import { StyleSheet, css } from "aphrodite";
import { SyntheticEvent, useEffect, useState } from "react";
import API from "../../config/api";
import Button from "../Form/Button";
import colors from "../../config/themes/colors";
import dynamic from "next/dynamic";
import FormInput from "../Form/FormInput";
import FormSelect from "../Form/FormSelect";
import { getPlainTextFromMarkdown } from "~/config/utils/getPlainTextFromMarkdown";

const DynamicComponent = dynamic(
  () => import("~/components/CKEditor/SimpleEditor")
);

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

const MIN_TITLE_LENGTH = 1;
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
  user: any;
};

function AskQuestionForm({ documentType, user }: AskQuestionFormProps) {
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
  const isPost = documentType === "post";

  // From ./PaperUploadInfo.js
  const getHubs = () => {
    fetch(API.HUB({ pageLimit: 1000 }), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((resp) => {
        /* @ts-ignore */
        const hubs = resp.results
          .map((hub, index) => {
            return {
              ...hub,
              value: hub.id,
              label: hub.name.charAt(0).toUpperCase() + hub.name.slice(1),
            };
          })
          .sort((a, b) => {
            return a.label.localeCompare(b.label);
          });
        setSuggestedHubs(hubs);
      });
  };

  useEffect(getHubs, []);

  const handleSaveDraft = (e: SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    sendPost(true)
      .then(onSuccess(true))
      .catch((err) => setIsSubmitting(false));
  };

  const handlePost = (e: SyntheticEvent) => {
    e.preventDefault();
    if (Object.values(formErrors).some((el: boolean): boolean => el)) {
      setShouldDisplayError(true);
    } else {
      setShouldDisplayError(false);
      setIsSubmitting(true);

      sendPost(false)
        .then(onSuccess(false))
        .catch((err) => setIsSubmitting(false));
    }
  };

  const onSuccess = (isDraft: boolean): ((value: any) => void) => {
    return (response) => {
      const { id, slug } = response;
      router.push(`/${isPost ? "post" : "hypothesis"}/${id}/${slug}`);
    };
  };

  const sendPost = (draft: boolean) => {
    const params = {
      admins: null,
      created_by: user.id,
      document_type: isPost ? "DISCUSSION" : "HYPOTHESIS",
      editors: null,
      full_src: mutableFormFields.text,
      /* @ts-ignore */
      hubs: mutableFormFields.hubs.map((hub) => hub.id),
      is_public: !draft,
      preview_img: firstImageFromHtml(mutableFormFields.text),
      renderable_text: getPlainTextFromMarkdown(mutableFormFields.text),
      title: mutableFormFields.title,
      viewers: null,
    };

    return fetch(
      isPost ? API.RESEARCHHUB_POSTS({}) : API.HYPOTHESIS({}),
      API.POST_CONFIG(params)
    )
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON);
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
    <div className={css(styles.rootContainer)}>
      <form>
        <div className={css(!isPost && styles.columnReverse)}>
          <FormSelect
            containerStyle={[
              styles.chooseHub,
              !isPost && styles.hypothesisChooseHub,
            ]}
            error={
              shouldDisplayError && formErrors.hubs && `Please select a hub`
            }
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
          <FormInput
            containerStyle={[
              styles.titleInputContainer,
              !isPost && styles.hypothesisTitle,
            ]}
            placeholder={"The earth revolves around the sun"}
            error={
              shouldDisplayError && formErrors.title
                ? isPost
                  ? `Title must be between ${MIN_TITLE_LENGTH} and ${MAX_TITLE_LENGTH} characters`
                  : ``
                : null
            }
            errorStyle={styles.errorText}
            id="title"
            inputStyle={shouldDisplayError && formErrors.title && styles.error}
            label={documentType === "hypothesis" ? "Hypothesis" : "Title"}
            labelStyle={styles.label}
            onChange={handleOnChangeFields}
            required
          />
        </div>
        {/* @ts-ignore */}
        <DynamicComponent
          id="text"
          initialData={mutableFormFields.text}
          label={
            documentType === "hypothesis" ? (
              <div>
                <div>Optional: Add a Clarifying Statement</div>
                <p className={css(styles.supportText)}>
                  Is there any clarification or short summary you wish to add to
                  the hypothesis?
                </p>
              </div>
            ) : (
              "Text"
            )
          }
          labelStyle={styles.label}
          onChange={handleOnChangeFields}
          containerStyle={styles.editor}
        />
        <div className={css(styles.buttonsContainer)}>
          {/* @ts-ignore */}
          {/* TODO: briansantoso - add back Save Draft button when needed */}
          {/* <Button
            customButtonStyle={styles.buttonStyle}
            disabled={isSubmitting}
            isWhite={true}
            label="Save Draft"
            onClick={handleSaveDraft}
          />
          <span className={css(styles.buttonSpacer)} /> */}
          {/* @ts-ignore */}
          <Button
            customButtonStyle={styles.buttonStyle}
            disabled={isSubmitting}
            isWhite={false}
            label={isPost ? "Post" : "Create Hypothesis"}
            onClick={handlePost}
          />
        </div>
      </form>
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(AskQuestionForm);

const styles = StyleSheet.create({
  rootContainer: {
    display: "flex",
    flexDirection: "column",
    background: "#FFFFFF",
    border: "1px solid #DEDEE6",
    borderRadius: "3px",
    padding: "20px 40px 30px 40px",
    "@media only screen and (min-width: 1024px)": {
      minWidth: 720,
    },
    "@media only screen and (max-width: 1209px)": {
      paddingLeft: "5vw",
      paddingRight: "5vw",
    },
  },
  columnReverse: {
    display: "flex",
    flexDirection: "column-reverse",
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
    maxWidth: "468px",
    minHeight: "55px",
    marginBottom: "21px",
  },
  hypothesisChooseHub: {
    marginBottom: 35,
  },
  titleInputContainer: {
    width: "auto",
    maxWidth: "851px",
    height: "55px",
    marginBottom: "35px",
  },

  hypothesisTitle: {
    marginBottom: 16,
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
    width: "160px",
    height: "50px",
    "@media only screen and (max-width: 415px)": {
      width: "160px",
      height: "50px",
    },
  },
  editor: {
    width: "720px",
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
