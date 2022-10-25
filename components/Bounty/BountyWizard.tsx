import {
  ReactElement,
  useState,
  useEffect,
  useRef,
  SyntheticEvent,
} from "react";
import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import ProgressBar from "@ramonak/react-progress-bar";

import { getCurrentUser } from "~/config/utils/getCurrentUser";
import { MessageActions } from "~/redux/message";
import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";
import Button from "../Form/Button";
import SimplePostEditor from "../Form/SimplePostEditor";
import icons from "~/config/themes/icons";
import BountyWizardRSCForm from "./BountyWizardRSCForm";
import { useRouter } from "next/router";

type BountyChoiceProps = {
  icon: string;
  title: string;
  text: string;
  active?: boolean;
  onClick: () => void;
};
const numSteps = 3;

function BountyChoice({
  icon,
  title,
  text,
  active,
  onClick,
}: BountyChoiceProps): ReactElement {
  return (
    <div
      className={css(
        choiceStyles.choiceContainer,
        active && choiceStyles.active
      )}
      onClick={onClick}
    >
      <div className={css(choiceStyles.icon)}>
        <img
          src={`/static/bounty-wizard/${icon}`}
          className={css(choiceStyles.iconImage)}
        ></img>
      </div>
      <h3 className={css(choiceStyles.title)}>{title}</h3>
      <p className={css(choiceStyles.text)}>{text}</p>
    </div>
  );
}

const choiceStyles = StyleSheet.create({
  choiceContainer: {
    height: 128,
    padding: 16,
    border: "1.5px solid #E9EAEF",
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    cursor: "pointer",

    ":hover": {
      borderColor: colors.BLUE(1),
    },
  },
  active: {
    borderColor: colors.BLUE(1),
  },
  icon: {
    width: 32,
  },
  iconImage: {
    width: "100%",
    objectFit: "contain",
  },
  title: { fontWeight: 500, fontSize: 18, textAlign: "center", marginTop: 10 },
  text: {
    color: "#7C7989",
    textAlign: "center",
    fontSize: 14,
    marginBottom: 0,
  },
});

type Props = {
  onSuccess: () => void;
};

function BountyWizard({ onSuccess }: Props): ReactElement {
  const [step, setStep] = useState(1);
  const [active, setActive] = useState("");
  const [post, setPost] = useState();
  const router = useRouter();

  const CHOICES = [
    {
      id: "question",
      title: "Answer to a question",
      text: "Get an answer to your question with references",
      icon: "answer-a-question.png",
    },
    {
      id: "metastudy",
      title: "Meta-Study",
      text: "Get a page created for a meta-study",
      icon: "meta-study.png",
    },
    {
      id: "something-else",
      title: "Something else",
      text: "Any other bounty you wish to create",
      icon: "something-else.png",
    },
  ];

  function renderSection() {
    switch (step) {
      case 1:
        return (
          <>
            <div className={css(styles.bountySelectSection)}>
              <h2 className={css(styles.subTitle)}>
                What are you looking for?
              </h2>
            </div>
            <div className={css(styles.choicesGrid)}>
              {CHOICES.map((choice) => {
                return (
                  <BountyChoice
                    {...choice}
                    onClick={() => {
                      setActive(choice.id);
                    }}
                    active={choice.id === active}
                  />
                );
              })}
            </div>
          </>
        );
      case 2:
        return (
          <>
            <SimplePostEditor
              documentType="BOUNTY"
              bountyType={active}
              onSuccess={(post) => {
                setPost(post);
                setStep(step + 1);
              }}
              otherButtons={
                <div
                  className={css(styles.previousStep)}
                  onClick={() => {
                    setStep(step - 1);
                  }}
                >
                  {icons.chevronLeft} <span>Previous Step</span>
                </div>
              }
              label={"Bounty Title"}
              buttonLabel={"Next"}
            />
          </>
        );
      case 3:
        return (
          <BountyWizardRSCForm
            addBtnLabel="Create Bounty"
            isOriginalPoster={true}
            postId={post?.id}
            unifiedDocId={post?.unified_document_id}
            postSlug={post?.slug}
            handleBountyAdded={(bounty) => {
              const { id, slug } = post;
              const route = `/post/${id}/${slug}`;
              onSuccess && onSuccess();
              router.push(route);
            }}
            // otherButtons={
            //   <div
            //     className={css(styles.previousStep)}
            //     onClick={() => {
            //       setStep(step - 1);
            //     }}
            //   >
            //     {icons.chevronLeft} <span>Previous Step</span>
            //   </div>
            // }
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className={css(styles.container)}>
      <div className={css(styles.titleContainer)}>
        <h1 className={css(styles.title)}>Create a new Bounty</h1>
        <span className={css(styles.numStepsContainer)}>
          {step} / {numSteps}
        </span>
      </div>
      <ProgressBar
        bgColor={colors.GREEN(1)}
        baseBgColor={colors.LIGHT_GREY(1)}
        className={css(styles.progressBar)}
        completed={(step / numSteps) * 100}
        height="4px"
        customLabel=" "
      />
      {renderSection()}
      {step === 1 && (
        <div className={css(styles.buttonRow)}>
          <Button
            label={"Next"}
            hideRipples={true}
            onClick={() => setStep(step + 1)}
          />
        </div>
      )}
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    background: "#FFFFFF",
    "@media only screen and (min-width: 1024px)": {
      minWidth: 800,
      padding: 40,
    },
    "@media only screen and (max-width: 1209px)": {
      paddingLeft: "5vw",
      paddingRight: "5vw",
    },
  },
  progressBar: { width: "100%" },
  title: {
    alignItems: "center",
    display: "flex",
    fontSize: 26,
    fontWeight: 500,
    justifyContent: "space-between",
    position: "relative",
    marginBottom: 0,
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      fontSize: 18,
    },
  },
  bountySelectSection: {
    marginTop: 38,
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    flex: 1,
    marginBottom: 20,
  },
  numStepsContainer: {
    marginLeft: "auto",
    background: "#F2FBF3",
    color: "#7C7989",
    fontWeight: 500,
    fontSize: 14,
    padding: "4px 10px",
  },
  subTitle: {
    fontWeight: 500,
    fontSize: 18,
    marginTop: 0,
    marginBottom: 16,
  },
  choicesGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 16,
  },
  buttonRow: {
    marginLeft: "auto",
    marginTop: 32,
  },
  previousStep: {
    color: colors.NEW_BLUE(1),
    cursor: "pointer",
    marginRight: "auto",
  },
});

const mapDispatchToProps = {
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};

export default connect(null, mapDispatchToProps)(BountyWizard);
