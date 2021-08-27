import { BodyTypeVals, NEW_SOURCE_BODY_TYPES } from "./modalBodyTypes";
import { breakpoints } from "~/config/themes/screen";
import { css, StyleSheet } from "aphrodite";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";
import { formGenericStyles } from "~/components/Paper/Upload/styles/formGenericStyles";
import React, { ReactElement, SyntheticEvent, useState } from "react";
import {
  SearchFilterDocType,
  SearchFilterDocTypeLabel,
} from "../search/sourceSearchHandler";
import FormSelect from "~/components//Form/FormSelect";
import SourceSearchInput from "../search/SourceSearchInput";
import Button from "~/components/Form/Button";

const { PAPER: PAPER_KEY } = SearchFilterDocType;
const docTypeOptions = [
  { label: SearchFilterDocTypeLabel[PAPER_KEY], value: PAPER_KEY },
];

type Props = {
  onCancel: (event: SyntheticEvent) => void;
  setBodyType: (bodyType: BodyTypeVals) => void;
};

export default function AddNewSourceBodySearch({
  onCancel,
  setBodyType,
}: Props): ReactElement<"div"> {
  const [isItemSelected, setIsItemSelected] = useState<boolean>(false);
  return (
    <div
      className={css(
        styles.addNewSourceBodySearch,
        formGenericStyles.pageContent,
        formGenericStyles.noBorder
      )}
    >
      <FormSelect
        id="doc-search-type"
        inputStyle={formGenericStyles.inputMax}
        label="Type"
        labelStyle={formGenericStyles.labelStyle}
        // onChange={handleInputChange} NOTE: calvinhlee may update searchState later
        options={docTypeOptions}
        placeholder="Select search type"
        required
        value={docTypeOptions[0]}
      />
      <SourceSearchInput
        emptyResultDisplay={<div>{""}</div>}
        inputPlaceholder="Search for a paper or upload"
        label="Source"
        onSelect={emptyFncWithMsg}
        optionalResultItem={<div> {"Click me to upload a new paper"} </div>}
        required
      />
      <div
        className={css(
          formGenericStyles.buttonRow,
          formGenericStyles.buttons,
          styles.whiteBackground
        )}
      >
        <div
          className={css(
            formGenericStyles.button,
            formGenericStyles.buttonLeft
          )}
          key="modal-cancel"
          onClick={onCancel}
          role="button"
        >
          <span
            className={css(
              formGenericStyles.buttonLabel,
              formGenericStyles.text
            )}
          >
            {"Cancel"}
          </span>
        </div>
        <Button
          customButtonStyle={styles.buttonCustomStyle}
          customLabelStyle={styles.buttonLabel}
          disabled={!isItemSelected}
          label="Add source"
          onClick={(): void => {}}
        />
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  addNewSourceBodySearch: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    height: 320,
    justifyContent: "center",
    width: 600,
  },
  buttonCustomStyle: {
    height: "50px",
    width: "160px",
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      width: "160px",
      height: "50px",
    },
  },
  buttonLabel: {
    alignItems: "center",
    display: "flex",
    height: "100%",
    justifyContent: "center",
    width: "100%",
  },
  buttonWrap: {
    marginTop: 16,
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
  whiteBackground: {
    background: "#fff",
  },
});
