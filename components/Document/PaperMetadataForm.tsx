import { Paper } from "~/components/Document/lib/types";
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
import FormSelect from "../Form/FormSelect";
import { Hub, parseHub } from "~/config/types/hub";
import { fetchHubSuggestions } from "../SearchSuggestion/lib/api";
import debounce from "lodash/debounce";
import { HubSuggestion } from "../SearchSuggestion/lib/types";
const { setMessage, showMessage } = MessageActions;

interface FormProps {
  paper: Paper;
  onUpdate?: Function;
}

const PaperMetadataForm = ({ paper, onUpdate }: FormProps) => {
  const [fields, setFields] = useState({
    doi: paper.doi || "",
    publishedDate: formatDateStandard(paper.publishedDate, "MM/DD/YYYY"),
    title: paper.title || "",
    hubs: (paper.hubs || []).map((h) => h.id),
  });

  const [editedFields, setEditedFields] = useState(new Set());
  const [suggestedHubs, setSuggestedHubs] = useState<HubSuggestion[]>([]);
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

    updatePaperMetadataAPI({
      id: paper.id,
      title: fields.title,
      doi: fields.doi,
      publishedDate: fields.publishedDate,
      hubs: fields.hubs,
    }).then(() => {
      onUpdate &&
        onUpdate({
          title: fields.title,
          publishedDate: fields.publishedDate,
          doi: fields.doi,
          hubs: suggestedHubs
            .filter((hub) => fields.hubs.includes(hub.id))
            .map((h) => parseHub(h)),
        });
      dispatch(setMessage("Paper updated"));

      // @ts-ignore
      dispatch(showMessage({ show: true, error: false }));
    });
  };

  const handleChange = (name, value) => {
    console.log("name", name);
    console.log("value", value);

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

  const handleHubInputChange = async (value) => {
    if (value.length >= 3) {
      const suggestions = await fetchHubSuggestions(value);
      setSuggestedHubs(suggestions);
      console.log("suggestions", suggestions);
    }
  };

  const debouncedHandleInputChange = useCallback(
    debounce(handleHubInputChange, 250),
    [suggestedHubs]
  );

  const selectedHubs = fields.hubs
    .map((hubId) => {
      const hub = paper.hubs.find((h) => h.id === hubId);
      return hub ? { label: hub.name, value: hub.id } : null;
    })
    .filter((h) => h !== null);

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
      <FormSelect
        containerStyle={formStyles.container}
        error={errors["hubs"]}
        id="hubs"
        isMulti
        label="Hubs"
        multiTagStyle={formStyles.tag}
        multiTagLabelStyle={formStyles.tagLabel}
        inputStyle={formStyles.inputStyle}
        onInputChange={(field, value) => {
          debouncedHandleInputChange(field, value);
        }}
        onChange={(name, value) => {
          console.log("value", value);
          handleChange(
            name,
            value.map((v) => v.value)
          );
        }}
        options={suggestedHubs}
        placeholder="Search Hubs"
        value={selectedHubs}
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
        <Button onClick={handleSubmit} label="Save changes" type="submit" />
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
