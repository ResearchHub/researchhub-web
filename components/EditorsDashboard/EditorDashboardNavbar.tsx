import { css, StyleSheet } from "aphrodite";
import { ID } from "~/config/types/root_types";
import { ReactElement, useState } from "react";
import { useEffectFetchSuggestedHubs } from "../Paper/Upload/api/useEffectGetSuggestedHubs";
import { useRouter } from "next/router";
import FormSelect from "../Form/FormSelect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLongArrowAltDown,
  faLongArrowAltUp,
} from "@fortawesome/pro-solid-svg-icons";
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import "react-dates/lib/css/_datepicker.css";

export type EditorDashFilters = {
  selectedHub: any;
  timeframe: any;
  orderBy: any;
};

type Props = { currentFilters: EditorDashFilters; onFilterChange: Function };

const INPUT_STYLE = {
  fontWeight: 500,
  minHeight: "unset",
  backgroundColor: "#FFF",
  display: "flex",
  justifyContent: "space-between",
};

export const filterOptions = [
  {
    value: "past_month",
    label: "Past Month",
  },
  {
    value: null,
    label: "All Time",
    disableScope: true,
  },
  {
    value: "today",
    label: "Today",
  },
  {
    value: "past_week",
    label: "Past Week",
  },
  {
    value: "past_year",
    label: "Past Year",
    disableScope: true,
  },
];

const ascStyle = {
  display: "flex",
  justifyContent: "space-between",
};

const marginStyle = {
  marginLeft: 8,
};

export const upDownOptions = [
  {
    value: "desc",
    label: (
      <div style={ascStyle}>
        {"Descending"}
        <span style={marginStyle}>
          {<FontAwesomeIcon icon={faLongArrowAltDown} />}{" "}
        </span>
      </div>
    ),
  },
  {
    value: "asc",
    label: (
      <div style={ascStyle}>
        {"Ascending"}
        <span style={marginStyle}>
          {<FontAwesomeIcon icon={faLongArrowAltUp} />}
        </span>
      </div>
    ),
    disableScope: true,
  },
];

export default function EditorDashboardNavbar({
  currentFilters,
  onFilterChange,
}: Props): ReactElement<"div"> {
  const router = useRouter();
  const [suggestedHubs, setSuggestedHubs] = useState<any>([]);
  const [datesOpen, setDatesOpen] = useState<boolean>(false);

  useEffectFetchSuggestedHubs({ setSuggestedHubs });

  const {
    orderBy: currentOrderBy,
    selectedHub: currentSelectedHub,
    timeframe: currentTimeframe,
  } = currentFilters;

  return (
    <div className={css(styles.editorDashboardNavbar)}>
      <div className={css(styles.header)}>{"Editor Dashboard"}</div>
      <div className={css(styles.navButtons)}>
        <FormSelect
          containerStyle={styles.hubDropdown}
          inputStyle={INPUT_STYLE}
          id="hubs"
          label=""
          onChange={(_id: ID, selectedHub: any): void =>
            onFilterChange({ ...currentFilters, selectedHub })
          }
          options={suggestedHubs}
          placeholder="Search Hubs"
          value={currentSelectedHub ?? null}
        />
        <DateRangePicker
          startDate={currentTimeframe.startDate} // momentPropTypes.momentObj or null,
          startDateId="start_id" // PropTypes.string.isRequired,
          endDate={currentTimeframe.endDate} // momentPropTypes.momentObj or null,
          endDateId="end_Id" // PropTypes.string.isRequired,
          orientation={window.outerWidth > 767 ? 'horizontal' : 'vertical'}
          onDatesChange={({ startDate, endDate }) => {
            const filter = {
              ...currentFilters,
              timeframe: { startDate, endDate },
            };
            onFilterChange(filter);
          }} // PropTypes.func.isRequired,
          focusedInput={datesOpen} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
          isOutsideRange={(day) => {
            return !day.isSameOrBefore(new Date());
          }}
          onFocusChange={(focusedInput) => setDatesOpen(focusedInput)} // PropTypes.func.isRequired,
        />
        {/* <FormSelect
          containerStyle={styles.dropdown}
          inputStyle={INPUT_STYLE}
          onChange={(_id: ID, timeframe: any): void =>
            onFilterChange({ ...currentFilters, timeframe })
          }
          options={filterOptions}
          value={currentTimeframe ?? null}
        /> */}
        <FormSelect
          containerStyle={styles.dropdown}
          inputStyle={INPUT_STYLE}
          onChange={(_id: ID, orderBy: any): void =>
            onFilterChange({ ...currentFilters, orderBy })
          }
          options={upDownOptions}
          value={currentOrderBy ?? null}
        />
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  editorDashboardNavbar: {
    backgroundColor: "#FFF",
    justifyContent: "space-between",
    display: "flex",
    width: "100%",
    marginBottom: 32,

    "@media only screen and (max-width: 767px)": {
      flexDirection: "column",
      marginBottom: 0,
    },
  },
  dropdown: {
    width: 170,
    minHeight: "unset",
    fontSize: 14,
    // marginRight: 16,
    "@media only screen and (max-width: 1343px)": {
      height: "unset",
    },
    "@media only screen and (max-width: 1149px)": {
      width: 150,
      fontSize: 13,
    },
    "@media only screen and (max-width: 779px)": {
      width: "100%",
      marginTop: 8,
    },
  },
  hubDropdown: {
    width: 200,
    minHeight: "unset",
    fontSize: 14,
    marginRight: 16,
    "@media only screen and (max-width: 1343px)": {
      height: "unset",
    },
    "@media only screen and (max-width: 1149px)": {
      width: 150,
      fontSize: 13,
    },
    "@media only screen and (max-width: 1023px)": {
      width: "100%",
      marginTop: 8,
      marginRight: 0,
      marginBottom: 8,
    },
  },
  header: {
    alignItems: "center",
    display: "flex",
    fontFamily: "Roboto",
    fontSize: "30px",
    fontWeight: 500,

    "@media only screen and (max-width: 767px)": {
      textAlign: 'center',
      display: 'unset',
    }
    
  },
  navButtons: {
    alignItems: "center",
    display: "flex",
    height: 60,
    justifyContent: "flex-start",

    "@media only screen and (max-width: 767px)": {
      flexDirection: "column",
      height: "unset",
      width: 284,
      margin: '0 auto',
    },
  },
  orderByIcon: {
    fontSize: 16,
    cursor: "pointer",
  },
});
