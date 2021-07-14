import { addNewUser } from "./api/authorModalAddNewUser";
import { AuthActions } from "../../../redux/auth";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { MessageActions } from "../../../redux/message";
import { ModalActions } from "../../../redux/modals";
import { PaperActions } from "../../../redux/paper";
import { useEffectFetchSuggestedHubs } from "./api/useEffectGetSuggestedHubs";
import AddAuthorModal from "../../Modals/AddAuthorModal";
import React, {
  ComponentState,
  Fragment,
  ReactElement,
  useEffect,
  useState,
} from "react";
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
import { ID } from "../../../config/types/root_types";
import { formGenericStyles } from "./styles/formGenericStyles";
import { css } from "aphrodite";

type ComponentProps = {
  authRedux: any;
  messageActions: any;
  modalsRedux: any;
  paperActions: any;
};

type InitAndParseReduxToStateArgs = {
  currUserAuthorID: ID;
  messageActions: any; // redux
  paperActions: any; // redux
  router: NextRouter;
  setFormData: (formData: FormState) => void;
  setSelectedAuthors: (authors: any) => void;
};

const useEffectInitAndParseReduxToState = ({
  currUserAuthorID,
  messageActions,
  paperActions,
  router,
  setFormData,
  setSelectedAuthors,
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
      onSuccess: ({
        selectedAuthors,
        parsedFormData,
      }: {
        selectedAuthors: any[];
        parsedFormData: FormState;
      }): void => {
        setSelectedAuthors(selectedAuthors);
        setFormData(parsedFormData);
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
  const [componentState, setComponentState] = useState<ComponentState>(
    defaultComponentState
  );
  const [formData, setFormData] = useState<FormState>(defaultFormState);
  const [formErrors, setFormErrors] = useState<FormErrorState>(
    defaultFormErrorState
  );
  /* NOTE: calvinhlee - because BE returns a hodge-podge of rawAuthors & "authorProfiles", we need separate handling state */
  const [selectedAuthors, setSelectedAuthors] = useState<any[]>([]);
  const [suggestedHubs, setSuggestedHubs] = useState<any>(null);

  const currUserAuthorID = isNullOrUndefined(authRedux.user.author_profile)
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

  useEffectFetchSuggestedHubs({ setSuggestedHubs });
  useEffectInitAndParseReduxToState({
    currUserAuthorID,
    messageActions,
    paperActions,
    router,
    setFormData,
    setSelectedAuthors,
  });

  return (
    <form
      autoComplete={"off"}
      className={css(formGenericStyles.form)}
      onSubmit={onFormSubmit}
    >
      <AddAuthorModal
        isOpen={modalsRedux.openAddAuthorModal}
        addNewUser={addNewUser}
      />
      Hi this is edit!
    </form>
  );
}

const mapStateToProps = (state) => ({
  authRedux: state.auth,
  messageRedux: state.auth,
  modalsRedux: state.modals,
  paperRedux: state.paper,
});

const mapDispatchToProps = (dispatch) => ({
  authActions: bindActionCreators(AuthActions, dispatch),
  messageActions: bindActionCreators(MessageActions, dispatch),
  modalActions: bindActionCreators(ModalActions, dispatch),
  paperActions: bindActionCreators(PaperActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaperUploadV2Update);
