import { css, StyleSheet } from "aphrodite";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";
import { formGenericStyles } from "~/components/Paper/Upload/styles/formGenericStyles";
import { ReactElement } from "react";
import {
  SearchFilterDocType,
  SearchFilterDocTypeLabel,
} from "../search/sourceSearchHandler";
import FormSelect from "~/components//Form/FormSelect";
import SourceSearchInput from "../search/SourceSearchInput";

const { PAPER: PAPER_KEY } = SearchFilterDocType;
const docTypeOptions = [
  { label: SearchFilterDocTypeLabel[PAPER_KEY], value: PAPER_KEY },
];
export default function AddNewSourceBodySearch(): ReactElement<"div"> {
  console.warn("docTypeOptions: ", docTypeOptions);
  return (
    <div
      className={css(
        styles.addNewSourceBodySearch,
        formGenericStyles.pageContent,
        formGenericStyles.noBorder
      )}
    >
      <FormSelect
        // error={formErrors.year}
        id="doc-search-type"
        inputStyle={formGenericStyles.inputStyle}
        label="Type"
        labelStyle={formGenericStyles.labelStyle}
        // onChange={handleInputChange}
        options={docTypeOptions}
        placeholder="Select search type"
        required
        value={docTypeOptions[0]}
      />
      <SourceSearchInput
        emptyResultDisplay={<div>Click me to upload a new paper</div>}
        inputPlaceholder="Search for a paper or upload"
        label="Sources"
        onSelect={emptyFncWithMsg}
      />
    </div>
  );
}

const styles = StyleSheet.create({
  addNewSourceBodySearch: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    height: 200,
    justifyContent: "center",
    width: 600,
  },
  headerText: {
    alignItems: "center",
    display: "flex",
    fontSize: 20,
    fontWeight: 500,
    justifyContent: "center",
    marginBottom: 16,
    width: "100%",
    "@media only screen and (max-width: 1199px)": {
      fontSize: 18,
    },
    "@media only screen and (max-width: 1399px)": {
      fontSize: 22,
    },
  },
  textSection: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 12,
    height: "70%",
    width: "100%",
    boxSizing: "border-box",
    "@media only screen and (max-width: 767px)": {
      width: "100%",
      padding: "12px 0px",
    },
  },
  bannerImg: {
    width: 330,
    objectFit: "contain",
  },
  bodyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: 400,
    "@media only screen and (max-width: 1199px)": {
      fontSize: 14,
    },
    "@media only screen and (max-width: 1399px)": {
      fontSize: 15,
    },
  },
  imgWrap: {
    display: "unset",
    height: "100%",
    width: "100%",
    "@media only screen and (max-width: 767px)": {
      // ipad-size
      display: "none",
    },
  },
});
