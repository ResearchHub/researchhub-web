import { css, StyleSheet } from "aphrodite";
import { useRouter } from "next/router";
import { SyntheticEvent, useState } from "react";
import { verifStyles } from "~/components/AuthorClaimModal/AuthorClaimPromptEmail";
import Button from "~/components/Form/Button";
import FormInput from "~/components/Form/FormInput";
import FormSelect from "~/components/Form/FormSelect";
import { useEffectFetchSuggestedHubs } from "../Upload/api/useEffectGetSuggestedHubs";
import {
  customStyles,
  formGenericStyles,
} from "../Upload/styles/formGenericStyles";

type FormError = {
  paperID: boolean;
  selectedHubs: boolean;
  title: boolean /* editorialized title */;
  doi: boolean;
};

type FormState = {
  doi: null | string;
  paperID: null;
  selectedHubs: any[];
  title: null | string /* editorialized title */;
};

const defaulError: FormError = {
  doi: false,
  paperID: false,
  selectedHubs: false,
  title: false,
};

const defaultFormState: FormState = {
  doi: null,
  paperID: null,
  selectedHubs: [],
  title: null,
};

export default function PaperUploadWizardUpdatePaper({ onExit, paperID }) {
  // TODO: calvinhlee - migrate this to pure typeahead
  const [formError, setFormError] = useState<FormError>(defaulError);
  const [formState, setFormState] = useState<FormState>(defaultFormState);
  const [suggestedHubs, setSuggestedHubs] = useState<any>([]);
  const { doi, title, selectedHubs } = formState;
  useEffectFetchSuggestedHubs({ setSuggestedHubs });

  // const onFormSubmit = (event: SyntheticEvent): void => {
  //   event.preventDefault();
  //   const isFormValid = getIsFormValid({
  //     formState,
  //     formErrors,
  //     setFormErrors,
  //   });
  //   if (isFormValid) {
  //     messageActions.showMessage({ load: true, show: true });
  //   } else {
  //     messageActions.setMessage("Required fields must be filled.");
  //     messageActions.showMessage({
  //       load: false,
  //       show: true,
  //       error: true,
  //     });
  //   }
  // };

  // const handleHubSelection = (_id: ID, selectedHubs: any): void => {
  //   if (isNullOrUndefined(selectedHubs)) {
  //     setFormState({ ...formState, hubs: [] });
  //     setFormErrors({ ...formErrors, hubs: true });
  //   } else {
  //     setFormState({ ...formState, hubs: selectedHubs });
  //     setFormErrors({ ...formErrors, hubs: selectedHubs.length < 1 });
  //   }
  // };
  const router = useRouter();
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        router.push("/paper/[paperId]/", `/paper/${paperID}/`);
        onExit();
      }}
    >
      <FormSelect
        containerStyle={formGenericStyles.container}
        error={formError.selectedHubs}
        id="hubs"
        isMulti
        label="Hubs"
        inputStyle={
          (customStyles.input,
          selectedHubs.length > 0 && customStyles.capitalize)
        }
        labelStyle={formGenericStyles.labelStyle}
        onChange={(hubs: any[]) =>
          setFormState({ ...formState, selectedHubs: hubs })
        }
        options={suggestedHubs}
        placeholder="Search Hubs"
        required
        // value={selectedHubs}
      />
      <FormInput
        label="DOI"
        placeholder="Jargon free version of the title that the average person would understand"
        containerStyle={formGenericStyles.container}
        labelStyle={formGenericStyles.labelStyle}
        // value={doi}
        id="doi"
        onChange={(doi: string | string) => setFormState({ ...formState, doi })}
      />
      <FormInput
        label="Editorialized Title (optional)"
        placeholder="Jargon free version of the title that the average person would understand"
        containerStyle={formGenericStyles.container}
        labelStyle={formGenericStyles.labelStyle}
        // value={title}
        id="title"
        onChange={(title: string | string) =>
          setFormState({ ...formState, title })
        }
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "16px 0",
          width: "100%",
        }}
      >
        <Button
          customButtonStyle={verifStyles.buttonSecondary}
          isWhite
          key="upload-wizard-cancel"
          label="Skip"
          rippleClass={verifStyles.rippleClass}
          size="xxsmall"
          type="button"
          onClick={(event: SyntheticEvent): void => {
            event.preventDefault();
            onExit();
            // logical ordering
          }}
        />
        <Button
          customButtonStyle={verifStyles.buttonCustomStyle}
          key="upload-wizard-button"
          label="Save"
          rippleClass={verifStyles.rippleClass}
          size="xxsmall"
          type="submit"
        />
      </div>
    </form>
  );
}
