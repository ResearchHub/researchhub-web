import React, { useState } from "react";
import FormInput from "../Form/FormInput";
import Button from "../Form/Button";
import FormSelect from "../Form/FormSelect";
import { StyleSheet, css } from "aphrodite";
import FormTextArea from "../Form/FormTextArea";

export default function AskQuesitonForm() {
  let [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Choose a Hub

  // Title

  // Text

  // Save Draft, Post
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
        <FormTextArea label="Text" />
        <div className={css(styles.buttonsContainer)}>
          <Button
            isWhite={true}
            label="Save Draft"
            disabled={isSubmitting}
            customButtonStyle={styles.buttonStyle}
          />
          <Button
            isWhite={false}
            label="Post"
            disabled={isSubmitting}
            customButtonStyle={styles.buttonStyle}
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
  buttonStyle: {
    marginLeft: "31px",
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
