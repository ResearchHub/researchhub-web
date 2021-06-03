import Button from "../Form/Button";
import FormInput from "../Form/FormInput";
import FormSelect from "../Form/FormSelect";
import React, { SyntheticEvent, useEffect, useState } from "react";
import colors from "../../config/themes/colors";
import { SimpleEditor } from "../CKEditor/SimpleEditor";
import { StyleSheet, css } from "aphrodite";
import API from "../../config/api";
import { Helpers } from "@quantfive/js-web-config";

type FormFields = {
  hub: null | object;
  text: string;
  title: string;
};

type FormError = {
  hub: boolean;
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
    case "hub":
      return !!value; // TODO: briansantoso - check that hub is a real hub
    case "text":
      return false;
    default:
      return result;
  }
}

export default function AskQuestionForm() {
  const [formErrors, setFormErrors] = useState<FormError>({
    hub: true,
    text: false,
    title: true,
  });
  const [mutableFormFields, setMutableFormFields] = useState<FormFields>({
    hub: null,
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
    // TODO: briansantoso - hookup to backend
  };

  const handlePost = (e: SyntheticEvent) => {
    e.preventDefault();
    if (Object.values(formErrors).some((el: boolean): boolean => el)) {
      setShouldDisplayError(true);
    } else {
      setShouldDisplayError(false);
      setIsSubmitting(true);
      // TODO: briansantso - hookup to backend
    }
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
          error={shouldDisplayError && formErrors.hub && `Please select a hub`}
          errorStyle={styles.errorText}
          id="hub"
          inputStyle={shouldDisplayError && formErrors.hub && styles.error}
          isMulti={false}
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
        <SimpleEditor
          id="text"
          initialData={mutableFormFields.text}
          onChange={handleOnChangeFields}
          label="Text"
          labelStyle={styles.label}
        />
        <div className={css(styles.buttonsContainer)}>
          <Button
            customButtonStyle={styles.buttonStyle}
            disabled={isSubmitting}
            isWhite={true}
            label="Save Draft"
            onClick={handleSaveDraft}
          />
          <span className={css(styles.buttonSpacer)} />
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

const styles = StyleSheet.create({
  rootContainer: {
    display: "flex",
    flexDirection: "column",
    alignSelf: "stretch",
    background: "#FFFFFF",
    border: "1px solid #DEDEE6",
    borderRadius: "3px",
    padding: "24px 50px 49px 50px",
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
    height: "55px",
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
});
