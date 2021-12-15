import { AuthActions } from "../../../redux/auth";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { MessageActions } from "../../../redux/message";
import { ModalActions } from "../../../redux/modals";
import { PaperActions } from "../../../redux/paper";
import { useEffectFetchSuggestedHubs } from "./api/useEffectGetSuggestedHubs";
import {
  defaultComponentState,
  defaultFormErrorState,
  defaultFormState,
  FormErrorState,
  FormState,
} from "./types/UploadComponentTypes";
import {
  getCreateNewProfileAndUpdateState,
  getHandleAuthorChange,
  getHandleAuthorInputChange,
  getHandleAuthorSelect,
} from "./util/authorInputHandler";
import { getHandleInputChange } from "./util/paperUploadV2HandleInputChange";
import { useRouter } from "next/router";
import { getExistingPaperForEdit } from "./api/getExistingPaperForEdit";
import { getIsFormValid } from "./util/getIsFormValid";
import {
  emptyFncWithMsg,
  isNullOrUndefined,
  nullthrows,
} from "../../../config/utils/nullchecks";
import { css } from "aphrodite";
import { customStyles, formGenericStyles } from "./styles/formGenericStyles";
import { ID } from "../../../config/types/root_types";
import * as Options from "../../../config/utils/options";
import AuthorCardList from "../../SearchSuggestion/AuthorCardList";
import AuthorInput from "../../SearchSuggestion/AuthorInput";
import Button from "../../Form/Button";
import CheckBox from "../../Form/CheckBox";
import FormInput from "../../Form/FormInput";
import FormSelect from "../../Form/FormSelect";
import FormTextArea from "../../Form/FormTextArea";
import {
  ComponentState,
  Fragment,
  ReactElement,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import { updateExistingPaper } from "./api/updateExistingPaper";

// Dynamic modules
import dynamic from "next/dynamic";
import { captureError } from "~/config/utils/error";
const AddAuthorModal = dynamic(() => import("../../Modals/AddAuthorModal"));

type ComponentProps = {
  authRedux: any;
  messageActions: any;
  modalActions: any;
  modalsRedux: any;
  paperActions: any;
};

type InitAndParseToStateArgs = {
  currUserAuthorID: ID;
  messageActions: any; // redux
  paperActions: any; // redux
  paperID: ID;
  setFormState: (formState: FormState) => void;
};

const useEffectInitAndParseToState = ({
  currUserAuthorID,
  messageActions,
  paperActions,
  paperID,
  setFormState,
}: InitAndParseToStateArgs): void => {
  useEffect(() => {
    paperActions.resetPaperState();
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
    messageActions.setMessage("Loading paper information for edit.");
    messageActions.showMessage({
      load: false,
      show: true,
      error: false,
    });
    getExistingPaperForEdit({
      currUserAuthorID,
      onError: (error: Error): void => {
        emptyFncWithMsg(error);
        messageActions.showMessage({
          load: false,
          show: false,
          error: true,
        });
      },
      onSuccess: ({ parsedFormState }): void => {
        // logical ordering
        setFormState(parsedFormState);
        messageActions.showMessage({
          load: false,
          show: false,
          error: false,
        });
      },
      paperID,
    });
  }, [
    /* Intentional explicit memo. Should only be called on ID changes
       Due to User-fetch latency with redux, this function could be (most likely) called twice after mount */
    currUserAuthorID,
    paperID,
  ]);
};

function PaperUploadV2Update({
  authRedux,
  messageActions,
  modalActions,
  modalsRedux,
  paperActions,
}: ComponentProps): ReactElement<typeof Fragment> {
  const router = useRouter();
  const [
    authorSearchDebncRef,
    setAuthorSearchDebncRef,
  ] = useState<NodeJS.Timeout | null>(null);
  const [componentState, setComponentState] = useState<ComponentState>(
    defaultComponentState
  );
  const [formState, setFormState] = useState<FormState>(defaultFormState);
  const [formErrors, setFormErrors] = useState<FormErrorState>(
    defaultFormErrorState
  );
  const [suggestedHubs, setSuggestedHubs] = useState<any>(null);
  const currUserAuthorID = !isNullOrUndefined(authRedux.user.author_profile)
    ? authRedux.user.author_profile.id
    : null;

  const { paperId } = router.query;
  const formattedPaperID = Array.isArray(paperId) ? paperId[0] : paperId;

  const handleFormCancel = (): void => {
    paperActions.resetPaperState();
    setComponentState(defaultComponentState);
    setFormState(defaultFormState);
    setFormErrors(defaultFormErrorState);
    router.back();
  };

  const handleInputChange = getHandleInputChange({
    currFormState: formState,
    currFormErrors: formErrors,
    currComponentState: componentState,
    setComponentState,
    setFormState,
    setFormErrors,
  });

  const handleHubSelection = (_id: ID, selectedHubs: any): void => {
    if (isNullOrUndefined(selectedHubs)) {
      setFormState({ ...formState, hubs: [] });
      setFormErrors({ ...formErrors, hubs: true });
    } else {
      setFormState({ ...formState, hubs: selectedHubs });
      setFormErrors({ ...formErrors, hubs: selectedHubs.length < 1 });
    }
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
      updateExistingPaper({
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
            setTimeout(
              () => messageActions.showMessage({ show: false, error: false }),
              2000
            );
          }
        },
        onSuccess: ({ paperID, paperName }): void => {
          messageActions.setMessage("Paper successfully updated");
          messageActions.showMessage({ show: true });
          const isUsersFirstTime = !authRedux.user.has_seen_first_coin_modal;
          // NOTE: calvinhlee - equivalent to authActions.checkUserFirstTime
          modalActions.openFirstVoteModal(isUsersFirstTime);
          messageActions.showMessage({ show: true, load: true });
          paperActions.resetPaperState();
          router.push(
            "/paper/[paperId]/[paperName]",
            `/paper/${paperID}/${paperName}`
          );
        },
        paperActions,
        paperID: nullthrows(
          formattedPaperID,
          "paperId must be present to update a paper"
        ),
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

  useEffectFetchSuggestedHubs({ setSuggestedHubs });
  useEffectInitAndParseToState({
    currUserAuthorID,
    messageActions,
    paperActions,
    paperID: formattedPaperID,
    setFormState,
  });

  const {
    abstract,
    author: formAuthor,
    authors: selectedAuthors = [],
    doi,
    hubs: selectedHubs,
    paper_title: paperTitle,
    published,
    title,
  } = formState;
  const { self_author: markedSelfAsAuthor } = formAuthor;
  const {
    authorSearchText,
    isFetchingAuthors,
    isFormDisabled,
    suggestedAuthors,
    shouldShowAuthorList,
  } = componentState;

  return (
    <Fragment>
      <AddAuthorModal
        addNewUser={getCreateNewProfileAndUpdateState({
          currComponentState: componentState,
          currFormErrors: formErrors,
          currFormState: formState,
          modalActions,
          setComponentState,
          setFormErrors,
          setFormState,
        })}
        isOpen={modalsRedux.openAddAuthorModal}
        key="AddAuthorModal"
      />
      <form
        autoComplete="off"
        className={css(formGenericStyles.form)}
        id="PaperUploadV2Update"
        key="PaperUploadV2Update"
        onSubmit={onFormSubmit}
      >
        <div className={css(formGenericStyles.pageContent)}>
          <div
            className={css(
              formGenericStyles.section,
              formGenericStyles.padding
            )}
          >
            <FormInput
              label="Editorialized Title (optional)"
              placeholder="Jargon free version of the title that the average person would understand"
              containerStyle={formGenericStyles.container}
              labelStyle={formGenericStyles.labelStyle}
              value={title}
              id="title"
              onChange={handleInputChange}
            />
            <span className={css(formGenericStyles.container)}>
              <AuthorInput
                error={formErrors.author}
                inputValue={authorSearchText}
                label="Authors"
                labelStyle={formGenericStyles.labelStyle}
                onChange={getHandleAuthorChange({
                  currComponentState: componentState,
                  currFormState: formState,
                  currUserAuthorID,
                  setComponentState,
                  setFormState,
                })}
                onChangeInput={getHandleAuthorInputChange({
                  currComponentState: componentState,
                  currFormState: formState,
                  debounceRef: authorSearchDebncRef,
                  debounceTime: 500,
                  setComponentState,
                  setDebounceRef: setAuthorSearchDebncRef,
                })}
                tags={selectedAuthors}
              />
            </span>
            <span className={css(formGenericStyles.container)}>
              <AuthorCardList
                addAuthor={async (): Promise<void> => {
                  await modalActions.openAddAuthorModal(true);
                }}
                authors={suggestedAuthors}
                loading={isFetchingAuthors}
                onAuthorClick={getHandleAuthorSelect({
                  currComponentState: componentState,
                  currFormErrors: formErrors,
                  currFormState: formState,
                  currUserAuthorID,
                  setComponentState,
                  setFormErrors,
                  setFormState,
                })}
                show={shouldShowAuthorList}
              />
            </span>
            <div
              className={css(
                formGenericStyles.row,
                formGenericStyles.authorCheckboxContainer
              )}
            >
              <CheckBox
                active={markedSelfAsAuthor}
                id="author.self_author"
                isSquare
                label="I am an author of this paper"
                labelStyle={formGenericStyles.labelStyle}
                onChange={(_id: ID, value: boolean): void => {
                  setComponentState({ ...componentState, isFormEdited: true });
                  setFormErrors({
                    ...formErrors,
                    author: value ? false : selectedAuthors.length < 1,
                  });
                  setFormState({
                    ...formState,
                    author: { self_author: value },
                  });
                }}
              />
            </div>
            <div className={css(formGenericStyles.row)}>
              <FormSelect
                containerStyle={formGenericStyles.smallContainer}
                error={formErrors.year}
                id="published.year"
                inputStyle={formGenericStyles.smallInput}
                label="Year of Publication"
                labelStyle={formGenericStyles.labelStyle}
                onChange={handleInputChange}
                options={Options.range(1960, new Date().getFullYear())}
                placeholder="yyyy"
                required={false}
                value={published.year}
              />
              <FormSelect
                containerStyle={formGenericStyles.smallContainer}
                error={formErrors.month}
                id="published.month"
                inputStyle={formGenericStyles.smallInput}
                label="Month of Publication"
                labelStyle={formGenericStyles.labelStyle}
                onChange={handleInputChange}
                options={Options.months}
                placeholder="month"
                required={false}
                value={published.month}
              />
            </div>
          </div>
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
                  required={true}
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
          <span className={css(formGenericStyles.mobileDoi)}>
            <FormInput
              containerStyle={formGenericStyles.doiInput}
              id="doi"
              label="DOI"
              labelStyle={formGenericStyles.labelStyle}
              onChange={handleInputChange}
              placeholder="Enter DOI of paper"
              required={true}
              value={doi}
            />
          </span>
          <span className={css(formGenericStyles.tagline)}>
            <FormTextArea
              containerStyle={formGenericStyles.taglineContainer}
              id="abstract"
              label="Abstract"
              labelStyle={formGenericStyles.labelStyle}
              onChange={handleInputChange}
              placeholder="Enter the paper"
              value={abstract}
            />
          </span>
        </div>
        <div
          className={css(
            formGenericStyles.buttonRow,
            formGenericStyles.buttons
          )}
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
            form="PaperUploadV2Update"
            label="Save"
            type="submit"
          />
        </div>
      </form>
    </Fragment>
  );
}

const mapStateToProps = (state: any) => ({
  authRedux: state.auth,
  messageRedux: state.auth,
  modalsRedux: state.modals,
  paperRedux: state.paper,
});

const mapDispatchToProps = (dispatch: any) => ({
  authActions: bindActionCreators(AuthActions, dispatch),
  messageActions: bindActionCreators(MessageActions, dispatch),
  modalActions: bindActionCreators(ModalActions, dispatch),
  paperActions: bindActionCreators(PaperActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaperUploadV2Update);
