import { SyntheticEvent, useState } from "react";
import { connect } from "react-redux";
import Button from "../Form/Button";
import colors from "../../config/themes/colors";
import { createAuthorClaimCase } from "./api/authorClaimCaseCreate";
import { css, StyleSheet } from "aphrodite";
import FormInput from "../Form/FormInput";
import { ID } from "../../config/types/root_types";
import Loader from "../Loader/Loader";
import { nullthrows } from "../../config/utils/nullchecks";
import FormSelect from "../Form/FormSelect";
import { breakpoints } from "../../config/themes/screen";
import { MessageActions } from "../../redux/message";

export type AuthorClaimPromptEmailProps = {
  authorData: AuthorDatum[];
  onSuccess: Function;
  userID: ID;
  setMessage: Function;
  showMessage: Function;
};

export type AuthorDatum = {
  id: ID;
  name: string;
};

type DropDownAuthor = {
  id: ID;
  name: string;
  label: string;
};

type FormFields = {
  eduEmail: null | string;
};

type FormError = {
  eduEmail: boolean;
};

function validateEmail(email: string): boolean {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const splitEmail = email.split(".");
  const stringEndsWithEDU = splitEmail[splitEmail.length - 1] === "edu";
  return re.test(String(email).toLowerCase()) && stringEndsWithEDU;
}

function validateFormField(fieldID: string, value: any): boolean {
  let result: boolean = true;
  switch (fieldID) {
    // case "eduEmail":
    //   return typeof value === "string" && validateEmail(value);
    default:
      return result;
  }
}

function AuthorClaimPromptEmail({
  authorData,
  onSuccess,
  userID,
  setMessage,
  showMessage,
}: AuthorClaimPromptEmailProps) {
  const [formErrors, setFormErrors] = useState<FormError>({
    eduEmail: true,
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [mutableFormFields, setMutableFormFields] = useState<FormFields>({
    eduEmail: null,
  });
  const [shouldDisplayError, setShouldDisplayError] = useState<boolean>(false);
  const [targetAuthor, setTargetAuthor] = useState<DropDownAuthor | null>(
    authorData.length === 1
      ? { ...authorData[0], label: authorData[0].name }
      : null
  );
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
      if (!targetAuthor) {
        setMessage("Please select an author to claim.");
        showMessage({ show: true, error: true });
        return;
      }
      const name =
        targetAuthor && targetAuthor.label && targetAuthor.label.split(" ");
      const author = {
        first_name: name && name.length > 0 ? name[0] : null,
        last_name: name && name.length > 1 ? name[1] : null,
      };
      setShouldDisplayError(false);
      setIsSubmitting(true);
      createAuthorClaimCase({
        eduEmail: mutableFormFields.eduEmail,
        onError: (errMsg: string): void => {
          setMessage(errMsg);
          showMessage({ show: true, error: true, timeout: 4000 });
          setIsSubmitting(false);
        },
        onSuccess: (): void => {
          setIsSubmitting(false);
          onSuccess();
        },
        targetAuthorID: nullthrows(
          nullthrows(targetAuthor).id,
          "targetAuthorID must be present to make a request"
        ),
        userID,
        author,
      });
    }
  };

  const options = authorData.map((authorDatum, index) => ({
    ...authorDatum,
    label: authorDatum.name,
    value: authorDatum.name + `_${index}`,
  }));

  return (
    <div className={css(verifStyles.rootContainer)}>
      <div className={css(verifStyles.titleContainer)}>
        <div className={css(verifStyles.title)}>Enter your Academic Email</div>
      </div>
      <div className={css(verifStyles.subTextContainer)}>
        <div className={css(verifStyles.subText)}>
          {
            "We will send you an email to verify your academic email address. Use the one that's openly available under your previous publications."
          }
          <br />
          <br />
          {
            "After you verify your email, we will manually review your request to ensure that it's you!"
          }
        </div>
      </div>
      <form
        encType="multipart/form-data"
        className={css(verifStyles.form)}
        onSubmit={handleValidationAndSubmit}
      >
        <FormSelect
          containerStyle={modalBodyStyles.containerStyle}
          onChange={(_type: string, authorDatum: DropDownAuthor): void =>
            setTargetAuthor(authorDatum)
          }
          disable={isSubmitting}
          id="author"
          label="Claiming author"
          options={options}
          placeholder="Choose an Author"
          required={true}
          type="select"
          value={targetAuthor}
        />
        <FormInput
          containerStyle={modalBodyStyles.containerStyle}
          disable={isSubmitting}
          id="eduEmail"
          inputStyle={shouldDisplayError && modalBodyStyles.error}
          label="Your academic email address"
          labelStyle={verifStyles.labelStyle}
          onChange={handleOnChangeFields}
          placeholder="example@university.edu"
          required
          type="email"
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

export const verifStyles = StyleSheet.create({
  rootContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "50px 40px",
    borderRadius: 5,
    transition: "all ease-in-out 0.4s",
    boxSizing: "border-box",
    width: "100%",

    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      padding: "40px 16px",
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
    alignItems: "center",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: "16px",
    textAlign: "left",
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
    alignItems: "center",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 16,
    textAlign: "center",
  },
  subText: {
    alignItems: "center",
    color: "#241F3A",
    display: "flex",
    fontSize: "16px",
    fontWeight: "normal",
    lineHeight: "22px",
    opacity: 0.8,
    textAlign: "left",
  },
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

const mapDispatchToProps = {
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};

export default connect(null, mapDispatchToProps)(AuthorClaimPromptEmail);
