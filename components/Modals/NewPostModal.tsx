import { connect } from "react-redux";
import { createNewNote } from "~/config/fetch";
import {
  filterNull,
  isNullOrUndefined,
  silentEmptyFnc,
} from "~/config/utils/nullchecks";
import { NullableString, User } from "~/config/types/root_types";
import { MessageActions } from "~/redux/message";
import { NOTE_GROUPS } from "~/components/Notebook/config/notebookConstants";
import { PostIcon, PaperIcon, HypothesisIcon } from "~/config/themes/icons";
import {
  ReactElement,
  useState,
  SyntheticEvent,
  useEffect,
  useContext,
} from "react";
import { StyleSheet, css } from "aphrodite";
import { useRouter } from "next/router";
import {
  DEFAULT_POST_BUTTON_VALUES,
  NewPostButtonContext,
  NewPostButtonContextType,
  NewPostButtonContextValues,
} from "~/components/contexts/NewPostButtonContext";
import { getIsOnMobileScreenSize } from "~/config/utils/getIsOnMobileScreenSize";
import BaseModal from "./BaseModal";
import Button from "../Form/Button";
import Link from "next/link";
import Modal from "react-modal";
import PaperUploadWizardContainer from "../Paper/UploadWizard/PaperUploadWizardContainer";
import ResearchhubOptionCard from "../ResearchhubOptionCard";
import killswitch from "~/config/killswitch/killswitch";
import AskQuestionForm from "~/components/Question/AskQuestionForm";

export type NewPostModalProps = {
  currentUser: any;
};

export const getModalOptionItems = ({
  currentUser,
  setButtonValues,
}: {
  currentUser: any;
  setButtonValues: (values: NewPostButtonContextValues) => void;
}) => [
  {
    key: "paper_upload",
    header: "Upload a Paper",
    description:
      "Upload a paper that has already been published. Upload it via a link to the journal, or upload the PDF directly.",
    icon: (
      <PaperIcon
        height={40}
        onClick={silentEmptyFnc}
        width={40}
        withAnimation={false}
      />
    ),
  },
  {
    key: "eln",
    header: "Publish a Post",
    description:
      "All posts must be academic in nature. Ideas, theories, and questions to the community are all welcome.",
    onClick: async () => {
      /* @ts-ignore */
      const note = await createNewNote({
        orgSlug: currentUser.organization_slug,
        grouping: NOTE_GROUPS.WORKSPACE,
      });
      /* @ts-ignore */
      router.push(`/${currentUser.organization_slug}/notebook/${note.id}`);
    },
    icon: (
      <PostIcon
        height={40}
        onClick={silentEmptyFnc}
        width={40}
        withAnimation={false}
      />
    ),
  },
  {
    key: "hypothesis",
    header: "Create a Meta-Study",
    description:
      "Aggregate a collection of papers that support a particular scientific theory.",
    route: "/hypothesis/create",
    icon: (
      <HypothesisIcon
        height={40}
        onClick={silentEmptyFnc}
        width={40}
        withAnimation={false}
      />
    ),
  },
  killswitch("bountyQuestion")
    ? {
        key: "question",
        header: "Ask a Question",
        description:
          "All posts must be scientific in nature. Ideas, theories, and questions to the community are all welcome.",
        onClick: (): void => {
          setButtonValues({
            ...DEFAULT_POST_BUTTON_VALUES,
            isOpen: true,
            isQuestionType: true,
          });
        },
        icon: (
          <HypothesisIcon
            height={40}
            onClick={silentEmptyFnc}
            width={40}
            withAnimation={false}
          />
        ),
      }
    : null,
];

function NewPostModal({
  currentUser,
}: NewPostModalProps): ReactElement<typeof Modal> {
  const router = useRouter();
  const { values: buttonValues, setValues: setButtonValues } =
    useContext<NewPostButtonContextType>(NewPostButtonContext);
  const { isOpen, isQuestionType, wizardBodyType } = buttonValues;

  // TODO: calvinhlee - reorganize these context values to better represent currently available post-types
  const [modalSelectedItemIndex, setModalSelectedItemIndex] = useState(0);
  const [bodyType, setBodyType] = useState<NullableString>(
    isQuestionType ? "question" : Boolean(wizardBodyType) ? "paperWizard" : null
  );
  const isMobileScreen = getIsOnMobileScreenSize();
  const shouldModalStayOpen =
    isOpen &&
    (["paperWizard", "question"].includes(bodyType ?? "") || isMobileScreen);
  const modalOptionItems = getModalOptionItems(currentUser);

  useEffect(
    (): void =>
      setBodyType(
        isQuestionType
          ? "question"
          : Boolean(wizardBodyType)
          ? "paperWizard"
          : null
      ),
    [isQuestionType, wizardBodyType]
  );

  const closeModal = (event?: SyntheticEvent): void => {
    event?.preventDefault();
    setModalSelectedItemIndex(0);
    setBodyType(null);
    setButtonValues({ ...DEFAULT_POST_BUTTON_VALUES });
  };

  const handleContinue = (event?: SyntheticEvent): void => {
    event && event.preventDefault();
    if (modalSelectedItemIndex === 0) {
      setButtonValues({
        ...DEFAULT_POST_BUTTON_VALUES,
        isOpen: true,
        wizardBodyType: "url_or_doi_upload",
      });
      setBodyType("paperWizard");
    } else if (modalSelectedItemIndex === 3) {
      setButtonValues({
        ...DEFAULT_POST_BUTTON_VALUES,
        isOpen: true,
        isQuestionType: true,
      });
      setBodyType("question");
    } else {
      closeModal(event);
    }
  };

  const modalOptionCards = filterNull(modalOptionItems).map((option, index) => (
    <ResearchhubOptionCard
      description={option.description}
      header={option.header}
      icon={option.icon}
      isActive={index === modalSelectedItemIndex}
      isCheckboxSquare={false}
      key={index}
      newFeature={option.newFeature}
      onSelect={(e: SyntheticEvent) => {
        e.preventDefault();
        setModalSelectedItemIndex(index);
      }}
    />
  ));

  return (
    <BaseModal
      children={
        bodyType === "question" ? (
          <div className={css(styles.rootContainer)} key="question-wizard">
            <AskQuestionForm documentType="question" onExit={closeModal} />
          </div>
        ) : bodyType === "paperWizard" ? (
          <div className={css(styles.rootContainer)} key="paper-wizard">
            <PaperUploadWizardContainer onExit={closeModal} />
          </div>
        ) : (
          <div className={css(styles.rootContainer)} key="upload-type-selector">
            <img
              alt="Close Button"
              className={css(styles.closeButton)}
              draggable={false}
              onClick={closeModal}
              src={"/static/icons/close.png"}
            />
            <div className={css(styles.titleContainer)}>
              <div className={css(styles.title)}>{"Select your post type"}</div>
            </div>
            <div className={css(styles.list)}>{modalOptionCards}</div>
            <div>
              <Button
                customButtonStyle={styles.buttonCustomStyle}
                customLabelStyle={styles.buttonLabel}
                label={
                  modalOptionItems[modalSelectedItemIndex]?.onClick ? (
                    <div
                      onClick={modalOptionItems[modalSelectedItemIndex]?.onClick}
                      className={css(styles.buttonLabel)}
                    >
                      Continue
                    </div>
                  ) : isNullOrUndefined(
                      modalOptionItems[modalSelectedItemIndex]?.route
                    ) ? (
                    <div className={css(styles.buttonLabel)}>Continue</div>
                  ) : (
                    <Link
                      href={
                        modalOptionItems[modalSelectedItemIndex]?.route ?? ""
                      }
                    >
                      <div className={css(styles.buttonLabel)}>Continue</div>
                    </Link>
                  )
                }
                onClick={handleContinue}
                rippleClass={styles.rippleClass}
              />
            </div>
          </div>
        )
      }
      closeModal={closeModal}
      isOpen={shouldModalStayOpen}
      modalStyle={styles.modalStyle}
      removeDefault={true}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    margin: "31px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    flex: "0 0 auto",
  },
  modalStyle: {
    maxHeight: "95vh",
    "@media only screen and (max-width: 767px)": {
      width: "100%",
    },
  },
  buttonLabel: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  rootContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 40,
    borderRadius: 5,
    transition: "all ease-in-out 0.4s",
    boxSizing: "border-box",
    width: "100%",
    "@media only screen and (max-width: 767px)": {
      overflowY: "auto",
      padding: "40px 10px",
    },
    "@media only screen and (max-width: 415px)": {
      padding: "40px 0px",
    },
  },
  form: {
    width: "100%",
    position: "relative",
  },
  buttonCustomStyle: {
    width: "160px",
    height: "50px",
    "@media only screen and (max-width: 415px)": {
      width: "160px",
      height: "50px",
    },
  },
  rippleClass: {
    width: "100%",
  },
  closeButton: {
    height: "12px",
    width: "12px",
    position: "absolute",
    top: "6px",
    right: "0px",
    padding: "16px",
    cursor: "pointer",
  },
  titleContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
    boxSizing: "border-box",
  },
  title: {
    fontWeight: 500,
    height: "30px",
    width: "100%",
    fontSize: "26px",
    color: "#232038",
    "@media only screen and (max-width: 415px)": {
      fontSize: "24px",
    },
  },
  modalContentStyles: {
    padding: "25px",
    overflowX: "hidden",
    "@media only screen and (max-width: 415px)": {
      padding: "25px",
    },
  },
});

const mapStateToProps = (state) => ({
  currentUser: state.auth.user,
});
const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(NewPostModal);
