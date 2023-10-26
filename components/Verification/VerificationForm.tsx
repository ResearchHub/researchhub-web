import OrcidConnectButton from "../OrcidConnectButton";
import { useCallback, useEffect, useState } from "react";
import { faAngleLeft, faCircleXmark } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IconButton from "../Icons/IconButton";
import { css, StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";
import { PaperIcon } from "~/config/themes/icons";
import CheckBox from "../Form/CheckBox";
import { captureEvent } from "~/config/utils/events";
import {
  faAngleDown,
  faAngleUp,
  faSearch,
} from "@fortawesome/pro-light-svg-icons";
import Button from "../Form/Button";
import LinkedInButton from "~/components/LinkedInButton";
import FormInput from "../Form/FormInput";
import debounce from "lodash/debounce";
import Image from "next/image";
import { ClipLoader } from "react-spinners";
import { HubBadge } from "../Hubs/HubTag";
import Link from "next/link";
import ALink from "../ALink";
import { isEmpty } from "~/config/utils/nullchecks";
import { parseUser } from "~/config/types/root_types";
import { RootState } from "~/redux";
import { useSelector } from "react-redux";
import VerifiedBadge from "./VerifiedBadge";
import { OpenAlexProfile, parseOpenAlexProfile } from "./lib/types";
import { completeProfileVerification, fetchOpenAlexProfiles } from "./lib/api";
import { breakpoints } from "~/config/themes/screen";

interface VerificationFormProps {
  onStepSelect?: (step: "PROVIDER_STEP" | "PROFILE_STEP") => void;
}

const VerificationForm = ({ onStepSelect }: VerificationFormProps) => {
  const [step, setStep] = useState<
    "PROVIDER_STEP" | "PROFILE_STEP" | "SUCCESS_STEP" | "ERROR_STEP"
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
          onError={() => setStep("ERROR_STEP")}
          providerDataResponse={providerDataResponse}
          onVerificationComplete={() => {
            setStep("SUCCESS_STEP");
          }}
        />
      )}
      {step === "ERROR_STEP" && (
        <VerificationFormErrorStep
          onPrevClick={() => setStep("PROVIDER_STEP")}
        />
      )}
      {step === "SUCCESS_STEP" && <VerificationFormSuccessStep />}
    </div>
  );
};

const VerificationFormSuccessStep = ({}) => {
  const currentUser = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
        paddingTop: 15,
      }}
    >
      <VerifiedBadge width={100} height={100} showTooltipOnHover={false} />
      <div style={{ fontSize: 26, fontWeight: 500, marginTop: 20 }}>
        Your account is now verified
      </div>
      <div
        style={{
          marginTop: 10,
          color: colors.MEDIUM_GREY2(),
          lineHeight: "26px",
        }}
      >
        <ul style={{ marginTop: 40, textAlign: "left" }}>
          <li>
            Your account will be updated to reflect your academic reputation in
            a few minutes.
          </li>
          <li>
            You will be able to view the papers you authored in the{" "}
            <ALink
              theme="solidPrimary"
              href={`/user/${currentUser?.authorProfile.id}/authored-papers`}
            >
              Authored Papers
            </ALink>{" "}
            section.
          </li>
        </ul>
      </div>
      <div style={{ width: 250, marginTop: 75 }}>
        <Button fullWidth onClick={() => (window.location.href = "/")}>
          Back Home
        </Button>
      </div>
    </div>
  );
};

const VerificationFormErrorStep = ({ onPrevClick }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
        paddingTop: 50,
      }}
    >
      <FontAwesomeIcon icon={faCircleXmark} color={colors.RED()} size={"5x"} />
      <div style={{ fontSize: 26, fontWeight: 500, marginTop: 50 }}>
        Could not verify
      </div>
      <div
        style={{
          marginTop: 10,
          color: colors.MEDIUM_GREY2(),
          lineHeight: "26px",
        }}
      >
        An error occurred while verifying your authorship. Please try a
        different verification method.
      </div>
      <div
        style={{
          marginTop: 10,
          color: colors.MEDIUM_GREY2(),
          lineHeight: "26px",
        }}
      >
        If this error persists, contact us at{" "}
        <ALink theme="solidPrimary" href="mailto:verification@researchhub.com">
          verification@researchhub.com
        </ALink>
        .
      </div>
      <div style={{ width: 250, marginTop: 100 }}>
        <Button fullWidth onClick={onPrevClick}>
          Try again
        </Button>
      </div>
    </div>
  );
};

const VerificationFormSelectProviderStep = ({
  onProviderConnectSuccess,
  onProviderConnectFailure,
}) => {
  const currentUser = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );

  const isAlreadyVerified = currentUser?.authorProfile?.isVerified;
  const isLinkedInVerified = Boolean(
    currentUser?.authorProfile?.linkedIn?.linkedInId
  );
  const isOrcidVerified = Boolean(currentUser?.authorProfile?.orcid?.orcidId);

  return (
    <div>
      <div className={css(formStyles.title)}>Become a Verified Author</div>
      <p className={css(formStyles.description)}>
        Authors with at least one published paper on any academic journal can
        now verify their authorship.
      </p>

      <div className={css(formStyles.chooseVerificationTitle)}>
        Choose a verification method:
      </div>
      <div className={css(formStyles.verificationOptions)}>
        <div
          className={css(
            formStyles.option,
            isOrcidVerified && formStyles.optionVerified
          )}
        >
          <OrcidConnectButton
            onSuccess={(data) => {
              onProviderConnectSuccess(data);
            }}
            onFailure={(data) => {
              onProviderConnectFailure();
            }}
          >
            <div
              className={css(formStyles.optionContent)}
              onClick={(e) => {
                if (isOrcidVerified) {
                  e.stopPropagation();
                }
              }}
            >
              <Image
                src="/static/logos/orcid.png"
                width={26}
                height={26}
                alt="Orcid"
                style={{ marginTop: 0 }}
              />
              <div>
                <div className={css(formStyles.optionValue)}>
                  Orcid
                  {isOrcidVerified && (
                    <div
                      style={{
                        color: colors.NEW_BLUE(),
                        fontWeight: 500,
                        fontSize: 13,
                      }}
                    >
                      (Verified)
                    </div>
                  )}
                </div>
                <div className={css(formStyles.optionDescription)}>
                  Verify authorship instantly with Orcid
                </div>
              </div>
              {isOrcidVerified && (
                <div style={{ marginLeft: "auto" }}>
                  <VerifiedBadge
                    width={26}
                    height={26}
                    showTooltipOnHover={false}
                  />
                </div>
              )}
            </div>
          </OrcidConnectButton>
        </div>

        <div
          className={css(
            formStyles.option,
            isLinkedInVerified && formStyles.optionVerified
          )}
        >
          <LinkedInButton
            onSuccess={(data) => {
              onProviderConnectSuccess(data);
            }}
            onFailure={(data) => {
              onProviderConnectFailure();
            }}
          >
            <div
              className={css(formStyles.optionContent)}
              onClick={(e) => {
                if (isLinkedInVerified) {
                  e.stopPropagation();
                }
              }}
            >
              <Image
                src="/static/logos/linkedin.png"
                width={26}
                height={26}
                alt="Linkedin"
                style={{ marginTop: -2 }}
              />
              <div>
                <div className={css(formStyles.optionValue)}>
                  LinkedIn
                  {isLinkedInVerified && (
                    <div
                      style={{
                        color: colors.NEW_BLUE(),
                        fontWeight: 500,
                        fontSize: 14,
                      }}
                    >
                      (Verified)
                    </div>
                  )}
                </div>
                <div className={css(formStyles.optionDescription)}>
                  Verify authorship instantly with LinkedIn
                </div>
              </div>
              {isLinkedInVerified && (
                <div style={{ marginLeft: "auto" }}>
                  <VerifiedBadge
                    width={26}
                    height={26}
                    showTooltipOnHover={false}
                  />
                </div>
              )}
            </div>
          </LinkedInButton>
        </div>
      </div>
      <div className={css(formStyles.whyVerifyWrapper)}>
        <div className={css(formStyles.whyVerify)}>
          <div className={css(formStyles.whyVerifyTitle)}>
            Reasons to become a verified author:
          </div>
          <ul className={css(formStyles.whyVerifyList)}>
            <li className={css(formStyles.whyVerifyItem)}>
              Improve your academic reputation on the platform
            </li>
            <li className={css(formStyles.whyVerifyItem)}>
              Get early access to new features
            </li>
            <li className={css(formStyles.whyVerifyItem)}>
              Earn ResearchCoin on your papers
            </li>
            <li className={css(formStyles.whyVerifyItem)}>
              <div style={{ display: "inline-flex", columnGap: 10 }}>
                Have the verified badge appear in your profile
                {!isAlreadyVerified && (
                  <VerifiedBadge
                    width={25}
                    height={25}
                    showTooltipOnHover={false}
                  />
                )}
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
  onError: () => void;
  onVerificationComplete: () => void;
  providerDataResponse: any;
}

const VerificationFormSelectProfileStep = ({
  onPrevClick,
  onVerificationComplete,
  onError,
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
  const [isVerifying, setIsVerifying] = useState(false);
  const [isInitialFetchComplete, setIsInitialFetchComplete] = useState(false);
  const [name, setName] = useState(providerDataResponse?.name || "");
  const [hasAgreedToAuthorTerms, setHasAgreedToAuthorTerms] = useState(false);
  const [hasAgreedToImpersonationTerms, setHasAgreedToImpersonationTerms] =
    useState(false);

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
    try {
      setIsVerifying(true);
      await completeProfileVerification({
        openAlexProfileIds: selectedProfileIds,
      });
      onVerificationComplete();
    } catch (error) {
      onError();
      captureEvent({
        data: {
          openAlexProfileId: selectedProfileIds,
          name,
          providerDataResponse,
        },
        msg: "[VERIFICATION] Failed to complete verification",
        error,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const debounceFetchProfiles = useCallback(
    debounce(async (name) => {
      if (name.length > 5) {
        setIsLoadingProfiles(true);
        try {
          const rawProfiles = await fetchOpenAlexProfiles({
            requestType,
            name,
          });
          const profiles = rawProfiles.map((p) => parseOpenAlexProfile(p));
          setProfileOptions(profiles);
        } catch (error) {
        } finally {
          setIsLoadingProfiles(false);
        }
      }
    }, 1500),
    []
  );

  useEffect(() => {
    if (isInitialFetchComplete) {
      return;
    }

    (async () => {
      try {
        const rawProfiles = await fetchOpenAlexProfiles({
          requestType,
          name: providerDataResponse.name,
        });
        const profiles = rawProfiles.map((p) => parseOpenAlexProfile(p));
        setProfileOptions(profiles);
        setIsLoadingProfiles(false);
        setIsInitialFetchComplete(true);
      } catch (error) {
        // This error is mostly okay and does not need to be captured since it implies
        // the user could not be found in OpenAlex.
        onError();
      }
    })();
  }, [isInitialFetchComplete]);

  const noResults = !isLoadingProfiles && profileOptions.length === 0;

  return (
    <div
      style={{
        height: 500,
        overflow: "scroll",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <div className={css(profileStepStyles.title)}>
          {providerDataResponse.provider === "ORCID" && <>Select Profile</>}
          {providerDataResponse.provider === "LINKEDIN" && (
            <>Select Profile(s)</>
          )}
        </div>
        <p className={css(profileStepStyles.description)}>
          Select all the author profiles associated with yourself.
        </p>
        <div className={css(profileStepStyles.prevActionWrapper)}>
          <IconButton onClick={onPrevClick}>
            <FontAwesomeIcon icon={faAngleLeft} color={colors.MEDIUM_GREY()} />
            Back
          </IconButton>
        </div>
        <div>
          {providerDataResponse.provider === "LINKEDIN" && !isVerifying && (
            <div style={{ position: "relative" }}>
              <FormInput
                disabled={isLoadingProfiles}
                value={name}
                onChange={(name, value) => {
                  setName(value);
                  debounceFetchProfiles(value);
                }}
              />
              <FontAwesomeIcon
                style={{
                  position: "absolute",
                  right: 15,
                  top: 15,
                  fontSize: 18,
                }}
                icon={faSearch}
                color={colors.MEDIUM_GREY()}
              />
            </div>
          )}
          {(isLoadingProfiles || isVerifying) && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                marginTop: 150,
              }}
            >
              <ClipLoader
                sizeUnit={"px"}
                size={44}
                color={colors.NEW_BLUE()}
                loading={true}
              />
            </div>
          )}
          {noResults && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                marginTop: 130,
              }}
            >
              <div
                style={{
                  textAlign: "center",
                }}
              >
                <div style={{ fontWeight: 500, fontSize: 18 }}>
                  No results found.
                </div>
                <div
                  style={{ fontWeight: 400, fontSize: 14, lineHeight: "20px" }}
                >
                  Please ensure spelling of your name is correct.
                </div>
              </div>
            </div>
          )}
          {!isLoadingProfiles &&
            !isVerifying &&
            profileOptions.map((profile, index) => {
              return (
                <div
                  style={{
                    background: colors.LIGHTER_GREY(0.7),
                    position: "relative",
                    padding: 10,
                    marginBottom: 10,
                    fontSize: 14,
                  }}
                  className={css(
                    profileStepStyles.profile,
                    selectedProfileIds.includes(profile.id) &&
                      profileStepStyles.profileSelected
                  )}
                  key={`profile-${profile.id}`}
                >
                  <div
                    style={{ position: "absolute", right: 0 }}
                    onClick={() =>
                      selectedProfileIds.includes(profile.id)
                        ? setSelectedProfileIds(
                            selectedProfileIds.filter((p) => p !== profile.id)
                          )
                        : setSelectedProfileIds([
                            ...selectedProfileIds,
                            profile.id,
                          ])
                    }
                  >
                    {/* @ts-ignore */}
                    <CheckBox
                      isSquare={true}
                      active={selectedProfileIds.includes(profile.id)}
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
                          <div>h-index:</div>
                          <div>{String(profile.summaryStats.hIndex)},</div>
                        </div>
                      )}
                      {profile.summaryStats.i10Index > 0 && (
                        <div className={css(profileStepStyles.metadataItem)}>
                          <div>i10-index:</div>
                          <div>{String(profile.summaryStats.i10Index)}</div>
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{ marginTop: 8 }}>
                    <div
                      className={css(profileStepStyles.publishedWorksTitle)}
                      onClick={() => toggleAuthorWorksVisibility(profile.id)}
                      style={{
                        display: "flex",
                        columnGap: 4,
                        justifyContent: "space-between",
                        cursor: "pointer",
                        alignItems: "center",
                      }}
                    >
                      {profile.works.length} Published papers
                      <FontAwesomeIcon
                        style={{ fontSize: 18 }}
                        icon={
                          showWorksForAuthors.includes(profile.id)
                            ? faAngleUp
                            : faAngleDown
                        }
                      />
                    </div>
                    <div
                      style={{
                        borderTop: "1px solid #E9EAEF",
                        paddingTop: 10,
                        marginTop: 10,
                      }}
                      className={css(
                        profileStepStyles.worksWrapper,
                        showWorksForAuthors.includes(profile.id) &&
                          profileStepStyles.worksWrapperActive
                      )}
                    >
                      {profile.works.map((work, index) => {
                        return (
                          <div className={css(profileStepStyles.paper)}>
                            <PaperIcon
                              withAnimation={false}
                              onClick={undefined}
                              color={colors.MEDIUM_GREY2()}
                            />
                            <div>
                              <div style={{ fontSize: 16 }}>{work.title}</div>
                              <div
                                className={css(profileStepStyles.metaWrapper)}
                              >
                                <div>
                                  <>{work.authors[0]}</>
                                  {work.authors.length > 1 && ` et al.`}
                                </div>
                                <div
                                  style={{
                                    marginLeft: 8,
                                    marginRight: 8,
                                    borderLeft: `1px solid ${colors.MEDIUM_GREY()}`,
                                    height: 13,
                                  }}
                                ></div>
                                <div>{work.publishedDate}</div>
                                <div
                                  style={{
                                    marginLeft: 8,
                                    marginRight: 8,
                                    borderLeft: `1px solid ${colors.MEDIUM_GREY()}`,
                                    height: 13,
                                  }}
                                ></div>
                                <div>
                                  {work.doiUrl && (
                                    <Link
                                      href={work.doiUrl}
                                      target={"_blank"}
                                      style={{ color: colors.NEW_BLUE() }}
                                    >
                                      {work.doi}
                                    </Link>
                                  )}
                                </div>
                              </div>

                              <div className={css(profileStepStyles.concepts)}>
                                {work.concepts.map((concept, index) => {
                                  return (
                                    <div>
                                      <HubBadge
                                        size={"small"}
                                        name={concept.displayName}
                                      />
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

      {!isLoadingProfiles && profileOptions.length > 0 && (
        <div>
          <div className={css(profileStepStyles.terms)}>
            <div
              onClick={() => setHasAgreedToAuthorTerms(!hasAgreedToAuthorTerms)}
            >
              {/* @ts-ignore */}
              <CheckBox
                small
                isSquare={true}
                active={hasAgreedToAuthorTerms}
                label={
                  <div style={{ marginLeft: 5, fontSize: 14 }}>
                    I confirm that I am the author of the above papers.
                  </div>
                }
              />
            </div>
            <div
              onClick={() =>
                setHasAgreedToImpersonationTerms(!hasAgreedToImpersonationTerms)
              }
            >
              {/* @ts-ignore */}
              <CheckBox
                small
                isSquare={true}
                active={hasAgreedToImpersonationTerms}
                label={
                  <div style={{ marginLeft: 5, fontSize: 14 }}>
                    I understand that impersonating an author can result in a
                    permanent account ban.
                  </div>
                }
              />
            </div>
          </div>
          <div>
            <Button
              fullWidth
              onClick={completeVerification}
              disabled={
                selectedProfileIds.length === 0 ||
                !hasAgreedToAuthorTerms ||
                !hasAgreedToImpersonationTerms
              }
            >
              Complete Verification
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const profileStepStyles = StyleSheet.create({
  worksWrapper: {
    display: "none",
  },
  prevActionWrapper: {
    position: "absolute",
    top: 12,
    left: 10,
  },
  metadata: {
    color: colors.MEDIUM_GREY2(),
    display: "flex",
    columnGap: "15px",
    marginTop: 4,
  },
  institution: {
    color: colors.MEDIUM_GREY2(),
    marginTop: 4,
    fontWeight: 500,
  },
  metadataItem: {
    display: "flex",
    columnGap: "5px",
  },
  paper: {
    display: "flex",
    columnGap: "10px",
    marginBottom: 15,
  },
  concepts: {
    display: "flex",
    columnGap: "10px",
    marginTop: 8,
  },
  metaWrapper: {
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    color: colors.MEDIUM_GREY2(),
    marginTop: 4,
    width: "100%",
    flexWrap: "wrap",
    lineHeight: "20px",
  },
  terms: {
    marginTop: 15,
    marginBottom: 10,
    display: "flex",
    flexDirection: "column",
    rowGap: "5px",
  },
  name: {
    fontWeight: 500,
    fontSize: 18,
  },
  profile: {},
  profileSelected: {
    border: `1px solid ${colors.NEW_BLUE()}`,
  },
  publishedWorksTitle: {
    padding: 5,
    marginLeft: -5,
    marginRight: -5,
    ":hover": {
      background: colors.GREY(0.5),
      transition: "0.2s",
    },
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

const formStyles = StyleSheet.create({
  whyVerifyWrapper: {
    height: 180,
  },
  optionContent: {
    padding: 15,
    columnGap: "15px",
    display: "flex",
    alignItems: "center",
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
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      padding: "20px 20px",
      position: "absolute",
    },
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      padding: "25px 25px 10px 20px ",
    }      

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
    cursor: "pointer",
    ":hover": {
      border: `1px solid ${colors.NEW_BLUE()}`,
    },
  },
  optionVerified: {
    ":hover": {
      border: `1px solid #E9EAEF`,
      cursor: "initial",
    },
  },
  optionValue: {
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    columnGap: "5px",
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

export default VerificationForm;
