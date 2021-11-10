import { breakpoints } from "~/config/themes/screen";
import { castUriID } from "../../../config/utils/castUriID";
import { css, StyleSheet } from "aphrodite";
import { ReactElement, useState } from "react";
import { useRouter } from "next/router";
import { ValidCitationType } from "./modal/AddNewSourceBodySearch";
import CitationTable from "./table/CitationTable";
import CitationAddNewButton from "./CitationAddNewButton";

type Props = { lastFetchTime: number; onCitationUpdate: Function };

export default function CitationContainer({
  lastFetchTime,
  onCitationUpdate,
}: Props): ReactElement<"div"> {
  const router = useRouter();
  const hypothesisID = castUriID(router.query.documentId);
  const [citationType, setCitationType] = useState<ValidCitationType>(null);

  return (
    <div className={css(styles.citationContainer)}>
      <div className={css(styles.citationGroup)}>
        <div className={css(styles.header)}>
          <div>{"Sources"}</div>
          <CitationAddNewButton
            citationType={citationType}
            hypothesisID={hypothesisID}
            lastFetchTime={lastFetchTime}
            updateLastFetchTime={onCitationUpdate}
            noText
          />
        </div>
        <CitationTable
          citationType={citationType}
          hypothesisID={hypothesisID}
          lastFetchTime={lastFetchTime}
          updateLastFetchTime={onCitationUpdate}
        />
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
});
