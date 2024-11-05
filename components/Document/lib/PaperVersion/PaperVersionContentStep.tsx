import { StyleSheet, css } from "aphrodite";
import { WORK_TYPE } from "../types";
import FormInput from "~/components/Form/FormInput";
import FormSelect from "~/components/Form/FormSelect";
import FormTextArea from "~/components/Form/FormTextArea";
import HubSelectDropdown, {
  selectDropdownStyles,
} from "~/components/Hubs/HubSelectDropdown";
import { Hub } from "~/config/types/hub";
import FormFileUpload from "~/components/Form/FormFileUpload";
import colors from "~/config/themes/colors";


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

export type ContentStepProps = {
  title: string | null;
  setTitle: Function;
  selectedWorkType: WORK_TYPE;
  setSelectedWorkType: Function;
  abstract: string | null;
  setAbstract: Function;
  selectedHubs: Hub[];
  setSelectedHubs: Function;
  onFileUpload: (objectKey: string, absoluteUrl: string) => void;
  onFileUploadError: (error: Error) => void;
  fileUploadError: Error | null;
};

const PaperVersionContentStep = ({
  title,
  setTitle,
  selectedWorkType,
  setSelectedWorkType,
  abstract,
  setAbstract,
  selectedHubs,
  setSelectedHubs,
  onFileUpload,
  onFileUploadError,
  fileUploadError,
}: ContentStepProps) => {
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

      <div className={css(formStyles.inputWrapper)}>
        <FormFileUpload
          label="Upload research file"
          error={fileUploadError ? "Failed to upload file" : null}
          onUploadComplete={onFileUpload}
          onUploadFError={onFileUploadError}
          helperText="Only PDF files supported at this time"
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
  },
  helperText: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    color: colors.MEDIUM_GREY2(),
    fontSize: 13,
    marginTop: -15,
    fontWeight: 500,
  },
});

export default PaperVersionContentStep;
