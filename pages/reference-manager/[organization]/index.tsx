import { connect } from "react-redux";
import ReferencesRoot from "~/components/ReferenceManager/references/ReferencesRoot";
import nookies from "nookies";
import { AUTH_TOKEN } from "~/config/constants";

function Index(props) {
  const { isLoggedIn, authChecked, calloutOpen } = props;

  return (
    <ReferencesRoot
      authChecked={authChecked}
      isLoggedIn={isLoggedIn}
      calloutOpen={calloutOpen}
    />
  );
}

export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);
  const calloutOpen = cookies["callout_open"];

  return {
    props: {
      calloutOpen,
    },
  };
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn,
  authChecked: state.auth.authChecked,
});

export default connect(mapStateToProps)(Index);
