import { AuthActions } from "../../../redux/auth";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  ComponentState,
  defaultComponentState,
  defaultFormErrorState,
  defaultFormState,
  FormErrorState,
  FormState,
} from "./types/UploadComponentTypes";
import { css } from "aphrodite";
import { customStyles, formGenericStyles } from "./styles/formGenericStyles";
import { ID } from "../../../config/types/root_types";
import { isNullOrUndefined } from "../../../config/utils/nullchecks";
import { MessageActions } from "../../../redux/message";
import { ModalActions } from "../../../redux/modals";
import { PaperActions } from "../../../redux/paper";
import { useEffectFetchSuggestedHubs } from "./api/useEffectGetSuggestedHubs";
import { useRouter } from "next/router";
import Button from "../../Form/Button";
import FormDND from "../../Form/FormDND";
import FormInput from "../../Form/FormInput";
import FormSelect from "../../Form/FormSelect";
import React, {
  Fragment,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from "react";

type Props = {
  paperActions: any;
  paperRedux: any;
};

const useEffectHandleInit = ({
  paperActions,
  paperRedux,
  uploadPaperTitle,
}): void => {
  useEffect(() => {
    paperActions.resetPaperState();
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
  }, [
    paperActions,
    uploadPaperTitle,
    paperRedux,
    paperRedux.uploadedPaper /* intentional explicit check */,
  ]);
};

function PaperuploadV2Create({
  paperActions,
  paperRedux,
}: Props): ReactElement<typeof Fragment> {
  const router = useRouter();
  const { uploadPaperTitle } = router.query;
  const [componentState, setComponentState] = useState<ComponentState>(
    defaultComponentState
  );
  const [formData, setFormData] = useState<FormState>(defaultFormState);
  const [formErrors, setFormErrors] = useState<FormErrorState>(
    defaultFormErrorState
  );
  const [suggestedHubs, setSuggestedHubs] = useState<any>(null);

  const { isFormDisabled, isURLView, shouldShowTitle } = componentState;
  const { doi, hubs: selectedHubs, paper_title, title } = formData;

  const handleInputChange = (id: string, value: any): void => {
    const keys = id.split(".");
    const firstKey = keys[0];
    const newFormData = { ...formData };
    const newFormErrors = { ...formErrors };
    // NOTE: calvinhlee - just simplifying previously existing logic. This however is still funky
    if (keys.length === 1) {
      newFormData[firstKey] =
        firstKey === "title"
          ? !isNullOrUndefined(value)
            ? value[0].toUpperCase() + value.slice(1)
            : ""
          : value;
    } else {
      newFormData[firstKey][keys[1]] = value;
      firstKey === "published" ? (newFormErrors[keys[1]] = false) : null; // removes red border on select fields
    }
    setComponentState({ ...componentState, isFormEdited: true });
    setFormData(newFormData);
    setFormErrors(newFormErrors);
  };

  const handleCancel = (): void => {
    paperActions.resetPaperState();
    setComponentState(defaultComponentState);
    setFormData(defaultFormState);
    setFormErrors(defaultFormErrorState);
    router.back();
  };

  const handleHubSelection = (_id: ID, selectedHubs: any): void => {
    if (isNullOrUndefined(selectedHubs)) {
      setFormData({ ...formData, hubs: [] });
      setFormErrors({ ...formErrors, hubs: true });
    } else {
      setFormData({ ...formData, hubs: selectedHubs });
      setFormErrors({ ...formErrors, hubs: selectedHubs.length < 1 });
    }
  };

  const handlePDFUpload = useCallback(
    (acceptedFiles, metaData): void => {
      // NOTE: calvinhlee - currently supporting only 1 upload
      paperActions.uploadPaperToState(acceptedFiles[0], metaData);
      setComponentState({
        ...componentState,
        isFormEdited: true,
        isFormDisabled: false,
      });
      setFormErrors({ ...formErrors, dnd: false });
    },
    [componentState, paperActions, setComponentState, setFormErrors]
  );

  useEffectHandleInit({ paperActions, paperRedux, uploadPaperTitle });
  useEffectFetchSuggestedHubs({ setSuggestedHubs });

  return (
    <form>
      <div className={css(formGenericStyles.pageContent)}>
        <div className={css(formGenericStyles.header, formGenericStyles.text)}>
          {"Add Paper"}
          <a
            className={css(formGenericStyles.authorGuidelines)}
            href="https://www.notion.so/researchhub/Paper-Submission-Guidelines-a2cfa1d9b53c431a91c9816e17f212e1"
            target="_blank"
            rel="noreferrer noopener"
          >
            {"Submission Guidelines"}
          </a>
          <div
            className={css(formGenericStyles.sidenote, formGenericStyles.text)}
          >
            {"Up to 15MB (.pdf)"}
          </div>
        </div>
        <div className={css(formGenericStyles.section)}>
          <div className={css(formGenericStyles.paper)}>
            <div
              className={css(
                formGenericStyles.label,
                formGenericStyles.labelStyle
              )}
            >
              {shouldShowTitle || isURLView ? `Link to Paper` : "Paper PDF"}
              <span className={css(formGenericStyles.asterick)}>{"*"}</span>
            </div>
            <FormDND
              handleDrop={handlePDFUpload}
              onDrop={null}
              onDuplicate={(): void =>
                setComponentState({ ...componentState, isFormDisabled: true })
              }
              onValidUrl={(): void =>
                setComponentState({ ...componentState, isFormDisabled: false })
              }
              toggleFormatState={(): void => {
                setComponentState({
                  ...componentState,
                  isURLView: !isURLView,
                });
              }}
            />
          </div>
        </div>
        <div
          className={css(formGenericStyles.section, formGenericStyles.padding)}
        >
          {!isURLView && (
            <FormInput
              containerStyle={formGenericStyles.container}
              id="paper_title"
              label="Paper Title"
              labelStyle={formGenericStyles.labelStyle}
              onChange={handleInputChange}
              placeholder="Enter title of paper"
              required
              value={paper_title}
            />
          )}
          <FormInput
            containerStyle={formGenericStyles.container}
            id="title"
            label="Editorialized Title (optional)"
            labelStyle={formGenericStyles.labelStyle}
            onChange={handleInputChange}
            placeholder="Jargon free version of the title that the average person would understand"
            value={title}
          />
          <div className={css(formGenericStyles.section)}>
            <div className={css(formGenericStyles.row)}>
              <span className={css(formGenericStyles.doi)}>
                <FormInput
                  containerStyle={formGenericStyles.doiInput}
                  id="doi"
                  label="DOI"
                  labelStyle={formGenericStyles.labelStyle}
                  onChange={handleInputChange}
                  placeholder="Enter DOI of paper"
                  required
                  value={doi}
                />
              </span>
            </div>
          </div>
          <FormSelect
            containerStyle={formGenericStyles.container}
            error={formErrors.hubs}
            id="hubs"
            isMulti
            label="Hubs"
            inputStyle={
              (customStyles.input,
              selectedHubs.length > 0 && customStyles.capitalize)
            }
            labelStyle={formGenericStyles.labelStyle}
            onChange={handleHubSelection}
            options={suggestedHubs}
            placeholder="Search Hubs"
            required
            value={selectedHubs}
          />
        </div>
      </div>
      <div
        className={css(formGenericStyles.buttonRow, formGenericStyles.buttons)}
      >
        <div
          className={css(
            formGenericStyles.button,
            formGenericStyles.buttonLeft
          )}
          onClick={handleCancel}
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
          customButtonStyle={formGenericStyles.button}
          disabled={isFormDisabled}
          label="Upload"
          type="submit"
        />
      </div>
    </form>
  );
}

const mapStateToProps = (state: any) => ({
  modalsRedux: state.modals,
  paperRedux: state.paper,
  authRedux: state.auth,
  messageRedux: state.auth,
});

const mapDispatchToProps = (dispatch: any) => ({
  modalActions: bindActionCreators(ModalActions, dispatch),
  paperActions: bindActionCreators(PaperActions, dispatch),
  authActions: bindActionCreators(AuthActions, dispatch),
  messageActions: bindActionCreators(MessageActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaperuploadV2Create);
