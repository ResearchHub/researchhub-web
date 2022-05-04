import { bindActionCreators } from "redux";
import { buildSlug } from "~/config/utils/buildSlug";
import {
  customStyles,
  formGenericStyles,
} from "../Upload/styles/formGenericStyles";
import { connect } from "react-redux";
import { ID, NullableString } from "~/config/types/root_types";
import { isEmpty, isNullOrUndefined } from "~/config/utils/nullchecks";
import {
  NewPostButtonContext,
  NewPostButtonContextType,
  NewPostButtonContextValues,
} from "~/components/contexts/NewPostButtonContext";
import { PaperActions } from "~/redux/paper";
import { SyntheticEvent, useContext, useEffect, useState } from "react";
import { useEffectFetchSuggestedHubs } from "../Upload/api/useEffectGetSuggestedHubs";
import { useRouter } from "next/router";
import { verifStyles } from "~/components/AuthorClaimModal/AuthorClaimPromptEmail";
import { WizardBodyTypes } from "./types/PaperUploadWizardTypes";
import Button from "~/components/Form/Button";
import colors from "~/config/themes/colors";
import FormInput from "~/components/Form/FormInput";
import FormSelect from "~/components/Form/FormSelect";
import Loader from "~/components/Loader/Loader";
import withWebSocket from "~/components/withWebSocket";

export type FormErrors = {
  paperID: boolean;
  selectedHubs: boolean;
  title: boolean /* editorialized title */;
  doi: boolean;
};

export type FormState = {
  doi: NullableString;
  paperID: ID;
  selectedHubs: any[];
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
  selectedHubs: false,
  title: false,
};

const defaultFormState: FormState = {
  doi: null,
  paperID: null,
  selectedHubs: [],
  title: null,
};

const getIsFormValid = ({
  formState,
  submissionType,
}: GetIsFormValidArgs): [verdict: boolean, errors: FormErrors] => {
  let verdict = true;
  const errorResult = { ...defaulError };
  const { selectedHubs } = formState;
  if (submissionType !== "standby" && isNullOrUndefined(formState.paperID)) {
    verdict = false;
    errorResult.paperID = true;
  }
  if (isEmpty(selectedHubs ?? [])) {
    verdict = false;
    errorResult.selectedHubs = true;
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
  const [suggestedHubs, setSuggestedHubs] = useState<any>([]);
  const parsedWsResponse = JSON.parse(wsResponse) ?? null;

  const isAsyncComplete = parsedWsResponse?.data?.paper_status === "COMPLETE";
  const asyncPaperTitle = parsedWsResponse?.current_paper?.paper_title ?? null;
  const asyncDOI = parsedWsResponse?.data?.doi ?? null;
  const { doi, paperID, selectedHubs, title } = formState;

  useEffectFetchSuggestedHubs({
    setSuggestedHubs,
  });
  useEffectPasteMetaDataToForm({
    currentFormState: formState,
    parsedWsResponse,
    setFormState,
    uploaderContextValues,
  });

  const onFormSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    const [verdict, formErrors] = getIsFormValid({
      formState,
      submissionType: uploaderContextValues.wizardBodyType ?? null,
    });
    if (verdict && isAsyncComplete) {
      // update paper instance directly
      const formattedPayload: any = {
        // intentional undefined to avoid overriding BE-proccessed metadata
        ...formState,
        authors: undefined,
        publishDate: undefined,
        hubs: selectedHubs.map((hub): ID => hub.id),
      };

      const response = await paperActions.patchPaper(paperID, formattedPayload);
      const { payload: resPayload } = response;
      if (resPayload.success) {
        const { postedPaper } = resPayload;
        const { id: paperID, paper_title, slug, title } = postedPaper || {};
        setIsSubmitting(false);
        const paperSlug = !isEmpty(slug)
          ? slug
          : buildSlug(paper_title ? paper_title : title);
        router.push(`/paper/${paperID}/${paperSlug}`);
        onExit();
      } else {
        setIsSubmitting(false);
      }
    } else {
      setFormErrors(formErrors);
      setIsSubmitting(false);
    }
  };

  const handleHubSelection = (_id: ID, selectedHubs: any): void => {
    if (isNullOrUndefined(selectedHubs)) {
      setFormState({ ...formState, selectedHubs: [] });
    } else {
      setFormState({ ...formState, selectedHubs });
    }
  };

  return (
    <form onSubmit={onFormSubmit}>
      <FormSelect
        disabled={isSubmitting}
        error={formErrors.selectedHubs}
        id="hubs"
        isMulti
        label={
          <div>
            <span>{"Hubs"}</span>
            <span style={{ color: colors.BLUE(1) }}>{"*"}</span>
          </div>
        }
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
      {!uploaderContextValues.isWithDOI ? (
        <FormInput
          disabled={isSubmitting || isEmpty(asyncDOI)}
          id="doi"
          label={["DOI ", isEmpty(asyncDOI) && <Loader size={12} />]}
          required
          labelStyle={formGenericStyles.labelStyle}
          onChange={(_id: ID, doi: string): void =>
            setFormState({ ...formState, doi: isEmpty(doi) ? null : doi })
          }
          placeholder="DOI"
          value={doi}
        />
      ) : null}
      {isAsyncComplete && (
        <FormInput
          disabled={isSubmitting}
          id="title"
          label="Editorialized Title (optional)"
          labelStyle={formGenericStyles.labelStyle}
          subtitle={asyncPaperTitle ?? null}
          onChange={(_id: ID, title: string): void =>
            setFormState({ ...formState, title: isEmpty(title) ? null : title })
          }
          placeholder="Jargon free version of the title that the average person would understand"
          value={title}
        />
      )}
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
          disabled={isSubmitting || !isAsyncComplete}
          key="upload-wizard-button"
          label={
            !isSubmitting ? "Save" : <Loader size={8} loading color="#fff" />
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
