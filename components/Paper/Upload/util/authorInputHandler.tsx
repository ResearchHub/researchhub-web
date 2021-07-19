import {
  ComponentState,
  FormErrorState,
  FormState,
} from "../types/UploadComponentTypes";
import { Helpers } from "@quantfive/js-web-config";
import { ID } from "../../../../config/types/root_types";
import API from "../../../../config/api";
import {
  isNullOrUndefined,
  nullthrows,
} from "../../../../config/utils/nullchecks";

type SetComponentState = (state: ComponentState) => void;
type SetFormErrors = (errors: FormErrorState) => void;
type SetFormState = (state: FormState) => void;

type HandleAuthorChangeArgs = {
  currComponentState: ComponentState;
  currFormState: FormState;
  currUserAuthorID: ID;
  setComponentState: SetComponentState;
  setFormState: SetFormState;
};

export const getHandleAuthorChange = ({
  currComponentState,
  currFormState,
  currUserAuthorID,
  setComponentState,
  setFormState,
}: HandleAuthorChangeArgs): Function => {
  return (selectedAuthors: any[]): void => {
    const { authors: currSelectedAuthors } = currFormState;
    // NOTE: we are currently handling "adding" with card-click. Need to only handle removing
    if (
      selectedAuthors.length <
      nullthrows(currSelectedAuthors, "Must an array").length
    ) {
      setFormState({
        ...currFormState,
        author: {
          self_author: selectedAuthors.some(
            (author: any): boolean => author.id === currUserAuthorID
          ),
        },
        authors: selectedAuthors,
      });
      setComponentState({
        ...currComponentState,
        isFormEdited: true,
      });
    }
  };
};

type GetHandleAuthorInputChangeArgs = {
  currComponentState: ComponentState;
  currFormState: FormState;
  debounceRef: NodeJS.Timeout | null;
  debounceTime: number | undefined | null;
  setComponentState: SetComponentState;
  setDebounceRef: (ref: NodeJS.Timeout | null) => void;
};

export const getHandleAuthorInputChange = ({
  currComponentState,
  currFormState,
  debounceRef,
  debounceTime = 500,
  setComponentState,
  setDebounceRef,
}: GetHandleAuthorInputChangeArgs): Function => (
  searchText: string | null
): void => {
  if (!isNullOrUndefined(debounceRef)) {
    clearTimeout(nullthrows(debounceRef));
  }

  const shouldShowAuthorList = Boolean(searchText);
  /* updating input state */
  setComponentState({
    ...currComponentState,
    authorSearchText: searchText,
    isFetchingAuthors: shouldShowAuthorList,
    shouldShowAuthorList: Boolean(searchText),
  });

  const { authors: currSelectedAuthors } = currFormState;

  setDebounceRef(
    setTimeout(async () => {
      return fetch(
        API.AUTHOR({
          search: searchText,
          excludeIds: nullthrows(currSelectedAuthors, "Must be an array").map(
            (author: any): ID => author.id
          ),
        }),
        API.GET_CONFIG()
      )
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((resp: any): void => {
          setComponentState({
            ...currComponentState,
            authorSearchText: searchText,
            isFetchingAuthors: false,
            shouldShowAuthorList,
            suggestedAuthors: resp.results,
          });
          setDebounceRef(null);
        });
    }, debounceTime || 500)
  );
};

type GetHandleAuthorSelectArgs = {
  currComponentState: ComponentState;
  currFormErrors: FormErrorState;
  currFormState: FormState;
  currUserAuthorID: ID;
  setComponentState: SetComponentState;
  setFormErrors: SetFormErrors;
  setFormState: SetFormState;
};

export const getHandleAuthorSelect = ({
  currComponentState,
  currFormErrors,
  currFormState,
  currUserAuthorID,
  setComponentState,
  setFormErrors,
  setFormState,
}: GetHandleAuthorSelectArgs): Function => {
  return (selectedAuthor: any): void => {
    const { authors: currSelectedAuthors } = currFormState;
    setFormState({
      ...currFormState,
      author: {
        self_author:
          selectedAuthor.id === currUserAuthorID ||
          currFormState.author.self_author,
      },
      authors: [
        ...nullthrows(currSelectedAuthors, "Must an array"),
        selectedAuthor,
      ],
    });
    setFormErrors({ ...currFormErrors, author: false });
    setComponentState({
      ...currComponentState,
      authorSearchText: "",
      isFormEdited: true,
      shouldShowAuthorList: false,
    });
  };
};

type CreateNewProfileAndUpdateState = {
  currComponentState: ComponentState;
  currFormErrors: FormErrorState;
  currFormState: FormState;
  modalActions: any; // redux
  setComponentState: SetComponentState;
  setFormErrors: SetFormErrors;
  setFormState: SetFormState;
};

export const getCreateNewProfileAndUpdateState = ({
  currComponentState,
  currFormErrors,
  currFormState,
  modalActions,
  setComponentState,
  setFormErrors,
  setFormState,
}: CreateNewProfileAndUpdateState): Function => (
  params: any /* refer to AddAuthorModal */
): void => {
  fetch(API.AUTHOR({}), API.POST_CONFIG(params))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((createdProfile) => {
      const { authors: currSelectedAuthors } = currFormState;
      setComponentState({
        ...currComponentState,
        authorSearchText: "",
        isFormEdited: true,
        shouldShowAuthorList: false,
      });
      setFormState({
        ...currFormState,
        authors: [
          ...nullthrows(currSelectedAuthors, "Must an array"),
          createdProfile,
        ],
      });
      setFormErrors({ ...currFormErrors, author: false });
    })
    .catch((err) => {
      if (err.response.status === 429) {
        modalActions.openRecaptchaPrompt(true);
      }
    });
};
