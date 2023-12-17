import OrcidConnectButton from "../OrcidConnectButton";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  faAngleLeft,
  faAngleRight,
  faCircleXmark,
} from "@fortawesome/pro-solid-svg-icons";
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
import {
  completeProfileVerification,
  fetchOpenAlexProfiles,
  fetchPaperByDoi,
} from "./lib/api";
import { breakpoints } from "~/config/themes/screen";

interface VerificationFormProps {
  onStepSelect?: (step: "PROVIDER_STEP" | "PROFILE_STEP") => void;
}

export type VERIFICATION_STEP =
  | "DOI_STEP"
  | "AUTHOR_STEP"
  | "SUCCESS_STEP"
  | "ERROR_STEP";

const VerificationForm = ({ onStepSelect }: VerificationFormProps) => {
  const [step, setStep] = useState<VERIFICATION_STEP>("DOI_STEP");
  const [error, setError] = useState<any | null>(null);

  const [providerDataResponse, setProviderDataResponse] = useState<any | null>(
    null
  );

  return (
    <div>
      {step === "DOI_STEP" && (
        <VerificationFormDoiStep onPrevClick={undefined} />
      )}
      {/* {step === "ERROR_STEP" && (
        <VerificationFormErrorStep
          error={error}
          onPrevClick={() => setStep("PROVIDER_STEP")}
        />
      )} */}
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

const VerificationFormErrorStep = ({ onPrevClick, error }) => {
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
        {error?.status === 404 ? (
          <>
            Your Orcid profile was not found. Please ensure that your Orcid
            profile has at least one paper associated with it. Orcid may take a
            few days to accurately reflect changes.
          </>
        ) : (
          <>
            An error occurred while verifying your authorship. Please try a
            different verification method.
          </>
        )}
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

const VerificationFormDoiStep = ({ onPrevClick }) => {
  const [doiInput, setDoiInput] = useState<string | null>(null);
  const [isDoiValid, setIsDoiValid] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isPaperFound, setIsPaperFound] = useState<boolean>(false);

  function extractAndValidateDOI(urlOrDOI) {
    // Remove the protocol and domain if present
    let doi = urlOrDOI.replace(/^https?:\/\/doi\.org\//, "");

    // Remove any query string
    doi = doi.split("?")[0];

    // Regex for validating the DOI
    const regex = /^10\.\d{4,9}\/[-._;()\/:A-Z0-9]+$/i;

    return regex.test(doi);
  }

  useEffect(() => {
    if (!doiInput) {
      return;
    }

    const isValid = extractAndValidateDOI(doiInput);
    setIsDoiValid(isValid);
    if (isValid) {
      setIsFetching(true);
      debounceFetchPaperByDoi({ doi: doiInput });
    }
  }, [doiInput]);

  const debounceFetchPaperByDoi = useCallback(
    debounce(async ({ doi }) => {
      try {
        fetchPaperByDoi({ doi });
      } finally {
        setIsFetching(false);
      }
    }, 1000),
    []
  );

  return (
    <div>
      <div>First, enter a DOI for a paper you authored:</div>
      <FormInput
        error={doiInput && !isDoiValid && "Please enter a valid DOI"}
        disabled={isFetching}
        containerStyle={profileStepStyles.inputContainer}
        onChange={(name, value) => {
          setDoiInput(value);
          setIsPaperFound(false);
        }}
      />
      <div style={{ minHeight: 100 }}>
        {isFetching && (
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
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button disabled={!isPaperFound} label={"Next"} />
      </div>
    </div>
  );
};

const profileStepStyles = StyleSheet.create({
  pagination: {
    display: "flex",
    columnGap: "5px",
    marginBottom: 15,
  },
  paginationDisabled: {
    color: colors.MEDIUM_GREY2(),
    cursor: "initial",
  },
  inputContainer: {
    marginBottom: 0,
  },
  paginationSquare: {
    cursor: "pointer",
    border: `1px solid ${colors.GREY(0.4)}`,
    height: "30px",
    width: "30px",
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",

    ":hover": {
      transition: "0.2s",
      backgroundColor: colors.NEW_BLUE(0.2),
      color: colors.NEW_BLUE(),
      border: `1px solid ${colors.NEW_BLUE(0.4)}`,
    },
  },
  paginationSelected: {
    backgroundColor: colors.NEW_BLUE(0.1),
    color: colors.NEW_BLUE(),
    border: `1px solid ${colors.NEW_BLUE(0.6)}`,
  },
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
    },
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
