import Button from "../Form/Button";
import colors from "../../config/themes/colors";
import { createAuthorClaimCase } from "./api/authorClaimCaseCreate";
import { css, StyleSheet } from "aphrodite";
import FormInput from "../Form/FormInput";
import { ID } from "../../config/types/root_types";
import Loader from "../Loader/Loader";
import React, { SyntheticEvent, useState } from "react";

export type AuthorClaimPromptEmailProps = {
  onSuccess: Function;
  targetAuthorID: ID;
  userID: ID;
};

type FormFields = {
  eduEmail: null | string;
};

type FormError = {
  eduEmail: boolean;
};

function validateEmail(email: string): boolean {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const splitted = email.split(".");
  return (
    re.test(String(email).toLowerCase()) &&
    splitted[splitted.length - 1] === "edu"
  );
}

function validateFormField(fieldID: string, value: any): boolean {
  let result: boolean = true;
  switch (fieldID) {
    case "eduEmail":
      return typeof value === "string" && validateEmail(value);
    default:
      return result;
  }
}

export default function AuthorClaimPromptEmail({
  onSuccess,
  targetAuthorID,
  userID,
}: AuthorClaimPromptEmailProps) {
  const [formErrors, setFormErrors] = useState<FormError>({
    eduEmail: false,
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [mutableFormFields, setMutableFormFields] = useState<FormFields>({
    eduEmail: null,
  });
  const [shouldDisplayError, setShouldDisplayError] = useState<boolean>(false);

  const handleOnChangeFields = (fieldID: string, value: string): void => {
    setMutableFormFields({ ...mutableFormFields, [fieldID]: value });
    setFormErrors({
      ...formErrors,
      [fieldID]: validateFormField(fieldID, value),
    });
    setShouldDisplayError(false);
  };

  const handleValidationAndSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    if (Object.values(formErrors).every((el: boolean): boolean => !el)) {
      setShouldDisplayError(true);
    } else {
      setShouldDisplayError(false);
      setIsSubmitting(true);
      createAuthorClaimCase({
        eduEmail: mutableFormFields.eduEmail,
        onError: (): void => {
          setIsSubmitting(false);
        },
        onSuccess: (): void => {
          setIsSubmitting(false);
          onSuccess();
        },
        targetAuthorID,
        userID,
      });
    }
  };

  return (
    <div className={css(verifStyles.rootContainer)}>
      <div className={css(verifStyles.titleContainer)}>
        <div className={css(verifStyles.title)}>Enter your .edu email</div>
      </div>
      <div className={css(verifStyles.subTextContainer)}>
        <div className={css(verifStyles.subText)}>
          Verify your .edu email address
        </div>
      </div>
      <form
        encType="multipart/form-data"
        className={css(verifStyles.form)}
        onSubmit={handleValidationAndSubmit}
      >
        <FormInput
          containerStyle={modalBodyStyles.containerStyle}
          disable={isSubmitting}
          id="eduEmail"
          label="Email"
          labelStyle={verifStyles.labelStyle}
          inputStyle={shouldDisplayError && modalBodyStyles.error}
          onChange={handleOnChangeFields}
          placeholder="Academic .edu email address"
          required
        />
        <div className={css(verifStyles.buttonContainer)}>
          <Button
            label={
              isSubmitting ? (
                <Loader
                  size={8}
                  loading
                  containerStyle={modalBodyStyles.loaderStyle}
                  color="#fff"
                />
              ) : (
                "Verify Email"
              )
            }
            type="submit"
            customButtonStyle={verifStyles.buttonCustomStyle}
            rippleClass={verifStyles.rippleClass}
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
}

const verifStyles = StyleSheet.create({
  rootContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "51px 90px 40px 90px",
    borderRadius: 5,
    transition: "all ease-in-out 0.4s",
    boxSizing: "border-box",
    width: "100%",
    "@media only screen and (min-width: 768px)": {
      overflowY: "auto",
    },
  },
  form: {
    width: "auto",
    position: "relative",
  },
  labelStyle: {
    "@media only screen and (max-width: 321px)": {
      fontWeight: 500,
      fontSize: "14px",
      lineHeight: "16px",
      color: "#241F3A",
    },
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    width: "auto",
    zIndex: 2,
    marginTop: 40,
  },
  buttonCustomStyle: {
    padding: "18px 21px",
    width: "258px",
    height: "55px",
    fontSize: "16px",
    lineHeight: "19px",
    "@media only screen and (max-width: 415px)": {
      width: "100%",
    },
  },
  rippleClass: {},
  closeButton: {
    height: 12,
    width: 12,
    position: "absolute",
    top: 6,
    right: 0,
    padding: 16,
    cursor: "pointer",
  },
  titleContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
    boxSizing: "border-box",
    marginBottom: "7px",
  },
  title: {
    fontWeight: 500,
    height: 30,
    width: "100%",
    fontSize: 26,
    color: "#232038",
    "@media only screen and (max-width: 557px)": {
      fontSize: 24,
      width: 380,
    },
    "@media only screen and (max-width: 725px)": {
      width: 450,
    },
    "@media only screen and (max-width: 415px)": {
      width: 300,
      fontSize: 22,
    },
    "@media only screen and (max-width: 321px)": {
      width: 280,
    },
  },
  subTextContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
    boxSizing: "border-box",
  },
  subText: {
    fontWeight: "normal",
    fontSize: "16px",
    lineHeight: "22px",

    display: "flex",
    alignItems: "center",
    textAlign: "center",
    color: "#241F3A",
    opacity: 0.8,
  },
  modalContentStyles: {},
});

const modalBodyStyles = StyleSheet.create({
  containerStyle: {
    "@media only screen and (max-width: 665px)": {
      width: 380,
    },
    "@media only screen and (max-width: 415px)": {
      width: 338,
    },
    "@media only screen and (max-width: 321px)": {
      width: 270,
      marginBottom: 5,
    },
  },
  error: {
    border: `1px solid ${colors.RED(1)}`,
  },
  loaderStyle: {
    display: "unset",
  },
});
