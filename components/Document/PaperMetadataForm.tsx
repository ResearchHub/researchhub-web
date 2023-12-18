import { DocumentMetadata, Paper } from "~/components/Document/lib/types";
import { useCallback, useState } from "react";
import FormInput from "../Form/FormInput";
import { css, StyleSheet } from "aphrodite";
import Button from "../Form/Button";
import { formatDateStandard } from "~/config/utils/dates";
import { MessageActions } from "~/redux/message";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import updatePaperMetadataAPI from "./api/updatePaperMetadataAPI";
import colors from "~/config/themes/colors";
import HubSelectDropdown from "../Hubs/HubSelectDropdown";
import { ClipLoader } from "react-spinners";
const { setMessage, showMessage } = MessageActions;

interface FormProps {
  paper: Paper;
  onUpdate?: Function;
  metadata: DocumentMetadata;
}

const PaperMetadataForm = ({ paper, onUpdate, metadata }: FormProps) => {
  const [fields, setFields] = useState({
    doi: paper.doi || "",
    publishedDate: formatDateStandard(paper.publishedDate, "MM/DD/YYYY"),
    title: paper.title || "",
    hubs: metadata.hubs,
  });

  const [saveInProgress, setSaveInProgress] = useState(false);
  const [editedFields, setEditedFields] = useState(new Set());
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  const validate = (name, value) => {
    if (name === "title") {
      return value.length >= 10;
    } else if (name === "doi") {
      return value.length > 0;
    } else if (name === "publishedDate") {
      const parsedDate = dayjs(value, "MM/DD/YYYY");
      return parsedDate.isValid() && value === parsedDate.format("MM/DD/YYYY");
    }
  };
  const handleSubmit = (e) => {
    const errors = {};
    if (editedFields.has("title") && !validate("title", fields["title"])) {
      errors["title"] = "Title must be at least 10 characters";
    }
    if (
      editedFields.has("publishedDate") &&
      !validate("publishedDate", fields["publishedDate"])
    ) {
      errors["publishedDate"] = "Enter a valid date in the format MM/DD/YYYY";
    }
    if (editedFields.has("doi") && !validate("doi", fields["doi"])) {
      errors["doi"] = "Enter a valid DOI";
    }

    setErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setSaveInProgress(true);
    updatePaperMetadataAPI({
      id: paper.id,
      title: fields.title,
      doi: fields.doi,
      publishedDate: fields.publishedDate,
      hubs: fields.hubs.map((h) => h.id),
    })
      .then(() => {
        onUpdate &&
          onUpdate({
            title: fields.title,
            publishedDate: fields.publishedDate,
            doi: fields.doi,
            hubs: fields.hubs,
          });
        dispatch(setMessage("Paper updated"));

        // @ts-ignore
        dispatch(showMessage({ show: true, error: false }));
      })
      .finally(() => {
        setSaveInProgress(false);
      });
  };

  const handleChange = (name, value) => {
    if (!editedFields.has(name)) {
      setEditedFields((prev) => new Set(prev).add(name));
    }

    if (errors[name]) {
      if (validate(name, value)) {
        setErrors((prev) => ({
          ...prev,
          [name]: null,
        }));
      }
    }

    setFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className={css(formStyles.formWrapper)}>
      <FormInput
        label="Title"
        placeholder="Original title of the paper"
        containerStyle={formStyles.container}
        inputStyle={formStyles.inputStyle}
        error={errors["title"]}
        value={fields.title}
        id="title"
        onChange={handleChange}
      />
      <HubSelectDropdown
        selectedHubs={fields.hubs}
        onChange={(hubs) => {
          handleChange("hubs", hubs);
        }}
      />
      <div style={{ display: "flex", columnGap: 25 }}>
        <FormInput
          label="DOI"
          placeholder="Unique DOI identifier"
          containerStyle={formStyles.container}
          inputStyle={formStyles.inputStyle}
          error={errors["doi"]}
          value={fields.doi}
          id="doi"
          onChange={handleChange}
        />
        <FormInput
          label="Published Date"
          placeholder="Date of publication (MM/DD/YYYY)"
          error={errors["publishedDate"]}
          containerStyle={formStyles.container}
          inputStyle={formStyles.inputStyle}
          value={fields.publishedDate}
          id="publishedDate"
          onChange={handleChange}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button disabled={saveInProgress} onClick={handleSubmit} type="submit">
          <div
            style={{ display: "flex", alignItems: "center", columnGap: "5px" }}
          >
            Save changes
            {saveInProgress && (
              <ClipLoader
                sizeUnit={"px"}
                size={18}
                color={"white"}
                loading={true}
              />
            )}
          </div>
        </Button>
      </div>
    </div>
  );
};

const formStyles = StyleSheet.create({
  container: {},
  inputStyle: {},
  formWrapper: {
    width: "100%",
  },
  tagLabel: {
    color: colors.NEW_BLUE(1),
    cursor: "pointer",
  },
  tag: {
    border: 0,
    background: colors.NEW_BLUE(0.1),
    padding: "4px 12px",
    height: "unset",
    textDecoration: "none",
    fontWeight: 400,
    borderRadius: 50,
    color: colors.NEW_BLUE(),
  },
});

export default PaperMetadataForm;
