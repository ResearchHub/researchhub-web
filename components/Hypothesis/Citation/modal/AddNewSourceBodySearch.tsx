import { BodyTypeVals, NEW_SOURCE_BODY_TYPES } from "./modalBodyTypes";
import { breakpoints } from "~/config/themes/screen";
import { css, StyleSheet } from "aphrodite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formGenericStyles } from "~/components/Paper/Upload/styles/formGenericStyles";
import { ID } from "~/config/types/root_types";
import {
  NewPostButtonContext,
  NewPostButtonContextType,
} from "~/components/contexts/NewPostButtonContext";
import { ReactElement, SyntheticEvent, useContext, useState } from "react";
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
import {
  emptyFncWithMsg,
  isNullOrUndefined,
  nullthrows,
  silentEmptyFnc,
} from "~/config/utils/nullchecks";
import SourceSearchInputItem from "../search/SourceSearchInputItem";

const { NEW_PAPER_UPLOAD } = NEW_SOURCE_BODY_TYPES;
const { PAPER: PAPER_KEY } = SearchFilterDocType;
const docTypeOptions = [
  { label: SearchFilterDocTypeLabel[PAPER_KEY], value: PAPER_KEY },
];
const citationTypeOptions = [
  // logical ordering
  { label: "Supports", value: "SUPPORT" },
  { label: "Rejects", value: "REJECT" },
];

export type ValidCitationType = null | "REJECT" | "SUPPORT";

type Props = {
  hypothesisID: ID;
  onCancel: (event: SyntheticEvent) => void;
  onSubmitComplete: (event: SyntheticEvent) => void;
  selectedCitationType: ValidCitationType;
  setSelectedCitationType: (citationType: ValidCitationType) => void;
};

export default function AddNewSourceBodySearch({
  hypothesisID,
  onCancel,
  onSubmitComplete,
  selectedCitationType,
  setSelectedCitationType,
}: Props): ReactElement<"div"> {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const {
    values: paperUploadButtonValues,
    setValues: setPaperUploadButtonValues,
  } = useContext<NewPostButtonContextType>(NewPostButtonContext);

  const isReadyToSubmit =
    Boolean(selectedItem) && Boolean(selectedCitationType);
  const citationTypeInputValue = !isNullOrUndefined(selectedCitationType)
    ? citationTypeOptions.find((el) => el.value === selectedCitationType)
    : null;

  const onSelectPaperUpload = (event: SyntheticEvent): void => {
    onCancel(event); /* this closes citation upload modal */
    setTimeout(
      // timing out makes the ui feel smoother during modal transition
      (): void =>
        setPaperUploadButtonValues({
          ...paperUploadButtonValues,
          isOpen: true,
          hypothesis: {
            isUploadForHypothesis: true,
            onPaperUpdateComplete: ({
              postedPaperUniDocID,
              exitPaperUploadModal,
            }) => {
              postCitationFromSearch({
                onError: emptyFncWithMsg,
                onSuccess: () => {
                  onSubmitComplete(event); /* forces the page to refetch */
                  exitPaperUploadModal();
                },
                payload: {
                  citation_type: selectedCitationType,
                  hypothesis_id: hypothesisID,
                  source_id: postedPaperUniDocID,
                },
              });
            },
          },
          wizardBodyType: "url_or_doi_upload",
        }),
      300
    );
  };
  return (
    <div
      className={css(
        formGenericStyles.pageContent,
        formGenericStyles.noBorder,
        styles.addNewSourceBodySearch
      )}
    >
      <div className={css(styles.title)}>{"Add a new Source"}</div>
      {/* NOTE: calvinhlee may update searchState later */}
      {/* <FormSelect
        id="doc-search-type"
        inputStyle={formGenericStyles.inputMax}
        label="Type"
        labelStyle={formGenericStyles.labelStyle}
        // onChange={handleInputChange} 
        options={docTypeOptions}
        placeholder="Select search type"
        required
        value={docTypeOptions[0]}
      /> */}
      <FormSelect
        id="citation-type"
        inputStyle={formGenericStyles.inputMax}
        label="Supports or rejects meta-study"
        labelStyle={formGenericStyles.labelStyle}
        onChange={(_inputID, inputVal): void =>
          setSelectedCitationType(inputVal.value)
        }
        options={citationTypeOptions}
        placeholder="Supports / Rejects"
        required
        value={citationTypeInputValue}
      />
      <SourceSearchInput
        inputPlaceholder="Search for a paper or upload"
        label="Source"
        onClearSelect={(): void => setSelectedItem(null)}
        onSelectPaperUpload={onSelectPaperUpload}
        onSelect={(item: any): void => setSelectedItem(item)}
        optionalResultItem={
          <SourceSearchInputItem
            key="optionalResultItem-Search-PaperUpload"
            onSelect={
              Boolean(selectedCitationType)
                ? onSelectPaperUpload
                : silentEmptyFnc
            }
            label={
              <div style={{ display: "flex", alignItems: "center" }}>
                <FontAwesomeIcon
                  icon={"plus-circle"}
                  className={css(styles.plusCircle)}
                />
                <span>{`Upload a paper ${
                  !Boolean(selectedCitationType)
                    ? "( Support / Reject to continue )"
                    : ""
                }`}</span>
              </div>
            }
          />
        }
        required
        shouldAllowNewUpload={Boolean(selectedCitationType)}
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
          disabled={!isReadyToSubmit || isSubmitting}
          label={
            !isSubmitting ? (
              "Add source"
            ) : (
              <Loader size={8} loading color="#fff" />
            )
          }
          onClick={(event: SyntheticEvent): void => {
            setIsSubmitting(true);
            postCitationFromSearch({
              payload: {
                citation_type: selectedCitationType,
                hypothesis_id: nullthrows(
                  hypothesisID,
                  "Selected item must have HypothesisID"
                ),
                source_id: nullthrows(
                  selectedItem?.unified_doc_id,
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
    marginTop: 0,
    boxSizing: "border-box",
    paddingTop: 0,
    padding: 32,
    width: 680,
    // media query taken care of by pageContent in formGenericStyles
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
  title: {
    alignItems: "center",
    color: colors.BLACK(1),
    display: "flex",
    fontSize: 26,
    fontWeight: 500,
    height: 30,
    justifyContent: "center",
    width: "100%",
    marginBottom: 16,
    "@media only screen and (max-width: 725px)": {
      width: 450,
    },
    "@media only screen and (max-width: 557px)": {
      width: 380,
      fontSize: 24,
    },
    "@media only screen and (max-width: 415px)": {
      width: 300,
      fontSize: 22,
    },
    "@media only screen and (max-width: 321px)": {
      width: 280,
    },
  },
});
