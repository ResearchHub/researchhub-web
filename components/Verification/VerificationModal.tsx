import { useState } from "react";
import { faAngleLeft } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IconButton from "../Icons/IconButton";
import BaseModal from "../Modals/BaseModal";
import { css, StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";
import { PaperIcon } from "~/config/themes/icons";
import CheckBox from "../Form/CheckBox";
import OrcidConnectButton from "../OrcidConnectButton";

interface Option {
  value: "LINKEDIN" | "ORCID" | null;
  title: string;
  description: string;
}

const serverProfileOptions: ProfileOption[] = [
  {
    profileId: "123",
    name: "John Doe",
    institution: "George Washington University",
    hIndex: 5,
    papers: [
      {
        paperId: "p123",
        title: "A paper",
        authors: ["John Doe", "Jane Doe"],
      },
    ],
  },
  {
    profileId: "1234",
    name: "John Doe",
    institution: "Georgetown University",
    hIndex: 3,
    papers: [
      {
        paperId: "p1234",
        title: "A paper",
        authors: ["John Doe", "Jane Doe"],
      },
    ],
  },
];

interface ProfileOption {
  profileId: string;
  name: string;
  institution: string;
  hIndex: number;
  papers: PublishedPaper[];
}

interface PublishedPaper {
  paperId: string;
  title: string;
  authors: string[];
}

const VerificationFormSelectProviderStep = ({ onProviderSelect }) => {
  return (
    <div>
      <div className={css(formStyles.title)}>Become a Verified Author</div>
      <p className={css(formStyles.description)}>
        Verify your authorship to get access to the best ResearchHub has to
        offer.
      </p>

      <div>
        <div className={css(formStyles.option)}>
          <OrcidConnectButton
            onSuccess={(data) => {
              console.log("success", data);
            }}
            onFailure={(data) => {
              console.log("failure", data);
            }}
          >
            <>
              <div className={css(formStyles.optionValue)}>Orcid</div>
              <div className={css(formStyles.optionDescription)}>
                Verify your authorship with Orcid (A few minutes)
              </div>
            </>
          </OrcidConnectButton>
        </div>

        <div className={css(formStyles.option)}>
          <div className={css(formStyles.optionValue)}>LinkedIn</div>
          <div className={css(formStyles.optionDescription)}>
            Verify your authorship with LinkedIn (A few minutes)
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProfileStepProps {
  profileOptions: ProfileOption[];
  selectedProfileId: string | null;
  onProfileSelect: (profileId: string) => void;
  setStep: (step: "PROVIDER_STEP" | "PROFILE_STEP") => void;
}

const VerificationFormSelectProfileStep = ({
  onProfileSelect,
  setStep,
  selectedProfileId,
  profileOptions,
}: ProfileStepProps) => {
  return (
    <div>
      <div className={css(profileStepStyles.title)}>Select Profile</div>
      <p className={css(profileStepStyles.description)}>
        Select the profile associated with yourself.
      </p>
      <div className={css(styles.prevActionWrapper)}>
        <IconButton onClick={() => setStep("PROVIDER_STEP")}>
          <FontAwesomeIcon icon={faAngleLeft} color={colors.MEDIUM_GREY()} />
          Back
        </IconButton>
      </div>

      {profileOptions.map((profile, index) => {
        return (
          <div
            className={css(profileStepStyles.profile)}
            key={`profile-${profile.profileId}`}
            onClick={() => onProfileSelect(profile.profileId)}
          >
            {/* @ts-ignore */}
            <CheckBox
              isSquare={true}
              active={profile.profileId === selectedProfileId}
            />
            <div className={css(profileStepStyles.name)}>{profile.name}</div>
            <div className={css(profileStepStyles.institution)}>
              {profile.institution}
            </div>
            <div className={css(profileStepStyles.metadata)}>
              <div className={css(profileStepStyles.metadataKey)}>H Index:</div>
              <div className={css(profileStepStyles.metadataValue)}>
                {profile.hIndex}
              </div>
            </div>
            {profile.papers.map((paper, index) => {
              return (
                <div className={css(profileStepStyles.paper)}>
                  <div className={css(profileStepStyles.paperTitle)}>
                    <PaperIcon withAnimation={false} onClick={undefined} />
                    {paper.title}
                  </div>
                  <div className={css(profileStepStyles.paperAuthors)}>
                    {paper.authors.join(", ")}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

interface VerificationFormProps {
  onProfileSelect?: (profileId: string) => void;
  onStepSelect?: (step: "PROVIDER_STEP" | "PROFILE_STEP") => void;
}

const VerificationForm = ({
  onProfileSelect,
  onStepSelect,
}: VerificationFormProps) => {
  const [step, setStep] = useState<"PROVIDER_STEP" | "PROFILE_STEP">(
    "PROVIDER_STEP"
  );
  const [selectedVerificationProvider, setSelectedVerificationProvider] =
    useState<null | "LINKEDIN" | "ORCID">(null);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [profileOptions, setProfileOptions] =
    useState<ProfileOption[]>(serverProfileOptions);

  return (
    <div>
      {step === "PROVIDER_STEP" && (
        <VerificationFormSelectProviderStep
          onProviderSelect={(provider) => {
            setSelectedVerificationProvider(provider);
            setStep("PROFILE_STEP");
            onStepSelect && onStepSelect("PROFILE_STEP");
          }}
        />
      )}
      {step === "PROFILE_STEP" && (
        <VerificationFormSelectProfileStep
          setStep={setStep}
          selectedProfileId={selectedProfileId}
          profileOptions={profileOptions}
          onProfileSelect={(profileId) => {
            setSelectedProfileId(profileId);
            onProfileSelect && onProfileSelect(profileId);
          }}
        />
      )}
    </div>
  );
};

const profileStepStyles = StyleSheet.create({});

const formStyles = StyleSheet.create({
  option: {
    border: "1px solid #E9EAEF",
    borderRadius: "8px",
    height: 76,
    boxSizing: "border-box",
    width: "100%",
    padding: 15,
    cursor: "pointer",
    ":hover": {
      border: `1px solid ${colors.NEW_BLUE()}`,
    },
  },
  optionValue: {
    fontWeight: 500,
  },
  optionDescription: {},
  title: {},
  description: {},
});

const VerificationModal = ({ isModalOpen = true, handleModalClose }) => {
  return (
    <BaseModal
      offset={"0px"}
      isOpen={isModalOpen}
      hideClose={false}
      closeModal={handleModalClose}
      zIndex={1000000001}
      // titleStyle={styles.modalTitleStyleOverride}
      modalContentStyle={styles.modalContentStyle}
      // title={step === "PROVIDER_STEP" ? "Become a Verified Author" : "Select Profile" }
    >
      <div className={css(styles.formWrapper)}>
        <VerificationForm />
      </div>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  formWrapper: {
    width: 500,
  },
  modalTitleStyleOverride: {},
  modalContentStyle: {},
  prevActionWrapper: {
    position: "absolute",
    top: 12,
    left: 10,
  },
});

export default VerificationModal;
