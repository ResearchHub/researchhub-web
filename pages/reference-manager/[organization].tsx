import { connect } from "react-redux";
import ReferencesRoot from "~/components/ReferenceManager/references/ReferencesRoot";

function Index(props) {
  const { isLoggedIn, authChecked } = props;
  // NOTE: // TODO: @@lightninglu10 - fix TS. why are we double wrapping with redux here?

  return <ReferencesRoot authChecked={authChecked} isLoggedIn={isLoggedIn} />;
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn,
  authChecked: state.auth.authChecked,
});

export default connect(mapStateToProps)(Index);
