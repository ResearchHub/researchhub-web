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
  getHandleAuthorInputChange,
  getHandleAuthorSelect,
} from "./util/authorInputHandler";
import { getHandleInputChange } from "./util/paperUploadV2HandleInputChange";
import { NextRouter, useRouter } from "next/router";
import { getExistingPaperForEdit } from "./api/getExistingPaperForEdit";
import {
  emptyFncWithMsg,
  isNullOrUndefined,
} from "../../../config/utils/nullchecks";
import { css } from "aphrodite";
import { customStyles, formGenericStyles } from "./styles/formGenericStyles";
import { ID } from "../../../config/types/root_types";
import * as Options from "../../../config/utils/options";
import AddAuthorModal from "../../Modals/AddAuthorModal";
import AuthorCardList from "../../SearchSuggestion/AuthorCardList";
import AuthorInput from "../../SearchSuggestion/AuthorInput";
import Button from "../../Form/Button";
import CheckBox from "../../Form/CheckBox";
import FormInput from "../../Form/FormInput";
import FormSelect from "../../Form/FormSelect";
import FormTextArea from "../../Form/FormTextArea";
import React, {
  ComponentState,
  Fragment,
  ReactElement,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";

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
  router: NextRouter;
  setFormState: (formState: FormState) => void;
};

const useEffectInitAndParseToState = ({
  currUserAuthorID,
  messageActions,
  paperActions,
  router,
  setFormState,
}: InitAndParseToStateArgs): void => {
  const { paperId } = router.query;
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
      paperID: paperId,
    });
  }, [
    // Intentional explicit memo. Should only be called on ID change
    paperId,
  ]);
};

const getIsFormValid = ({
  componentState,
  formState,
  formErrors,
  setFormErrors,
}: {
  componentState: ComponentState;
  formState: FormState;
  formErrors: FormErrorState;
  setFormErrors: (errors: FormErrorState) => void;
}) => {
  const { hubs: selectedHubs } = formState;
  const newErrors = { ...formErrors };
  let result = true;
  if (selectedHubs.length < 1) {
    result = false;
    newErrors.hubs = true;
  }
  // NOTE: calvinhlee - previoulsy we had a check for published date as well. It's deprecated
  setFormErrors(newErrors);
  return result;
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
  };

  useEffectFetchSuggestedHubs({ setSuggestedHubs });
  useEffectInitAndParseToState({
    currUserAuthorID,
    messageActions,
    paperActions,
    router,
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
    <form
      autoComplete={"off"}
      className={css(formGenericStyles.form)}
      onSubmit={onFormSubmit}
    >
      <AddAuthorModal
        isOpen={modalsRedux.openAddAuthorModal}
        addNewUser={getCreateNewProfileAndUpdateState({
          currComponentState: componentState,
          currFormErrors: formErrors,
          currFormState: formState,
          modalActions,
          setComponentState,
          setFormErrors,
          setFormState,
        })}
      />
      <div className={css(formGenericStyles.pageContent)}>
        <div
          className={css(formGenericStyles.section, formGenericStyles.padding)}
        >
          <FormInput
            label="Editorialized Title (optional)"
            placeholder="Jargon free version of the title that the average person would understand"
            containerStyle={formGenericStyles.container}
            labelStyle={formGenericStyles.labelStyle}
            value={title || paperTitle}
            id="title"
            onChange={handleInputChange}
          />
          <span className={css(formGenericStyles.container)}>
            <AuthorInput
              error={formErrors.author}
              inputValue={authorSearchText}
              label="Authors"
              labelStyle={formGenericStyles.labelStyle}
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
                setFormState({ ...formState, author: { self_author: value } });
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
          label="Save"
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
  authActions: bindActionCreators(AuthActions, dispatch),
  messageActions: bindActionCreators(MessageActions, dispatch),
  modalActions: bindActionCreators(ModalActions, dispatch),
  paperActions: bindActionCreators(PaperActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaperUploadV2Update);
