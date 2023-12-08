import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { css, StyleSheet } from "aphrodite";
import { ID } from "~/config/types/root_types";
import { ReactElement, useState } from "react";
import { useEffectFetchSuggestedHubs } from "../Paper/Upload/api/useEffectGetSuggestedHubs";
import { useRouter } from "next/router";
import FormSelect, {
  CustomSelectControlWithoutClickEvents,
} from "~/components/Form/FormSelect";
import {
  faLongArrowAltDown,
  faLongArrowAltUp,
  faComments,
  faStar,
  faGrid2,
} from "@fortawesome/pro-solid-svg-icons";
import "react-dates/initialize";
import { DateRangePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import HubSelectModal from "../Hubs/HubSelectModal";
import colors from "~/config/themes/colors";
import { DownIcon } from "~/config/themes/icons";
import { set } from "react-ga";

export type EditorDashFilters = {
  selectedHub: any;
  timeframe: any;
  orderBy: any;
};

type Props = {
  currentFilters: EditorDashFilters;
  headerLabel: string;
  onFilterChange: Function;
};

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

export default function LeaderDashboardNavbar({
  currentFilters,
  headerLabel,
  onFilterChange,
}: Props): ReactElement<"div"> {
  const router = useRouter();
  const [suggestedHubs, setSuggestedHubs] = useState<any>([]);
  const [datesOpen, setDatesOpen] = useState<boolean>(false);
  const [isHubsModalOpen, setIsHubsModalOpen] = useState<boolean>(false);

  useEffectFetchSuggestedHubs({ setSuggestedHubs });

  const {
    orderBy: currentOrderBy,
    selectedHub: currentSelectedHub,
    timeframe: currentTimeframe,
  } = currentFilters;

  return (
    <div className={css(styles.LeaderDashboardNavbar)}>
      <HubSelectModal
        preventLinkClick={true}
        selectedHub={currentSelectedHub}
        isModalOpen={isHubsModalOpen}
        handleModalClose={() => setIsHubsModalOpen(false)}
        handleSelect={(hub) => {
          onFilterChange({ ...currentFilters, selectedHub: hub });
          setIsHubsModalOpen(false);
        }}
      />
      <div className={css(styles.header)}>{headerLabel}</div>

      <div className={css(styles.navButtons)}>
        <div onClick={(e) => setIsHubsModalOpen(true)}>
          <FormSelect
            selectComponents={{
              Control: CustomSelectControlWithoutClickEvents,
            }}
            containerStyle={[styles.dropdown, styles.hubsFilter]}
            inputStyle={INPUT_STYLE}
            options={[]}
            value={{
              value: "hubs",
              label: currentSelectedHub ? (
                <div
                  style={{
                    display: "flex",
                    columnGap: "5px",
                    alignItems: "center",
                  }}
                >
                  {currentSelectedHub.name}
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    columnGap: "5px",
                    alignItems: "center",
                  }}
                >
                  <span style={{ marginTop: 1 }}>
                    {<FontAwesomeIcon icon={faGrid2} />}{" "}
                  </span>
                  <span>{"Hubs"}</span>
                </div>
              ),
            }}
          />
        </div>

        <DateRangePicker
          startDate={currentTimeframe.startDate} // momentPropTypes.momentObj or null,
          startDateId="start_id" // PropTypes.string.isRequired,
          endDate={currentTimeframe.endDate} // momentPropTypes.momentObj or null,
          endDateId="end_Id" // PropTypes.string.isRequired,
          orientation={window.outerWidth > 767 ? "horizontal" : "vertical"}
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
  LeaderDashboardNavbar: {
    backgroundColor: "#FFF",
    justifyContent: "space-between",
    display: "flex",
    width: "100%",
    marginBottom: 32,

    "@media only screen and (max-width: 1023px)": {
      flexDirection: "column",
      marginBottom: 0,
    },
  },
  downIcon: {
    padding: 4,
    fontSize: 11,
  },
  hubsFilter: {
    marginRight: 16,
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
      // width: 150,
      width: "100%",
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
    // fontWeight: 500,

    "@media only screen and (max-width: 767px)": {
      textAlign: "center",
      display: "unset",
    },

    "@media only screen and (max-width: 1250px)": {
      flexDirection: "column",
    },
  },
  apply: {
    marginLeft: 16,
    fontSize: 18,
  },
  applyHref: {
    color: "rgb(78, 83, 255)",
  },
  navButtons: {
    alignItems: "center",
    display: "flex",
    height: 60,
    justifyContent: "flex-start",

    "@media only screen and (max-width: 1023px)": {
      flexDirection: "column",
      height: "unset",
      width: 284,
      margin: "0 auto",
    },
  },
  orderByIcon: {
    fontSize: 16,
    cursor: "pointer",
  },
});
