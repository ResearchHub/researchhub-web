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
import { useRouter } from "next/router";

type Props = {
  modalsRedux: any;
};

const useEffectInitAndParseReduxToState = ({
  paperActions,
  paperTitleQuery,
}): void => {
  useEffect(() => {
    paperActions.resetPaperState();
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
  }, []);
};

function PaperUploadV2Update({
  modalsRedux,
}: Props): ReactElement<typeof Fragment> {
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
