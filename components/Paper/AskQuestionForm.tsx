import React, { useState } from "react";
import FormInput from "../Form/FormInput";
import Button from "../Form/Button";
import FormSelect from "../Form/FormSelect";
import { StyleSheet, css } from "aphrodite";
import FormTextArea from "../Form/FormTextArea";
import { MyEditor } from "../CKEditor/MyEditor";

export default function AskQuesitonForm() {
  let [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSaveDraft = () => {
    setIsSubmitting(true);
  };

  const handlePost = () => {
    setIsSubmitting(true);
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
          containerStyle={styles.titleInputContainer}
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
});
