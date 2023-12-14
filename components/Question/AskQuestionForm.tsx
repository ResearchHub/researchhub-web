import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/pro-light-svg-icons";
import { breakpoints } from "~/config/themes/screen";
import { connect, useSelector } from "react-redux";
import { createOrUpdatePost } from "./api/createQuestion";
import { firstImageFromHtml } from "~/config/utils/getFirstImageOfHtml";
import { formGenericStyles } from "../Paper/Upload/styles/formGenericStyles";
import { getPlainTextFromMarkdown } from "~/config/utils/getPlainTextFromMarkdown";
import { StyleSheet, css } from "aphrodite";
import { SyntheticEvent, useContext, useEffect, useState } from "react";
import { useEffectFetchSuggestedHubs } from "../Paper/Upload/api/useEffectGetSuggestedHubs";
import { useRouter } from "next/router";
import Button from "../Form/Button";
import colors from "../../config/themes/colors";
import dynamic from "next/dynamic";
import FormInput from "../Form/FormInput";
import FormSelect from "../Form/FormSelect";
import HubSelectDropdown from "../Hubs/HubSelectDropdown";
import { Post } from "../Document/lib/types";
import { ID, parseUser } from "~/config/types/root_types";
import { RootState } from "~/redux";
import { isEmpty } from "~/config/utils/nullchecks";
import useCacheControl from "~/config/hooks/useCacheControl";
import { DocumentContext } from "../Document/lib/DocumentContext";
import { parseHub } from "~/config/types/hub";

const SimpleEditor = dynamic(() => import("../CKEditor/SimpleEditor"));

type FormFields = {
  hubs: any[];
  text: string | TrustedHTML;
  title: string;
};

type FormError = {
  hubs: boolean;
  text: boolean;
  title: boolean;
};

const MIN_TITLE_LENGTH = 10;
const MAX_TITLE_LENGTH = 250;

function validateFormField(fieldID: string, value: any): boolean {
  const result = true;
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

const useCurrentUser = () => {
  const currentUser = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );

  return currentUser;
};

export type AskQuestionFormProps = {
  onExit: (event?: SyntheticEvent) => void;
  user: any;
  post?: Post;
};

function AskQuestionForm({ post, user, onExit }: AskQuestionFormProps) {
  const router = useRouter();
  const [formErrors, setFormErrors] = useState<FormError>({
    hubs: false,
    text: false,
    title: false,
  });
  const [mutableFormFields, setMutableFormFields] = useState<FormFields>({
    hubs: post?.hubs ?? [],
    text: post?.postHtml ?? "",
    title: post?.title ?? "",
  });
  const [shouldDisplayError, setShouldDisplayError] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const currentUser = useCurrentUser();
  const documentContext = useContext(DocumentContext);

  const onFormSubmit = (event: SyntheticEvent): void => {
    event.preventDefault();
    if (Object.values(formErrors).some((el: boolean): boolean => el)) {
      setShouldDisplayError(true);
      return;
    } else {
      setShouldDisplayError(false);
      setIsSubmitting(true);
    }

    createOrUpdatePost({
      payload: {
        postId: post?.id,
        title: mutableFormFields.title,
        textContent: mutableFormFields.text,
        editorContent: mutableFormFields.text,
        hubIds: mutableFormFields.hubs.map((hub) => hub.id as ID),
        postType: "QUESTION",
      },
      currentUser,
      onError: (_err: Error): void => setIsSubmitting(false),
      onSuccess: (response: any): void => {
        if (post?.id) {
          const updatedHubs = (mutableFormFields.hubs || []).map(parseHub);
          const updated = {
            ...post,
            title: response.title,
            postHtml: response.full_markdown,
            hubs: updatedHubs,
          };
          documentContext.updateDocument(updated);
        } else {
          const { id, slug } = response ?? {};
          router.push(`/question/${id}/${slug}`);
        }

        onExit();
      },
    });

    // createQuestion({
    //   payload: {
    //     admins: null,
    //     created_by: user.id,
    //     document_type: "QUESTION",
    //     editors: null,
    //     full_src: mutableFormFields.text,
    //     hubs: mutableFormFields.hubs.map((hub) => hub.id),
    //     is_public: true,
    //     preview_img: firstImageFromHtml(mutableFormFields.text),
    //     renderable_text: getPlainTextFromMarkdown(mutableFormFields.text),
    //     title: mutableFormFields.title,
    //     viewers: null,
    //   },

    //   onError: (_err: Error): void => setIsSubmitting(false),
    //   onSuccess: (response: any): void => {
    //     const { id, slug } = response ?? {};
    //     router.push(`/question/${id}/${slug}`);
    //     onExit();
    //   },
    // });
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
    <form
      autoComplete={"off"}
      className={css(styles.askQuestionForm)}
      id="askQuestionForm"
      onSubmit={onFormSubmit}
    >
      <div className={css(formGenericStyles.text, styles.header)}>
        {post ? "Update Question" : "Ask a Question"}
        <a
          className={css(formGenericStyles.authorGuidelines)}
          style={{ color: colors.BLUE(1) }}
          href="https://www.notion.so/researchhub/Paper-Submission-Guidelines-a2cfa1d9b53c431a91c9816e17f212e1"
          target="_blank"
          rel="noreferrer noopener"
        >
          {"Submission Guidelines"}
        </a>
        <span className={css(styles.close)} onClick={onExit}>
          {<FontAwesomeIcon icon={faX}></FontAwesomeIcon>}
        </span>
      </div>
      <FormInput
        containerStyle={[styles.titleInputContainer]}
        placeholder={"e.g. Are there limits to human knowledge?"}
        error={
          shouldDisplayError && formErrors.title
            ? `Title must be between ${MIN_TITLE_LENGTH} and ${MAX_TITLE_LENGTH} characters`
            : null
        }
        errorStyle={styles.errorText}
        id="title"
        value={mutableFormFields.title}
        inputStyle={shouldDisplayError && formErrors.title && styles.error}
        label={"Title"}
        onChange={handleOnChangeFields}
        required
      />
      {/* @ts-ignore */}
      <div className={css(styles.editorWrapper)}>
        <SimpleEditor
          id="text"
          initialData={mutableFormFields.text}
          label="Additional Details"
          placeholder={
            "Include all the information someone would need to answer your question. Be specific about what you need."
          }
          text={mutableFormFields.title}
          onChange={handleOnChangeFields}
          containerStyle={styles.editor}
          required
        />
      </div>
      <HubSelectDropdown
        selectedHubs={mutableFormFields.hubs}
        required
        onChange={(hubs) => {
          handleOnChangeFields("hubs", hubs);
        }}
      />
      <div className={css(styles.buttonsContainer)}>
        <Button
          fullWidth
          customButtonStyle={styles.buttonStyle}
          disabled={isSubmitting}
          label={post ? "Update" : "Ask Question"}
          type="submit"
        />
      </div>
    </form>
  );
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(AskQuestionForm);

const styles = StyleSheet.create({
  askQuestionForm: {
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    background: "#FFFFFF",
  },
  close: {
    position: "absolute",
    padding: "16px",
    cursor: "pointer",
    fontSize: 16,
    color: colors.BLACK(0.5),
    top: -32,
    right: -14,
  },
  header: {
    alignItems: "center",
    borderBottom: `1px solid ${colors.GREY_BORDER}`,
    display: "flex",
    fontSize: 26,
    fontWeight: 500,
    justifyContent: "space-between",
    paddingBottom: 8,
    paddingTop: 20,
    position: "relative",
    width: "100%",
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      fontSize: 22,
    },
  },
  buttonsContainer: {
    width: 200,
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "30px",
    marginLeft: "auto",
    "@media only screen and (max-width: 767px)": {
      width: "100%",
      justifyContent: "center",
    },
  },
  buttonSpacer: {
    width: "100%",
    maxWidth: "31px",
  },
  chooseHub: {
    width: "100%",
    minHeight: "55px",
    marginBottom: "21px",
  },
  titleInputContainer: {
    width: "auto",
    maxWidth: "851px",
    height: "55px",
    marginBottom: "35px",
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
    height: "50px",
  },
  editorWrapper: {
    width: "721px",
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      width: "80vw",
    },
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      width: "86vw",
    },
  },
  editor: {
    width: "100%",
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
