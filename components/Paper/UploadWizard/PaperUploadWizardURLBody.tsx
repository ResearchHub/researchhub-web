import { isStringURL } from "~/config/utils/isStringURL";
import { SyntheticEvent, useState } from "react";
import { verifStyles } from "~/components/AuthorClaimModal/AuthorClaimPromptEmail";
import { WizardBodyTypes } from "./types/PaperUploadWizardTypes";
import Button from "~/components/Form/Button";
import PaperUploadWizardInput from "./shared/PaperUploadWizardInput";

type Props = { setCurrentStep: (step: WizardBodyTypes) => void };
type FormErrors = { url: boolean };
type FormValues = { url: string };

export default function PaperUploadWizardURLBody({ setCurrentStep }: Props) {
  const [formErrors, setFormErrors] = useState<FormErrors>({ url: false });
  const [formValues, setFormValues] = useState<FormValues>({ url: "" });

  const { url: urlError } = formErrors;
  const { url } = formValues;

  const onSubmit = (event: SyntheticEvent): void => {
    event.preventDefault();
    const wtf = isStringURL(url);
    const newFormErrors = { url: !wtf };
    const hasError = Object.values(newFormErrors).includes(true);
    if (hasError) {
      setFormErrors(newFormErrors);
    } else {
      setFormErrors({ url: false });
      setFormValues({ url: "" });
      setCurrentStep("standby");
      // TODO: calvinhlee - hook up to BE & wait for async response
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <PaperUploadWizardInput
        error={urlError}
        label="Link to Paper"
        onChange={(value: null | string): void =>
          setFormValues({ ...formValues, url: value ?? "" })
        }
        placeholder="Paste a url to source"
        required
        value={url}
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
