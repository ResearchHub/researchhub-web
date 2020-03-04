import { connect } from "react-redux";
// import { StyleSheet, css } from "aphrodite";
import Router, { withRouter } from "next/router";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

import { AuthActions, AuthConstants } from "../../../redux/auth";
import { ORCID_CLIENT_ID, ORCID_JWKS_URI } from "../../../config/constants";
import { getFragmentParameterByName } from "~/config/utils";
// import Modal from "react-modal";

// import { AuthActions } from "../../redux/auth";

// import FormInput from "../../components/Form/FormInput";
// import Button from "../../components/Form/Button";
// import Loader from "../../components/Loader/Loader";

// import colors from "~/config/themes/colors";
// import API from "~/config/api";
// import { Helpers } from "@quantfive/js-web-config";
// import { modalStyles } from "~/config/themes/styles";

const client = jwksClient({
  strictSsl: false, // Default true
  jwksUri: ORCID_JWKS_URI,
});

class OrcidConnectPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: false,
      orcid: "",
    };
    this.path = "";
  }

  componentDidMount() {
    this.parseJwtFromUrl();
  }

  parseJwtFromUrl() {
    const { asPath } = this.props.router;
    this.path = asPath;
    if (this.path) {
      const jwtIdToken = this.parseJwtIdToken();
      if (jwtIdToken && jwtIdToken !== "") {
        this.parseJwtIfValid(jwtIdToken);
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.orcid !== this.state.orcid && this.state.orcid !== "") {
      const accessToken = this.parseAccessToken();
      console.log("accessToken", accessToken);
      console.log("orcid", this.state.orcid);
      this.props.dispatch((dispatch) => {
        return dispatch({ type: AuthConstants.ORCID_CONNECT_PENDING });
      });
      this.props
        .dispatch(
          AuthActions.orcidConnect({ accessToken, orcid: this.state.orcid })
        )
        .then((action) => {
          const success = action.orcidConnectSuccess;
          if (success) {
            Router.push({
              pathname: `/orcid/login`,
              query: { success: "true" },
            });
          } else {
            console.error("ORCID connect failed");
          }
        })
        .catch(console.error);
    }
  }

  parseJwtIdToken() {
    return getFragmentParameterByName("id_token", this.path);
  }

  async parseJwtIfValid(token) {
    await jwt.verify(
      token,
      getKey,
      {
        alg: ["RS256"],
        iss: ["https://orcid.org"],
        aud: ORCID_CLIENT_ID,
        gracePeriod: 15 * 60, //15 mins skew allowed
      },
      (err, decoded) => {
        if (!err) this.setState({ orcid: decoded["sub"] });
      }
    );

    function getKey(header, callback) {
      client.getSigningKey(header.kid, (err, key) => {
        const pubKey = key.getPublicKey();
        callback(null, pubKey);
      });
    }
  }

  parseAccessToken() {
    return getFragmentParameterByName("access_token", this.path);
  }

  getOrcidFromJwt(token) {
    return token.payload["sub"];
  }

  render() {
    return <div>Reached connect page</div>;
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default withRouter(connect(mapStateToProps)(OrcidConnectPage));
