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
import icons, {
  PostIcon,
  PaperIcon,
  HypothesisIcon,
  QuestionIcon,
  RSCIcon,
} from "~/config/themes/icons";
import {
  ReactElement,
  useState,
  SyntheticEvent,
  useEffect,
  useContext,
} from "react";
import { StyleSheet, css } from "aphrodite";
import { NextRouter, useRouter } from "next/router";
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
import AskQuestionForm from "~/components/Question/AskQuestionForm";
import colors from "~/config/themes/colors";
import BountyWizard from "../Bounty/BountyWizard";
import { breakpoints } from "~/config/themes/screen";

export type NewPostModalProps = {
  currentUser: any;
};

export const getModalOptionItems = ({
  currentUser,
  router,
  setButtonValues,
}: {
  currentUser: any;
  router: NextRouter;
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
        color={`#aeaeae`}
        withAnimation={false}
      />
    ),
  },
  {
    key: "bounty",
    header: (
      <div className={css(styles.header)}>
        <span>Start a Bounty</span>
        <span className={css(styles.new)}>
          <span className={css(styles.fireIcon)}>{icons.fire}</span>
          <span className={css(styles.newText)}>New</span>
        </span>
      </div>
    ),
    onClick: (): void => {
      setButtonValues({
        ...DEFAULT_POST_BUTTON_VALUES,
        isOpen: true,
        type: "bounty",
      });
    },
    description:
      "Offer ResearchCoin in exchange for work or knowledge. Must be science related.",
    icon: <RSCIcon onClick={silentEmptyFnc} />,
  },

  {
    key: "question",
    header: (
      <div className={css(styles.header)}>
        <span>Ask a Question</span>
      </div>
    ),
    description:
      "Ask a science related question. Add a bounty to incentivize quality submissions.",
    onClick: (): void => {
      setButtonValues({
        ...DEFAULT_POST_BUTTON_VALUES,
        isOpen: true,
        isQuestionType: true,
      });
    },
    icon: (
      <QuestionIcon
        color={`#aeaeae`}
        onClick={silentEmptyFnc}
        withAnimation={false}
        size={40}
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
      const note: any = await createNewNote({
        orgSlug: currentUser.organization_slug,
        grouping: NOTE_GROUPS.WORKSPACE,
      });
      router.push(
        `/${currentUser.organization_slug}/notebook/${note?.id ?? ""}`
      );
    },
    icon: (
      <PostIcon
        height={40}
        onClick={silentEmptyFnc}
        width={40}
        color={`#aeaeae`}
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
        color={`#aeaeae`}
        withAnimation={false}
      />
    ),
  },
];

function NewPostModal({
  currentUser,
}: NewPostModalProps): ReactElement<typeof Modal> {
  const router = useRouter();
  const { values: buttonValues, setValues: setButtonValues } =
    useContext<NewPostButtonContextType>(NewPostButtonContext);
  const { isOpen, isQuestionType, wizardBodyType, type } = buttonValues;

  // TODO: calvinhlee - reorganize these context values to better represent currently available post-types
  const [modalSelectedItemIndex, setModalSelectedItemIndex] = useState(0);
  const [bodyType, setBodyType] = useState<NullableString>(
    isQuestionType ? "question" : Boolean(wizardBodyType) ? "paperWizard" : type
  );
  const isMobileScreen = getIsOnMobileScreenSize();
  const shouldModalStayOpen =
    isOpen &&
    (["paperWizard", "question", "bounty"].includes(bodyType ?? "") ||
      isMobileScreen);
  const modalOptionItems = getModalOptionItems({
    currentUser,
    router,
    setButtonValues,
  });

  useEffect((): void => {
    setBodyType(
      isQuestionType
        ? "question"
        : Boolean(wizardBodyType)
        ? "paperWizard"
        : type
    );
  }, [isQuestionType, wizardBodyType, type]);

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
    } else if ([1, 2].includes(modalSelectedItemIndex)) {
      return;
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
        bodyType === "bounty" ? (
          <BountyWizard onSuccess={closeModal} />
        ) : bodyType === "question" ? (
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
            <div className={css(styles.postOptionslist)}>
              {modalOptionCards}
            </div>
            <div style={{ margin: "0 auto" }}>
              <Button
                customButtonStyle={styles.buttonCustomStyle}
                customLabelStyle={styles.buttonLabel}
                label={
                  modalOptionItems[modalSelectedItemIndex]?.onClick ? (
                    <div
                      onClick={
                        modalOptionItems[modalSelectedItemIndex]?.onClick
                      }
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
                      legacyBehavior>
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
      modalContentStyle={styles.modalContentStyle}
      removeDefault={true}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
  new: {
    fontSize: 15,
    color: colors.ORANGE_DARK2(),
  },
  newText: {},
  fireIcon: {
    marginRight: 4,
  },
  postOptionslist: {
    display: "flex",
    flex: "0 0 auto",
    flexDirection: "column",
    justifyContent: "flex-start",
    margin: 32,
    maxHeight: "100%",
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      maxHeight: "600px",
      overflowX: "scroll",
      margin: "12px 0px",
    },
  },
  modalStyle: {
    maxHeight: "95vh",
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      maxHeight: "100vh",
      top: "none",
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      maxHeight: "100vh",
      top: "none",
    },
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      minHeight: "100vh",
      top: -68,
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
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      overflowY: "auto",
    },
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      alignItems: "flex-start",
      overflowY: "hidden",
      padding: "40px 8px",
    },
  },
  form: {
    width: "100%",
    position: "relative",
  },
  buttonCustomStyle: {
    width: "160px",
    height: "50px",
    marginLeft: "unset",
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
    alignItems: "center",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    marginLeft: "unset",
    textAlign: "center",
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
  modalContentStyle: {
    position: "static",
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      // position: "fixed",
      // top: 0,
      width: "100%",
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
