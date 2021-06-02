import React, { SyntheticEvent, useState } from "react";
import FormInput from "../Form/FormInput";
import Button from "../Form/Button";
import FormSelect from "../Form/FormSelect";
import { StyleSheet, css } from "aphrodite";
import FormTextArea from "../Form/FormTextArea";
import { MyEditor } from "../CKEditor/MyEditor";
import colors from "../../config/themes/colors";

type FormFields = {
  title: null | string;
  hub: null | string;
};

type FormError = {
  title: boolean;
  hub: boolean;
};

function validateFormField(fieldID: string, value: any): boolean {
  let result: boolean = true;
  switch (fieldID) {
    case "title":
      return !!value; // title exists (and is not empty string)
    case "hub":
      return !!value; // TODO: briansantoso - check that hub is a real hub
    default:
      return result;
  }
}

export default function AskQuesitonForm() {
  const [formErrors, setFormErrors] = useState<FormError>({
    title: false,
    hub: false,
  });
  const [mutableFormFields, setMutableFormFields] = useState<FormFields>({
    title: null,
    hub: null,
  });
  const [shouldDisplayError, setShouldDisplayError] = useState<boolean>(false);
  let [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSaveDraft = (e: SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  };

  const handlePost = (e: SyntheticEvent) => {
    e.preventDefault();
    if (Object.values(formErrors).every((el: boolean): boolean => !el)) {
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
      [fieldID]: validateFormField(fieldID, value),
    });
    setShouldDisplayError(false);
  };

  return (
    <div className={css(styles.rootContainer)}>
      <form>
        <FormSelect
          label="Choose a hub"
          containerStyle={styles.chooseHub}
          required={true}
        />
        <FormInput
          label="Title"
          required={true}
          id="title"
          containerStyle={styles.titleInputContainer}
          labelStyle={styles.labelStyle}
          inputStyle={shouldDisplayError && styles.error}
          onChange={handleOnChangeFields}
          placeholder="Title"
        />
        {/* <FormTextArea label="Text" /> */}
        <MyEditor />
        <div className={css(styles.buttonsContainer)}>
          <Button
            isWhite={true}
            label="Save Draft"
            disabled={isSubmitting}
            customButtonStyle={styles.buttonStyle}
            onClick={handleSaveDraft}
          />
          <span className={css(styles.buttonSpacer)} />
          <Button
            isWhite={false}
            label="Post"
            disabled={isSubmitting}
            customButtonStyle={styles.buttonStyle}
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
    width: "951px",
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
  error: {
    border: `1px solid ${colors.RED(1)}`,
  },
});
