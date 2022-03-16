import { css } from "aphrodite";
import { formGenericStyles } from "../Upload/styles/formGenericStyles";
import { ReactElement } from "react";

type Props = {
  currentStep: string;
};

export default function PaperUploadWizardHeader({
  currentStep,
}: Props): ReactElement<"div"> | null {
  if (currentStep === "standby") {
    return null;
  }

  return (
    <div className={css(formGenericStyles.header, formGenericStyles.text)}>
      {currentStep === "url_upload" ? "Add Paper" : "Add PDF"}
      <a
        className={css(formGenericStyles.authorGuidelines)}
        href="https://www.notion.so/researchhub/Paper-Submission-Guidelines-a2cfa1d9b53c431a91c9816e17f212e1"
        target="_blank"
        rel="noreferrer noopener"
      >
        {"Submission Guidelines"}
      </a>
      {currentStep === "pdf_upload" && (
        <div
          className={css(formGenericStyles.sidenote, formGenericStyles.text)}
        >
          {"Up to 15MB (.pdf)"}
        </div>
      )}
    </div>
  );
}
