import { breakpoints } from "~/config/themes/screen";
import { css, StyleSheet } from "aphrodite";
import { formGenericStyles } from "../Upload/styles/formGenericStyles";
import { ReactElement, SyntheticEvent, useContext } from "react";
import { WizardBodyTypes } from "./types/PaperUploadWizardTypes";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import {
  NewPostButtonContext,
  NewPostButtonContextType,
} from "~/components/contexts/NewPostButtonContext";

type Props = {
  currentStep?: WizardBodyTypes;
};

export default function PaperUploadWizardHeader({
  currentStep,
}: Props): ReactElement<"div"> | null {
  const { values: uploaderContextValues, setValues: setUploaderContextValues } =
    useContext<NewPostButtonContextType>(NewPostButtonContext);

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
        <div className={css(styles.title)}>
          {"Your paper was imported successfully."}
        </div>
        <div className={css(styles.subTitle)}>{"Please add some metadata"}</div>
      </div>
    );
  } else {
    return (
      <div
        className={css(formGenericStyles.header, formGenericStyles.text)}
        style={{
          /* overrides default header padding */
          paddingBottom: "16px !important",
          [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
            paddingLeft: "0 !important",
            paddingRight: "0 !important",
            padding: "unset !important",
          },
        }}
      >
        {currentStep === "pdf_upload" ? (
          <div
            style={{
              alignItems: "center",
              display: "flex",
            }}
          >
            <span
              style={{
                color: colors.TEXT_GREY(1),
                cursor: "pointer",
                fontSize: 16,
                marginRight: 8,
              }}
              onClick={(event: SyntheticEvent): void => {
                event.preventDefault();
                setUploaderContextValues({
                  ...uploaderContextValues,
                  wizardBodyType: "url_or_doi_upload",
                });
              }}
            >
              {icons.longArrowLeft}
            </span>
            {" Add PDF "}
          </div>
        ) : (
          "Add Paper"
        )}
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

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: 500,
    marginBottom: 26,
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      fontSize: 20,
      marginBottom: 18,
    },
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 500,
    marginBottom: 18,
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      fontSize: 16,
      marginBottom: 8,
    },
  },
});
