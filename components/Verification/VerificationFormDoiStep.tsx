import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";
import Button from "../Form/Button";
import FormInput from "../Form/FormInput";
import debounce from "lodash/debounce";
import { ClipLoader } from "react-spinners";
import { fetchPaperByDoi } from "./lib/api";
import extractAndValidateDOI from "~/config/utils/extractAndValidateDoi";
import { VerificationPaperResult as VerificationPaperResultType } from "./lib/types";
import VerificationPaperResult from "./VerificationPaperResult";

type ERROR_TYPE = "DOI_ERROR" | "PAPER_NOT_FOUND" | null;

interface Props {
  nextStep: Function;
  setPaperDoi: Function;
  paperDoi: string | null;
  setAuthoredPaper: (paper: VerificationPaperResultType | null) => void;
  authoredPaper: VerificationPaperResultType | null;
}

const VerificationFormDoiStep = ({
  nextStep,
  setAuthoredPaper,
  authoredPaper,
  paperDoi,
  setPaperDoi,
}: Props) => {
  const [error, setError] = useState<ERROR_TYPE>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // If paperDoi and authoredPaper already set, don't refetch on initial mount.
    // This scenario occurs when user navigates back to the previous step.
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (paperDoi && authoredPaper) {
        return;
      }
    }

    if (!paperDoi) {
      return;
    }

    const isValid = extractAndValidateDOI({ doi: paperDoi });
    if (isValid) {
      setIsFetching(true);
      debounceFetchPaperByDoi({ doi: paperDoi });
    } else {
      setError("DOI_ERROR");
    }
  }, [paperDoi]);

  const debounceFetchPaperByDoi = useCallback(
    debounce(async ({ doi }) => {
      try {
        const foundPaper = await fetchPaperByDoi({ doi });
        setAuthoredPaper(foundPaper);
        setError(null);
      } catch (error) {
        setError("PAPER_NOT_FOUND");
        setAuthoredPaper(null);
      } finally {
        setIsFetching(false);
      }
    }, 1000),
    []
  );

  return (
    <div>
      <div>First, enter a DOI for a paper you authored:</div>
      <FormInput
        error={
          paperDoi &&
          error &&
          (error === "DOI_ERROR"
            ? "Please enter a valid DOI."
            : "Paper not found. Please try another DOI.")
        }
        value={paperDoi || ""}
        disabled={isFetching}
        containerStyle={styles.inputContainer}
        onChange={(name, value) => {
          setPaperDoi(value);
        }}
      />
      <div style={{ minHeight: 100 }}>
        {isFetching && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              marginTop: 150,
            }}
          >
            <ClipLoader
              sizeUnit={"px"}
              size={44}
              color={colors.NEW_BLUE()}
              loading={true}
            />
          </div>
        )}
        {authoredPaper && <VerificationPaperResult result={authoredPaper} />}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button disabled={!authoredPaper} onClick={nextStep} label={"Next"} />
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  successMessage: {
    color: colors.GREEN(),
    fontSize: 14,
    marginRight: 15,
  },
  inputContainer: {
    marginBottom: 0,
  },
});

export default VerificationFormDoiStep;
