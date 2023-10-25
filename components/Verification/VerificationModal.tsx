import { use, useCallback, useEffect, useState } from "react";
import {
  faAngleLeft,
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/pro-solid-svg-icons";
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
import ReactTooltip from "react-tooltip";
import { genClientId } from "~/config/utils/id";
import { isEmpty } from "~/config/utils/nullchecks";
import { parseUser } from "~/config/types/root_types";
import { RootState } from "~/redux";
import { useSelector } from "react-redux";

interface VerificationModalProps {
  height: number;
  width: number;
  variation?: "blue" | "grey";
  showTooltipOnHover?: boolean;
}

export const VerifiedBadge = ({
  height = 25,
  width = 25,
  variation = "blue",
  showTooltipOnHover = true,
}: VerificationModalProps) => {
  const id = genClientId();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <VerificationModal
        isModalOpen={isOpen}
        handleModalClose={(e) => {
          // stopPropagation is necessary because this component is included various card components with a click action.
          // We need this stopPropagation to prevent the click action on the card from taking place.
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(false);
        }}
      />
      <Image
        src={
          variation === "grey"
            ? "/static/verified-grey.svg"
            : "/static/verified.svg"
        }
        width={width}
        height={height}
        alt="Verified"
        data-for={`verified-${id}`}
        data-tip={""}
        style={{ cursor: "pointer" }}
      />
      {showTooltipOnHover && (
        <ReactTooltip
          arrowColor={"white"}
          id={`verified-${id}`}
          className={css(verifiedBadgeStyles.tooltip)}
          place="bottom"
          effect="solid"
          delayShow={500}
          delayHide={500}
          delayUpdate={500}
        >
          <div className={css(verifiedBadgeStyles.verifiedWrapper)}>
            <div>Verified Author Account</div>
            <Image
              src="/static/verified.svg"
              width={width}
              height={height}
              alt="Verified"
            />
          </div>
          <div className={css(verifiedBadgeStyles.learnMoreWrapper)}>
            <span
              className={css(verifiedBadgeStyles.learnMore)}
              onClick={(e) => {
                // stopPropagation is necessary because this component is included various card components with a click action.
                // We need this stopPropagation to prevent the click action on the card from taking place.
                e.stopPropagation();
                e.preventDefault();
                setIsOpen(true);
              }}
            >
              Learn More
            </span>
          </div>
        </ReactTooltip>
      )}
    </>
  );
};

const verifiedBadgeStyles = StyleSheet.create({
  tooltip: {
    color: "black",
    background: "#fff",
    transition: "unset",
    opacity: 1,
    boxShadow: "0px 0px 10px 0px #00000026",
    ":after": {
      display: "none",
    },
  },
  verifiedWrapper: {
    background: "white",
    columnGap: "5px",
    display: "flex",
    alignItems: "center",
  },
  learnMoreWrapper: {
    marginTop: 0,
  },
  learnMore: {
    color: colors.NEW_BLUE(),
    textDecoration: "underline",
    cursor: "pointer",
  },
});

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

const completeProfileVerification = async ({ openAlexProfileIds }) => {
  const url = generateApiUrl(`user/verify_user`);

  return fetch(url, API.POST_CONFIG({ openalex_ids: openAlexProfileIds })).then(
    helpers.checkStatus
  );
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

const parseOpenAlexWork = (
  raw: any,
  onlyImportantConcepts: boolean
): OpenAlexWork => {
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
    parsed.concepts = parsed.concepts.sort(
      (a, b) => b.relevancyScore - a.relevancyScore
    );
    parsed.concepts = parsed.concepts.slice(0, 3);
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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
        paddingTop: 75,
      }}
    >
      <VerifiedBadge width={100} height={100} showTooltipOnHover={false} />
      <div style={{ fontSize: 26, fontWeight: 500, marginTop: 50 }}>
        Your account is now verified
      </div>
      <div
        style={{
          marginTop: 10,
          color: colors.MEDIUM_GREY2(),
          lineHeight: "26px",
        }}
      >
        Your account will be updated to reflect your academic reputation in a
        few minutes.
      </div>
      <div style={{ width: 250, marginTop: 75 }}>
        <Button fullWidth onClick={() => (window.location.href = "/")}>
          Back Home
        </Button>
      </div>
    </div>
  );
};

const VerificationFormAlreadyVerifiedStep = ({ onClose }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
        paddingTop: 75,
      }}
    >
      <VerifiedBadge width={100} height={100} showTooltipOnHover={false} />
      <div style={{ fontSize: 26, fontWeight: 500, marginTop: 50 }}>
        Your account is already verified
      </div>
      <div
        style={{
          marginTop: 10,
          color: colors.MEDIUM_GREY2(),
          lineHeight: "26px",
        }}
      >
        Thank you for verifying your account with ResearchHub.
      </div>
      <div style={{ width: 250, marginTop: 75 }}>
        <Button fullWidth onClick={onClose}>
          Close
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
  onProfileAlreadyVerified,
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
                if (isOLinkedinVerified) {
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
        <div className={css(styles.prevActionWrapper)}>
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
                  <div
                    className={css(profileStepStyles.name)}
                    style={{ fontWeight: 500, fontSize: 18 }}
                  >
                    {profile.displayName}
                  </div>
                  {profile.institution && (
                    <div
                      className={css(profileStepStyles.institution)}
                      style={{
                        color: colors.MEDIUM_GREY2(),
                        marginTop: 4,
                        fontWeight: 500,
                      }}
                    >
                      {profile.institution.displayName}
                    </div>
                  )}
                  {(profile.summaryStats.hIndex > 0 ||
                    profile.summaryStats.i10Index > 0) && (
                    <div
                      className={css(profileStepStyles.metadata)}
                      style={{
                        color: colors.MEDIUM_GREY2(),
                        display: "flex",
                        columnGap: 15,
                        marginTop: 4,
                      }}
                    >
                      {profile.summaryStats.hIndex > 0 && (
                        <div
                          className={css(profileStepStyles.metadataItem)}
                          style={{ display: "flex", columnGap: 5 }}
                        >
                          <div className={css(profileStepStyles.metadataKey)}>
                            h-index:
                          </div>
                          <div className={css(profileStepStyles.metadataValue)}>
                            {String(profile.summaryStats.hIndex)},
                          </div>
                        </div>
                      )}
                      {profile.summaryStats.i10Index > 0 && (
                        <div
                          className={css(profileStepStyles.metadataItem)}
                          style={{ display: "flex", columnGap: 5 }}
                        >
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
                          <div
                            className={css(profileStepStyles.paper)}
                            style={{
                              display: "flex",
                              columnGap: 10,
                              marginBottom: 15,
                            }}
                          >
                            <PaperIcon
                              withAnimation={false}
                              onClick={undefined}
                              color={colors.MEDIUM_GREY2()}
                            />
                            <div>
                              <div
                                className={css(profileStepStyles.paperTitle)}
                                style={{ fontSize: 16 }}
                              >
                                {work.title}
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  fontSize: 14,
                                  color: colors.MEDIUM_GREY2(),
                                  marginTop: 4,
                                  width: "100%",
                                  flexWrap: "wrap",
                                  lineHeight: "20px",
                                }}
                              >
                                <div
                                  className={css(
                                    profileStepStyles.paperAuthors
                                  )}
                                >
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

                              <div
                                className={css(profileStepStyles.concepts)}
                                style={{
                                  display: "flex",
                                  columnGap: 10,
                                  marginTop: 8,
                                }}
                              >
                                {work.concepts.map((concept, index) => {
                                  return (
                                    <div
                                      className={css(profileStepStyles.concept)}
                                      style={{}}
                                    >
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
          <div
            className={css(profileStepStyles.terms)}
            style={{
              marginTop: 15,
              marginBottom: 10,
              display: "flex",
              flexDirection: "column",
              rowGap: "5px",
            }}
          >
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

interface VerificationFormProps {
  onStepSelect?: (step: "PROVIDER_STEP" | "PROFILE_STEP") => void;
  onClose: () => void;
}

const VerificationForm = ({ onStepSelect, onClose }: VerificationFormProps) => {
  const [step, setStep] = useState<
    | "PROVIDER_STEP"
    | "PROFILE_STEP"
    | "SUCCESS_STEP"
    | "ALREADY_VERIFIED_STEP"
    | "ERROR_STEP"
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
          onProfileAlreadyVerified={() => setStep("ALREADY_VERIFIED_STEP")}
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
      {step === "ALREADY_VERIFIED_STEP" && (
        <VerificationFormAlreadyVerifiedStep onClose={onClose} />
      )}
    </div>
  );
};

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

const VerificationModal = ({ isModalOpen = true, handleModalClose }) => {
  return (
    <BaseModal
      offset={"0px"}
      isOpen={isModalOpen}
      hideClose={false}
      closeModal={handleModalClose}
      zIndex={1000000001}
      modalStyle={styles.modalStyle}
      modalContentStyle={styles.modalContentStyle}
    >
      <div className={css(styles.formWrapper)}>
        <VerificationForm onClose={handleModalClose} />
      </div>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  formWrapper: {
    width: 540,
    height: "100%",
  },
  modalStyle: {},
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
