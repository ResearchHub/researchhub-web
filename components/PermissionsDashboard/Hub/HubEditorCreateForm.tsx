import { ReactElement, SyntheticEvent, useState } from "react";
import { verifStyles } from "~/components/AuthorClaimModal/AuthorClaimPromptEmail";
import Button from "~/components/Form/Button";
import FormInput from "~/components/Form/FormInput";
import FormSelect from "~/components/Form/FormSelect";
import Loader from "~/components/Loader/Loader";
import { useEffectFetchSuggestedHubs } from "~/components/Paper/Upload/api/useEffectGetSuggestedHubs";
import {
  customStyles,
  formGenericStyles,
} from "~/components/Paper/Upload/styles/formGenericStyles";
import { ID } from "~/config/types/root_types";

type FormState = {
  selectedHub: any;
  editorEmail: string | null;
};

export default function HubEditorCreateForm(): ReactElement<"div"> {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [suggestedHubs, setSuggestedHubs] = useState<any>([]);
  const [formState, setFormState] = useState<FormState>({
    selectedHub: null,
    editorEmail: null,
  });

  useEffectFetchSuggestedHubs({ setSuggestedHubs });

  const { selectedHub, editorEmail } = formState;
  const handleSubmit = (event: SyntheticEvent): void => {
    event.preventDefault();
    setIsSubmitting(true);
    console.warn("selectedHub: ", selectedHub);
    console.warn("editorEmail: ", editorEmail);
  };

  return (
    <form encType="multipart/form-data" onSubmit={handleSubmit}>
      <FormSelect
        containerStyle={formGenericStyles.container}
        id="hubs"
        label="Hubs"
        inputStyle={customStyles.input}
        labelStyle={formGenericStyles.labelStyle}
        onChange={(_id: ID, selectedHub: any): void =>
          setFormState({ ...formState, selectedHub })
        }
        options={suggestedHubs}
        placeholder="Search Hubs"
        required
        value={selectedHub}
      />
      <FormInput
        containerStyle={formGenericStyles.container}
        disable={isSubmitting}
        id="editorEmail"
        label="New Editor's Email"
        onChange={(_id: ID, editorEmail: string): void =>
          setFormState({ ...formState, editorEmail })
        }
        placeholder="example@university.edu"
        required
        type="email"
      />
      <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
        <Button
          label={
            isSubmitting ? (
              <Loader size={8} loading color="#fff" />
            ) : (
              "Verify Email"
            )
          }
          type="submit"
          customButtonStyle={verifStyles.buttonCustomStyle}
          rippleClass={verifStyles.rippleClass}
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
}
