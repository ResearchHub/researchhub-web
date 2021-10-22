import { FC, useRef, useState } from "react";
import FormInput from "../../Form/FormInput";
import { PaperDetails } from "./PaperUploadWizard";

type StepOneProps = {
  onFetchSuccess: (details: Partial<PaperDetails>) => void;
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const StepOne: FC<StepOneProps> = ({ onFetchSuccess }) => {
  const [value, setValue] = useState("");
  const valueRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");

  const handleInputChange = (id: string, value: string) => {
    setValue(value);
    setIsLoading(true);
    valueRef.current = value;

    delay(Math.random() * 3000).then(() => {
      // make sure we deal with most recently input data, and not with the most
      // recently resolved API fetch
      if (valueRef.current !== value) {
        return;
      }

      setIsLoading(false);
      // TODO duplicate
      // TODO success
      // TODO fail (no meta, invalid doi or url) TODO display error

      onFetchSuccess({
        // TODO
      });
    });
  };

  return (
    <div>
      <FormInput
        id="url"
        label="Link to the paper"
        placeholder="Paste a DOI or an URL to the PDF"
        value={value}
        onChange={handleInputChange}
        required
        spellCheck={false}
        // containerStyle={formGenericStyles.container}
        // labelStyle={formGenericStyles.labelStyle}
      />
    </div>
  );
};
