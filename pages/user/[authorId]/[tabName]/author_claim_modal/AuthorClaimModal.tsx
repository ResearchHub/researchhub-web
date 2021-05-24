import { css, StyleSheet } from "aphrodite";
import Button from "../../../../../components/Form/Button";
import colors from "../../../../../config/themes/colors";
import FormInput from "../../../../../components/Form/FormInput";
import Loader from "../../../../../components/Loader/Loader";
import Modal from "react-modal";
import React, { ReactElement, SyntheticEvent, useState } from "react";
import { createAuthorClaimCase } from "./api/authorClaimCaseCreate";

export type AuthorClaimDataProps = {
  auth: any;
  author: any;
  isOpen: boolean;
  setIsOpen: (flag: boolean) => void;
  user: any;
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
    splitted[splitted.length - 1] === ".edu"
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

export default function AuthorClaimModal({
  auth,
  author,
  isOpen,
  setIsOpen,
  user,
}: AuthorClaimDataProps): ReactElement<typeof Modal> {
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
          setIsOpen(false);
        },
        targetAuthorID: author.id,
        userID: auth.user.id,
      });
    }
  };

  return (
    <Modal
      children={
        <div className={css(modalBodyStyles.modalBody)}>
          <form
            encType="multipart/form-data"
            className={css(modalBodyStyles.form)}
            onSubmit={handleValidationAndSubmit}
          >
            <FormInput
              containerStyle={modalBodyStyles.containerStyle}
              disabled
              id="user_name"
              label="Your name"
              labelStyle={modalBodyStyles.labelStyle}
              placeholder="your name"
              required
              value={`${user.first_name} ${user.last_name}`}
            />
            <FormInput
              containerStyle={modalBodyStyles.containerStyle}
              disabled
              id="author_name"
              label="Claiming author's name"
              labelStyle={modalBodyStyles.labelStyle}
              placeholder="academic email address"
              required
              value={`${author.first_name} ${author.last_name}`}
            />
            <FormInput
              containerStyle={modalBodyStyles.containerStyle}
              disable={isSubmitting}
              id="eduEmail"
              label="Your .edu email address"
              labelStyle={modalBodyStyles.labelStyle}
              inputStyle={shouldDisplayError && modalBodyStyles.error}
              onChange={handleOnChangeFields}
              placeholder="academic email address"
              required
            />
            <div>
              <Button
                customButtonStyle={modalBodyStyles.buttonStyle}
                disable={isSubmitting}
                label={
                  !isSubmitting ? (
                    "Request"
                  ) : (
                    <Loader
                      size={8}
                      loading
                      containerStyle={modalBodyStyles.loaderStyle}
                      color="#fff"
                    />
                  )
                }
                type="submit"
              />
              <Button
                customButtonStyle={modalBodyStyles.cancelButtonStyle}
                disabled={isSubmitting}
                label="Cancel"
                onClick={(e: SyntheticEvent): void => {
                  e.preventDefault();
                  setIsOpen(false);
                }}
              />
            </div>
          </form>
        </div>
      }
      isOpen={isOpen}
      style={customModalStyle}
    />
  );
}

const modalBodyStyles = StyleSheet.create({
  buttonStyle: {
    height: 45,
    width: 140,
  },
  cancelButtonStyle: {
    backgroundColor: colors.RED(1),
    height: 45,
    marginLeft: 16,
    width: 140,
    ":hover": {
      backgroundColor: colors.RED(1),
    },
  },
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
  form: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  labelStyle: {
    "@media only screen and (max-width: 321px)": {
      fontSize: 13,
    },
  },
  loaderStyle: {
    display: "unset",
  },
  modalBody: {
    alignItems: "center",
    backgroundColor: "#fff",
    border: `1px solid ${colors.GREY(1)}`,
    borderRadius: 4,
    display: "flex",
    justifyContent: "center",
    width: 640,
    padding: "16px 0",
    "@media only screen and (max-width: 665px)": {
      width: 420,
    },
    "@media only screen and (max-width: 415px)": {
      width: 360,
    },
    "@media only screen and (max-width: 321px)": {
      width: 320,
    },
  },
});

const customModalStyle = {
  content: {
    alignItems: "center",
    backgroundColor: "transparent",
    display: "flex",
    justifyContent: "center",
    left: 0,
    maxHeight: "80%",
    overflow: "auto",
    width: "100%",
  },
  overlay: {
    zIndex: 2,
  },
};
