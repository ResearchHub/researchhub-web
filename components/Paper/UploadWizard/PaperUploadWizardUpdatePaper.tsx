import { bindActionCreators } from "redux";
import { buildSlug } from "~/config/utils/buildSlug";
import {
  customStyles,
  formGenericStyles,
} from "../Upload/styles/formGenericStyles";
import { connect } from "react-redux";
import { ID, NullableString } from "~/config/types/root_types";
import {
  isEmpty,
  isNullOrUndefined,
  nullthrows,
} from "~/config/utils/nullchecks";
import {
  NewPostButtonContext,
  NewPostButtonContextValues,
} from "~/components/contexts/NewPostButtonContext";
import { PaperActions } from "~/redux/paper";
import { SyntheticEvent, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { verifStyles } from "~/components/AuthorClaimModal/AuthorClaimPromptEmail";
import { WizardBodyTypes } from "./types/PaperUploadWizardTypes";
import Button from "~/components/Form/Button";
import colors from "~/config/themes/colors";
import FormInput from "~/components/Form/FormInput";
import FormSelect from "~/components/Form/FormSelect";
import Loader from "~/components/Loader/Loader";
import withWebSocket from "~/components/withWebSocket";
import { StyleSheet } from "aphrodite";
import { ClipLoader } from "react-spinners";

export type FormErrors = {
  paperID: boolean;
  title: boolean /* editorialized title */;
  doi: boolean;
};

export type FormState = {
  doi: NullableString;
  paperID: ID;
  title: NullableString /* editorialized title */;
};

type Props = {
  onExit: () => void;
  paperActions: any /* redux */;
  userRedux: any;
  wsResponse: any /* socket */;
};

type GetIsFormValidArgs = {
  formState: FormState;
  submissionType: WizardBodyTypes | null;
};

const defaulError: FormErrors = {
  doi: false,
  paperID: false,
  title: false,
};

const defaultFormState: FormState = {
  doi: null,
  paperID: null,
  title: null,
};

const getIsFormValid = ({
  formState,
  submissionType,
}: GetIsFormValidArgs): [verdict: boolean, errors: FormErrors] => {
  let verdict = true;
  const errorResult = { ...defaulError };
  if (submissionType !== "standby" && isNullOrUndefined(formState.paperID)) {
    verdict = false;
    errorResult.paperID = true;
  }
  return [verdict, errorResult];
};

function useEffectPasteMetaDataToForm({
  currentFormState,
  parsedWsResponse,
  setFormState,
  uploaderContextValues,
}: {
  currentFormState: FormState;
  parsedWsResponse: any;
  setFormState: (data: FormState) => void;
  uploaderContextValues: NewPostButtonContextValues;
}): void {
  const asyncDOI = parsedWsResponse?.data?.doi ?? null;

  useEffect(() => {
    setFormState({
      ...currentFormState,
      doi: asyncDOI ?? uploaderContextValues?.doi ?? null,
      paperID: uploaderContextValues?.paperID,
    });
  }, [asyncDOI, uploaderContextValues?.doi, uploaderContextValues?.paperID]);
}
function PaperUploadWizardUpdatePaper({
  onExit,
  paperActions,
  userRedux: _userRedux,
  wsResponse,
}: Props) {
  const router = useRouter();
  const {
    values: uploaderContextValues,
    setValues: _setUploaderContextValues,
  } = useContext<NewPostButtonContextType>(NewPostButtonContext);
  const [formErrors, setFormErrors] = useState<FormErrors>(defaulError);
  const [formState, setFormState] = useState<FormState>(defaultFormState);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const parsedWsResponse = JSON.parse(wsResponse) ?? null;

  const isAsyncComplete = parsedWsResponse?.data?.paper_status === "COMPLETE";
  const asyncPaperTitle = parsedWsResponse?.current_paper?.paper_title ?? null;
  const asyncDOI = parsedWsResponse?.data?.doi ?? null;
  const { doi, paperID, title } = formState;

  useEffectPasteMetaDataToForm({
    currentFormState: formState,
    parsedWsResponse,
    setFormState,
    uploaderContextValues,
  });

  const onFormSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    console.log(`/paper/${parsedWsResponse.current_paper.id}/${parsedWsResponse.current_paper.slug}`)
    onExit();
    router.push(`/paper/${parsedWsResponse.current_paper.id}/${parsedWsResponse.current_paper.slug}`);
  };

  return (
    <form onSubmit={onFormSubmit}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "16px 0",
          width: "100%",
        }}
      >
        <Button
          customButtonStyle={verifStyles.buttonCustomStyle}
          disabled={!isAsyncComplete}
          key="upload-wizard-button"
          label={
            !isSubmitting ? (
              "View Paper"
            ) : (
              <ClipLoader
                sizeUnit={"px"}
                size={8}
                color={"#fff"}
                loading={true}
              />
            )
          }
          rippleClass={verifStyles.rippleClass}
          size="xxsmall"
          type="submit"
        />
      </div>
    </form>
  );
}

const mapStateToProps = (state: any) => ({
  paperRedux: state.paper,
  userRedux: state.auth.user,
});

const mapDispatchToProps = (dispatch: any) => ({
  paperActions: bindActionCreators(PaperActions, dispatch),
});

export default withWebSocket(
  // @ts-ignore legacy hook
  connect(mapStateToProps, mapDispatchToProps)(PaperUploadWizardUpdatePaper)
);

const styles = StyleSheet.create({
  loaderStyle: {
    height: 23,
    top: "70%",
  },
});
