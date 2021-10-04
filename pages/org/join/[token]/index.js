import { acceptInviteToOrg } from "~/config/fetch";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import Button from "~/components/Form/Button";
import { StyleSheet, css } from "aphrodite";
import Loader from "~/components/Loader/Loader";
import { MessageActions } from "~/redux/message";
import colors from "~/config/themes/colors";

const Index = ({ auth, showMessage, setMessage }) => {
  const router = useRouter();
  console.log('auth', auth);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log(router.query);
    // acceptInviteToOrg({ token: router.query.token })
  }, []);

  useEffect(() => {

  }, [])

  const joinOrg = async () => {
    try {
      setIsLoading(true);
      await acceptInviteToOrg({ token: router.query.token })
      showMessage({ show: true, error: false });
    }
    catch(err) {
      setIsLoading(false);
      setMessage(`Failed to join organization. ${err}`);
      showMessage({ show: true, error: true });
    }

  }

  return (
    <div className={css(styles.container)}>
      <div className={css(styles.inviteText)}>{`X Org`} Invited you to join.</div>
      {isLoading ? 
        <Loader
          key={"loader"}
          loading={true}
          size={25}
          color={colors.BLUE()}
        />
        : <Button onClick={joinOrg} label={`Join Org`} />
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