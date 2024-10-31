import Button from "~/components/Form/Button";
import { Paper } from "../types";
import { StyleSheet, css } from "aphrodite";
import { useState } from "react";
import colors from "~/config/themes/colors";
import AuthorSelectDropdown from "~/components/Author/lib/AuthorSelectDropdown";
import { SuggestedAuthor, SuggestedInstitution } from "~/components/SearchSuggestion/lib/types";
import InstitutionSelectDropdown from "~/components/Author/lib/InstitutionSelectDropdown";

const PaperVersionAuthorsAndMetadataStep = ({
  paper,
}: {
  paper: Paper | null;
}) => {
  const [isFormVisible, setIsFormVisible] = useState(true);

  return <div>{isFormVisible && <AuthorForm />}</div>;
};

const AuthorForm = () => {
  const [selectedAuthor, setSelectedAuthor] = useState<null | SuggestedAuthor>(
    null
  );
  const [selectedInstitution, setSelectedInstitution] = useState<null | SuggestedInstitution>(
    null
  );

  return (
    <div className={css(styles.authorForm)}>
      <AuthorSelectDropdown
        label="Search authors"
        onChange={(name, value) => {
          console.log(name, value);
          setSelectedAuthor(value);
        }}
        selectedAuthor={selectedAuthor}
        placeholder="Select authors"
      />
      <InstitutionSelectDropdown
        label="Search institutions"
        onChange={(name, value) => {
          console.log(name, value);
          setSelectedInstitution(value);
        }}
        selectedInstitution={selectedInstitution}
        placeholder="Select institutions"
      />

      <Button
        label="Add author"
        onClick={() => {}}
        buttonStyle={{ marginTop: 20 }}
      />
    </div>
  );
};

const styles = StyleSheet.create({
  authorForm: {
    padding: 20,
    background: colors.LIGHTER_GREY(),
  },
});

export default PaperVersionAuthorsAndMetadataStep;
