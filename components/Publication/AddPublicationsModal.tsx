import withWebSocket from "~/components/withWebSocket";
import BaseModal from "../Modals/BaseModal";
import Button from "../Form/Button";
import { generateApiUrl } from "~/config/api";
import API from "~/config/api";
import { connect } from "react-redux";
import { useState } from "react";
import FormInput from "../Form/FormInput";
import { StyleSheet, css } from "aphrodite";
import { fetchPublicationsByDoi } from "./lib/api";
import { ID, parseUser } from "~/config/types/root_types";
import { isEmpty } from "~/config/utils/nullchecks";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "~/redux";
import { OpenAlexAuthor, OpenAlexWork } from "../Verification/lib/types";
import FormSelect from "../Form/FormSelect";
import colors from "~/config/themes/colors";
import IconButton from "../Icons/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/pro-light-svg-icons";
import { CloseIcon } from "~/config/themes/icons";

type STEP = "DOI" | "NEEDS_AUTHOR_CONFIRMATION" |  "RESULTS";
type ERROR_TYPE = "DOI_NOT_FOUND" | "GENERIC_ERROR" | null;
const ORDERED_STEPS: Array<STEP> = ["DOI", "NEEDS_AUTHOR_CONFIRMATION", "RESULTS"]

const AddPublicationModal = ({ wsResponse }) => {

  const [paperDoi, setPaperDoi] = useState("");
  const [selectedAuthorId, setSelectedAuthorId] = useState<null|ID>(null);
  const [availableAuthors, setAvailableAuthors] = useState<OpenAlexAuthor[]>([]);
  const [publications, setPublications] = useState<OpenAlexWork[]>([]);
  const [error, setError] = useState<ERROR_TYPE>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [step, setStep] = useState<STEP>("DOI");
  const currentUser = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );

  

  const handleClick = async () => {
      const url = generateApiUrl(
        `paper/test`
      );
    
      try {
        const response = await fetch(url, API.GET_CONFIG());
      } catch (error) {
        console.log('error', error)
      }
  }

  const handleFetchPublications = async ({ doi, authorId }: { doi: string, authorId?: string|null }) => {
    try {
      const response = await fetchPublicationsByDoi({ doi, authorId })
      setPublications(response.works);
      setSelectedAuthorId(response.selectedAuthorId);
      setAvailableAuthors(response.availableAuthors);
  
      if (!response.selectedAuthorId) {
        setStep("NEEDS_AUTHOR_CONFIRMATION");
      }
      else if (selectedAuthorId && response.works.length > 0) {
        setStep("RESULTS");
      }
    }
    catch(error) {
      if (error instanceof Error && error.message === '404') {
        setError("DOI_NOT_FOUND");
      }
      else {
        setError("GENERIC_ERROR");
      }
    }
  }

  const authorDropdownOptions = availableAuthors.map((author, index) => ({
    ...author,
    label: author.displayName,
    value: author.id,
    id: author.id,
  }))



  return (
    <BaseModal
      isOpen={true}
      closeModal={() => null}
      zIndex={1000000001}
      title={


        step == "RESULTS" || step == "NEEDS_AUTHOR_CONFIRMATION" ? (
          <div
            className={css(styles.titleWrapper, styles.titleWrapperWithBorder)}
          >

            <IconButton overrideStyle={styles.backButton}>
              <FontAwesomeIcon
                icon={faArrowLeft}
                onClick={() => {
                  const indexOfCurrentStep =
                    ORDERED_STEPS.indexOf(step);
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
        <div style={{ fontWeight: 500, }}>Enter a DOI for any paper you authored:</div>
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

        <Button onClick={() => handleFetchPublications({ doi: paperDoi })}>Next</Button>

      </div>
    )}
    {step === "NEEDS_AUTHOR_CONFIRMATION" && (
      <div>
        <div>Please confirm which of these authors you are:</div>

        <FormSelect
          onChange={(_type: string, authorDatum: OpenAlexAuthor): void => {
            setSelectedAuthorId(authorDatum.id);
            handleFetchPublications({ doi: paperDoi, authorId: authorDatum.id });
          }}
          id="author"
          label="Claiming author"
          options={authorDropdownOptions}
          placeholder="Choose an Author"
          required={true}
          type="select"
          value={authorDropdownOptions.find((author) => author.id === selectedAuthorId)}
        />        
      </div>
    )}
    {step === "RESULTS" && (
      <div>
        <div>Results</div>
        {publications.map((publication) => (
          <div key={publication.id}>{publication.title}</div>
        ))}
      </div>
    )}


      {/* <Button onClick={handleClick}>Trigger</Button> */}
    </BaseModal>
  )
}

const styles = StyleSheet.create({
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
})

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
});

const mapDispatchToProps = (dispatch) => ({});

export default withWebSocket(
  // @ts-ignore legacy hook
  connect(mapStateToProps, mapDispatchToProps)(AddPublicationModal)
);
