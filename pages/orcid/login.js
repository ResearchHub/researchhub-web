import { connect } from "react-redux";
import { withRouter } from "next/router";
import { AuthActions } from "../../redux/auth";

class OrcidLoginPage extends React.Component {
  componentDidMount() {
    const code = this.props.router.query["code"];
    if (code) {
      this.props.dispatch(AuthActions.orcidLogin({ code }));
    }
  }

  render() {
    return <div>Loading...</div>;
  }
}

const mapStateToProps = (state) => ({});

export default withRouter(connect(mapStateToProps)(OrcidLoginPage));
