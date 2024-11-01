import { useState, useCallback } from "react";
import { components } from "react-select";
import debounce from "lodash/debounce";
import { css, StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";
import FormSelect from "~/components/Form/FormSelect";
import Avatar from "@mui/material/Avatar";
import { isEmpty } from "~/config/utils/nullchecks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faChartSimple,
  faAddressCard,
} from "@fortawesome/pro-solid-svg-icons";
import { fetchInstitutionSuggestions } from "~/components/SearchSuggestion/lib/api";
import { SuggestedInstitution } from "~/components/SearchSuggestion/lib/types";
import InstitutionThumbnail from "./InstitutionThumbnail";

interface Props {
  selectedInstitution: {
    label: string;
    value: string;
    institution: SuggestedInstitution;
  } | null;
  onChange: Function;
  menuPlacement?: "auto" | "top" | "bottom";
  required?: boolean;
  label?: string | null;
  placeholder?: string;
  dropdownStyles?: any;
  containerStyle?: any;
}

export const selectDropdownStyles = {
  multiTagLabelStyle: {
    color: colors.NEW_BLUE(1),
    cursor: "pointer",
  },
  multiTagStyle: {
    border: 0,
    background: colors.NEW_BLUE(0.1),
    padding: "4px 12px",
    height: "unset",
    textDecoration: "none",
    fontWeight: 400,
    borderRadius: 50,
    color: colors.NEW_BLUE(),
  },
  option: {
    display: "flex",
    gap: 10,
    alignItems: "flex-start",
    padding: "12px 16px",
  },
  menuList: {
    display: "flex",
    flexDirection: "column",
  },
  valueContainer: {
    padding: "7px 7px 7px 4px",
  },
};

const SingleValue: React.FC<any> = (props) => {
  const institution = props.data.institution;

  if (!institution) return null;

  return (
    <components.SingleValue {...props}>
      <div className={css(styles.selected)}>
        <InstitutionThumbnail institution={institution} size={34} />
        <span className={css(styles.selectedName)}>
          {institution.name}
        </span>
      </div>
    </components.SingleValue>
  );
};

const InstitutionOption: React.FC<any> = (props) => {
  const institution: SuggestedInstitution = props?.data?.institution;

  const location = [
    institution.city,
    institution.region,
    institution.countryCode
  ].filter(Boolean).join(", ");

  return (
    <components.Option {...props}>
      <InstitutionThumbnail institution={institution} size={80} />
      <div className={css(styles.details)}>
        <div className={css(styles.name)}>
          {institution.name}
        </div>
        {location && (
          <div className={css(styles.lineItem)}>
            <FontAwesomeIcon icon={faLocationDot} />
            <span>{location}</span>
          </div>
        )}
        <div className={css(styles.lineItem)}>
          <FontAwesomeIcon icon={faChartSimple} />
          <span>
            {institution.hIndex && `h-index: ${institution.hIndex}`}
            {institution.hIndex && institution.worksCount && " • "}
            {institution.worksCount && `${institution.worksCount.toLocaleString()} works`}
          </span>
        </div>
      </div>
    </components.Option>
  );
};

const InstitutionSelectDropdown = ({
  selectedInstitution = null,
  onChange,
  menuPlacement = "auto",
  required = false,
  label = "Search institutions",
  placeholder = "Search institutions",
  dropdownStyles = selectDropdownStyles,
}: Props) => {
  const [suggestedInstitutions, setSuggestedInstitutions] = useState<SuggestedInstitution[]>([]);

  console.log('suggestedInstitutions', suggestedInstitutions);

  const handleSuggestedInstitutionInputChange = async (value: string) => {
    if (value.length >= 3) {
      const suggestions = await fetchInstitutionSuggestions({ query: value });
      setSuggestedInstitutions(suggestions);
    }
  };

  const debouncedHandleInputChange = useCallback(
    debounce(handleSuggestedInstitutionInputChange, 250),
    [suggestedInstitutions]
  );

  const formattedSuggestions = suggestedInstitutions.map((institution) => ({
    label: institution.name,
    value: institution.id,
    institution: institution,
  }));

  return (
    <div>
      <FormSelect
        containerStyle={styles.container}
        id="institutions"
        isMulti={false}
        label={label}
        required={required}
        reactStyles={{}}
        inputStyle={styles.inputStyle}
        reactSelect={{ styles: dropdownStyles }}
        noOptionsMessage={(value) => {
          return value.inputValue.length >= 3
            ? "No institutions found"
            : "Type to search institutions";
        }}
        onInputChange={(value) => {
          debouncedHandleInputChange(value);
        }}
        onChange={(name, values) => {
          onChange(name, values);
        }}
        selectComponents={{
          Option: InstitutionOption,
          SingleValue,
          IndicatorsContainer: () => null,
        }}
        options={formattedSuggestions}
        placeholder={placeholder}
        value={selectedInstitution}
        menuPlacement={menuPlacement}
      />
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: "auto",
  },
  name: {
    fontWeight: 500,
    fontSize: 15,
    marginBottom: 4,
  },
  inputStyle: {},
  lineItem: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    fontSize: 13,
    color: colors.BLACK(0.6),
  },
  details: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  selected: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "2px 0",
  },
  selectedName: {
    fontSize: 14,
    fontWeight: 500,
  },
});

export default InstitutionSelectDropdown;