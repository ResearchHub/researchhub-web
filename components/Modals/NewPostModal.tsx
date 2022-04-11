import { connect } from "react-redux";
import { createNewNote } from "~/config/fetch";
import {
  filterNull,
  isNullOrUndefined,
  silentEmptyFnc,
} from "~/config/utils/nullchecks";
import { NullableString } from "~/config/types/root_types";
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
import BaseModal from "./BaseModal";
import Button from "../Form/Button";
import Link from "next/link";
import Modal from "react-modal";
import PaperUploadWizardContainer from "../Paper/UploadWizard/PaperUploadWizardContainer";
import ResearchhubOptionCard from "../ResearchhubOptionCard";
import {
  DEFAULT_POST_BUTTON_VALUES,
  NewPostButtonContext,
  NewPostButtonContextType,
} from "~/components/contexts/NewPostButtonContext";

export type NewPostModalProps = {
  currentUser: any;
};

function NewPostModal({
  currentUser,
}: NewPostModalProps): ReactElement<typeof Modal> {
  const router = useRouter();
  const { values: buttonValues, setValues: setButtonValues } =
    useContext<NewPostButtonContextType>(NewPostButtonContext);
  const { isOpen, wizardBodyType } = buttonValues;
  const [selected, setSelected] = useState(0);
  const [bodyType, setBodyType] = useState<NullableString>(
    Boolean(wizardBodyType) ? "paperWizard" : null
  );

  useEffect(
    (): void => setBodyType(Boolean(wizardBodyType) ? "paperWizard" : null),
    [wizardBodyType]
  );

  const closeModal = (event?: SyntheticEvent): void => {
    event && event.preventDefault();
    setSelected(0);
    setBodyType(null);
    setButtonValues({ ...DEFAULT_POST_BUTTON_VALUES });
  };

  const handleContinue = (event?: SyntheticEvent): void => {
    event && event.preventDefault();
    if (selected === 0) {
      setBodyType("paperWizard");
    } else {
      closeModal(event);
    }
  };

  const items = [
    {
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
      newFeature: true,
    },
    {
      header: "Propose a Hypothesis",
      description:
        "Propose an explanation to an observation and back it up by citing relevant academic papers.",
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
  ];
  return (
    <BaseModal
      children={
        bodyType === "paperWizard" ? (
          <div className={css(styles.rootContainer)} key="paper-wizard">
            <PaperUploadWizardContainer onExit={(): void => closeModal()} />
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
            <div className={css(styles.list)}>
              {filterNull(items).map((option, index) => (
                <ResearchhubOptionCard
                  description={option.description}
                  header={option.header}
                  icon={option.icon}
                  isActive={index === selected}
                  isCheckboxSquare={false}
                  key={index}
                  newFeature={option.newFeature}
                  onSelect={(e: SyntheticEvent) => {
                    e.preventDefault();
                    setSelected(index);
                  }}
                />
              ))}
            </div>
            <div>
              <Button
                customButtonStyle={styles.buttonCustomStyle}
                customLabelStyle={styles.buttonLabel}
                label={
                  items[selected].onClick ? (
                    <div
                      onClick={items[selected].onClick}
                      className={css(styles.buttonLabel)}
                    >
                      Continue
                    </div>
                  ) : isNullOrUndefined(items[selected]?.route) ? (
                    <div className={css(styles.buttonLabel)}>Continue</div>
                  ) : (
                    <Link href={items[selected]?.route ?? ""}>
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
      isOpen={isOpen}
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
