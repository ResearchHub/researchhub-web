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
  title: null | string;
  hub: null | object;
};

type FormError = {
  title: boolean;
  hub: boolean;
};

function validateFormField(fieldID: string, value: any): boolean {
  let result: boolean = true;
  switch (fieldID) {
    case "title":
      return !!value && value.length <= 250; // title exists (and is not empty string)
    case "hub":
      return !!value; // TODO: briansantoso - check that hub is a real hub
    default:
      return result;
  }
}

export default function AskQuestionForm() {
  const [formErrors, setFormErrors] = useState<FormError>({
    title: true,
    hub: true,
  });
  const [mutableFormFields, setMutableFormFields] = useState<FormFields>({
    title: null,
    hub: null,
  });
  const [suggestedHubs, setSuggestedHubs] = useState([]);
  let [shouldDisplayError, setShouldDisplayError] = useState<boolean>(false);
  let [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
  };

  const handlePost = (e: SyntheticEvent) => {
    console.log(mutableFormFields);
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
          id="hub"
          inputStyle={shouldDisplayError && formErrors.hub && styles.error}
          label="Choose a hub"
          labelStyle={styles.labelStyle}
          onChange={handleOnChangeFields}
          placeholder="Search Hubs"
          required
          isMulti={false}
          options={suggestedHubs}
        />
        <FormInput
          containerStyle={styles.titleInputContainer}
          id="title"
          inputStyle={shouldDisplayError && formErrors.title && styles.error}
          label="Title"
          labelStyle={styles.labelStyle}
          onChange={handleOnChangeFields}
          placeholder="Title"
          required
        />
        <div className={css(styles.editorLabel)}>Text</div>
        <SimpleEditor />
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
    maxWidth: "951px",
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
  },
  buttonSpacer: {
    width: "31px",
  },
  chooseHub: {
    width: "468px",
    height: "55px",
  },
  titleInputContainer: {
    width: "auto",
    height: "55px",
  },
  labelStyle: {
    "@media only screen and (max-width: 321px)": {
      fontWeight: 500,
      fontSize: "14px",
      lineHeight: "16px",
      color: "#241F3A",
    },
  },
  editorLabel: {
    fontWeight: 500,
    marginBottom: 10,
    color: "#232038",
    display: "flex",
    justifyContent: "flex-start",
  },
  error: {
    border: `1px solid ${colors.RED(1)}`,
  },
});
