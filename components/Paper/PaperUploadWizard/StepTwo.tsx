import { FC, useRef, useState } from "react";
import FormInput from "../../Form/FormInput";
import FormDND from "../../Form/FormDND";
import FormSelect from "../../Form/FormSelect";
import * as Options from "../../../config/utils/options";
import FormTextArea from "../../Form/FormTextArea";
import { PaperDetails } from "./PaperUploadWizard";
import { HubPicker } from "./HubPicker";

type StepTwoProps = {
  details: PaperDetails;
  setDetails: (details: Partial<PaperDetails>) => void;
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
}) => {
  function handleFieldChange<T extends keyof PaperDetails>(field: T) {
    return (id: string, value: PaperDetails[T]) => {
      setDetails({ [field]: value });
    };
  }

  return (
    <div>
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
      <FormTextArea
        id="abstract"
        label="Abstract"
        onChange={handleFieldChange("abstract")}
        placeholder="Enter the paper"
        value={abstract}
      />
      <FormSelect
        // error={formErrors.year}
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
        id="published.month"
        label="Month of Publication"
        onChange={handleFieldChange("pubMonth")}
        options={Options.months}
        placeholder="month"
        required={false}
        value={pubMonth}
      />
      <HubPicker value={hubs} onChange={handleFieldChange("hubs")} />
    </div>
  );
};
