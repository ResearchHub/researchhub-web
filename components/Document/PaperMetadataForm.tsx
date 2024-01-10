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
import { components } from "react-select";
import useCurrentUser from "~/config/hooks/useCurrentUser";
import FormSelect from "../Form/FormSelect";
const { setMessage, showMessage } = MessageActions;

// These options match the OpenAlex types: https://api.openalex.org/works?group_by=primary_location.license:include_unknown
const LICENSE_OPTIONS = [
  {
    label: "Unknown",
    value: "unknown",
    description: "The license status of this paper is unclear or not provided.",
  },
  {
    label: "CC BY",
    value: "cc-by",
    description:
      "Allows others to distribute, remix, adapt, and build upon the work, even commercially, as long as they credit the author for the original creation.",
  },
  {
    label: "CC BY-NC-ND",
    value: "cc-by-nc-nd",
    description:
      "Allows others to download the works and share them with others as long as they credit the author, but they can't change them in any way or use them commercially.",
  },
  {
    label: "CC BY-NC",
    value: "cc-by-nc",
    description:
      "Allows others to remix, tweak, and build upon the work non-commercially, and although their new works must also acknowledge the author and be non-commercial, they don't have to license their derivative works on the same terms.",
  },
  {
    label: "CC BY-NC-SA",
    value: "cc-by-nc-sa",
    description:
      "Allows others to remix, tweak, and build upon the work non-commercially, as long as they credit the author and license their new creations under the identical terms.",
  },
  {
    label: "CC BY-SA",
    value: "cc-by-sa",
    description:
      "Allows others to remix, tweak, and build upon the work even for commercial purposes, as long as they credit the author and license their new creations under the identical terms.",
  },
  {
    label: "CC BY-ND",
    value: "cc-by-nd",
    description:
      "Allows for redistribution, commercial and non-commercial, as long as the work is passed along unchanged and in whole, with credit to the author.",
  },
  {
    label: "Publisher-Specific Open-Access",
    value: "publisher-specific-oa",
    description:
      "Open access license defined by the publisher, which may include specific restrictions and conditions.",
  },
  {
    label: "Publisher-Specific or Author Manuscript",
    value: "publisher-specific, author manuscript",
    description:
      "Includes publisher-specific licenses or papers that are author manuscripts, possibly with different usage rights.",
  },
  {
    label: "CC0 (Public Domain)",
    value: "public-domain",
    description:
      "Indicates that the author has waived all copyright and related rights, placing the work in the public domain.",
  },
  {
    label: "Other Open-Access",
    value: "other-oa",
    description:
      "Open access license not covered by other categories, may include various less common open-access types.",
  },
];

const LicenseOptionWithDescription: React.FC<any> = (props) => {
  return (
    <components.Option {...props}>
      <div>{props.data.label}</div>
      <small style={{ opacity: 0.5, textTransform: "none" }}>
        {props.data.description}
      </small>
    </components.Option>
  );
};

interface FormProps {
  paper: Paper;
  onUpdate?: Function;
  metadata: DocumentMetadata;
}

const PaperMetadataForm = ({ paper, onUpdate, metadata }: FormProps) => {
  const user = useCurrentUser();
  const [fields, setFields] = useState({
    doi: paper.doi || "",
    publishedDate: formatDateStandard(paper.publishedDate, "MM/DD/YYYY"),
    title: paper.title || "",
    hubs: metadata.hubs,
    pdfLicense:
      LICENSE_OPTIONS.find(
        (l) => l.value === paper.license || l.value === paper.raw.pdf_license
      ) || LICENSE_OPTIONS[0],
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

    let pdfLicense: string | undefined = fields.pdfLicense?.value;
    if (pdfLicense === "unknown") {
      pdfLicense = undefined;
    }

    setSaveInProgress(true);
    updatePaperMetadataAPI({
      id: paper.id,
      title: fields.title,
      doi: fields.doi,
      publishedDate: fields.publishedDate,
      hubs: fields.hubs.map((h) => h.id),
      pdfLicense: pdfLicense,
    })
      .then(() => {
        onUpdate &&
          onUpdate({
            title: fields.title,
            publishedDate: fields.publishedDate,
            doi: fields.doi,
            hubs: fields.hubs,
            pdfLicense: pdfLicense,
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
      {user?.moderator && (
        <div style={{ display: "flex" }}>
          <FormSelect
            containerStyle={formStyles.container}
            id="pdfLicense"
            label="PDF License"
            reactStyles={{}}
            inputStyle={formStyles.inputStyle}
            reactSelect={{ styles: {} }}
            onChange={(name, value) => {
              handleChange("pdfLicense", value);
            }}
            selectComponents={{
              Option: LicenseOptionWithDescription,
            }}
            options={LICENSE_OPTIONS}
            value={fields.pdfLicense}
          />
          <div />
        </div>
      )}

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
