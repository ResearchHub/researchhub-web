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

const Index = ({ auth, showMessage, setMessage }) => {
  const router = useRouter();
  const [org, setOrg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(async () => {
    try {
      const org = await fetchOrgByInviteToken({ token: router.query.token });
      setOrg(org);
    }
    catch(err) {
    }

    setIsLoading(false);
  }, []);

  const joinOrg = async (e) => {
    e.stopPropagation();

    try {
      setIsLoading(true);
      await acceptInviteToOrg({ token: router.query.token })
      showMessage({ show: true, error: false });

      router.push(`/org/${org.slug}/`)
    }
    catch(err) {
      setIsLoading(false);

      if (err.message === "Invitation has expired") {
        setMessage(`Invitation has expired`);  
      }
      
      showMessage({ show: true, error: true });
    }
  }

  return (
    <div className={css(styles.container)}>
      {org && 
        <div className={css(styles.inviteText)}>{org.name} invited you to join its organization.</div>
      }
      {isLoading ? 
        <Loader
          key={"loader"}
          loading={true}
          size={25}
          color={colors.BLUE()}
        />
        : (
          <PermissionNotificationWrapper
            loginRequired
            modalMessage="join [organization]"
            onClick={joinOrg}
            styling={styles.rippleClass}
          >
            <Button label={`Join Org`} hideRipples={true} />
          </PermissionNotificationWrapper>
        )
      }
    </div>
  );
}

const styles = StyleSheet.create({
  inviteText: {
    marginBottom: 20,
  },
  container: {
    width: 300,
    margin: "0 auto",
    marginTop: 100,
    textAlign: "center",
  }
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);