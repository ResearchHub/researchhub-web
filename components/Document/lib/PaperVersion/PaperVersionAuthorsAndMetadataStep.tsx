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
  faTrash,
  faUserPlus,
  faPlus,
  faEnvelope,
} from "@fortawesome/pro-solid-svg-icons";
import Avatar from "@mui/material/Avatar";
import { isEmpty } from "~/config/utils/nullchecks";
import TextField from "@mui/material/TextField";
import FormInput from "~/components/Form/FormInput";

// Update the type definition to include email and department
type AuthorAffiliation = {
  author: SuggestedAuthor;
  institution: SuggestedInstitution;
  isCorrespondingAuthor: boolean;
  email?: string;
  department?: string;
};

const PaperVersionAuthorsAndMetadataStep = ({
  authorsAndAffiliations,
  setAuthorsAndAffiliations,
}: {
  authorsAndAffiliations: Array<AuthorAffiliation>;
  setAuthorsAndAffiliations: Function;
}) => {
  const [isFormVisible, setIsFormVisible] = useState(false);

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
    email,
    department,
  }) => {
    setIsFormVisible(false);
    setAuthorsAndAffiliations([
      ...authorsAndAffiliations,
      {
        author,
        institution,
        isCorrespondingAuthor,
        email,
        department,
      },
    ]);
  };

  const deleteAuthor = (indexToDelete: number) => {
    const newAuthors = authorsAndAffiliations.filter(
      (_, index) => index !== indexToDelete
    );
    setAuthorsAndAffiliations(newAuthors);
  };

  return (
    <div style={{ minHeight: 250 }}>
      {isFormVisible ? (
        <AuthorAndAffiliationForm
          onAffiliationAdded={onAffiliationAdded}
          handleCloseForm={() => setIsFormVisible(false)}
        />
      ) : (
        <>
          <div className={css(styles.authorsList)}>
            {authorsAndAffiliations.length === 0 ? (
              <div className={css(styles.emptyState)}>
                <FontAwesomeIcon
                  icon={faUserPlus}
                  style={{
                    fontSize: 24,
                    marginBottom: 16,
                    color: colors.BLACK(0.6),
                  }}
                />
                <div className={css(styles.emptyStateText)}>
                  No authors added yet. Click the button below to add authors
                  and their affiliations.
                </div>
                <Button
                  size="small"
                  customButtonStyle={styles.addAuthorButton}
                  label={
                    <div style={{ fontWeight: 500 }}>
                      <FontAwesomeIcon
                        icon={faPlus}
                        style={{ marginRight: 8 }}
                      />
                      Add author
                    </div>
                  }
                  variant="outlined"
                  onClick={() => setIsFormVisible(true)}
                />
              </div>
            ) : (
              authorsAndAffiliations.map((authorAndAffiliation, index) => (
                <div
                  key={authorAndAffiliation.author.id}
                  className={css(styles.authorItem)}
                >
                  <div className={css(styles.authorContent)}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <Avatar
                        src={authorAndAffiliation.author.profileImage}
                        sx={{ width: 24, height: 24, fontSize: 14 }}
                      >
                        {isEmpty(authorAndAffiliation.author.profileImage) &&
                          (authorAndAffiliation.author.fullName || "")[0]}
                      </Avatar>
                      <div className={css(styles.authorName)}>
                        {authorAndAffiliation.author.fullName}
                        {authorAndAffiliation.email && (
                          <>
                            -{" "}
                            <div className={css(styles.email)}>
                              {authorAndAffiliation.email}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <FontAwesomeIcon
                        icon={faBuildingColumns}
                        style={{ width: 24 }}
                      />
                      <div>
                        <div className={css(styles.institutionName)}>
                          {authorAndAffiliation.institution.name}
                        </div>
                        {authorAndAffiliation.department && (
                          <div className={css(styles.departmentName)}>
                            Department: {authorAndAffiliation.department}
                          </div>
                        )}
                      </div>
                    </div>
                    {authorAndAffiliation.isCorrespondingAuthor && (
                      <div className={css(styles.correspondingAuthor)}>
                        <FontAwesomeIcon
                          icon={faEnvelope}
                          style={{ marginRight: 12, fontSize: 16 }}
                        />
                        Corresponding author
                      </div>
                    )}
                  </div>
                  <div className={css(styles.controls)}>
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
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => deleteAuthor(index)}
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        color={colors.MEDIUM_GREY2()}
                      />
                      {/* Delete */}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
          {authorsAndAffiliations.length > 0 && (
            <div
              style={{
                marginTop: 20,
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <Button
                size="small"
                variant="outlined"
                customButtonStyle={styles.addAuthorButton}
                label={
                  <div style={{ fontWeight: 500 }}>
                    <FontAwesomeIcon icon={faPlus} style={{ marginRight: 8 }} />
                    Author
                  </div>
                }
                onClick={() => setIsFormVisible(true)}
              />
            </div>
          )}
        </>
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
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [isCorrespondingAuthor, setIsCorrespondingAuthor] = useState(false);
  const [errors, setErrors] = useState<{
    author?: boolean;
    institution?: boolean;
    department?: boolean;
    email?: boolean;
  }>({});

  const validateForm = () => {
    const newErrors = {
      author: !selectedAuthor,
      institution: !selectedInstitution,
      department: !department?.trim(),
      email: isCorrespondingAuthor && !email,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean); // returns true if form is valid
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    onAffiliationAdded({
      author: selectedAuthor?.author,
      institution: selectedInstitution?.institution,
      department,
      email,
      isCorrespondingAuthor,
    });
    handleCloseForm();
  };

  return (
    <div className={css(styles.authorForm)}>
      <h2 className={css(styles.formTitle)}>Add author</h2>
      <AuthorSelectDropdown
        label="Author"
        onChange={(name, value) => {
          setSelectedAuthor(value);
          setErrors({ ...errors, author: false });
        }}
        error={errors.author ? "Author is required" : undefined}
        required
        selectedAuthor={selectedAuthor}
        placeholder="Select authors"
      />
      <InstitutionSelectDropdown
        label="Institution"
        onChange={(name, value) => {
          setSelectedInstitution(value);
          setErrors({ ...errors, institution: false });
        }}
        required
        error={errors.institution ? "Institution is required" : undefined}
        selectedInstitution={selectedInstitution}
        placeholder="Select institutions"
      />
      <FormInput
        required
        label="Department"
        value={department}
        error={errors.department && "Department is required"}
        onChange={(id, value) => {
          setDepartment(value);
          setErrors({ ...errors, department: false });
        }}
        placeholder="Department of the institution"
      />
      <FormInput
        label="Email"
        required={isCorrespondingAuthor}
        value={email}
        onChange={(id, value) => {
          setEmail(value);
          setErrors({ ...errors, email: false });
        }}
        type="email"
        error={errors.email && "Email is required for corresponding authors"}
        placeholder="Email of the author"
      />
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
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
          buttonStyle={{ marginRight: 10 }}
        />
        <Button
          label="Save"
          variant="outlined"
          customButtonStyle={styles.saveButton}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  addAuthorButton: {
    color: colors.MEDIUM_GREY2(),
    borderColor: colors.MEDIUM_GREY2(),
  },
  saveButton: {
    color: colors.BLACK(),
    borderColor: colors.BLACK(),
  },
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
    flexDirection: "column",
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
    gap: 10,
  },
  authorName: {
    fontWeight: 500,
    fontSize: 15,
    display: "flex",
    alignItems: "center",
    gap: 4,
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
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  arrowControls: {
    display: "flex",
    gap: 12,
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
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 32,
    background: colors.LIGHTER_GREY(),
    borderRadius: 4,
    textAlign: "center",
  },
  emptyStateText: {
    color: colors.BLACK(0.6),
    fontSize: 15,
    marginBottom: 20,
  },
  row: {
    display: "flex",
    gap: 16,
    marginBottom: 16,
  },
  flexGrow: {
    flex: 1,
  },
  departmentName: {
    color: colors.BLACK(0.6),
    fontSize: 14,
  },
  email: {
    color: colors.BLACK(0.6),
    fontSize: 13,
  },
  controls: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    borderTop: `1px solid ${colors.GREY_LINE()}`,
    marginTop: 12,
    paddingTop: 12,
  },
  formTitle: {
    marginBottom: 40,
    fontSize: 22,
    textAlign: "center",
    fontWeight: 500,
  },
});

export default PaperVersionAuthorsAndMetadataStep;
