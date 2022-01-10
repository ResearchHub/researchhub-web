import {
  customStyles,
  formGenericStyles,
} from "~/components/Paper/Upload/styles/formGenericStyles";
import { emptyFncWithMsg, nullthrows } from "~/config/utils/nullchecks";
import { hubEditorCreate } from "../api/hubEditorCreate";
import { ID } from "~/config/types/root_types";
import { Fragment, ReactElement, SyntheticEvent, useState } from "react";
import { useEffectFetchSuggestedHubs } from "~/components/Paper/Upload/api/useEffectGetSuggestedHubs";
import { verifStyles } from "~/components/AuthorClaimModal/AuthorClaimPromptEmail";
import Button from "~/components/Form/Button";
import FormInput from "~/components/Form/FormInput";
import FormSelect from "~/components/Form/FormSelect";
import Loader from "~/components/Loader/Loader";

type FormState = {
  selectedHub: any;
  editorEmail: string | null;
};

const DEFAULT_FORM_STATE: FormState = {
  selectedHub: null,
  editorEmail: null,
};

export default function HubEditorCreateForm(): ReactElement<typeof Fragment> {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [suggestedHubs, setSuggestedHubs] = useState<any>([]);
  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);

  useEffectFetchSuggestedHubs({ setSuggestedHubs });

  const { selectedHub, editorEmail } = formState;
  const handleSubmit = (event: SyntheticEvent): void => {
    event.preventDefault();
    setIsSubmitting(true);
    hubEditorCreate({
      editorEmail: nullthrows(editorEmail, "Editor email cannot be empty"),
      onSuccess: (): void => {
        setFormState(DEFAULT_FORM_STATE);
        setIsSubmitting(false);
        alert(
          `User with email ${editorEmail} is now an editor of ${selectedHub.name}`
        );
      },
      onError: (error: Error): void => {
        emptyFncWithMsg(error);
        setFormState(DEFAULT_FORM_STATE);
        setIsSubmitting(false);
        alert(`Oops, something went wrong: ${error.message}`);
      },
      selectedHubID: nullthrows(
        selectedHub?.id ?? null,
        "Hub needs to be selected"
      ),
    });
  };

  return (
    <Fragment>
      <div>
        <h1>{"Add a New Hub Editor"}</h1>
      </div>
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
          value={editorEmail}
        />
        <div
          style={{ display: "flex", width: "100%", justifyContent: "center" }}
        >
          <Button
            label={
              isSubmitting ? (
                <Loader size={8} loading color="#fff" />
              ) : (
                "Submit"
              )
            }
            type="submit"
            customButtonStyle={verifStyles.buttonCustomStyle}
            rippleClass={verifStyles.rippleClass}
            disabled={isSubmitting}
          />
        </div>
      </form>
    </Fragment>
  );
}
