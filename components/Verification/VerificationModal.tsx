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
import { ClipLoader } from "react-spinners";
import { HubBadge } from "../Hubs/HubTag";
import Link from "next/link";


const VerifiedBadge = ({height = 25, width = 25}) => {
  return (
    <Image src="/static/verified.svg" width={width} height={height} alt="Verified" />
  )
}

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
    .then((res): any => true)
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
  doi?: string;
  doiUrl?: string;
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

const parseOpenAlexWork = (raw: any, onlyImportantConcepts: boolean): OpenAlexWork => {
  const parsed = {
    title: raw.title,
    id: raw.id,
    publishedDate: formatDateStandard(raw.publication_date, "MMM D, YYYY"),
    authors: raw.authorships.map(
      (authorship) => authorship.author.display_name
    ),
    doiUrl: raw.doi,
    concepts: raw.concepts.map((concept) => parseOpenAlexConcept(concept)),
  };

  if (onlyImportantConcepts) {
    parsed.concepts = parsed.concepts.filter((concept) => concept.level === 1);
    parsed.concepts = parsed.concepts.sort((a, b) => b.relevancyScore - a.relevancyScore);
    parsed.concepts = parsed.concepts.slice(0,3)
  }

  if (parsed.doiUrl) {
    parsed.doi = parsed.doiUrl.replace("https://doi.org/", "");
  }

  return parsed;
};

const parseOpenAlexProfile = (raw: any): OpenAlexProfile => {
  return {
    id: raw.id,
    displayName: raw.display_name,
    institution:
      raw.last_known_institution &&
      parseOpenAlexInstitution(raw.last_known_institution),
    summaryStats: parseOpenAlexSummaryStats(raw.summary_stats),
    works: raw.works.map((work) => parseOpenAlexWork(work, true)),
  };
};

const VerificationFormSuccessStep = ({}) => {
  return (
    <div style={{ display: "flex", alignItems: "center", flexDirection: "column", textAlign: "center", paddingTop: 75, }}>
      <VerifiedBadge width={100} height={100} />
      <div style={{ fontSize: 26, fontWeight: 500, marginTop: 50, }}>Your account is now verified</div>      
      <div style={{ marginTop: 10, color: colors.MEDIUM_GREY2(), lineHeight: "26px", }}>Your account will be updated to reflect your academic reputation in a few minutes.</div>
      <div style={{ width: 250, marginTop: 75, }}>
        <Button fullWidth onClick={() => null}>
          Close
        </Button>      
      </div>
    </div>
  );
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
            <li className={css(formStyles.whyVerifyItem)}>Improve your academic reputation on the platform</li>
            <li className={css(formStyles.whyVerifyItem)}>Earn ResearchCoin on your papers</li>
            <li className={css(formStyles.whyVerifyItem)}>
              <div style={{display: "inline-flex", columnGap: 10, }}>
                Have the verified badge appear in your profile
                <VerifiedBadge width={25} height={25} />
              </div>
            </li>
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
  const [selectedProfileIds, setSelectedProfileIds] = useState<Array<string>>(
    []
  );
  const requestType =
    providerDataResponse.provider === "ORCID" ? "ORCID" : "NAME";
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isInitialFetchComplete, setIsInitialFetchComplete] = useState(false);

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
    await completeProfileVerification({ openAlexProfileId: selectedProfileIds[0] });
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
    if (isInitialFetchComplete) {
      return;
    }

    (async () => {
      const rawProfiles = await fetchOpenAlexProfiles({
        requestType,
        name: providerDataResponse.name,
      });
      const profiles = rawProfiles.map((p) => parseOpenAlexProfile(p));
      setProfileOptions(profiles);
      setIsLoadingProfiles(false);
      setIsInitialFetchComplete(true);
    })();
  }, [isInitialFetchComplete]);

  return (
    <div style={{height: 500, overflow: "scroll", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
      <div>
        <div className={css(profileStepStyles.title)}>
          {providerDataResponse.provider === "ORCID" &&
            <>Select Profile</>
          }
          {providerDataResponse.provider === "LINKEDIN" &&
            <>Select Profile(s)</>
          }
        </div>
        <p className={css(profileStepStyles.description)}>
          {profileOptions.length <= 1 &&
            <>Select profile associated with yourself.</>
          }
          {providerDataResponse.provider === "LINKEDIN" &&
            <>Select all the profiles associated with yourself.</>
          }
        </p>
        <div className={css(styles.prevActionWrapper)}>
          <IconButton onClick={onPrevClick}>
            <FontAwesomeIcon icon={faAngleLeft} color={colors.MEDIUM_GREY()} />
            Back
          </IconButton>
        </div>
        <div>
            {isLoadingProfiles && (
              <div
                style={{ display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                marginTop: 150,
              }}>
                  <ClipLoader
                    sizeUnit={"px"}
                    size={44}
                    color={colors.NEW_BLUE()}
                    loading={true}
                  />
              </div>
              )}


          {providerDataResponse.provider === "LINKED" && (
            <FormInput
              value={providerDataResponse?.name || ""}
              onChange={(name, value) => debounceFetchProfiles(value)}
            />
          )}
          {profileOptions.map((profile, index) => {
            return (
              <div
                style={{ background: colors.LIGHTER_GREY(0.7), position: "relative", padding: 10, marginBottom: 10, fontSize: 14 }}
                className={css(profileStepStyles.profile)}
                key={`profile-${profile.id}`}
              >
                <div
                  style={{ position: "absolute", right: 0}}
                  onClick={() =>
                     selectedProfileIds.includes(profile.id)
                      ? setSelectedProfileIds(selectedProfileIds.filter(p => p !== profile.id))
                      : setSelectedProfileIds([...selectedProfileIds, profile.id])
                  }
                >
                  {/* @ts-ignore */}
                  <CheckBox
                    isSquare={true}
                    active={selectedProfileIds.includes(profile.id)}
                  />
                </div>
                <div className={css(profileStepStyles.name)} style={{ fontWeight: 500, fontSize: 18, }}>
                  {profile.displayName}
                </div>
                {profile.institution && (
                  <div className={css(profileStepStyles.institution)} style={{ color: colors.MEDIUM_GREY2(), marginTop: 4, fontWeight: 500 }}>
                    {profile.institution.displayName}
                  </div>
                )}
                {(profile.summaryStats.hIndex > 0 ||
                  profile.summaryStats.i10Index > 0) && (
                  <div className={css(profileStepStyles.metadata)} style={{ color: colors.MEDIUM_GREY2(), display: "flex", columnGap: 15, marginTop: 4 }}>
                    {profile.summaryStats.hIndex > 0 && (
                      <div className={css(profileStepStyles.metadataItem)} style={{display: "flex", columnGap: 5}}>
                        <div className={css(profileStepStyles.metadataKey)}>
                          h-index:
                        </div>
                        <div className={css(profileStepStyles.metadataValue)}>
                          {String(profile.summaryStats.hIndex)},
                        </div>
                      </div>
                    )}
                    {profile.summaryStats.i10Index > 0 && (
                      <div className={css(profileStepStyles.metadataItem)} style={{display: "flex", columnGap: 5}}>
                        <div className={css(profileStepStyles.metadataKey)}>
                          i10-index:
                        </div>
                        <div className={css(profileStepStyles.metadataValue)}>
                          {String(profile.summaryStats.i10Index)}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div style={{marginTop: 8}}>
                  <div className={css(profileStepStyles.publishedWorksTitle)} onClick={() => toggleAuthorWorksVisibility(profile.id)} style={{display: "flex", columnGap: 4, justifyContent: "space-between", cursor: "pointer", alignItems: "center"}}>
                    {profile.works.length} Published papers
                    <FontAwesomeIcon
                      style={{fontSize: 18}}
                      icon={
                        showWorksForAuthors.includes(profile.id)
                          ? faAngleUp
                          : faAngleDown
                      }
                    />
                  </div>
                  <div
                    style={{ borderTop:  "1px solid #E9EAEF", paddingTop: 10, marginTop: 10,}}
                    className={css(
                      profileStepStyles.worksWrapper,
                      showWorksForAuthors.includes(profile.id) &&
                        profileStepStyles.worksWrapperActive
                    )}
                  >
                    {profile.works.map((work, index) => {
                      return (
                        <div className={css(profileStepStyles.paper)} style={{ display: "flex", columnGap: 10, marginBottom: 15 }}>
                          <PaperIcon withAnimation={false} onClick={undefined} color={colors.MEDIUM_GREY2()} />
                          <div>
                            <div className={css(profileStepStyles.paperTitle)} style={{ fontSize: 16 }}>
                              {work.title}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", fontSize: 14, color: colors.MEDIUM_GREY2(), marginTop: 4, width: "100%", flexWrap: "wrap", lineHeight: "20px" }}>
                              <div className={css(profileStepStyles.paperAuthors)}>
                                <>{work.authors[0]}</>
                                {work.authors.length > 1 && 
                                  ` et al.`
                                }
                              </div>
                              <div style={{ marginLeft: 8, marginRight: 8, borderLeft: `1px solid ${colors.MEDIUM_GREY()}`, height: 13, }}></div>
                              <div>{work.publishedDate}</div>
                              <div style={{ marginLeft: 8, marginRight: 8, borderLeft: `1px solid ${colors.MEDIUM_GREY()}`, height: 13, }}></div>
                              <div>
                              {work.doiUrl && 
                                <Link href={work.doiUrl} target={"_blank"} style={{color: colors.NEW_BLUE()}}>{work.doi}</Link>
                              }                              
                            </div>                              
                            </div>

                            <div className={css(profileStepStyles.concepts)} style={{display: "flex", columnGap: 10, marginTop: 8,}}>
                              {work.concepts.map((concept, index) => {
                                return (
                                  <div className={css(profileStepStyles.concept)} style={{  }}>
                                    <HubBadge size={"small"} name={concept.displayName} />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!isLoadingProfiles &&
        <Button onClick={completeVerification} disabled={selectedProfileIds.length === 0}>
          Complete Verification
        </Button>
      }

      </div>
  );
};

const profileStepStyles = StyleSheet.create({
  worksWrapper: {
    display: "none",
  },
  publishedWorksTitle: {
    padding: 5,
    marginLeft: -5,
    marginRight: -5,
    ":hover": {
      background: colors.GREY(0.5),
      transition: "0.2s",
    }
  },
  worksWrapperActive: {
    display: "block",
  },
  title: {
    fontSize: 26,
    fontWeight: 500,
  },
  description: {
    marginTop: 5,
    color: colors.MEDIUM_GREY(),
    fontSize: 16,
    lineHeight: "22px",
  },  
});

interface VerificationFormProps {
  onProfileSelect?: (profileId: string | null) => void;
  onStepSelect?: (step: "PROVIDER_STEP" | "PROFILE_STEP") => void;
}

const VerificationForm = ({ onStepSelect }: VerificationFormProps) => {
  const [step, setStep] = useState<
    "PROVIDER_STEP" | "PROFILE_STEP" | "SUCCESS_STEP" | "FAILURE_STEP"
  >("PROVIDER_STEP");

  const [providerDataResponse, setProviderDataResponse] = useState<any | null>(
    // {provider: "LINKEDIN", name: "Jeffrey Koury"}
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

const formStyles = StyleSheet.create({
  whyVerifyWrapper: {
    height: 160,
  },
  whyVerify: {
    background: colors.LIGHTER_GREY(0.7),
    color: colors.MEDIUM_GREY2(),
    width: "100%",
    boxSizing: "border-box",    
    padding: "25px 50px 10px 50px ",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  whyVerifyTitle: {
    color: colors.BLACK(),
    fontSize: 16,
    marginBottom: 15,
  },
  whyVerifyItem: {
    fontSize: 15,
    position: "relative",
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
  description: {
    marginTop: 5,
    color: colors.MEDIUM_GREY(),
    fontSize: 16,
    lineHeight: "22px",
  },
  chooseVerificationTitle: {
    fontSize: 16,
    fontWeight: 500,
    marginTop: 30,
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
      modalStyle={styles.modalStyle}
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
    height: "100%",
  },
  modalStyle: {
  },
  modalTitleStyleOverride: {},
  modalContentStyle: {
    position: "relative",
    minHeight: 560,
    padding: "50px 25px ",
  },
  prevActionWrapper: {
    position: "absolute",
    top: 12,
    left: 10,
  },
});

export default VerificationModal;
