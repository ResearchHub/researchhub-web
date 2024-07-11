import withWebSocket from "~/components/withWebSocket";
import BaseModal from "../Modals/BaseModal";
import Button from "../Form/Button";
import API, { generateApiUrl } from "~/config/api";
import { connect, useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import FormInput from "../Form/FormInput";
import { StyleSheet, css } from "aphrodite";
import {
  fetchPublicationsByDoi,
  claimProfileAndAddPublications,
  addPublicationsToAuthor,
} from "./lib/api";
import { ID, parseUser } from "~/config/types/root_types";
import { isEmpty } from "~/config/utils/nullchecks";
import { RootState } from "~/redux";
import { OpenAlexAuthor, OpenAlexWork } from "../Verification/lib/types";
import FormSelect from "../Form/FormSelect";
import colors from "~/config/themes/colors";
import IconButton from "../Icons/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/pro-light-svg-icons";
import { CloseIcon } from "~/config/themes/icons";
import VerificationPaperResult from "../Verification/VerificationPaperResult";
import sample from "./lib/sample.json";
import CheckBox from "~/components//Form/CheckBox";
import { AuthorClaimError, AuthorClaimErrorReason } from "./lib/types";
import { Avatar } from "@mui/material";
import { authorProfileContext } from "../Author/lib/AuthorProfileContext";

type STEP = "DOI" | "NEEDS_AUTHOR_CONFIRMATION" | "RESULTS" | "ERROR";
type ERROR_TYPE =
  | "DOI_NOT_FOUND"
  | "GENERIC_ERROR"
  | "ALREADY_CLAIMED_BY_CURRENT_USER"
  | "ALREADY_CLAIMED_BY_ANOTHER_USER"
  | null;
const ORDERED_STEPS: Array<STEP> = [
  "DOI",
  "NEEDS_AUTHOR_CONFIRMATION",
  "RESULTS",
];

const AddPublicationModal = ({ wsResponse, children }) => {
  const [paperDoi, setPaperDoi] = useState("");
  const [selectedAuthorId, setSelectedAuthorId] = useState<
    null | undefined | ID
  >(null);
  const [availableAuthors, setAvailableAuthors] = useState<OpenAlexAuthor[]>(
    []
  );
  const [publications, setPublications] = useState<OpenAlexWork[]>(sample);
  const [error, setError] = useState<ERROR_TYPE>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [step, setStep] = useState<STEP>("DOI");
  const currentUser = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );
  const [selectedPaperIds, setSelectedPaperIds] = useState<Array<string>>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { setIsLoadingPublications } = authorProfileContext();

  const handleFetchPublications = async ({
    doi,
    authorId,
  }: {
    doi: string;
    authorId?: null | undefined | ID;
  }) => {
    try {
      const response = await fetchPublicationsByDoi({ doi, authorId });
      setPublications(response.works);
      setSelectedAuthorId(response.selectedAuthorId);
      setAvailableAuthors(response.availableAuthors);

      if (!response.selectedAuthorId) {
        setStep("NEEDS_AUTHOR_CONFIRMATION");
      } else if (selectedAuthorId && response.works.length > 0) {
        setStep("RESULTS");
      }
    } catch (error) {
      if (error instanceof Error && error.message === "404") {
        setError("DOI_NOT_FOUND");
      } else {
        setError("GENERIC_ERROR");
      }
    }
  };

  const authorDropdownOptions = availableAuthors.map((author, index) => ({
    ...author,
    label: author.displayName,
    value: author.id,
    id: author.id,
  }));
  const selectedAuthor = availableAuthors.find(
    (author) => author.id === selectedAuthorId
  );

  return (
    <>
      <div onClick={() => setIsOpen(!isOpen)}>{children}</div>
      <BaseModal
        isOpen={isOpen}
        hideClose={true}
        closeModal={() => setIsOpen(false)}
        zIndex={1000000001}
        modalContentStyle={styles.modalStyle}
        titleStyle={styles.modalTitle}
        title={
          step == "RESULTS" || step == "NEEDS_AUTHOR_CONFIRMATION" ? (
            <div
              className={css(
                styles.titleWrapper,
                styles.titleWrapperWithBorder
              )}
            >
              <IconButton overrideStyle={styles.backButton}>
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  onClick={() => {
                    const indexOfCurrentStep = ORDERED_STEPS.indexOf(step);
                    if (indexOfCurrentStep > 0) {
                      setStep(ORDERED_STEPS[indexOfCurrentStep - 1]);
                    }
                  }}
                />
              </IconButton>
              <CloseIcon
                // @ts-ignore
                overrideStyle={styles.close}
                color={colors.MEDIUM_GREY()}
                onClick={() => null}
              />
            </div>
          ) : null
        }
      >
        {step === "DOI" && (
          <div>
            <div style={{ fontWeight: 500 }}>
              Enter a DOI for any paper you authored:
            </div>
            <FormInput
              error={
                paperDoi &&
                error &&
                (error === "GENERIC_ERROR"
                  ? "Please enter a valid DOI."
                  : "Paper not found. Please try another DOI.")
              }
              value={paperDoi || ""}
              placeholder={"e.g. 10.1038/s41586-023-06466-x"}
              disabled={isFetching}
              containerStyle={styles.inputContainer}
              onChange={(name, value) => {
                setPaperDoi(value.trim());
              }}
            />

            <Button onClick={() => handleFetchPublications({ doi: paperDoi })}>
              Next
            </Button>
          </div>
        )}
        {step === "NEEDS_AUTHOR_CONFIRMATION" && (
          <div>
            <div>Please confirm which of these authors you are:</div>

            <FormSelect
              onChange={(_type: string, authorDatum: OpenAlexAuthor): void => {
                setSelectedAuthorId(authorDatum.id);
              }}
              id="author"
              label="Claiming author"
              options={authorDropdownOptions}
              placeholder="Choose an Author"
              required={true}
              type="select"
              value={authorDropdownOptions.find(
                (author) => author.id === selectedAuthorId
              )}
            />
            <Button
              variant="text"
              onClick={() => {
                handleFetchPublications({
                  doi: paperDoi,
                  authorId: selectedAuthorId,
                });
              }}
            >
              Next
            </Button>
          </div>
        )}
        {step === "RESULTS" && (
          <div>
            <div>
              Showing results for
              {selectedAuthor && (
                <div className={css(styles.authorWrapper)}>
                  <div className={css(styles.author)}>
                    <Avatar sx={{ height: 24, width: 24, fontSize: 14 }}>
                      {selectedAuthor.initials}
                    </Avatar>
                    {selectedAuthor.displayName}
                  </div>
                  <span
                    className={css(styles.changeAuthor)}
                    onClick={() => setStep("NEEDS_AUTHOR_CONFIRMATION")}
                  >
                    (Change)
                  </span>
                </div>
              )}
            </div>
            <div className={css(styles.selectAll)}>
              <CheckBox
                active={selectedPaperIds.length === publications.length}
                isSquare={true}
                small={true}
                onChange={(a, b) => {
                  if (selectedPaperIds.length === publications.length) {
                    setSelectedPaperIds([]);
                  } else {
                    setSelectedPaperIds(
                      publications.map((publication) => publication.id)
                    );
                  }
                }}
                label={undefined}
                labelStyle={undefined}
              />
              Select All
            </div>

            <div className={css(styles.publicationWrapper)}>
              {publications.map((publication) => (
                <>
                  <CheckBox
                    active={selectedPaperIds.includes(publication.id)}
                    isSquare={true}
                    small={true}
                    onChange={() => {
                      selectedPaperIds.includes(publication.id)
                        ? setSelectedPaperIds(
                            selectedPaperIds.filter(
                              (id) => id !== publication.id
                            )
                          )
                        : setSelectedPaperIds([
                            ...selectedPaperIds,
                            publication.id,
                          ]);
                    }}
                    label={undefined}
                    labelStyle={undefined}
                  />
                  <VerificationPaperResult result={publication} />
                </>
              ))}
            </div>
            <div className={css(styles.buttonsWrapper)}>
              <Button variant="text">Do this later</Button>
              <Button
                disabled={selectedPaperIds.length === 0}
                onClick={async () => {
                  try {
                    setIsLoadingPublications(true);
                    const response = await addPublicationsToAuthor({
                      authorId: currentUser?.authorProfile.id,
                      openAlexPublicationIds: selectedPaperIds,
                      openAlexAuthorId: selectedAuthorId,
                    });
                  } catch (error: any) {
                    setStep("ERROR");
                    if (error instanceof AuthorClaimError) {
                      // @ts-ignore
                      setError(error.reason);
                    } else {
                      setError("GENERIC_ERROR");
                    }
                  }
                }}
              >
                Add Publications
              </Button>
            </div>
          </div>
        )}
        {step === "ERROR" && (
          <div>
            {error === "ALREADY_CLAIMED_BY_ANOTHER_USER" && (
              <div>This profile has already been claimed by another user</div>
            )}
            {error === "ALREADY_CLAIMED_BY_CURRENT_USER" && (
              <div>This profile has already been claimed you</div>
            )}
            {error === "GENERIC_ERROR" && <div>An error has occured</div>}
          </div>
        )}

        {/* <Button onClick={handleClick}>Trigger</Button> */}
      </BaseModal>
    </>
  );
};

const styles = StyleSheet.create({
  author: {
    display: "flex",
  },
  authorWrapper: {
    display: "flex",
  },
  changeAuthor: {
    color: colors.NEW_BLUE(),
    cursor: "pointer",
  },
  modalStyle: {
    padding: "20px 20px",
  },
  modalContentStyle: {
    padding: "10px 20px",
  },
  modalTitle: {},
  buttonsWrapper: {
    display: "flex",
  },
  publicationWrapper: {
    maxHeight: 200,
    overflowY: "scroll",
  },
  selectAll: {
    display: "flex",
    alignItems: "center",
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 0,
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: 7,
    fontSize: 20,
    cursor: "pointer",
  },
  close: {
    position: "absolute",
    right: 10,
    top: 7,
    cursor: "pointer",
  },
  titleWrapper: {
    padding: 15,
    marginBottom: 15,
    justifyContent: "center",
    position: "relative",
    flexDirection: "row",
    display: "flex",
    fontSize: 16,
  },
  titleWrapperWithBorder: {
    borderBottom: `1px solid ${colors.LIGHT_GREY()}`,
  },
});

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
});

const mapDispatchToProps = (dispatch) => ({});

export default withWebSocket(
  // @ts-ignore legacy hook
  connect(mapStateToProps, mapDispatchToProps)(AddPublicationModal)
);
