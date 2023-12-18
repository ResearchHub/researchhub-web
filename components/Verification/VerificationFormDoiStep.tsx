import { useCallback, useEffect, useState } from "react";
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
  nextStep: () => void,
  setAuthoredPaper: (paper: VerificationPaperResultType|null) => void,
  authoredPaper: VerificationPaperResultType | null,
}

const VerificationFormDoiStep = ({ nextStep, setAuthoredPaper, authoredPaper }: Props) => {
  const [doiInput, setDoiInput] = useState<string | null>(null);
  const [error, setError] = useState<ERROR_TYPE>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    if (!doiInput) {
      return;
    }

    const isValid = extractAndValidateDOI({ doi: doiInput });
    if (isValid) {
      setIsFetching(true);
      debounceFetchPaperByDoi({ doi: doiInput });
    } else {
      setError("DOI_ERROR");
    }
  }, [doiInput]);

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
          doiInput &&
          error &&
          (error === "DOI_ERROR"
            ? "Please enter a valid DOI."
            : "Paper not found. Please try another DOI.")
        }
        disabled={isFetching}
        containerStyle={styles.inputContainer}
        onChange={(name, value) => {
          setDoiInput(value);
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
