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

  const {
    isFormDisabled,
    isFormEdited,
    isLoading,
    isURLView,
    shouldShowTitle,
  } = componentState;
  const {
    abstract,
    author,
    doi,
    hubs: selectedHubs,
    paperTitle,
    published,
    rawAuthors,
    title,
  } = formData;

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
              {componentState.isURLView ? `Link to Paper` : "Paper PDF"}
              <span className={css(formGenericStyles.asterick)}>*</span>
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
                  isURLView: !componentState.isURLView,
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
              label="Paper Title"
              placeholder="Enter title of paper"
              required={true}
              containerStyle={formGenericStyles.container}
              labelStyle={formGenericStyles.labelStyle}
              value={paperTitle}
              id="paper_title"
              onChange={this.handleInputChange}
            />
          )}
          <FormInput
            label={"Editorialized Title (optional)"}
            placeholder="Jargon free version of the title that the average person would understand"
            containerStyle={formGenericStyles.container}
            labelStyle={formGenericStyles.labelStyle}
            value={title}
            id={"title"}
            onChange={this.handleInputChange}
          />
          <div className={css(formGenericStyles.section)}>
            <div className={css(formGenericStyles.row)}>
              <span className={css(formGenericStyles.doi)}>
                <FormInput
                  label="DOI"
                  placeholder="Enter DOI of paper"
                  id="doi"
                  value={doi}
                  required={true}
                  containerStyle={formGenericStyles.doiInput}
                  labelStyle={formGenericStyles.labelStyle}
                  onChange={this.handleInputChange}
                />
              </span>
            </div>
          </div>
          <FormSelect
            label="Hubs"
            placeholder="Search Hubs"
            required={true}
            containerStyle={formGenericStyles.container}
            inputStyle={
              (customStyles.input,
              selectedHubs.length > 0 && customStyles.capitalize)
            }
            labelStyle={formGenericStyles.labelStyle}
            isMulti={true}
            value={selectedHubs}
            id="hubs"
            options={suggestedHubs}
            onChange={this.handleHubSelection}
            error={error.hubs}
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
          onClick={this.cancel}
        >
          <span
            className={css(
              formGenericStyles.buttonLabel,
              formGenericStyles.text
            )}
          >
            Cancel
          </span>
        </div>
        <Button
          label={editMode ? "Save" : "Upload"}
          customButtonStyle={formGenericStyles.button}
          disabled={disabled}
          type={"submit"}
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
