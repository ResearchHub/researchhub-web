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
  console.warn("inited");
  return (selectedAuthors: any[]): void => {
    console.warn("clicked?");
    const { selectedAuthors: currSelectedAuthors } = currComponentState;
    console.warn("selectedAuthors: ", selectedAuthors);
    console.warn("currSelectedAuthors: ", currSelectedAuthors);
    if (selectedAuthors.length < currSelectedAuthors.length) {
      setFormState({
        ...currFormState,
        author: {
          self_author: selectedAuthors.includes(
            (author: any): boolean => author.id === currUserAuthorID
          ),
        },
      });
      setComponentState({
        ...currComponentState,
        isFormEdited: true,
        selectedAuthors,
      });
    }
  };
};

type GetHandleAuthorInputChangeArgs = {
  currComponentState: ComponentState;
  debounceRef: NodeJS.Timeout | null;
  debounceTime: number | undefined | null;
  setComponentState: SetComponentState;
  setDebounceRef: (ref: NodeJS.Timeout) => void;
};

export const getHandleAuthorInputChange = ({
  currComponentState,
  debounceRef,
  debounceTime = 500,
  setComponentState,
  setDebounceRef,
}: GetHandleAuthorInputChangeArgs): Function => (value: string | null) => {
  if (!isNullOrUndefined(debounceRef)) {
    clearTimeout(nullthrows(debounceRef));
  }
  /* updating input string */
  setComponentState({
    ...currComponentState,
    authorSearchText: value,
    isFetchingAuthors: true,
  });

  const { selectedAuthors: currSelectedAuthors } = currComponentState;
  setDebounceRef(
    setTimeout(async () => {
      return fetch(
        API.AUTHOR({
          search: value,
          excludeIds: currSelectedAuthors.map((author: any): ID => author.id),
        }),
        API.GET_CONFIG()
      )
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((resp: any): void => {
          setComponentState({
            ...currComponentState,
            authorSearchText: value,
            isFetchingAuthors: false,
            shouldShowAuthorList: true,
            suggestedAuthors: resp.results,
          });
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
    const { selectedAuthors: currSelectedAuthors } = currComponentState;
    setFormState({
      ...currFormState,
      author: {
        self_author: selectedAuthor.id === currUserAuthorID,
      },
    });
    setFormErrors({ ...currFormErrors, author: false });
    setComponentState({
      ...currComponentState,
      authorSearchText: "",
      selectedAuthors: [...currSelectedAuthors, selectedAuthor],
      isFormEdited: true,
    });
  };
};

type CreateNewProfileAndUpdateState = {
  currComponentState: ComponentState;
  currFormErrors: FormErrorState;
  modalActions: any; // redux
  setComponentState: SetComponentState;
  setFormErrors: SetFormErrors;
};

export const getCreateNewProfileAndUpdateState = ({
  currComponentState,
  currFormErrors,
  modalActions,
  setComponentState,
  setFormErrors,
}: CreateNewProfileAndUpdateState): Function => (
  params: any /* refer to AddAuthorModal */
): void => {
  fetch(API.AUTHOR({}), API.POST_CONFIG(params))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((createdProfile) => {
      const { selectedAuthors: currSelectedAuthors } = currComponentState;
      setComponentState({
        ...currComponentState,
        selectedAuthors: [...currSelectedAuthors, createdProfile],
        isFormEdited: true,
      });
      setFormErrors({ ...currFormErrors, author: false });
    })
    .catch((err) => {
      if (err.response.status === 429) {
        modalActions.openRecaptchaPrompt(true);
      }
    });
};
