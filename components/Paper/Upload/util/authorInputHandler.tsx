import { ComponentState, FormState } from "../types/UploadComponentTypes";
import { Helpers } from "@quantfive/js-web-config";
import { ID } from "../../../../config/types/root_types";
import API from "../../../../config/api";
import {
  isNullOrUndefined,
  nullthrows,
} from "../../../../config/utils/nullchecks";

type HandleAuthorChangeArgs = {
  currComponentState: ComponentState;
  currFormData: FormState;
  currUserAuthorID: ID;
  setComponentState: (state: ComponentState) => void;
  setFormData: (state: FormState) => void;
};

export const getHandleAuthorChange = ({
  currComponentState,
  currFormData,
  currUserAuthorID,
  setComponentState,
  setFormData,
}: HandleAuthorChangeArgs): Function => (selectedAuthors: any[]) => {
  console.warn("ok?");
  const { selectedAuthors: currSelectedAuthors } = currComponentState;
  if (selectedAuthors.length < currSelectedAuthors.length) {
    setFormData({
      ...currFormData,
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

type GetHandleAuthorInputChangeArgs = {
  currComponentState: ComponentState;
  debounceRef: NodeJS.Timeout | null;
  debounceTime: number | undefined | null;
  setComponentState: (state: ComponentState) => void;
  setDebounceRef: (ref: NodeJS.Timeout) => void;
};

export const getHandleAuthorInputChange = ({
  currComponentState,
  debounceRef,
  debounceTime = 500,
  setComponentState,
  setDebounceRef,
}: GetHandleAuthorInputChangeArgs): Function => {
  console.warn("defined function");
  return (value: string | null) => {
    console.warn("before clear: ", value);
    // if (!isNullOrUndefined(debounceRef)) {
    //   clearTimeout(nullthrows(debounceRef));
    // }
    console.warn("after clear: ", value);

    // if (!isNullOrUndefined(value) && nullthrows(value).length > 1) {
    //   setComponentState({
    //     ...currComponentState,
    //     authorSearchText: value,
    //     isFetchingAuthors: true,
    //   });
    // }

    const { selectedAuthors: currSelectedAuthors } = currComponentState;
    // setDebounceRef(
    //   setTimeout(async () => {
    //     return fetch(
    //       API.AUTHOR({
    //         search: value,
    //         excludeIds: currSelectedAuthors.map((author: any): ID => author.id),
    //       }),
    //       API.GET_CONFIG()
    //     )
    //       .then(Helpers.checkStatus)
    //       .then(Helpers.parseJSON)
    //       .then((resp: any): void => {
    //         console.warn("setting: ", value);

    //         setComponentState({
    //           ...currComponentState,
    //           suggestedAuthors: resp.results,
    //           isFetchingAuthors: false,
    //         });
    //       });
    //   }, debounceTime || 500)
    // );
  };
};
