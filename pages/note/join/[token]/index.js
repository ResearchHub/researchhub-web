import { acceptNoteInvite, fetchNoteInviteByToken } from "~/config/fetch";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import Button from "~/components/Form/Button";
import { StyleSheet, css } from "aphrodite";
import Loader from "~/components/Loader/Loader";
import { MessageActions } from "~/redux/message";
import colors from "~/config/themes/colors";
import AuthorAvatar from "~/components/AuthorAvatar";
import GoogleLoginButton from "~/components/GoogleLoginButton";
import { AuthActions } from "~/redux/auth";
import { captureError } from "~/config/utils/error";

const Index = ({ auth, showMessage, setMessage, googleLogin, getUser }) => {
  const router = useRouter();
  const [invite, setInvite] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const _fetchInvite = async () => {
      try {
        const invite = await fetchNoteInviteByToken({
          token: router.query.token,
        });
        setInvite(invite);
        setIsLoading(false);
      } catch (error) {
        captureError({
          error,
          msg: "Failed to fetch invite",
          data: {
            token: router.query.token,
          },
        });

        setMessage(`Failed to fetch invite`);
        showMessage({ show: true, error: true });
      } finally {
        setIsLoading(false);
      }
    };

    if (auth.authChecked && !invite) {
      _fetchInvite();
    }
  }, [auth]);

  const handleJoin = async (e) => {
    e && e.stopPropagation();

    try {
      setIsLoading(true);
      await acceptNoteInvite({ token: router.query.token });

      setMessage("");
      showMessage({ show: true, error: false });

      // router.push(`/${org.slug}/notebook`);
    } catch (error) {
      captureError({
        error,
        msg: "Failed to accept invite",
        data: {
          token: router.query.token,
        },
      });
      setMessage(`Invitation invalid or expired`);
      showMessage({ show: true, error: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={css(styles.container)}>
      {invite && (
        <div>
          <div className={css(styles.avatarContainer)}>
            <AuthorAvatar size={80} author={invite.inviter.author_profile} />
          </div>
          <div className={css(styles.inviteText)}>
            {`${invite.inviter.author_profile.first_name} ${invite.inviter.author_profile.last_name} `}
            invited you to collaborate on note{" "}
            <strong>{invite.note.title}</strong>.
          </div>
        </div>
      )}
      {isLoading ? (
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
  avatarContainer: {
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