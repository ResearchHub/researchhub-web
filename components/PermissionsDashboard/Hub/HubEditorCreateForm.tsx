import { css, StyleSheet } from "aphrodite";
import {
  customStyles,
  formGenericStyles,
} from "~/components/Paper/Upload/styles/formGenericStyles";
import { emptyFncWithMsg, nullthrows } from "~/config/utils/nullchecks";
import { hubEditorCreate } from "../api/hubEditorCreate";
import { ID } from "~/config/types/root_types";
import { ReactElement, SyntheticEvent, useState } from "react";
import { verifStyles } from "~/components/AuthorClaimModal/AuthorClaimPromptEmail";
import Button from "~/components/Form/Button";
import FormInput from "~/components/Form/FormInput";
import FormSelect from "~/components/Form/FormSelect";
import Loader from "~/components/Loader/Loader";
import HubSelectDropdown from "~/components/Hubs/HubSelectDropdown";
import { Hub } from "~/config/types/hub";

type FormState = {
  selectedHub: any;
  editorType: string;
  editorEmail: string | null;
};

const DEFAULT_FORM_STATE: FormState = {
  selectedHub: null,
  editorType: "ASSISTANT_EDITOR",
  editorEmail: null,
};

export default function HubEditorCreateForm(): ReactElement<"div"> {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
  const [isOpen, setIsOpen] = useState(false);

  const { selectedHub, editorEmail, editorType } = formState;
  const handleSubmit = (event: SyntheticEvent): void => {
    event.preventDefault();
    setIsSubmitting(true);
    hubEditorCreate({
      editorEmail: nullthrows(editorEmail, "Editor email cannot be empty"),
      editorType: nullthrows(editorType, "Editor type cannot be empty"),
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

  const editorOptions = [
    {value: "ASSISTANT_EDITOR", label: "Assistant Editor"},
    {value: "ASSOCIATE_EDITOR", label: "Associate Editor"},
    {value: "SENIOR_EDITOR", label: "Senior Editor"},
  ];

  return (
    <div className={css(styles.formWrap)}>
      <div>
        <h1>{"Add a New Hub Editor"}</h1>
      </div>
      <form encType="multipart/form-data" onSubmit={handleSubmit}>
        <HubSelectDropdown
          selectedHubs={selectedHub ? [selectedHub] : []}
          required
          isMulti={false}
          onChange={(hubs: Array<Hub>) => {
            setFormState({ ...formState, selectedHub: hubs[0] });
          }}
        />
        <FormSelect
          id={"frequencySelect"}
          options={editorOptions}
          label="Editor Type"
          value={formState.editorType}
          containerStyle={formGenericStyles.container}
          isSearchable={false}
          onChange={(_id: ID, editorType: string): void =>
            setFormState({ ...formState, editorType })
          }
          required
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
          value={editorEmail ?? ""}
        />
        <div
          style={{ display: "flex", width: "100%", justifyContent: "center" }}
        >
          <Button
            label={
              isSubmitting ? <Loader size={8} loading color="#fff" /> : "Submit"
            }
            type="submit"
            customButtonStyle={verifStyles.buttonCustomStyle}
            rippleClass={verifStyles.rippleClass}
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
}

const styles = StyleSheet.create({
  formWrap: { maxWidth: 800, width: "100%" },
});