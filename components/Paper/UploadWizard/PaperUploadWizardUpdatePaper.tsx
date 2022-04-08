import {
  customStyles,
  formGenericStyles,
} from "../Upload/styles/formGenericStyles";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ID, NullableString } from "~/config/types/root_types";
import { isEmpty, isNullOrUndefined } from "~/config/utils/nullchecks";
import { PaperActions } from "~/redux/paper";
import { SyntheticEvent, useContext, useState } from "react";
import { useEffectFetchSuggestedHubs } from "../Upload/api/useEffectGetSuggestedHubs";
import { useRouter } from "next/router";
import { verifStyles } from "~/components/AuthorClaimModal/AuthorClaimPromptEmail";
import Button from "~/components/Form/Button";
import FormInput from "~/components/Form/FormInput";
import FormSelect from "~/components/Form/FormSelect";
import { buildSlug } from "~/config/utils/buildSlug";
import Loader from "~/components/Loader/Loader";
import {
  NewPostButtonContext,
  NewPostButtonContextType,
} from "~/components/contexts/NewPostButtonContext";
import colors from "~/config/themes/colors";

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
};

type GetIsFormValidArgs = {
  formState: FormState;
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
}: GetIsFormValidArgs): [verdict: boolean, errors: FormErrors] => {
  let verdict = true;
  const errorResult = { ...defaulError };
  const { selectedHubs } = formState;
  if (isNullOrUndefined(formState.paperID)) {
    verdict = false;
    errorResult.paperID = true;
  }
  if (isEmpty(selectedHubs ?? [])) {
    verdict = false;
    errorResult.selectedHubs = true;
  }
  return [verdict, errorResult];
};

function PaperUploadWizardUpdatePaper({ onExit, paperActions }: Props) {
  const router = useRouter();
  const { values: uploaderContextValues } =
    useContext<NewPostButtonContextType>(NewPostButtonContext);
  const [formErrors, setFormErrors] = useState<FormErrors>(defaulError);
  const [formState, setFormState] = useState<FormState>({
    ...defaultFormState,
    doi: uploaderContextValues?.doi ?? null,
    paperID: uploaderContextValues?.paperID,
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [suggestedHubs, setSuggestedHubs] = useState<any>([]);
  const { doi, paperID, selectedHubs, title } = formState;
  useEffectFetchSuggestedHubs({ setSuggestedHubs });

  const onFormSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    const [verdict, formErrors] = getIsFormValid({
      formState,
    });
    if (verdict) {
      //  calvinhlee - Refer to NOTE(100)
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
        containerStyle={formGenericStyles.container}
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
          containerStyle={formGenericStyles.container}
          disabled={isSubmitting}
          id="doi"
          label="DOI"
          required
          labelStyle={formGenericStyles.labelStyle}
          onChange={(_id: ID, doi: string): void =>
            setFormState({ ...formState, doi: isEmpty(doi) ? null : doi })
          }
          placeholder="DOI"
          value={doi}
        />
      ) : null}
      <FormInput
        containerStyle={formGenericStyles.container}
        disabled={isSubmitting}
        id="title"
        label="Editorialized Title (optional)"
        labelStyle={formGenericStyles.labelStyle}
        onChange={(_id: ID, title: string): void =>
          setFormState({ ...formState, title: isEmpty(title) ? null : title })
        }
        placeholder="Jargon free version of the title that the average person would understand"
        value={title}
      />
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
          disabled={isSubmitting}
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
});

const mapDispatchToProps = (dispatch: any) => ({
  paperActions: bindActionCreators(PaperActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaperUploadWizardUpdatePaper);
