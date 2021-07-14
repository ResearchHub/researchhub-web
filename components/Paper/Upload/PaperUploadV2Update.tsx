import { addNewUser } from "./api/authorModalAddNewUser";
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
import CheckBox from "../../Form/CheckBox";
import FormInput from "../../Form/FormInput";
import FormSelect from "../../Form/FormSelect";
import React, {
  ComponentState,
  Fragment,
  ReactElement,
  useEffect,
  useState,
} from "react";
import {
  getHandleAuthorChange,
  getHandleAuthorInputChange,
} from "./util/authorInputHandler";
import FormTextArea from "../../Form/FormTextArea";

type ComponentProps = {
  authRedux: any;
  messageActions: any;
  modalsRedux: any;
  paperActions: any;
};

type InitAndParseReduxToStateArgs = {
  currComponentState: ComponentState;
  currUserAuthorID: ID;
  messageActions: any; // redux
  paperActions: any; // redux
  router: NextRouter;
  setComponentState: (state: ComponentState) => void;
  setFormData: (formData: FormState) => void;
};

const useEffectInitAndParseReduxToState = ({
  currComponentState,
  currUserAuthorID,
  messageActions,
  paperActions,
  router,
  setFormData,
  setComponentState,
}: InitAndParseReduxToStateArgs): void => {
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
      onSuccess: ({ selectedAuthors, parsedFormData }): void => {
        // logical ordering
        setFormData(parsedFormData);
        setComponentState({
          ...currComponentState,
          selectedAuthors,
        });
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

function PaperUploadV2Update({
  authRedux,
  messageActions,
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
  const [formData, setFormData] = useState<FormState>(defaultFormState);
  const [formErrors, setFormErrors] = useState<FormErrorState>(
    defaultFormErrorState
  );
  const [suggestedHubs, setSuggestedHubs] = useState<any>(null);
  const currUserAuthorID = !isNullOrUndefined(authRedux.user.author_profile)
    ? authRedux.user.author_profile.id
    : null;

  const handleInputChange = getHandleInputChange({
    currFormData: formData,
    currFormErrors: formErrors,
    currComponentState: componentState,
    setComponentState,
    setFormData,
    setFormErrors,
  });

  const handleHubSelection = (_id: ID, selectedHubs: any): void => {
    if (isNullOrUndefined(selectedHubs)) {
      setFormData({ ...formData, hubs: [] });
      setFormErrors({ ...formErrors, hubs: true });
    } else {
      setFormData({ ...formData, hubs: selectedHubs });
      setFormErrors({ ...formErrors, hubs: selectedHubs.length < 1 });
    }
  };

  const onFormSubmit = emptyFncWithMsg;

  useEffectFetchSuggestedHubs({ setSuggestedHubs });
  useEffectInitAndParseReduxToState({
    currComponentState: componentState,
    currUserAuthorID,
    messageActions,
    paperActions,
    router,
    setComponentState,
    setFormData,
  });
  const {
    abstract,
    author: formAuthor,
    doi,
    hubs: selectedHubs,
    paper_title: paperTitle,
    published,
    title,
  } = formData;
  const {
    authorSearchText,
    selectedAuthors,
    suggestedAuthors,
  } = componentState;
  console.warn("authorSearchText: ", authorSearchText);
  return (
    <form
      autoComplete={"off"}
      className={css(formGenericStyles.form)}
      onSubmit={() => onFormSubmit}
    >
      <AddAuthorModal
        isOpen={modalsRedux.openAddAuthorModal}
        addNewUser={addNewUser}
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
              onChange={getHandleAuthorChange({
                currComponentState: componentState,
                currFormData: formData,
                currUserAuthorID,
                setComponentState,
                setFormData,
              })}
              onChangeInput={getHandleAuthorInputChange({
                currComponentState: componentState,
                debounceRef: authorSearchDebncRef,
                debounceTime: 500,
                setComponentState,
                setDebounceRef: setAuthorSearchDebncRef,
              })}
              tags={selectedAuthors}
            />
          </span>
          <span className={css(formGenericStyles.container)}>
            {/* <AuthorCardList
            addAuthor={openAddAuthorModal}
            authors={suggestedAuthors}
            loading={loading}
            onAuthorClick={handleAuthorSelect}
            show={showAuthorList}
          /> */}
          </span>
          <div
            className={css(
              formGenericStyles.row,
              formGenericStyles.authorCheckboxContainer
            )}
          >
            {/* <CheckBox
            active={formAuthor.self_author}
            id="author.self_author"
            isSquare
            label="I am an author of this paper"
            labelStyle={formGenericStyles.labelStyle}
            onChange={handleSelfAuthorToggle}
          /> */}
          </div>
          <div className={css(formGenericStyles.row)}>
            <FormSelect
              label="Year of Publication"
              placeholder="yyyy"
              required={false}
              containerStyle={formGenericStyles.smallContainer}
              inputStyle={formGenericStyles.smallInput}
              value={published.year}
              id="published.year"
              options={Options.range(1960, new Date().getFullYear())}
              onChange={handleInputChange}
              error={formErrors.year}
              labelStyle={formGenericStyles.labelStyle}
            />
            <FormSelect
              label="Month of Publication"
              placeholder="month"
              required={false}
              containerStyle={formGenericStyles.smallContainer}
              inputStyle={formGenericStyles.smallInput}
              value={published.month}
              id="published.month"
              options={Options.months}
              onChange={handleInputChange}
              error={formErrors.month}
              labelStyle={formGenericStyles.labelStyle}
            />
          </div>
        </div>
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
                onChange={handleInputChange}
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
            label="DOI"
            placeholder="Enter DOI of paper"
            id="doi"
            value={doi}
            required={true}
            containerStyle={formGenericStyles.doiInput}
            labelStyle={formGenericStyles.labelStyle}
            onChange={handleInputChange}
          />
        </span>
        <span className={css(formGenericStyles.tagline)}>
          <FormTextArea
            label="Abstract"
            placeholder="Enter the paper"
            containerStyle={formGenericStyles.taglineContainer}
            labelStyle={formGenericStyles.labelStyle}
            value={abstract}
            id="abstract"
            onChange={handleInputChange}
          />
        </span>
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
