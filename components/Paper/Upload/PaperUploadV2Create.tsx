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
import { getHandleInputChange } from "./util/paperUploadV2HandleInputChange";
import { getIsFormValid } from "./util/getIsFormValid";
import { ID } from "../../../config/types/root_types";
import {
  isNullOrUndefined,
  nullthrows,
} from "../../../config/utils/nullchecks";
import { MessageActions } from "../../../redux/message";
import { ModalActions } from "../../../redux/modals";
import { PaperActions } from "../../../redux/paper";
import { parseDate } from "./util/parseDate";
import { useEffectFetchSuggestedHubs } from "./api/useEffectGetSuggestedHubs";
import { useRouter } from "next/router";
import Button from "../../Form/Button";
import FormDND from "../../Form/FormDND";
import FormInput from "../../Form/FormInput";
import FormSelect from "../../Form/FormSelect";
import {
  Fragment,
  ReactElement,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import { uploadNewPaper } from "./api/uploadNewPaper";

type ComponentProps = {
  authRedux: any;
  hypothesisID?: ID;
  messageActions: any;
  modalActions: any;
  onCancelComplete?: Function;
  onSubmitComplete?: Function;
  paperActions: any;
  paperRedux: any;
};

type ParseReduxToStateArgs = {
  componentState: ComponentState;
  formState: FormState;
  hypothesisID: ID;
  messageActions: any;
  paperRedux: any;
  setComponentState: (componentState: ComponentState) => void;
  setFormState: (formState: FormState) => void;
};

const useEffectHandleInit = ({
  isURLView,
  paperActions,
  setFormState,
}): void => {
  useEffect(() => {
    paperActions.resetPaperState();
    setFormState(defaultFormState);
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
  }, [isURLView /* intentional explicit check */]);
};

const useEffectParseReduxToState = ({
  formState,
  hypothesisID,
  messageActions,
  paperRedux,
  setFormState,
}: ParseReduxToStateArgs): void => {
  const { uploadedPaper } = paperRedux;
  const { title: reduxPaperTitle } = uploadedPaper;
  const {
    author: formAuthors,
    hubs: formHubs,
    paper_title: formPaperTitle,
    title: formTitle,
  } = formState;
  const resolvedPaperTitle = !isNullOrUndefined(reduxPaperTitle)
    ? reduxPaperTitle
    : formPaperTitle;
  const resolvedFormTitle = !isNullOrUndefined(formTitle)
    ? formTitle
    : resolvedPaperTitle;
  useEffect((): void => {
    const {
      abstract,
      author: authorArray,
      DOI,
      issued,
      type,
      url,
    } = uploadedPaper;
    const formattedAbstract = !isNullOrUndefined(abstract)
      ? abstract
      : formState.abstract;
    const formattedDOI = !isNullOrUndefined(DOI) ? DOI : formState.doi;
    const formattedURL = !isNullOrUndefined(url) ? url : formState.url;
    // NOTE: calvinhlee - date parsing comes from legacy code.
    const formattedPublishedDate = !isNullOrUndefined(issued)
      ? parseDate(issued["date-parts"][0])
      : formState.published;
    const formType = !isNullOrUndefined(type) ? type : "REGULAR"; // currently only supports regular type
    const formattedRawAuthors =
      !isNullOrUndefined(authorArray) && Array.isArray(authorArray)
        ? authorArray.map((a) => {
            return {
              first_name: a.given ? a.given : "",
              last_name: a.family ? a.family : "",
            };
          })
        : [];
    setFormState({
      abstract: formattedAbstract,
      author: formAuthors,
      doi: formattedDOI,
      hubs: formHubs,
      hypothesis_id: hypothesisID,
      paper_title: resolvedPaperTitle,
      paper_type: formType,
      published: formattedPublishedDate,
      raw_authors: formattedRawAuthors,
      title: resolvedFormTitle,
      url: formattedURL,
    });
    messageActions.showMessage({ show: false });
  }, [formAuthors, formHubs, messageActions, setFormState, uploadedPaper]);
};

function PaperuploadV2Create({
  authRedux,
  hypothesisID,
  messageActions,
  modalActions,
  onCancelComplete,
  onSubmitComplete,
  paperActions,
  paperRedux,
}: ComponentProps): ReactElement<typeof Fragment> {
  const isPaperForHypothesis = !isNullOrUndefined(hypothesisID);
  const router = useRouter();
  const [componentState, setComponentState] = useState<ComponentState>(
    defaultComponentState
  );
  const [formState, setFormState] = useState<FormState>(
    isPaperForHypothesis
      ? { ...defaultFormState, hypothesis_id: hypothesisID }
      : defaultFormState
  );
  const [formErrors, setFormErrors] = useState<FormErrorState>(
    defaultFormErrorState
  );
  const [suggestedHubs, setSuggestedHubs] = useState<any>(null);

  const { isFormDisabled, isURLView, shouldShowTitleField } = componentState;
  const { doi, hubs: selectedHubs, paper_title, title } = formState;

  const handleInputChange = getHandleInputChange({
    currFormState: formState,
    currFormErrors: formErrors,
    currComponentState: componentState,
    setComponentState,
    setFormState,
    setFormErrors,
  });

  const handleFormCancel = (event: SyntheticEvent): void => {
    event.preventDefault();
    paperActions.resetPaperState();
    setComponentState(defaultComponentState);
    setFormState(
      isPaperForHypothesis ? { ...defaultFormState } : defaultFormState
    );
    setFormErrors(defaultFormErrorState);
    if (!isNullOrUndefined(onCancelComplete)) {
      nullthrows(onCancelComplete)(event);
    }
    if (!isPaperForHypothesis) {
      router.back();
    }
  };

  const handleHubSelection = (_id: ID, selectedHubs: any): void => {
    if (isNullOrUndefined(selectedHubs)) {
      setFormState({ ...formState, hubs: [] });
      setFormErrors({ ...formErrors, hubs: true });
    } else {
      setFormState({ ...formState, hubs: selectedHubs });
      setFormErrors({ ...formErrors, hubs: selectedHubs.length < 1 });
    }
  };

  const handlePDFUpload = (acceptedFiles, metaData): void => {
    // NOTE: calvinhlee - currently supporting only 1 upload
    // logical ordering
    const { csl_item } = metaData;
    paperActions.uploadPaperToState(acceptedFiles[0], metaData);
    setFormState({
      ...formState,
      paper_title: csl_item.name,
      file: acceptedFiles[0],
    });
    setComponentState({
      ...componentState,
      isFormDisabled: false,
      isFormEdited: true,
    });
    setFormErrors({ ...formErrors, dnd: false });
  };

  const onFormSubmit = (event: SyntheticEvent): void => {
    event.preventDefault();
    const isFormValid = getIsFormValid({
      formState,
      formErrors,
      setFormErrors,
    });
    if (isFormValid) {
      messageActions.showMessage({ load: true, show: true });
      uploadNewPaper({
        onError: (respPayload: any): void => {
          // NOTE: calvinhlee - existing legacy logic
          const errorBody = respPayload.errorBody;
          if (!isNullOrUndefined(errorBody) && errorBody.status === 429) {
            messageActions.showMessage({ show: false });
          } else {
            messageActions.setMessage(
              errorBody
                ? errorBody.error
                : "You are not allowed to upload papers"
            );
            messageActions.showMessage({ show: true, error: true });
            setTimeout(() => messageActions.showMessage({ show: false }), 2000);
          }
        },
        onSuccess: ({ paperID, paperName }): void => {
          messageActions.setMessage("Paper successfully uploaded");
          messageActions.showMessage({ show: true });
          const isUsersFirstTime = !authRedux.user.has_seen_first_coin_modal;
          // NOTE: calvinhlee - equivalent to authActions.checkUserFirstTime
          modalActions.openFirstVoteModal(isUsersFirstTime);
          messageActions.showMessage({ show: true, load: true });
          paperActions.resetPaperState();
          setComponentState(defaultComponentState);
          setFormState(defaultFormState);
          if (!isPaperForHypothesis) {
            router.push(
              "/paper/[paperId]/[paperName]",
              `/paper/${paperID}/${paperName}`
            );
          }
          if (!isNullOrUndefined(onSubmitComplete)) {
            nullthrows(onSubmitComplete)();
          }
        },
        paperActions,
        paperRedux,
        payload: formState,
      });
    } else {
      messageActions.setMessage("Required fields must be filled.");
      messageActions.showMessage({
        load: false,
        show: true,
        error: true,
      });
    }
  };

  // logical ordering
  useEffectHandleInit({
    isURLView,
    paperActions,
    setFormState,
  });
  useEffectFetchSuggestedHubs({ setSuggestedHubs });
  useEffectParseReduxToState({
    componentState,
    messageActions,
    formState,
    hypothesisID,
    paperRedux,
    setComponentState,
    setFormState,
  });

  return (
    <form
      autoComplete={"off"}
      className={css(formGenericStyles.form)}
      onSubmit={onFormSubmit}
    >
      <div
        className={css(
          formGenericStyles.pageContent,
          isPaperForHypothesis && formGenericStyles.noBorder
        )}
      >
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
              {isURLView ? `Link to Paper` : "Paper PDF"}
              <span className={css(formGenericStyles.asterick)}>{"*"}</span>
            </div>
            <FormDND
              handleDrop={handlePDFUpload}
              onDrop={null}
              onDuplicate={(): void =>
                setComponentState({ ...componentState, isFormDisabled: true })
              }
              onValidUrl={(): void =>
                setComponentState({
                  ...componentState,
                  isFormDisabled: false,
                })
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
          {(shouldShowTitleField || !isURLView) && (
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
            value={title || ""}
          />
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
          onClick={handleFormCancel}
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
  authRedux: state.auth,
  messageRedux: state.auth,
  modalsRedux: state.modals,
  paperRedux: state.paper,
});

const mapDispatchToProps = (dispatch: any) => ({
  messageActions: bindActionCreators(MessageActions, dispatch),
  modalActions: bindActionCreators(ModalActions, dispatch),
  paperActions: bindActionCreators(PaperActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaperuploadV2Create);
