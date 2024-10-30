import Button from "~/components/Form/Button";
import { Paper } from "../types";
import { StyleSheet, css } from "aphrodite";
import { useState } from "react";
import colors from "~/config/themes/colors";
import AuthorSelectDropdown from "~/components/Author/lib/AuthorSelectDropdown";

const PaperVersionAuthorsAndMetadataStep = ({ paper }: { paper: Paper | null }) => {

  const [isFormVisible, setIsFormVisible] = useState(true);  

  return (
    <div>
      {isFormVisible && <AuthorForm />}
    </div>
  );
}

const AuthorForm = () => {
  return (
    <div className={css(styles.authorForm)}>
      <AuthorSelectDropdown
        label="Authors"
        onChange={() => {}}
        placeholder="Select authors"
        required
      />
      <Button
        label="Add author"
        onClick={() => {}}
        buttonStyle={{ marginTop: 20 }}
      />
    </div>
  );
}

const styles = StyleSheet.create({
  authorForm: {
    padding: 20,
    background: colors.LIGHTER_GREY(),
  }
})

export default PaperVersionAuthorsAndMetadataStep;