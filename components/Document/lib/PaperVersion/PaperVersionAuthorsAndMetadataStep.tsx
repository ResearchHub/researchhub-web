import Button from "~/components/Form/Button";
import { Paper } from "../types";
import { StyleSheet, css } from "aphrodite";
import { useState } from "react";
import colors from "~/config/themes/colors";
import AuthorSelectDropdown from "~/components/Author/lib/AuthorSelectDropdown";
import {
  SuggestedAuthor,
  SuggestedInstitution,
} from "~/components/SearchSuggestion/lib/types";
import InstitutionSelectDropdown from "~/components/Author/lib/InstitutionSelectDropdown";
import Checkbox from "@mui/material/Checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronUp,
  faChevronDown,
  faBuildingColumns,
} from "@fortawesome/pro-solid-svg-icons";
import Avatar from "@mui/material/Avatar";
import { isEmpty } from "~/config/utils/nullchecks";
const PaperVersionAuthorsAndMetadataStep = ({
  authorsAndAffiliations,
  setAuthorsAndAffiliations,
}: {
  authorsAndAffiliations: Array<{
    author: SuggestedAuthor;
    institution: SuggestedInstitution;
    isCorrespondingAuthor: boolean;
  }>;
  setAuthorsAndAffiliations: Function;
}) => {
  const [isFormVisible, setIsFormVisible] = useState(true);

  const moveAuthor = (currentIndex: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    // Check if the move is within bounds
    if (newIndex < 0 || newIndex >= authorsAndAffiliations.length) return;

    const newAuthors = [...authorsAndAffiliations];
    const [movedAuthor] = newAuthors.splice(currentIndex, 1);
    newAuthors.splice(newIndex, 0, movedAuthor);
    setAuthorsAndAffiliations(newAuthors);
  };

  const onAffiliationAdded = ({
    author,
    institution,
    isCorrespondingAuthor,
  }) => {
    setIsFormVisible(false);
    setAuthorsAndAffiliations([
      ...authorsAndAffiliations,
      {
        author,
        institution,
        isCorrespondingAuthor,
      },
    ]);
  };

  return (
    <div>
      <div className={css(styles.authorFormWrapper)}>
        {isFormVisible && (
          <AuthorAndAffiliationForm
            onAffiliationAdded={onAffiliationAdded}
            handleCloseForm={() => setIsFormVisible(false)}
          />
        )}
      </div>
      <div className={css(styles.authorsList)}>
        {authorsAndAffiliations.map((authorAndAffiliation, index) => (
          <div
            key={authorAndAffiliation.author.id}
            className={css(styles.authorItem)}
          >
            <div className={css(styles.authorContent)}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Avatar
                  src={authorAndAffiliation.author.profileImage}
                  sx={{ width: 24, height: 24, fontSize: 14 }}
                >
                  {isEmpty(authorAndAffiliation.author.profileImage) &&
                    (authorAndAffiliation.author.fullName || "")[0]}
                </Avatar>
                <div className={css(styles.authorName)}>
                  {authorAndAffiliation.author.fullName}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <FontAwesomeIcon
                  icon={faBuildingColumns}
                  style={{ width: 24 }}
                />
                <div className={css(styles.institutionName)}>
                  {authorAndAffiliation.institution.name}
                </div>
              </div>
              {authorAndAffiliation.isCorrespondingAuthor && (
                <div className={css(styles.correspondingAuthor)}>
                  Corresponding author
                </div>
              )}
            </div>
            <div className={css(styles.arrowControls)}>
              <button
                className={css(
                  styles.arrowButton,
                  index === 0 && styles.arrowButtonDisabled
                )}
                onClick={() => moveAuthor(index, "up")}
                disabled={index === 0}
              >
                <FontAwesomeIcon icon={faChevronUp} />
              </button>
              <button
                className={css(
                  styles.arrowButton,
                  index === authorsAndAffiliations.length - 1 &&
                    styles.arrowButtonDisabled
                )}
                onClick={() => moveAuthor(index, "down")}
                disabled={index === authorsAndAffiliations.length - 1}
              >
                <FontAwesomeIcon icon={faChevronDown} />
              </button>
            </div>
          </div>
        ))}
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

const AuthorAndAffiliationForm = ({ onAffiliationAdded, handleCloseForm }) => {
  const [selectedAuthor, setSelectedAuthor] = useState<{
    author: SuggestedAuthor;
    label: string;
    value: string;
  } | null>(null);
  const [selectedInstitution, setSelectedInstitution] = useState<{
    institution: SuggestedInstitution;
    label: string;
    value: string;
  } | null>(null);
  const [isCorrespondingAuthor, setIsCorrespondingAuthor] = useState(false);

  const handleAddAuthor = () => {
    onAffiliationAdded({
      author: selectedAuthor?.author,
      institution: selectedInstitution?.institution,
      isCorrespondingAuthor,
    });
  };

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
          setSelectedInstitution(value);
        }}
        selectedInstitution={selectedInstitution}
        placeholder="Select institutions"
      />
      <div style={{ display: "flex", alignItems: "center" }}>
        <Checkbox
          checked={isCorrespondingAuthor}
          onChange={() => setIsCorrespondingAuthor(!isCorrespondingAuthor)}
          sx={{ padding: "0px 10px 0px 0px" }}
        />
        Corresponding author
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          label="Cancel"
          variant="text"
          onClick={() => handleCloseForm()}
          buttonStyle={{ marginTop: 20, marginRight: 10 }}
        />
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
    marginBottom: 20,
  },
  authorForm: {
    padding: 20,
    background: colors.LIGHTER_GREY(),
    borderRadius: 4,
  },
  authorsList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  authorItem: {
    display: "flex",
    alignItems: "center",
    padding: 16,
    background: "white",
    borderRadius: 4,
    border: `1px solid ${colors.GREY_LINE()}`,
    transition: "all 0.2s ease",
  },
  authorContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  authorName: {
    fontWeight: 500,
    fontSize: 15,
    marginBottom: 4,
  },
  institutionName: {
    color: colors.BLACK(0.6),
    fontSize: 14,
    marginBottom: 4,
  },
  correspondingAuthor: {
    fontSize: 13,
    color: colors.NEW_BLUE(),
    fontWeight: 500,
  },
  arrowControls: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    marginLeft: 16,
  },
  arrowButton: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    padding: 8,
    borderRadius: 4,
    transition: "all 0.2s ease",
    ":hover": {
      background: colors.LIGHTER_GREY(),
      color: colors.NEW_BLUE(),
    },
    ":active": {
      background: colors.GREY_LINE(),
    },
  },
  arrowButtonDisabled: {
    opacity: 0.3,
    cursor: "not-allowed",
    ":hover": {
      background: "transparent",
    },
  },
});

export default PaperVersionAuthorsAndMetadataStep;