import { connect } from "react-redux";
import { firstImageFromHtml } from "~/config/utils/getFirstImageOfHtml";
import { getPlainTextFromMarkdown } from "~/config/utils/getPlainTextFromMarkdown";
import { Helpers } from "@quantfive/js-web-config";
import { sendAmpEvent } from "~/config/fetch";
import { StyleSheet, css } from "aphrodite";
import { SyntheticEvent, useState } from "react";
import { useEffectFetchSuggestedHubs } from "../Paper/Upload/api/useEffectGetSuggestedHubs";
import { useRouter } from "next/router";
import API from "../../config/api";
import Button from "../Form/Button";
import colors from "../../config/themes/colors";
import dynamic from "next/dynamic";
import FormInput from "../Form/FormInput";
import FormSelect from "../Form/FormSelect";

const DynamicComponent = dynamic(
  () => import("../../components/CKEditor/SimpleEditor")
);

type FormFields = {
  hubs: any[];
  text: string;
  title: string;
};

type FormError = {
  hubs: boolean;
  text: boolean;
  title: boolean;
};

const MIN_TITLE_LENGTH = 1;
const MAX_TITLE_LENGTH = 250;

function validateFormField(fieldID: string, value: any): boolean {
  let result: boolean = true;
  switch (fieldID) {
    case "title":
      return (
        value.length >= MIN_TITLE_LENGTH && value.length <= MAX_TITLE_LENGTH
      );
    case "hubs":
      return value && value.length > 0;
    case "text":
      return true;
    default:
      return result;
  }
}

export type Props = {
  documentType: string;
  user: any;
};

function HypothesisSubmitForm({ documentType, user }: Props) {
  const router = useRouter();
  const [formErrors, setFormErrors] = useState<FormError>({
    hubs: true,
    text: false,
    title: true,
  });
  const [mutableFormFields, setMutableFormFields] = useState<FormFields>({
    hubs: [],
    text: "",
    title: "",
  });
  const [suggestedHubs, setSuggestedHubs] = useState([]);
  const [shouldDisplayError, setShouldDisplayError] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const isPost = documentType === "post";

  useEffectFetchSuggestedHubs({ setSuggestedHubs });

  const handlePost = (e: SyntheticEvent) => {
    e.preventDefault();
    if (Object.values(formErrors).some((el: boolean): boolean => el)) {
      setShouldDisplayError(true);
    } else {
      setShouldDisplayError(false);
      setIsSubmitting(true);

      sendPost(false)
        .then((res: any) => {
          const payload = {
            event_type: "create_metastudy",
            time: +new Date(),
            user_id: user.id,
            insert_id: `metastudy_${res?.id}`,
            event_properties: {
              interaction: "Meta-Study created",
            },
          };
          sendAmpEvent(payload);

          return res;
        })
        .then(onSuccess(false))
        .catch((err) => setIsSubmitting(false));
    }
  };

  const onSuccess = (isDraft: boolean): ((value: any) => void) => {
    return (response) => {
      const { id, slug } = response;
      router.push(
        `/hypothesis/${id}/${slug}${
          router.query.from ? "?from=" + router.query.from : ""
        }`
      );
    };
  };

  const sendPost = (draft: boolean) => {
    const params = {
      admins: null,
      created_by: user.id,
      document_type: "HYPOTHESIS",
      editors: null,
      from_bounty: router.query.bounty_id,
      full_src: mutableFormFields.text,
      /* @ts-ignore */
      hubs: mutableFormFields.hubs.map((hub) => hub.id),
      is_public: !draft,
      preview_img: firstImageFromHtml(mutableFormFields.text),
      renderable_text: getPlainTextFromMarkdown(mutableFormFields.text),
      title: mutableFormFields.title,
      viewers: null,
    };

    return fetch(API.HYPOTHESIS({}), API.POST_CONFIG(params))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON);
  };

  const handleOnChangeFields = (fieldID: string, value: string): void => {
    setMutableFormFields({ ...mutableFormFields, [fieldID]: value });
    setFormErrors({
      ...formErrors,
      [fieldID]: !validateFormField(fieldID, value),
    });
    setShouldDisplayError(false);
  };

  return (
    <div className={css(styles.rootContainer)}>
      <form>
        <FormSelect
          containerStyle={[styles.chooseHub]}
          error={shouldDisplayError && formErrors.hubs && `Please select a hub`}
          errorStyle={styles.errorText}
          id="hubs"
          inputStyle={shouldDisplayError && formErrors.hubs && styles.error}
          isMulti={true}
          label="Hubs"
          labelStyle={styles.label}
          menu={styles.dropDown}
          onChange={handleOnChangeFields}
          options={suggestedHubs}
          placeholder="Search Hubs"
          required
        />
        <FormInput
          containerStyle={[styles.titleInputContainer]}
          placeholder={"The earth revolves around the sun"}
          error={
            shouldDisplayError && formErrors.title
              ? `Title must be between ${MIN_TITLE_LENGTH} and ${MAX_TITLE_LENGTH} characters`
              : null
          }
          errorStyle={styles.errorText}
          id="title"
          inputStyle={shouldDisplayError && formErrors.title && styles.error}
          label={documentType === "hypothesis" ? "Hypothesis" : "Title"}
          labelStyle={styles.label}
          onChange={handleOnChangeFields}
          required
        />
        {/* @ts-ignore */}
        <DynamicComponent
          id="text"
          initialData={mutableFormFields.text}
          label={
            documentType === "hypothesis" ? (
              <div>
                <div>Optional: Add a Clarifying Statement</div>
                <p className={css(styles.supportText)}>
                  Is there any clarification or short summary you wish to add to
                  the hypothesis?
                </p>
              </div>
            ) : (
              "Text"
            )
          }
          labelStyle={styles.label}
          onChange={handleOnChangeFields}
          containerStyle={styles.editor}
        />
        <div className={css(styles.buttonsContainer)}>
          <Button
            customButtonStyle={styles.buttonStyle}
            disabled={isSubmitting}
            isWhite={false}
            label={isPost ? "Post" : "Create Meta-Study"}
            onClick={handlePost}
          />
        </div>
      </form>
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(HypothesisSubmitForm);

const styles = StyleSheet.create({
  rootContainer: {
    display: "flex",
    flexDirection: "column",
    background: "#FFFFFF",
    border: "1px solid #DEDEE6",
    borderRadius: "3px",
    padding: "20px 40px 30px 40px",
    "@media only screen and (min-width: 1024px)": {
      minWidth: 720,
    },
    "@media only screen and (max-width: 1209px)": {
      paddingLeft: "5vw",
      paddingRight: "5vw",
    },
  },
  buttonsContainer: {
    width: "auto",
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "30px",
    "@media only screen and (max-width: 767px)": {
      width: "auto",
      justifyContent: "center",
    },
  },
  buttonSpacer: {
    width: "100%",
    maxWidth: "31px",
  },
  chooseHub: {
    width: "100%",
    maxWidth: "468px",
    minHeight: "55px",
    marginBottom: "21px",
  },
  titleInputContainer: {
    width: "auto",
    maxWidth: "851px",
    height: "55px",
    marginBottom: "35px",
  },
  label: {
    fontWeight: 500,
    fontSize: "19px",
    lineHeight: "21px",
  },
  error: {
    border: `1px solid ${colors.RED(1)}`,
  },
  errorText: {
    marginTop: "5px",
  },
  dropDown: {
    zIndex: 999,
  },
  buttonStyle: {
    width: "160px",
    height: "50px",
    "@media only screen and (max-width: 415px)": {
      width: "160px",
      height: "50px",
    },
  },
  editor: {
    width: "721px",
    "@media only screen and (max-width: 900px)": {
      width: "80vw",
    },
  },
  supportText: {
    marginTop: 6,
    opacity: 0.6,
    fontSize: 14,
    letterSpacing: 0.7,
    fontStyle: "italic",
    marginBottom: 6,
  },
});
