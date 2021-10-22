import { FC } from "react";
import Button from "../../Form/Button";
import FormInput from "../../Form/FormInput";
import FormDND from "../../Form/FormDND";
import FormSelect from "../../Form/FormSelect";
import * as Options from "../../../config/utils/options";
import FormTextArea from "../../Form/FormTextArea";
import { PaperDetails } from "./PaperUploadWizard";
import { HubPicker } from "./HubPicker";
import { AuthorsPicker } from "./AuthorsPicker";
import { css, StyleSheet } from "aphrodite";
import { formGenericStyles } from "../Upload/styles/formGenericStyles";
import { PaperMetadata } from "~/config/types/root_types";

type StepTwoProps = {
  details: PaperDetails;
  setDetails: (details: Partial<PaperDetails>) => void;
  onBack: () => void;
  onSubmit: () => void;
};

export const StepTwo: FC<StepTwoProps> = ({
  details: {
    abstract,
    authors,
    doi,
    pubMonth,
    pubYear,
    editorializedTitle,
    pdfUrl,
    hubs,
  },
  setDetails,
  onBack,
  onSubmit,
}) => {
  const isSubmitDisabled = false;

  function handleFieldChange<T extends keyof PaperDetails>(field: T) {
    return (id: string, value: PaperDetails[T]) => {
      setDetails({ [field]: value });
    };
  }

  const handleFileDrop = (
    acceptedFiles: File[],
    paperMetadata: PaperMetadata
  ) => {
    // const paperFile = acceptedFiles[0];
    // this.props.uploadPaperToState(paperFile, paperMetaData);
    // paperActions.uploadPaperToState(metaData, { ...res })
  };

  return (
    <div>
      <div>
        <FormDND
          handleDrop={handleFileDrop}
          urlView={false}
          showUrlOption={false}
        />

        <FormInput
          id="doi"
          label="DOI"
          placeholder="DOI"
          value={doi}
          onChange={handleFieldChange("doi")}
          required={true}
          spellCheck={false}
        />
        <FormInput
          id="ed_title"
          label="Editorialized Title (optional)"
          placeholder="Jargon free version of the title that the average person would understand"
          value={editorializedTitle}
          onChange={handleFieldChange("editorializedTitle")}
        />
        <AuthorsPicker
          id="authors"
          value={authors}
          onChange={handleFieldChange("authors")}
        />
        <div className={css(formGenericStyles.row)}>
          <FormSelect
            // error={formErrors.year}
            containerStyle={formGenericStyles.smallContainer}
            id="published.year"
            label="Year of Publication"
            onChange={handleFieldChange("pubYear")}
            options={Options.range(1960, new Date().getFullYear())}
            placeholder="yyyy"
            required={false}
            value={pubYear}
          />
          <FormSelect
            // error={formErrors.month}
            containerStyle={formGenericStyles.smallContainer}
            id="published.month"
            label="Month of Publication"
            onChange={handleFieldChange("pubMonth")}
            options={Options.months}
            placeholder="month"
            required={false}
            value={pubMonth}
          />
        </div>
        <HubPicker
          value={hubs}
          onChange={handleFieldChange("hubs")}
          id="hubs"
        />
        <FormTextArea
          id="abstract"
          label="Abstract"
          onChange={handleFieldChange("abstract")}
          placeholder="Enter the paper"
          value={abstract}
        />
      </div>
      <div className={css(styles.buttonsContainer)}>
        <div
          className={css(
            formGenericStyles.button,
            formGenericStyles.buttonLeft
          )}
          onClick={onBack}
        >
          <span
            className={css(
              formGenericStyles.buttonLabel,
              formGenericStyles.text
            )}
          >
            Cancel
          </span>
        </div>
        <Button
          customButtonStyle={formGenericStyles.button}
          disabled={isSubmitDisabled}
          label="Upload"
          type="submit"
        />
      </div>
    </div>
  );
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
