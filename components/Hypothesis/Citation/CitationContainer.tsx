import { breakpoints } from "~/config/themes/screen";
import { castUriID } from "../../../config/utils/castUriID";
import { css, StyleSheet } from "aphrodite";
import { ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import CitationTable from "./table/CitationTable";
import CitationAddNewButton from "./CitationAddNewButton";
import TextDropdown, {
  TextDropdownOption,
  TextDropdownOptions,
} from "~/components/shared/TextDropdown";

type Props = { lastFetchTime: number; onCitationUpdate: Function };

const TABLE_SORT_OPTIONS: TextDropdownOptions = [
  /* logical ordering */
  { label: "All Sources", optionLabel: "All", value: null },
  { label: "Supporting Sources", optionLabel: "Supporting", value: "SUPPORT" },
  { label: "Rejecting Sources", optionLabel: "Rejecting", value: "REJECT" },
];

export default function CitationContainer({
  lastFetchTime,
  onCitationUpdate,
}: Props): ReactElement<"div"> {
  const router = useRouter();
  const hypothesisID = castUriID(router.query.documentId);
  const [sourceFilter, setSourceFilter] = useState<TextDropdownOption>(
    TABLE_SORT_OPTIONS[0]
  );
  const { value: citationType } = sourceFilter;
  useEffect((): void => onCitationUpdate(), [citationType]);

  return (
    <div className={css(styles.citationContainer)}>
      <div className={css(styles.citationGroup)}>
        <div className={css(styles.header)}>
          <TextDropdown
            onSelect={setSourceFilter}
            options={TABLE_SORT_OPTIONS}
            selected={sourceFilter}
          />
          <CitationAddNewButton
            citationType={citationType}
            hypothesisID={hypothesisID}
            lastFetchTime={lastFetchTime}
            updateLastFetchTime={onCitationUpdate}
            noText
          />
        </div>
        <div className={css(styles.tableHorizontalWrap)}>
          <CitationTable
            citationType={citationType}
            hypothesisID={hypothesisID}
            lastFetchTime={lastFetchTime}
            updateLastFetchTime={onCitationUpdate}
          />
        </div>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  citationContainer: {
    alignItems: "flex-start",
    display: "flex",
    justifyContent: "space-between",
    boxSizing: "border-box",
    marginTop: 30,
    width: "100%",
    maxWidth: "100%",
    [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
      flexDirection: "column",
    },
  },
  header: {
    display: "flex",
    fontFamily: "Roboto",
    fontSize: 20,
    fontStyle: "normal",
    fontWeight: 500,
    justifyContent: "space-between",
    alignItems: "center",
  },
  citationGroup: {
    backgroundColor: "#fff",
    border: "1.5px solid #F0F0F0", // copying existing cards for borders
    borderRadius: 3,
    boxShadow: "0px 3px 4px rgba(0, 0, 0, 0.02)", // copying existing cards
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    padding: 30,
    width: "100%",
    minHeight: 353,
    [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
      width: "100%",
      marginBottom: 16,
      minHeight: "unset",
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      padding: 16,
    },
  },
  tableHorizontalWrap: {
    width: "100%",
    height: "100%",
    overflowX: "auto",
  },
});
