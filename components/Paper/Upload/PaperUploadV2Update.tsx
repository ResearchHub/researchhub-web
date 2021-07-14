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

type ComponentProps = {
  modalsRedux: any;
};

type InitAndParseReduxToStateArgs = {
  paperActions: any; // redux,
  router: NextRouter;
};

const useEffectInitAndParseReduxToState = ({
  paperActions,
  router,
}: InitAndParseReduxToStateArgs): void => {
  const { paperId } = router.query;

  useEffect(() => {
    paperActions.resetPaperState();
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
  }, [
    // Intentional explicit memo. Should only be called on ID change
    paperId,
  ]);
};

function PaperUploadV2Update({
  modalsRedux,
}: ComponentProps): ReactElement<typeof Fragment> {
  const router = useRouter();
  const [componentState, setComponentState] = useState<ComponentState>(
    defaultComponentState
  );
  const [formData, setFormData] = useState<FormState>(defaultFormState);
  const [formErrors, setFormErrors] = useState<FormErrorState>(
    defaultFormErrorState
  );
  const [suggestedHubs, setSuggestedHubs] = useState<any>(null);

  const handleInputChange = getHandleInputChange({
    currFormData: formData,
    currFormErrors: formErrors,
    currComponentState: componentState,
    setComponentState,
    setFormData,
    setFormErrors,
  });

  useEffectFetchSuggestedHubs({ setSuggestedHubs });
  useEffectInitAndParseReduxToState();

  return (
    <Fragment>
      <AddAuthorModal
        isOpen={modalsRedux.openAddAuthorModal}
        addNewUser={addNewUser}
      />
      Hi this is edit!
    </Fragment>
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
