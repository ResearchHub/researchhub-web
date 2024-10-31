import { Hub } from "~/config/types/hub";
import Select, { ValueType, OptionTypeBase, components } from "react-select";
import debounce from "lodash/debounce";
import { useCallback, useEffect, useState } from "react";
import { css, StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";
import FormSelect from "~/components/Form/FormSelect";
import { fetchAuthorSuggestions } from "~/components/SearchSuggestion/lib/api";
import { SuggestedAuthor } from "~/components/SearchSuggestion/lib/types";
import HubTag, { HubBadge } from "~/components/Hubs/HubTag";
import Avatar from "@mui/material/Avatar";
import { isEmpty } from "~/config/utils/nullchecks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuildingColumns,
  faGrid,
  faGrid2,
  faBirthdayCake,
} from "@fortawesome/pro-solid-svg-icons";
import ALink, { themes } from "~/components/ALink";
import { faAddressCard } from "@fortawesome/pro-regular-svg-icons";
import { truncateText } from "~/config/utils/string";

interface Props {
  selectedAuthor: {
    label: string;
    value: string;
    author: SuggestedAuthor;
  } | null;
  onChange: Function;
  menuPlacement?: "auto" | "top" | "bottom";
  required?: boolean;
  label?: string | null;
  placeholder?: any;
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
  },
  menuList: {
    display: "flex",
    flexDirection: "column",
    // flexWrap: "wrap",
    // columnGap: "10px",
    // padding: "7px 7px 0 7px",
  },
  valueContainer: {
    padding: "7px 7px 7px 4px",
  },
};

const SingleValue: React.FC<any> = (props) => {
  const author = props.data.author;

  if (!author) return null;

  return (
    <components.SingleValue {...props}>
      <div className={css(formStyles.selectedAuthor)}>
        <Avatar
          src={author.profileImage}
          sx={{ width: 24, height: 24, fontSize: 14 }}
        >
          {isEmpty(author.profileImage) && (author.fullName || "")[0]}
        </Avatar>
        <span className={css(formStyles.selectedAuthorName)}>
          {author.fullName}
        </span>
      </div>
    </components.SingleValue>
  );
};

const TagOnlyOption: React.FC<any> = (props) => {
  const author: SuggestedAuthor = props?.data?.author;
  const schools =
    (author.education?.[0] ? author.education?.[0] + ", " : "") +
    author.institutions
      .map((inst) => inst.name)
      .slice(0, 2)
      .join(", ");

  return (
    <components.Option {...props}>
      <Avatar
        src={author.profileImage}
        sx={{ width: 22, height: 22, fontSize: 13 }}
      >
        {isEmpty(author.profileImage) && (author.fullName || "")[0]}
      </Avatar>
      <div className={css(formStyles.details)}>
        <div className={css(formStyles.name)}>
          {author.fullName}
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <FontAwesomeIcon
              icon={faAddressCard}
              style={{ color: colors.NEW_BLUE() }}
            />
            <ALink
              theme={themes.blue}
              target="_blank"
              href={`/author/${author.id}`}
            >
              Profile
            </ALink>
          </div>
        </div>
        {author.headline && (
          <div className={css(formStyles.lineItem)} style={{ marginBottom: 5 }}>
            {truncateText(author.headline)}
          </div>
        )}
        {author.userId && author.createdDate && (
          <div className={css(formStyles.lineItem)}>
            <FontAwesomeIcon icon={faBirthdayCake} fontSize={18} />
            User since {author.createdDate}
          </div>
        )}
        {author.reputationHubs.length > 0 && (
          <div className={css(formStyles.lineItem)}>
            <FontAwesomeIcon icon={faGrid2} />
            {author.reputationHubs.slice(0, 4).join(", ")}
          </div>
        )}
        {author.institutions.length > 0 && (
          <div className={css(formStyles.lineItem)}>
            <FontAwesomeIcon icon={faBuildingColumns} />
            {schools}
          </div>
        )}
      </div>
    </components.Option>
  );
};

const AuthorSelectDropdown = ({
  selectedAuthor = null,
  onChange,
  menuPlacement = "auto",
  required = false,
  label = "Search authors",
  placeholder = "Search hubs",
  dropdownStyles = selectDropdownStyles,
}: Props) => {
  const [suggestedAuthors, setSuggestedAuthors] = useState<SuggestedAuthor[]>(
    []
  );
  
  const handleSuggestedAuthorInputChange = async (value) => {
    if (value.length >= 3) {
      const suggestions = await fetchAuthorSuggestions({ query: value });
      setSuggestedAuthors(suggestions);
    }
  };

  const debouncedHandleInputChange = useCallback(
    debounce(handleSuggestedAuthorInputChange, 250),
    [suggestedAuthors]
  );

  const formattedSuggestions = suggestedAuthors.map((author) => {
    return {
      label: author.fullName,
      value: author.id,
      author: author,
    };
  });

  return (
    <div>
      <FormSelect
        containerStyle={formStyles.container}
        id="authors"
        isMulti={false}
        label={label}
        required={required}
        reactStyles={{}}
        inputStyle={formStyles.inputStyle}
        reactSelect={{ styles: dropdownStyles }}
        noOptionsMessage={(value) => {
          return value.inputValue.length >= 3
            ? "No authors found"
            : "Type to search authors";
        }}
        onInputChange={(field, value) => {
          debouncedHandleInputChange(field, value);
        }}
        onChange={(name, values) => {
          console.log("name", name);
          console.log("values", values);
          onChange(name, values);
        }}
        selectComponents={{
          Option: TagOnlyOption,
          SingleValue,
          IndicatorsContainer: () => null,
        }}
        menu={{
          display: "flex",
          flexWrap: "wrap",
        }}
        options={formattedSuggestions}
        placeholder={placeholder}
        value={selectedAuthor}
        menuPlacement={menuPlacement}
      />
    </div>
  );
};

const formStyles = StyleSheet.create({
  container: {
    minHeight: "auto",
  },
  name: {
    fontWeight: 500,
    fontSize: 15,
    display: "flex",
    justifyContent: "space-between",
  },
  inputStyle: {},
  hubs: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  hubWrapper: {},
  lineItem: {
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
  },
  details: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    fontSize: 13,
    width: "100%",
  },
  selectedAuthor: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "2px 0",
  },
  selectedAuthorName: {
    fontSize: 14,
    fontWeight: 500,
  },
});

export default AuthorSelectDropdown;
