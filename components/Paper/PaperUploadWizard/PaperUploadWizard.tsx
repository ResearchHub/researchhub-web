import { FC, useState } from "react";
import Button from "../../Form/Button";
import FormDND from "../../Form/FormDND";
import FormInput from "../../Form/FormInput";
import FormSelect from "../../Form/FormSelect";
import { StepOne } from "./StepOne";
import { ID, PaperAuthor, Hub } from "~/config/types/root_types";
import { css, StyleSheet } from "aphrodite";
import { usePartialState } from "~/config/utils/usePartialState";
import { StepTwo } from "./StepTwo";
import { StepThree } from "./StepThree";

type PaperUploadWizardProps = {
  hypothesisId?: ID;
};

type WizardStep = "url-doi" | "details" | "confirmation";

export type PaperDetails = {
  url: string;
  doi: string;
  authors: PaperAuthor[];
  abstract: string;
  pubYear: number | null;
  pubMonth: number | null;
  editorializedTitle: string;
  pdfUrl: string;
  hubs: Hub[];
};

export const PaperUploadWizard: FC<PaperUploadWizardProps> = ({}) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>("details");
  const [details, setDetails] = usePartialState<PaperDetails>({
    url: "",
    doi: "",
    abstract: "",
    authors: [],
    pubYear: null,
    pubMonth: null,
    editorializedTitle: "",
    pdfUrl: "",
    hubs: [],
  });

  const handleFetchSuccess = (details: Partial<PaperDetails>) => {
    setDetails(details);
  };

  switch (currentStep) {
    case "url-doi": {
      return (
        <div className={css(styles.container)}>
          <StepOne onFetchSuccess={handleFetchSuccess} />
        </div>
      );
    }
    case "details": {
      return (
        <div className={css(styles.container)}>
          <div>
            <StepTwo details={details} setDetails={setDetails} />
          </div>
          <div className={css(styles.buttonsContainer)}>(back) (submit)</div>
        </div>
      );
    }
    case "confirmation": {
      return (
        <div className={css(styles.container)}>
          <StepThree />
        </div>
      );
    }
    default: {
      throw Error("Unhandled Paper Upload step render.");
    }
  }
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    background: "#FFFFFF",
    border: "1px solid #DEDEE6",
    borderRadius: "3px",
    padding: "20px 40px 30px 40px",
    "@media only screen and (min-width: 1024px)": {
      minWidth: 720,
    },
    "@media only screen and (max-width: 1209px)": {
      paddingLeft: "5vw",
      paddingRight: "5vw",
    },
  },
  buttonsContainer: {
    width: "auto",
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "30px",
    "@media only screen and (max-width: 767px)": {
      width: "auto",
      justifyContent: "center",
    },
  },
});
