import useCurrentUser from "~/config/hooks/useCurrentUser";
import FormSelect from "../Form/FormSelect";
import { VerificationPaperResult as VerificationPaperResultType } from "./lib/types";
import FormInput from "../Form/FormInput";
import { useEffect, useState, useCallback } from "react";
import Button from "../Form/Button";
import { StyleSheet, css } from "aphrodite";
import { isValidEmail, isCommonEmailExt } from "~/config/utils/validation";
import debounce from "lodash/debounce";
import { createAuthorClaimCase } from "../AuthorClaimModal/api/authorClaimCaseCreate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  authoredPaper: VerificationPaperResultType | null;
  nextStep: () => void;
}

type EMAIL_ERROR =
  | "NO_EMAIL"
  | "INVALID_EMAIL_ERROR"
  | "COMMON_EMAIL_ERROR"
  | null;

const VerificationFormSelectAuthorStep = ({
  authoredPaper,
  nextStep,
}: Props) => {
  const [academicEmail, setAcademicEmail] = useState<string>("");
  const [error, setError] = useState<EMAIL_ERROR>(null);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [selectedAuthor, setSelectedAuthor] = useState<
    { label: string; value: string } | undefined
  >(undefined);
  const user = useCurrentUser();

  const foundAuthorByLastNameIndex = authoredPaper?.authors.findIndex(
    (author) => {
      return (
        (author.split(" ").slice(-1)[0] || "").toLowerCase() ===
        user?.lastName.toLowerCase()
      );
    }
  );

  // Validate form
  useEffect(() => {
    if (validateEmail(academicEmail).isValid && selectedAuthor && !error) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [academicEmail, selectedAuthor, error]);

  // Debounce email validation so that we don't spam the user with errors as soon as they type the first character
  useEffect(() => {
    debounceValidateEmail(academicEmail);
  }, [academicEmail]);

  const validateEmail = (email): { isValid: boolean; error: EMAIL_ERROR } => {
    if (!email || email.length === 0) {
      return { isValid: false, error: "NO_EMAIL" };
    }
    if (!isValidEmail(email)) {
      return { isValid: false, error: "INVALID_EMAIL_ERROR" };
    } else if (isCommonEmailExt(email)) {
      return { isValid: false, error: "COMMON_EMAIL_ERROR" };
    } else {
      return { isValid: true, error: null };
    }
  };

  const debounceValidateEmail = useCallback(
    debounce(async (email) => {
      const { error } = validateEmail(email);
      setError(error);
    }, 1200),
    []
  );

  const authorsAsOptions = authoredPaper?.authors.map((author) => {
    return {
      value: author,
      label: author,
    };
  });

  const handleClaimRequest = async () => {
    createAuthorClaimCase({
      eduEmail: academicEmail,
      onError: (errMsg: string): void => {
        console.log("error", errMsg);
      },
      onSuccess: (): void => {
        console.log("success");
        nextStep();
      },
      userID: user?.id,
      targetAuthorName: selectedAuthor!.value,
      doi: authoredPaper?.doi,
    });
  };

  // @ts-ignore
  // const foundAuthor = foundAuthorByLastNameIndex > -1 ? authorsAsOptions[foundAuthorByLastNameIndex] : undefined;
  return (
    <div>
      {/* {error && (
      <div className={css(styles.error)}>
        <FontAwesomeIcon icon="exclamation-circle" />
        {error}
      </div>
      )} */}
      <div className={css(styles.inputWrapper)}>
        <FormSelect
          value={selectedAuthor}
          onChange={(name, value) => {
            setSelectedAuthor(value);
          }}
          options={authorsAsOptions}
          label={"Select your name from the list of authors:"}
        />
      </div>
      <div className={css(styles.inputWrapper)}>
        <FormInput
          error={
            error &&
            (error === "INVALID_EMAIL_ERROR"
              ? "Please enter a valid email."
              : error === "COMMON_EMAIL_ERROR"
              ? "Enter email of academic institution."
              : "")
          }
          placeholder="jane.lane@usc.edu"
          labelStyle={styles.labelStyle}
          subtitle="Only email addresses from academic insitutions will be approved"
          required={true}
          label={`Enter your academic email`}
          value={academicEmail}
          onChange={(name, value) => {
            setAcademicEmail(value);
          }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          disabled={!isFormValid}
          onClick={handleClaimRequest}
          label={"Next"}
        />
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    marginBottom: 50,
  },
  labelStyle: {
    marginBottom: 5,
  },
});

export default VerificationFormSelectAuthorStep;
