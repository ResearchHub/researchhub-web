import Button from "../Form/Button";
import FormInput from "../Form/FormInput";
import FormSelect from "../Form/FormSelect";
import React, { SyntheticEvent, useState } from "react";
import colors from "../../config/themes/colors";
import { SimpleEditor } from "../CKEditor/SimpleEditor";
import { StyleSheet, css } from "aphrodite";

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
          containerStyle={styles.chooseHub}
          id="hub"
          inputStyle={shouldDisplayError && styles.error}
          label="Choose a hub"
          labelStyle={styles.labelStyle}
          onChange={handleOnChangeFields}
          required
        />
        <FormInput
          containerStyle={styles.titleInputContainer}
          id="title"
          inputStyle={shouldDisplayError && styles.error}
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
