import { acceptInviteToOrg, fetchOrgByInviteToken } from "~/config/fetch";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import Button from "~/components/Form/Button";
import { StyleSheet, css } from "aphrodite";
import Loader from "~/components/Loader/Loader";
import { MessageActions } from "~/redux/message";
import colors from "~/config/themes/colors";
import PermissionNotificationWrapper from "~/components/PermissionNotificationWrapper";
import OrgAvatar from "~/components/Org/OrgAvatar";

const Index = ({ auth, showMessage, setMessage }) => {
  const router = useRouter();
  const [org, setOrg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrg = async() => {
      try {
        const org = await fetchOrgByInviteToken({ token: router.query.token });
        setOrg(org);
        setIsLoading(false);
      } catch (err) {
        console.error(`Could not fetch org by ${router.query.token}`)
      }
    }

    fetchOrg();
  }, []);

  const joinOrg = async (e) => {
    e.stopPropagation();

    try {
      setIsLoading(true);
      await acceptInviteToOrg({ token: router.query.token });
      showMessage({ show: true, error: false });

      router.push(`/${org.slug}/notebook`);
    } catch (err) {
      setIsLoading(false);

      if (err.message === "Invitation has expired") {
        setMessage(`Invitation has expired`);
      }

      showMessage({ show: true, error: true });
    }
  };

  return (
    <div className={css(styles.container)}>
      {org && (
        <div>
          <div className={css(styles.OrgAvatarContainer)}>
            <OrgAvatar org={org} size={150} />
          </div>
          <div className={css(styles.inviteText)}>
            You have been invited to join {org.name}.
          </div>
        </div>
      )}
      {isLoading ? (
        <Loader key={"loader"} loading={true} size={25} color={colors.BLUE()} />
      ) : (
        <PermissionNotificationWrapper
          loginRequired
          modalMessage="join [organization]"
          onClick={joinOrg}
          styling={styles.rippleClass}
        >
          <Button label={`Join Org`} hideRipples={true} />
        </PermissionNotificationWrapper>
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
    fontSize: 18,
  },
  container: {
    width: 300,
    margin: "0 auto",
    marginTop: 100,
    textAlign: "center",
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
