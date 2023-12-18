import useCurrentUser from "~/config/hooks/useCurrentUser";
import FormSelect from "../Form/FormSelect";
import { VerificationPaperResult as VerificationPaperResultType } from "./lib/types";
import FormInput from "../Form/FormInput";
import { useState } from "react";
import Button from "../Form/Button";
import { StyleSheet, css } from "aphrodite";

interface Props {
  authoredPaper: VerificationPaperResultType | null;
  nextStep: () => void,
}

const VerificationFormSelectAuthorStep = ({ authoredPaper, nextStep }: Props) => {
  const [academicEmail, setAcademicEmail] = useState<string>("");
  const user = useCurrentUser();

  const foundAuthorByLastNameIndex = authoredPaper?.authors.findIndex((author) => {
    return (author.split(" ").slice(-1)[0] || "").toLowerCase() === user?.lastName.toLowerCase();
  })  

  const authorsAsOptions = authoredPaper?.authors.map((author) => {
    return {
      value: author,
      label: author,
    }
  });

  // @ts-ignore
  const foundAuthor = foundAuthorByLastNameIndex > -1 ? authorsAsOptions[foundAuthorByLastNameIndex] : undefined;
  return (
    <div>
      {/* <div>Next, select your name from the list of authors:</div> */}
      <div className={css(styles.inputWrapper)}>
        <FormSelect value={foundAuthor} options={authorsAsOptions} label={"Select your name from the list of authors:"} />
      </div>
      <div className={css(styles.inputWrapper)}>
        <FormInput labelStyle={styles.labelStyle} subtitle="Only email addresses from academic insitutions will be approved" required={true} label={`Enter your academic email`} value={academicEmail} onChange={setAcademicEmail} />  
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button disabled={false} onClick={nextStep} label={"Next"} />
      </div>
    </div>  
  )  
}

const styles = StyleSheet.create({
  inputWrapper: {
    marginBottom: 50,
  },
  labelStyle: {
    marginBottom: 5,
  }
});

export default VerificationFormSelectAuthorStep;