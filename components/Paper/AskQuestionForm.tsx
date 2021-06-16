import API from "../../config/api";
import Button from "../Form/Button";
import FormInput from "../Form/FormInput";
import FormSelect from "../Form/FormSelect";
import React, { SyntheticEvent, useEffect, useState } from "react";
import colors from "../../config/themes/colors";
import removeMd from "remove-markdown";
import { Helpers } from "@quantfive/js-web-config";
import { Router, useRouter } from "next/router";
import { SimpleEditor } from "../CKEditor/SimpleEditor";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";

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

function firstImageFromMarkdown(text: string): string | null {
  // https://stackoverflow.com/questions/26024796/what-type-of-regexp-would-i-need-to-extract-image-url-from-markdown
  const match = text.match(/!\[.*?\]\((.*?)\)/);
  return match ? match[1] : null;
}

export type AskQuestionFormProps = {
  user: any;
};

function markdownToPlaintext(text: string): string {
  return removeMd(text).replace(/&nbsp;/g, " ");
}

function AskQuestionForm({ user }: AskQuestionFormProps) {
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

  // From ./PaperUploadInfo.js
  const getHubs = () => {
    fetch(API.HUB({ pageLimit: 1000 }), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((resp) => {
        /* @ts-ignore */
        let hubs = resp.results
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
      const { id, title } = response;
      const slug = title.toLowerCase().replace(/\s/g, "-");
      router.push(`/post/${id}/${slug}`);
    };
  };

  const sendPost = (draft: boolean) => {
    const params = {
      admins: null,
      created_by: user.id,
      document_type: "DISCUSSION",
      editors: null,
      full_src: mutableFormFields.text,
      /* @ts-ignore */
      hubs: mutableFormFields.hubs.map((hub) => hub.id),
      is_public: !draft,
      preview_img: firstImageFromMarkdown(mutableFormFields.text),
      renderable_text: markdownToPlaintext(mutableFormFields.text),
      title: mutableFormFields.title,
      viewers: null,
    };

    return fetch(API.RESEARCHHUB_POSTS({}), API.POST_CONFIG(params))
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
        <FormSelect
          containerStyle={styles.chooseHub}
          error={shouldDisplayError && formErrors.hubs && `Please select a hub`}
          errorStyle={styles.errorText}
          id="hubs"
          inputStyle={shouldDisplayError && formErrors.hubs && styles.error}
          isMulti={true}
          label="Choose a hub"
          labelStyle={styles.label}
          menu={styles.dropDown}
          onChange={handleOnChangeFields}
          options={suggestedHubs}
          placeholder="Search Hubs"
          required
        />
        <FormInput
          containerStyle={styles.titleInputContainer}
          error={
            shouldDisplayError &&
            formErrors.title &&
            `Title must be between ${MIN_TITLE_LENGTH} and ${MAX_TITLE_LENGTH} characters`
          }
          errorStyle={styles.errorText}
          id="title"
          inputStyle={shouldDisplayError && formErrors.title && styles.error}
          label="Title"
          labelStyle={styles.label}
          onChange={handleOnChangeFields}
          placeholder="Title"
          required
        />
        {/* @ts-ignore */}
        <SimpleEditor
          id="text"
          initialData={mutableFormFields.text}
          label="Text"
          labelStyle={styles.label}
          onChange={handleOnChangeFields}
          containerStyle={styles.editor}
        />
        <div className={css(styles.buttonsContainer)}>
          {/* @ts-ignore */}
          <Button
            customButtonStyle={styles.buttonStyle}
            disabled={isSubmitting}
            isWhite={true}
            label="Save Draft"
            onClick={handleSaveDraft}
          />
          <span className={css(styles.buttonSpacer)} />
          {/* @ts-ignore */}
          <Button
            customButtonStyle={styles.buttonStyle}
            disabled={isSubmitting}
            isWhite={false}
            label="Post"
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
    alignSelf: "stretch",
    background: "#FFFFFF",
    border: "1px solid #DEDEE6",
    borderRadius: "3px",
    padding: "24px 50px 49px 50px",
    minWidth: 0,
  },
  buttonsContainer: {
    width: "auto",
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "42px",
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
  buttonStyle: {},
  editor: {
    width: "720px",
    "@media only screen and (max-width: 900px)": {
      width: "80vw",
    },
  },
});
