import { css } from "aphrodite";
import { formGenericStyles } from "../Upload/styles/formGenericStyles";
import { ReactElement } from "react";
import { WizardBodyTypes } from "./types/PaperUploadWizardTypes";
import colors from "~/config/themes/colors";

type Props = {
  currentStep?: WizardBodyTypes;
};

export default function PaperUploadWizardHeader({
  currentStep,
}: Props): ReactElement<"div"> | null {
  if (currentStep === "posted_paper_update") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingBottom:
            "16px !important" /* overrides default header padding */,
        }}
      >
        <img
          style={{ width: 60, marginBottom: 16 }}
          src="/static/icons/check.svg"
        />
        <div
          style={{
            fontSize: 26,
            fontWeight: 500,
            marginBottom: 26,
          }}
        >
          {"Your paper was imported successfully."}
        </div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 500,
            marginBottom: 18,
          }}
        >
          {"Please add some metadata"}
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={css(formGenericStyles.header, formGenericStyles.text)}
        style={{
          paddingBottom:
            "16px !important" /* overrides default header padding */,
        }}
      >
        {currentStep !== "url_or_doi_upload" ? "Add PDF" : "Add Paper"}
        <a
          className={css(formGenericStyles.authorGuidelines)}
          style={{ color: colors.BLUE(1) }}
          href="https://www.notion.so/researchhub/Paper-Submission-Guidelines-a2cfa1d9b53c431a91c9816e17f212e1"
          target="_blank"
          rel="noreferrer noopener"
        >
          {"Submission Guidelines"}
        </a>
      </div>
    );
  }
}
