import { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { useTransition, animated } from "react-spring";

// Helpers
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "../../config/themes/colors";

// Components
import FormInput from "../../components/Form/FormInput";
import ComponentWrapper from "~/components/ComponentWrapper";
import CustomHead from "~/components/Head";
import EmptyState from "../../components/Placeholders/EmptyState";
import LeaderboardUser from "../../components/Leaderboard/LeaderboardUser";
import ReactPlaceholder from "react-placeholder/lib";
import LeaderboardPlaceholder from "../../components/Placeholders/LeaderboardPlaceholder";
import Button from "../../components/Form/Button";
import Loader from "../../components/Loader/Loader";
import HowItWorks from "../../components/Referral/HowItWorks";

const isServer = () => typeof window === "undefined";

const Index = ({ auth }) => {
  const [copySuccessMessage, setCopySuccessMessage] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [fetchingInvitedFriends, setFetchingInvitedFriends] = useState(true);
  const [fetchingLoadMore, setFetchingLoadMore] = useState(true);
  const [RSC_EARNED, setRSCEarned] = useState(0);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [invitedFriends, setInvitedFriends] = useState([]);
  const formInputRef = useRef();

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

  useEffect(() => {
    if (auth.user.id) {
      fetchInvitedFriends();
      fetchRSCTotal();
    }
  }, [auth.user.id]);

  const fetchRSCTotal = () => {
    return fetch(API.USER({ route: "referral_rsc" }), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        setRSCEarned(res.amount);
      });
  };

  const fetchInvitedFriends = (loadMore) => {
    if (loadMore) {
      setFetchingLoadMore(true);
    } else {
      setFetchingInvitedFriends(true);
    }
    return fetch(API.USER({ invitedBy: auth.user.id, page }), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        setFetchingInvitedFriends(false);
        setFetchingLoadMore(false);
        setInvitedFriends(res.results);
        setPage(page + 1);
        setTotalCount(res.count);
      });
  };

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
              Invite your friends to ResearchHub. If they sign up and
              contribute, you and your friend will receive 125 RSC! Share your
              personal referral link by copying below.
            </p>
            <FormInput
              getRef={formInputRef}
              inlineNodeRight={
                <a className={css(styles.copyLink)} onClick={copyToClipboard}>
                  {showSuccessMessage ? "Copied!" : "Copy Referral Link"}
                </a>
              }
              inlineNodeStyles={styles.inlineNodeStyles}
              messageStyle={[
                styles.copySuccessMessageStyle,
                !showSuccessMessage && styles.noShow,
              ]}
              value={`https://www.researchhub.com/referral/${auth.user.referral_code}`}
              containerStyle={styles.containerStyle}
              inputStyle={styles.inputStyle}
            />
          </div>
        </ReactTransitionComponent>
      </div>
      <ComponentWrapper>
        <h2 className={css(styles.howItWorksTitle)}>How it Works</h2>
        <HowItWorks />
        <div className={css(styles.invitedFriendsSection)}>
          <h2 className={css(styles.howItWorksTitle)}>
            You've Earned{" "}
            <span className={css(styles.rsc)}> {RSC_EARNED} RSC</span>
          </h2>
          <h3 className={css(styles.invitedFriendsTitle)}>Invited friends</h3>
          <ReactPlaceholder
            ready={!fetchingInvitedFriends}
            customPlaceholder={<LeaderboardPlaceholder color="#efefef" />}
          >
            {invitedFriends.length > 0 ? (
              invitedFriends.map((friend) => {
                return (
                  <LeaderboardUser
                    name={
                      friend.author_profile.first_name +
                      " " +
                      friend.author_profile.last_name
                    }
                    reputation={
                      <span className={css(styles.earnedRSC)}>
                        {friend.has_seen_first_coin_modal
                          ? "+125 RSC"
                          : "0 RSC"}
                      </span>
                    }
                    authorProfile={friend.author_profile}
                    authorId={friend.author_profile.id}
                  />
                );
              })
            ) : (
              <div>
                <EmptyState
                  text={"You haven't invited any friends yet"}
                  icon={
                    <img
                      className={css(styles.emptyState)}
                      src={"/static/referrals/second-step.svg"}
                    ></img>
                  }
                />
              </div>
            )}

            {totalCount > invitedFriends.length && (
              <div className={css(styles.buttonContainer)}>
                {!fetchingLoadMore ? (
                  <Button
                    onClick={() => {
                      fetchingInvitedFriends(true);
                    }}
                    isWhite={true}
                    label={"Load More"}
                  ></Button>
                ) : (
                  <Loader
                    key={"paperLoader"}
                    loading={true}
                    size={25}
                    color={colors.BLUE()}
                  />
                )}
              </div>
            )}
          </ReactPlaceholder>
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
    color: "#241F3A",
  },
  rsc: {
    color: colors.NEW_BLUE(1),
  },
  banner: {
    height: 345,
    width: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // opacity: 0,
    transition: "all ease-in-out 0.5s",
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
    "@media only screen and (min-width: 768px)": {
      marginTop: 150,
    },
  },
  invitedFriendsTitle: {
    fontWeight: 500,
    fontSize: 18,
    borderBottom: "1px solid #EFEFEF",
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

    "@media only screen and (max-width: 767px)": {
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
    paddingRight: 166,

    "@media only screen and (max-width: 767px)": {
      paddingRight: 16,
    },
  },
  containerStyle: {
    paddingRight: "unset",
    minHeight: "unset",
    width: 700,
    margin: "0 auto",
    "@media only screen and (max-width: 665px)": {
      width: 360,
    },
    "@media only screen and (max-width: 415px)": {
      width: 338,
    },
    "@media only screen and (max-width: 321px)": {
      width: 270,
    },
  },
  noShow: {
    display: "none",
  },
  copySuccessMessageStyle: {
    position: "absolute",
    right: -70,
    top: "50%",
    color: "#fff",
    transform: "translateY(-50%)",
  },
  inlineNodeStyles: {
    paddingRight: 0,
    right: 16,

    "@media only screen and (max-width: 767px)": {
      textAlign: "center",
      marginTop: 16,
      background: "#fff",
      padding: 16,
      top: 50,
      transform: "translateX(-50%)",
      right: "unset",
      left: "50%",
      border: "2px solid rgb(78, 83, 255)",
      borderRadius: 4,
    },
  },
  title: {
    color: "#fff",
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
    color: "#fff",
    fontWeight: 400,
    fontSize: 18,
    opacity: 0.8,
    maxWidth: 650,
    margin: "0 auto",
    marginBottom: 32,
  },
  copyLink: {
    color: colors.PURPLE(),
    cursor: "pointer",
    fontWeight: 500,
  },
  innerTitle: {
    fontSize: 22,
    fontWeight: 500,
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Index);
