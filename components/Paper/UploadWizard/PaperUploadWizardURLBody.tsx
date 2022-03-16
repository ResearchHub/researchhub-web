import { useState } from "react";
import { verifStyles } from "~/components/AuthorClaimModal/AuthorClaimPromptEmail";
import Button from "~/components/Form/Button";
import Loader from "~/components/Loader/Loader";
import PaperUploadWizardInput from "./shared/PaperUploadWizardInput";
import { WizardBodyTypes } from "./types/PaperUploadWizardTypes";

type ComponentState = { isSubmitting: boolean };
type Props = { setCurrentStep: (step: WizardBodyTypes) => void };
type FormValue = { url: string };

// TODO: calvinhojin - add validation for the form
// validateWebsiteUrl = websiteUrl => {
//     const urlRegEx =
//       '[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}(.[a-z]{2,4})?\b(/[-a-zA-Z0-9@:%_+.~#?&//=]*)?';
//     return urlRegEx.test(String(websiteUrl).toLowerCase());
//   };

export default function PaperUploadWizardURLBody({ setCurrentStep }: Props) {
  const [formValues, setFormValues] = useState<FormValue>({ url: "" });
  const { url } = formValues;

  return (
    <form key="upload-wizard">
      <PaperUploadWizardInput
        label="Link to Paper"
        onChange={(value: null | string): void =>
          setFormValues({ ...formValues, url: value ?? "" })
        }
        required
        value={url}
        placeholder="Paste a url to source"
      />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "16px 0",
          width: "100%",
        }}
      >
        <Button
          customButtonStyle={verifStyles.buttonCustomStyle}
          key="upload-wizard-button"
          label="Import"
          rippleClass={verifStyles.rippleClass}
          size="xxsmall"
          type="submit"
        />
      </div>
    </form>
  );
}
