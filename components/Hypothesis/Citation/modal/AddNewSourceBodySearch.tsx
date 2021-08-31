import { BodyTypeVals, NEW_SOURCE_BODY_TYPES } from "./modalBodyTypes";
import { breakpoints } from "~/config/themes/screen";
import { css, StyleSheet } from "aphrodite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formGenericStyles } from "~/components/Paper/Upload/styles/formGenericStyles";
import { ID } from "~/config/types/root_types";
import { ReactElement, SyntheticEvent, useState } from "react";
import {
  SearchFilterDocType,
  SearchFilterDocTypeLabel,
} from "../search/sourceSearchHandler";
import Button from "~/components/Form/Button";
import colors from "~/config/themes/colors";
import FormSelect from "~/components//Form/FormSelect";
import Loader from "~/components/Loader/Loader";
import SourceSearchInput from "../search/SourceSearchInput";
import { postCitationFromSearch } from "../../api/postCitationFromSearch";
import { emptyFncWithMsg, nullthrows } from "~/config/utils/nullchecks";

const { NEW_PAPER_UPLOAD } = NEW_SOURCE_BODY_TYPES;
const { PAPER: PAPER_KEY } = SearchFilterDocType;
const docTypeOptions = [
  { label: SearchFilterDocTypeLabel[PAPER_KEY], value: PAPER_KEY },
];

type Props = {
  hypothesisID: ID;
  onCancel: (event: SyntheticEvent) => void;
  onSubmitComplete: (event: SyntheticEvent) => void;
  setBodyType: (bodyType: BodyTypeVals) => void;
};

export default function AddNewSourceBodySearch({
  hypothesisID,
  onCancel,
  onSubmitComplete,
  setBodyType,
}: Props): ReactElement<"div"> {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const isItemSelected = Boolean(selectedItem);
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
        inputPlaceholder="Search for a paper or upload"
        label="Source"
        onClearSelect={(): void => setSelectedItem(null)}
        onPaperUpload={(): void => setBodyType(NEW_PAPER_UPLOAD)}
        onSelect={(item: any): void => setSelectedItem(item)}
        optionalResultItem={
          <div
            key="optionalResultItem-Search-PaperUpload"
            className={css(styles.uploadNewPaperButton)}
            onClick={(): void => setBodyType(NEW_PAPER_UPLOAD)}
          >
            <FontAwesomeIcon
              icon={"plus-circle"}
              className={css(styles.plusCircle)}
            />
            <span>{"Upload a paper"}</span>
          </div>
        }
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
          disabled={!isItemSelected || isSubmitting}
          label={
            !isSubmitting ? (
              "Add source"
            ) : (
              <Loader size={8} loading color="#fff" />
            )
          }
          onClick={(event: SyntheticEvent): void => {
            setIsSubmitting(true);
            debugger;
            postCitationFromSearch({
              payload: {
                hypothesis_id: nullthrows(
                  hypothesisID,
                  "Selected item must have HypothesisID"
                ),
                source_id: nullthrows(
                  selectedItem?.source?.id,
                  "Selected item must have unifiedDocID"
                ),
              },
              onSuccess: (): void => {
                setIsSubmitting(false);
                onSubmitComplete(event);
              },
              onError: emptyFncWithMsg,
            });
          }}
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
    justifyContent: "center",
    minHeight: 320,
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
  uploadNewPaperButton: {
    alignItems: "center",
    boxSizing: "border-box",
    cursor: "pointer",
    display: "flex",
    minHeight: 37,
    overflow: "hidden",
    padding: "0 12px",
    whiteSpace: "nowrap",
    width: "100%",
    color: colors.BLUE(1),
    ":hover": {
      backgroundColor: colors.LIGHT_BLUE(0.7),
    },
  },
  plus: {
    color: colors.BLUE(1),
    left: 5,
    position: "absolute",
    top: -1,
  },
  plusCircle: {
    alignItems: "center",
    borderRadius: "50%",
    color: colors.BLUE(1),
    display: "flex",
    fontSize: 16,
    height: 16,
    justifyContent: "center",
    marginRight: 8,
    position: "relative",
    width: 16,
  },
});
