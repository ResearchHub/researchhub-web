import { css } from "aphrodite";
import { formGenericStyles } from "../Upload/styles/formGenericStyles";
import { ReactElement } from "react";
import { WizardBodyTypes } from "./types/PaperUploadWizardTypes";

type Props = {
  currentStep?: WizardBodyTypes;
};

export default function PaperUploadWizardHeader({
  currentStep,
}: Props): ReactElement<"div"> | null {
  return (
    <div
      className={css(formGenericStyles.header, formGenericStyles.text)}
      style={{
        paddingBottom: "16px !important" /* overrides default header padding */,
      }}
    >
      {currentStep !== "url_upload" ? "Add PDF" : "Add Paper"}
      <a
        className={css(formGenericStyles.authorGuidelines)}
        href="https://www.notion.so/researchhub/Paper-Submission-Guidelines-a2cfa1d9b53c431a91c9816e17f212e1"
        target="_blank"
        rel="noreferrer noopener"
      >
        {"Submission Guidelines"}
      </a>
      <div className={css(formGenericStyles.sidenote, formGenericStyles.text)}>
        {"Up to 15MB (.pdf)"}
      </div>
    </div>
  );
}
