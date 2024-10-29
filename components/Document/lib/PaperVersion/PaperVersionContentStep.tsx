import { useEffect, useState } from "react";
import BaseModal from "~/components/Modals/BaseModal";
import { StyleSheet, css } from "aphrodite";
import { fetchDocumentByType } from "../fetchDocumentByType";
import { DocumentVersion, Paper, parsePaper, WORK_TYPE } from "../types";
import FormInput from "~/components/Form/FormInput";
import FormSelect from "~/components/Form/FormSelect";
import FormTextArea from "~/components/Form/FormTextArea";
import HubSelectDropdown, {
  selectDropdownStyles,
} from "~/components/Hubs/HubSelectDropdown";
import { Hub } from "~/config/types/hub";
import Button from "~/components/Form/Button";

export const articleTypeOptions: Array<{ value: WORK_TYPE; label: string }> = [
  {
    value: "article",
    label: "Research Article",
  },
  {
    value: "review",
    label: "Review Article",
  },
];

const PaperVersionContentStep = ({ paper }: { paper: Paper | null }) => {
  const [title, setTitle] = useState<null | string>(null);
  const [selectedWorkType, setSelectedWorkType] =
    useState<WORK_TYPE>("article");
  const [abstract, setAbstract] = useState<null | string>(null);
  const [selectedHubs, setSelectedHubs] = useState<Hub[]>([]);

  useEffect(() => {
    setTitle(paper?.title || null);
    setSelectedWorkType(paper?.workType || "article");
    setAbstract(paper?.abstract || null);
  }, [paper]);

  return (
    <div>
      <div className={css(formStyles.inputWrapper)}>
        <FormInput
          error={typeof title === "string" && title.length === 0}
          value={title}
          label="Title"
          placeholder={"Paper title"}
          containerStyle={formStyles.inputContainer}
          onChange={(name, value) => {
            setTitle(value);
          }}
        />
      </div>

      <div className={css(formStyles.inputWrapper)}>
        <FormSelect
          onChange={(_type: string, value): void => {
            setSelectedWorkType(value);
          }}
          id="article-type"
          label="Article type"
          options={articleTypeOptions}
          placeholder="Select article type"
          required={true}
          type="select"
          value={articleTypeOptions.find(
            (option) => option.value === selectedWorkType
          )}
        />
      </div>

      <div className={css(formStyles.inputWrapper)}>
        <FormTextArea
          label="Abstract"
          placeholder="Abstract"
          inputStyle={formStyles.textArea}
          value={abstract || ""}
          onChange={(_name, value) => {
            setAbstract(value);
          }}
        />
      </div>

      <div className={css(formStyles.inputWrapper)}>
        <HubSelectDropdown
          label={null}
          selectedHubs={selectedHubs}
          showSelectedHubs={false}
          dropdownStyles={{
            ...selectDropdownStyles,
            menu: {
              minWidth: 425,
              width: "100%",
            },
          }}
          placeholder={"Hubs"}
          onChange={(hubs) => {
            setSelectedHubs(hubs);
          }}
        />
      </div>
    </div>
  );
};

const formStyles = StyleSheet.create({
  inputContainer: {
    width: "100%",
  },
  inputWrapper: {},
  textArea: {
    maxHeight: 300,
    minHeight: 100,
  },
  buttonWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
  }
});

export default PaperVersionContentStep;