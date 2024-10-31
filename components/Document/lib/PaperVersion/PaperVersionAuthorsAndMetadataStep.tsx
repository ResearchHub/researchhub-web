import Button from "~/components/Form/Button";
import { Paper } from "../types";
import { StyleSheet, css } from "aphrodite";
import { useState } from "react";
import colors from "~/config/themes/colors";
import AuthorSelectDropdown from "~/components/Author/lib/AuthorSelectDropdown";
import { SuggestedAuthor, SuggestedInstitution } from "~/components/SearchSuggestion/lib/types";
import InstitutionSelectDropdown from "~/components/Author/lib/InstitutionSelectDropdown";
import Checkbox from "@mui/material/Checkbox";

const PaperVersionAuthorsAndMetadataStep = ({
  paper,
}: {
  paper: Paper | null;
}) => {
  const [isFormVisible, setIsFormVisible] = useState(true);

  const onAffiliationAdded = ({ author, institution, isCorrespondingAuthor }) => {
    console.log("Author and affiliation added", author, institution, isCorrespondingAuthor);
    setIsFormVisible(false);
  } 

  return (
    <div>
      <div className={css(styles.authorFormWrapper)}>
        {isFormVisible && <AuthorAndAffiliationForm onAffiliationAdded={onAffiliationAdded} />}
      </div>
      {!isFormVisible && (
        <Button
          label="Add author"
          onClick={() => setIsFormVisible(true)}
          buttonStyle={{ marginTop: 20 }}
        />
      )}
    </div>
  );
};

const AuthorAndAffiliationForm = ({ onAffiliationAdded }) => {
  const [selectedAuthor, setSelectedAuthor] = useState<{
    author: SuggestedAuthor,
    label: string,
    value: string,
  } | null>(
    null
  );
  const [selectedInstitution, setSelectedInstitution] = useState<{
    institution: SuggestedInstitution,
    label: string,
    value: string,
  } | null>(
    null
  );
  const [isCorrespondingAuthor, setIsCorrespondingAuthor] = useState(false);

  const handleAddAuthor = () => {
    onAffiliationAdded({
      author: selectedAuthor?.author,
      institution: selectedInstitution?.institution,
      isCorrespondingAuthor,
    });
  }

  return (
    <div className={css(styles.authorForm)}>
      <AuthorSelectDropdown
        label="Author"
        onChange={(name, value) => {
          setSelectedAuthor(value);
        }}
        selectedAuthor={selectedAuthor}
        placeholder="Select authors"
      />
      <InstitutionSelectDropdown
        label="Institution"
        onChange={(name, value) => {
          console.log('Institution selected', value);
          setSelectedInstitution(value);
        }}
        selectedInstitution={selectedInstitution}
        placeholder="Select institutions"
      />
      <div style={{ display: "flex",  alignItems: "center" }}>
        <Checkbox
          checked={isCorrespondingAuthor}
          onChange={() => setIsCorrespondingAuthor(!isCorrespondingAuthor)}
          sx={{ padding: "0px 10px 0px 0px" }}
        />
        Corresponding author
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end"}}>
        <Button
          label="Save"
          onClick={handleAddAuthor}
          buttonStyle={{ marginTop: 20 }}
        />
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  authorFormWrapper: {

  },
  authorForm: {
    padding: 20,
    background: colors.LIGHTER_GREY(),
  },
});

export default PaperVersionAuthorsAndMetadataStep;
