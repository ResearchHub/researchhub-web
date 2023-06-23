import { connect } from "react-redux";
import ReferencesRoot from "~/components/ReferenceManager/references/ReferencesRoot";

function Index(props) {
  const { isLoggedIn, authChecked } = props;

  return <ReferencesRoot authChecked={authChecked} isLoggedIn={isLoggedIn} />;
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn,
  authChecked: state.auth.authChecked,
});

export default connect(mapStateToProps)(Index);
