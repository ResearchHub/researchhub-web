import { acceptInviteToOrg, fetchOrgByInviteToken } from "~/config/fetch";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import Button from "~/components/Form/Button";
import { StyleSheet, css } from "aphrodite";
import Loader from "~/components/Loader/Loader";
import { MessageActions } from "~/redux/message";
import colors from "~/config/themes/colors";
import OrgAvatar from "~/components/Org/OrgAvatar";
import GoogleLoginButton from "~/components/GoogleLoginButton";
import { AuthActions } from "~/redux/auth";
import HeadComponent from "~/components/Head";
import { captureEvent } from "~/config/utils/events";

const Index = ({ auth, showMessage, setMessage, googleLogin, getUser }) => {
  const router = useRouter();
  const [org, setOrg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const _fetchOrg = async () => {
      try {
        const org = await fetchOrgByInviteToken({ token: router.query.token });
        setOrg(org);
        setIsLoading(false);
      } catch (error) {
        setMessage(`Failed to fetch invite`);
        showMessage({ show: true, error: true });
        setIsLoading(false);
        console.error(`Could not fetch org by ${router.query.token}`);
        captureEvent({
          error,
          msg: "Failed to fetch org by invite",
          tags: { token: router.query.token },
          data: { org },
        });
      }
    };

    if (auth.authChecked && !org) {
      _fetchOrg();
    }
  }, [auth]);

  const handleJoinOrg = async (e) => {
    e && e.stopPropagation();

    try {
      setIsLoading(true);
      await acceptInviteToOrg({ token: router.query.token });
      showMessage({ show: true, error: false });

      router.push(`/${org.slug}/notebook`);
    } catch (err) {
      setIsLoading(false);

      setMessage(
        `Invitation invalid or expired.\n Contact organization's admin.`
      );
      showMessage({ show: true, error: true });
    }
  };

  return (
    <div className={css(styles.container)}>
      {org && (
        <div>
          <HeadComponent title={`Join ${org.name}`} />
          <div className={css(styles.OrgAvatarContainer)}>
            <OrgAvatar org={org} size={110} fontSize={28} />
          </div>
          <div className={css(styles.inviteText)}>
            You have been invited to join <strong>{org.name}</strong>.
          </div>
        </div>
      )}
      {isLoading ? (
        <Loader key={"loader"} size={35} color={colors.BLUE()} />
      ) : (
        <div className={css(styles.buttonContainer)}>
          {auth.isLoggedIn ? (
            <Button
              onClick={handleJoinOrg}
              label={`Join Org`}
              hideRipples={true}
            />
          ) : (
            <GoogleLoginButton
              styles={styles.googleLoginButton}
              googleLogin={googleLogin}
              getUser={getUser}
              loginCallback={handleJoinOrg}
              customLabel={"Sign in with Google to join"}
            />
          )}
        </div>
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  OrgAvatarContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 20,
  },
  inviteText: {
    marginBottom: 20,
    fontSize: 16,
  },
  container: {
    width: 300,
    margin: "0 auto",
    marginTop: 150,
    textAlign: "center",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {
  googleLogin: AuthActions.googleLogin,
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
  getUser: AuthActions.getUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);