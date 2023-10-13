import { useEffect, useState } from "react";
import { faAngleLeft } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IconButton from "../Icons/IconButton";
import BaseModal from "../Modals/BaseModal";
import { css, StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";
import { PaperIcon } from "~/config/themes/icons";
import CheckBox from "../Form/CheckBox";
import OrcidConnectButton from "../OrcidConnectButton";
import API, { generateApiUrl } from "~/config/api";
import helpers from "~/config/api/helpers";
import { captureEvent } from "~/config/utils/events";
import { formatDateStandard } from "~/config/utils/dates";
import { faAngleDown, faAngleUp } from "@fortawesome/pro-light-svg-icons";
import Button from "../Form/Button";
import LinkedInButton from "~/components/LinkedInButton";
import FormInput from "../Form/FormInput";
import debounce from "lodash/debounce";
import Image from "next/image";

interface Option {
  value: "LINKEDIN" | "ORCID" | null;
  title: string;
  description: string;
}

const fetchOpenAlexProfiles = async ({
  requestType,
  name,
}: {
  requestType: "ORCID" | "NAME";
  name?: string;
}): Promise<any[]> => {
  const url = generateApiUrl(`user_verification/get_openalex_author_profiles`);

  return fetch(url, API.POST_CONFIG({ request_type: requestType, name }))
    .then(async (res) => {
      const parsed = await helpers.parseJSON(res);
      if (Array.isArray(parsed)) {
        return parsed;
      } else {
        return [parsed];
      }
    })
    .catch((error) => {
      captureEvent({
        error,
        msg: "[VERIFICATION] Failed to fetch openalex profiles",
        data: { requestType },
      });
      throw error;
    });
};

const completeProfileVerification = async ({ openAlexProfileId }) => {
  const url = generateApiUrl(`user/verify_user`);

  return fetch(url, API.POST_CONFIG({ id: openAlexProfileId }))
    .then((res): any => helpers.parseJSON(res))
    .catch((error) => {
      captureEvent({
        error,
        msg: "[VERIFICATION] Failed to verify profile",
        data: { openAlexProfileId },
      });
    });
};

interface OpenAlexProfile {
  id: string;
  displayName: string;
  institution: OpenAlexInstitution | null;
  summaryStats: OpenAlexSummaryStats;
  works: OpenAlexWork[];
}

interface OpenAlexInstitution {
  displayName: string;
  id: string;
  countryCode: string;
}

interface OpenAlexConcept {
  displayName: string;
  level: number;
  relevancyScore: number;
}

interface OpenAlexWork {
  id: string;
  title: string;
  publishedDate: string;
  authors: string[];
  concepts: OpenAlexConcept[];
}

interface OpenAlexSummaryStats {
  hIndex: number;
  i10Index: number;
}

const parseOpenAlexSummaryStats = (raw: any): OpenAlexSummaryStats => {
  return {
    hIndex: raw.h_index,
    i10Index: raw.i10_index,
  };
};

const parseOpenAlexInstitution = (raw: any): OpenAlexInstitution => {
  return {
    id: raw.id,
    displayName: raw.display_name,
    countryCode: raw.country_code,
  };
};

const parseOpenAlexConcept = (raw: any): OpenAlexConcept => {
  return {
    displayName: raw.display_name,
    level: raw.level,
    relevancyScore: raw.score,
  };
};

const parseOpenAlexWork = (raw: any): OpenAlexWork => {
  return {
    title: raw.title,
    id: raw.id,
    publishedDate: formatDateStandard(raw.publication_date, "MMM D, YYYY"),
    authors: raw.authorships.map(
      (authorship) => authorship.author.display_name
    ),
    concepts: raw.concepts.map((concept) => parseOpenAlexConcept(concept)),
  };
};

const parseOpenAlexProfile = (raw: any): OpenAlexProfile => {
  console.log("raw", raw);
  return {
    id: raw.id,
    displayName: raw.display_name,
    institution:
      raw.last_known_institution &&
      parseOpenAlexInstitution(raw.last_known_institution),
    summaryStats: parseOpenAlexSummaryStats(raw.summary_stats),
    works: raw.works.map((work) => parseOpenAlexWork(work)),
  };
};

const VerificationFormSuccessStep = ({}) => {
  return <div>Success!</div>;
};

const VerificationFormSelectProviderStep = ({
  onProviderConnectSuccess,
  onProviderConnectFailure,
}) => {
  return (
    <div>
      <div className={css(formStyles.title)}>Become a Verified Author</div>
      <p className={css(formStyles.description)}>
        Verify your authorship to get access to the best ResearchHub has to
        offer.
      </p>

      <div className={css(formStyles.chooseVerificationTitle)}>Choose a verification method:</div>
      <div className={css(formStyles.verificationOptions)}>
        <div className={css(formStyles.option)}>
          <Image
            src="/static/logos/orcid.png"
            width={22}
            height={22}
            alt="Orcid"
            style={{ marginTop: 0 }}
          />
          <OrcidConnectButton
            onSuccess={(data) => {
              onProviderConnectSuccess(data);
            }}
            onFailure={(data) => {
              onProviderConnectFailure();
            }}
          >
            <>
              <div className={css(formStyles.optionValue)}>Orcid</div>
              <div className={css(formStyles.optionDescription)}>
                Verify authorship instantly with Orcid
              </div>
            </>
          </OrcidConnectButton>
        </div>

        <div className={css(formStyles.option)}>
          <Image
            src="/static/logos/linkedin.png"
            width={22}
            height={22}
            alt="Linkedin"
            style={{ marginTop: -2 }}
          />          
          <LinkedInButton
            onSuccess={(data) => {
              onProviderConnectSuccess(data);
            }}
            onFailure={(data) => {
              onProviderConnectFailure();
            }}
          >
            <div className={css(formStyles.optionValue)}>LinkedIn</div>
            <div className={css(formStyles.optionDescription)}>
              Verify authorship instantly with LinkedIn
            </div>
          </LinkedInButton>
        </div>
      </div>

      <div className={css(formStyles.whyVerifyWrapper)}>
        <div className={css(formStyles.whyVerify)}>
          <div className={css(formStyles.whyVerifyTitle)}>Why should you verify your authorship:</div>
          <ul className={css(formStyles.whyVerifyList)}>
            <li className={css(formStyles.whyVerifyItem)}>Auto-import your papers and academic data into ResearchHub</li>
            <li className={css(formStyles.whyVerifyItem)}>Earn ResearchCoin on your papers</li>
            <li className={css(formStyles.whyVerifyItem)}>Improve your academic reputation on the platform</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

interface ProfileStepProps {
  onPrevClick: () => void;
  onVerificationComplete: () => void;
  providerDataResponse: any;
}

const VerificationFormSelectProfileStep = ({
  onPrevClick,
  onVerificationComplete,
  providerDataResponse,
}: ProfileStepProps) => {
  const [showWorksForAuthors, setShowWorksForAuthors] = useState<string[]>([]);
  const [profileOptions, setProfileOptions] = useState<OpenAlexProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
    null
  );
  const requestType =
    providerDataResponse.provider === "ORCID" ? "ORCID" : "NAME";

  const toggleAuthorWorksVisibility = (profileId) => {
    if (showWorksForAuthors.includes(profileId)) {
      setShowWorksForAuthors(
        showWorksForAuthors.filter((id) => id !== profileId)
      );
    } else {
      setShowWorksForAuthors([...showWorksForAuthors, profileId]);
    }
  };

  const completeVerification = async () => {
    await completeProfileVerification({ openAlexProfileId: selectedProfileId });
    onVerificationComplete();
  };

  const debounceFetchProfiles = debounce(async (name) => {
    if (name.length > 5) {
      const rawProfiles = await fetchOpenAlexProfiles({
        requestType,
        name: providerDataResponse.name,
      });
      const profiles = rawProfiles.map((p) => parseOpenAlexProfile(p));
      setProfileOptions(profiles);
    }
  }, 1500);

  useEffect(() => {
    (async () => {
      const rawProfiles = await fetchOpenAlexProfiles({
        requestType,
        name: providerDataResponse.name,
      });
      const profiles = rawProfiles.map((p) => parseOpenAlexProfile(p));
      setProfileOptions(profiles);
    })();
  }, []);

  return (
    <div>
      <div className={css(profileStepStyles.title)}>Select Profile</div>
      <p className={css(profileStepStyles.description)}>
        Select the profile associated with yourself.
      </p>
      <div className={css(styles.prevActionWrapper)}>
        <IconButton onClick={onPrevClick}>
          <FontAwesomeIcon icon={faAngleLeft} color={colors.MEDIUM_GREY()} />
          Back
        </IconButton>
      </div>

      {providerDataResponse.provider === "LINKED" && (
        <FormInput
          value={providerDataResponse?.name || ""}
          onChange={(name, value) => debounceFetchProfiles(value)}
        />
      )}
      {profileOptions.map((profile, index) => {
        return (
          <div
            className={css(profileStepStyles.profile)}
            key={`profile-${profile.id}`}
          >
            <div
              onClick={() =>
                profile.id === selectedProfileId
                  ? setSelectedProfileId(null)
                  : setSelectedProfileId(profile.id)
              }
            >
              {/* @ts-ignore */}
              <CheckBox
                isSquare={true}
                active={profile.id === selectedProfileId}
              />
            </div>
            <div className={css(profileStepStyles.name)}>
              {profile.displayName}
            </div>
            {profile.institution && (
              <div className={css(profileStepStyles.institution)}>
                {profile.institution.displayName}
              </div>
            )}
            {(profile.summaryStats.hIndex > 0 ||
              profile.summaryStats.i10Index > 0) && (
              <div className={css(profileStepStyles.metadata)}>
                {profile.summaryStats.hIndex > 0 && (
                  <div className={css(profileStepStyles.metadataItem)}>
                    <div className={css(profileStepStyles.metadataKey)}>
                      h Index:
                    </div>
                    <div className={css(profileStepStyles.metadataValue)}>
                      {String(profile.summaryStats.hIndex)}
                    </div>
                  </div>
                )}
                {profile.summaryStats.i10Index > 0 && (
                  <div className={css(profileStepStyles.metadataItem)}>
                    <div className={css(profileStepStyles.metadataKey)}>
                      i10 Index:
                    </div>
                    <div className={css(profileStepStyles.metadataValue)}>
                      {String(profile.summaryStats.i10Index)}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <div onClick={() => toggleAuthorWorksVisibility(profile.id)}>
                {profile.works.length}Published papers
                <FontAwesomeIcon
                  icon={
                    showWorksForAuthors.includes(profile.id)
                      ? faAngleUp
                      : faAngleDown
                  }
                />
              </div>
              <div
                className={css(
                  profileStepStyles.worksWrapper,
                  showWorksForAuthors.includes(profile.id) &&
                    profileStepStyles.worksWrapperActive
                )}
              >
                {profile.works.map((work, index) => {
                  return (
                    <div className={css(profileStepStyles.paper)}>
                      <div className={css(profileStepStyles.paperTitle)}>
                        <PaperIcon withAnimation={false} onClick={undefined} />
                        {work.title}
                      </div>
                      <div className={css(profileStepStyles.paperAuthors)}>
                        {work.authors.join(", ")}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}

      <Button onClick={completeVerification} disabled={!selectedProfileId}>
        Complete Verification
      </Button>
    </div>
  );
};

interface VerificationFormProps {
  onProfileSelect?: (profileId: string | null) => void;
  onStepSelect?: (step: "PROVIDER_STEP" | "PROFILE_STEP") => void;
}

const VerificationForm = ({ onStepSelect }: VerificationFormProps) => {
  const [step, setStep] = useState<
    "PROVIDER_STEP" | "PROFILE_STEP" | "SUCCESS_STEP" | "FAILURE_STEP"
  >("PROVIDER_STEP");

  const [providerDataResponse, setProviderDataResponse] = useState<any | null>(
    null
  );

  return (
    <div>
      {step === "PROVIDER_STEP" && (
        <VerificationFormSelectProviderStep
          onProviderConnectSuccess={(data) => {
            setProviderDataResponse(data);
            setStep("PROFILE_STEP");
            onStepSelect && onStepSelect("PROFILE_STEP");
          }}
          onProviderConnectFailure={() => {
            console.log("failure to connect");
          }}
        />
      )}
      {step === "PROFILE_STEP" && providerDataResponse && (
        <VerificationFormSelectProfileStep
          onPrevClick={() => setStep("PROVIDER_STEP")}
          providerDataResponse={providerDataResponse}
          onVerificationComplete={() => {
            setStep("SUCCESS_STEP");
          }}
        />
      )}
      {step === "SUCCESS_STEP" && <VerificationFormSuccessStep />}
    </div>
  );
};

const profileStepStyles = StyleSheet.create({
  worksWrapper: {
    display: "none",
    overflow: "scroll",
    maxHeight: 300,
  },
  worksWrapperActive: {
    display: "block",
  },
});

const formStyles = StyleSheet.create({
  whyVerify: {
    background: colors.LIGHTER_GREY(0.7),
    color: colors.MEDIUM_GREY2(),
    position: "absolute",
    width: "100%",
    left: "0",
    bottom: 0,
    boxSizing: "border-box",    
    padding: "25px 50px ",
  },
  whyVerifyWrapper: {
    height: 180,
    width: "100%",
  },
  whyVerifyTitle: {
    color: colors.BLACK(),
    fontSize: 16,
    marginBottom: 15,
  },
  whyVerifyItem: {
    fontSize: 15,
  },
  whyVerifyList: {
    padding: 0,
    paddingLeft: 10,
    lineHeight: "1.5em",
    listStylePosition: "inside",
  },
  verificationOptions: {
    marginTop: 10,    
  },
  option: {
    display: "flex",
    columnGap: "10px",
    marginTop: 15,
    background: colors.LIGHTER_GREY(0.7),
    border: "1px solid #E9EAEF",
    borderRadius: "8px",
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
  optionDescription: {
    marginTop: 5,
    color: colors.MEDIUM_GREY2(),
    fontSize: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: 500,
  },
  chooseVerificationTitle: {
    fontSize: 16,
    fontWeight: 500,
    marginTop: 30,
  },
  description: {
    marginTop: 5,
    color: colors.MEDIUM_GREY(),
    fontSize: 16,
    lineHeight: "22px",
  },
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
