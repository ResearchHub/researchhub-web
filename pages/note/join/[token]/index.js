import { acceptNoteInvite, fetchNoteByInviteToken } from "~/config/fetch";
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

const Index = ({ auth, showMessage, setMessage, googleLogin, getUser }) => {
  const router = useRouter();
  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const _fetchNote = async () => {
      try {
        const note = await fetchNoteByInviteToken({
          token: router.query.token,
        });
        setNote(note);
        setIsLoading(false);
      } catch (err) {
        setMessage(`Failed to fetch invite`);
        showMessage({ show: true, error: true });
        setIsLoading(false);
        console.error(`Could not fetch org by ${router.query.token}`);
      }
    };

    if (auth.authChecked && !note) {
      _fetchNote();
    }
  }, [auth]);

  const handleJoin = async (e) => {
    e && e.stopPropagation();

    try {
      setIsLoading(true);
      await acceptNoteInvite({ token: router.query.token });
      showMessage({ show: true, error: false });

      // router.push(`/${org.slug}/notebook`);
    } catch (err) {
      setIsLoading(false);

      setMessage(`Invitation invalid or expired.`);
      showMessage({ show: true, error: true });
    }
  };

  return (
    <div className={css(styles.container)}>
      {/*org && (
        <div>
          <div className={css(styles.OrgAvatarContainer)}>
            <OrgAvatar org={org} size={110} fontSize={28} />
          </div>
          <div className={css(styles.inviteText)}>
            You have been invited to join <strong>{org.name}</strong>.
          </div>
        </div>
      )*/}
      {false ? (
        <Loader key={"loader"} loading={true} size={25} color={colors.BLUE()} />
      ) : (
        <div className={css(styles.buttonContainer)}>
          {auth.isLoggedIn ? (
            <Button
              onClick={handleJoin}
              label={`Accept Invite`}
              hideRipples={true}
            />
          ) : (
            <GoogleLoginButton
              styles={styles.googleLoginButton}
              googleLogin={googleLogin}
              getUser={getUser}
              loginCallback={handleJoin}
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
    marginTop: 100,
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
