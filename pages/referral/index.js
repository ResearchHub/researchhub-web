import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/pro-light-svg-icons";
import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { useState, useRef, useEffect } from "react";
import { useTransition, animated } from "react-spring";
import nookies from "nookies";

import colors from "../../config/themes/colors";

// Components
import FormInput from "../../components/Form/FormInput";
import ComponentWrapper from "~/components/ComponentWrapper";
import CustomHead from "~/components/Head";
import { AUTH_TOKEN } from "~/config/constants";
import ReferredUserList from "~/components/Referral/ReferredUserList";

import { breakpoints } from "~/config/themes/screen";

const Index = ({ auth }) => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [copySuccessMessage, setCopySuccessMessage] = useState(null);
  const [referralLink, setReferralLink] = useState("");
  const formInputRef = useRef();

  useEffect(() => {
    setReferralLink(
      `${window.location.protocol}//${window.location.host}/referral/${auth?.user?.referral_code}`
    );
  }, []);

  function copyToClipboard() {
    setShowSuccessMessage(true);
    formInputRef.current.select();
    document.execCommand("copy");
    // e.target.focus(); // TODO: Uncomment if we don't want highlighting
    setCopySuccessMessage("Copied!");
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 2000);
  }

  return (
    <div className={css(styles.container)}>
      <div className={css(styles.banner)}>
        <img
          draggable={false}
          src={"/static/referrals/referral-banner.svg"}
          className={css(styles.bannerOverlay)}
        />
        <ReactTransitionComponent>
          <div className={css(styles.column, styles.titleContainer)}>
            <h1 className={css(styles.title)}>ResearchHub Referral Program</h1>
            <p className={css(styles.subtitle)}>
              Get rewarded for referring scientists and reserachers to our
              platform.
            </p>
            <FormInput
              getRef={formInputRef}
              onClick={copyToClipboard}
              inlineNodeRight={
                <a className={css(styles.copyLink)} onClick={copyToClipboard}>
                  {showSuccessMessage ? (
                    "Copied!"
                  ) : (
                    <span className={css(styles.copyIcon)}>
                      {<FontAwesomeIcon icon={faCopy}></FontAwesomeIcon>}
                    </span>
                  )}
                </a>
              }
              inlineNodeStyles={styles.inlineNodeStyles}
              messageStyle={[
                styles.copySuccessMessageStyle,
                !showSuccessMessage && styles.noShow,
              ]}
              value={referralLink}
              containerStyle={styles.containerStyle}
              inputStyle={styles.inputStyle}
            />
          </div>
        </ReactTransitionComponent>
      </div>
      <ComponentWrapper>
        <div className={css(styles.invitedFriendsSection)}>
          <ReferredUserList />
        </div>
      </ComponentWrapper>
      <CustomHead title="ResearchHub Referral Program" />
    </div>
  );
};

const ReactTransitionComponent = ({ children, state, trail }) => {
  // a component that takes a props and arguments to make a resusable transition component
  const [show, set] = useState(state);
  const transitions = useTransition(
    show,
    null,
    {
      from: {
        transform: "translate3d(0, 40px, 0)",
        opacity: 0,
      },
      enter: {
        transform: "translate3d(0, 0px, 0)",
        opacity: 1,
      },
      unique: true,
    },
    []
  );

  return transitions.map(({ item, key, props }) => (
    <animated.div key={key} style={props}>
      {children}
    </animated.div>
  ));
};

const styles = StyleSheet.create({
  container: {
    color: colors.TEXT_DARKER_GREY,
  },
  rsc: {
    color: colors.NEW_BLUE(1),
  },
  user: {
    paddingTop: 16,
    paddingBottom: 16,
    borderBottom: `1px solid ${colors.PLACEHOLDER_CARD_BACKGROUND}`,
  },
  banner: {
    height: 300,
    width: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    justifyContent: "center",
    alignItems: "center",
    // opacity: 0,
    transition: "all ease-in-out 0.5s",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      paddingLeft: 25,
      paddingRight: 25,
    },
  },
  earnedRSC: {
    color: "#59BD5C",
  },
  emptyState: {
    marginBottom: 16,
  },
  buttonContainer: {
    textAlign: "center",
  },
  invitedFriendsSection: {
    maxWidth: 624,
    margin: "0 auto",
    paddingBottom: 50,
    marginTop: 100,
  },
  invitedFriendsTitle: {
    fontWeight: 500,
    fontSize: 18,
    borderBottom: `1px solid ${colors.PLACEHOLDER_CARD_BACKGROUND}`,
    paddingBottom: 21,
    marginTop: 50,
  },
  bannerOverlay: {
    position: "absolute",
    top: 0,
    objectFit: "cover",
    height: "100%",
    minHeight: "100%",
    width: "100%",
    minWidth: "100%",
  },
  howItWorksTitle: {
    textAlign: "center",
    marginTop: 105,
    fontSize: 33,
    fontWeight: 500,

    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      marginTop: 50,
    },
  },
  referralSection: {
    textAlign: "center",
  },
  coinIcon: {
    height: 50,
  },
  inputStyle: {
    paddingRight: 70,
  },
  containerStyle: {
    paddingRight: "unset",
    minHeight: "unset",
    width: 700,
    margin: "0 auto",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: "auto",
    },
  },
  noShow: {
    display: "none",
  },
  copySuccessMessageStyle: {
    position: "absolute",
    right: -70,
    color: colors.WHITE(),
  },
  inlineNodeStyles: {
    paddingRight: 0,
    right: 16,
  },
  title: {
    color: colors.WHITE(),
    fontWeight: 500,
    fontSize: 40,
    textAlign: "center",
    "@media only screen and (max-width: 665px)": {
      fontSize: 25,
    },
    "@media only screen and (max-width: 416px)": {
      fontSize: 25,
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 20,
    },
  },
  subtitle: {
    textAlign: "center",
    color: colors.WHITE(),
    fontWeight: 400,
    fontSize: 18,
    opacity: 0.8,
    maxWidth: 650,
    margin: "0 auto",
    marginBottom: 32,
    whiteSpace: "pre-wrap",
  },
  copyLink: {
    color: colors.NEW_BLUE(),
    cursor: "pointer",
    fontWeight: 500,
  },
  copyIcon: {
    fontSize: 22,
  },
  innerTitle: {
    fontSize: 22,
    fontWeight: 500,
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);
  const authToken = cookies[AUTH_TOKEN];

  if (!authToken) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // Pass data to the page via props
  return { props: {} };
}

export default connect(mapStateToProps)(Index);
