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
    label: "Original Research Article",
  },
  {
    value: "case-study",
    label: "Case Study",
  },
  {
    value: "short-report",
    label: "Short communication",
  },  
];

export type ContentStepProps = {
  title: string | null;
  setTitle: Function;
  selectedWorkType: WORK_TYPE;
  setSelectedWorkType: Function;
  abstract: string | null;
  fileName: string | null;
  setAbstract: Function;
  selectedHubs: Hub[];
  setSelectedHubs: Function;
  onFileUpload: (objectKey: string, absoluteUrl: string, fileName: string) => void;
  onFileUploadError: (error: Error) => void;
  fileUploadError: Error | null;
  fieldErrors: {[key: string]: string | null};
};

const PaperVersionContentStep = ({
  title,
  setTitle,
  selectedWorkType,
  setSelectedWorkType,
  abstract,
  fileName,
  setAbstract,
  selectedHubs,
  setSelectedHubs,
  onFileUpload,
  onFileUploadError,
  fileUploadError,
  fieldErrors,
}: ContentStepProps) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div className={css(formStyles.inputWrapper)}>
        <FormInput
          error={fieldErrors?.title}
          value={title || ""}
          label="Title"
          required
          placeholder="Title of your manuscript"
          containerStyle={formStyles.inputContainer}
          onChange={(name, value) => {
            setTitle(value);
          }}
        />
      </div>

      <div className={css(formStyles.inputWrapper)}>
        <FormTextArea
          label="Abstract"
          required
          placeholder="Abstract of your manuscript"
          inputStyle={formStyles.textArea}
          value={abstract || ""}
          onChange={(_name, value) => {
            setAbstract(value);
          }}
          error={fieldErrors?.abstract}
        />
      </div>

      <div className={css(formStyles.inputWrapper)}>
        <FormSelect
          onChange={(_type: string, value): void => {
            setSelectedWorkType(value);
          }}
          id="article-type"
          label="Article type"
          required
          options={articleTypeOptions}
          placeholder="Select article type"
          type="select"
          value={articleTypeOptions.find(
            (option) => option.value === (selectedWorkType || "article")
          )}
          error={fieldErrors?.workType}
        />
      </div>

      <div className={css(formStyles.inputWrapper)}>
        <HubSelectDropdown
          label={"Hubs"}
          selectedHubs={selectedHubs}
          showSelectedHubs={false}
          dropdownStyles={{
            ...selectDropdownStyles,
            menu: {
              minWidth: 425,
              width: "100%",
            },
          }}
          placeholder={<div style={{ textTransform: "initial"}}>Tag your manuscript with relevant hubs</div>}
          required
          onChange={(hubs) => {
            setSelectedHubs(hubs);
          }}
          error={fieldErrors.hubs}
        />
      </div>

      <div className={css(formStyles.inputWrapper)}>
        <FormFileUpload
          required
          label="Upload manuscript file"
          fileName={fileName || undefined}
          error={fieldErrors.file || (fileUploadError ? "Failed to upload file" : undefined)}
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
