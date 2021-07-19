import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import Router, { withRouter } from "next/router";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import Modal from "react-modal";

import { ORCID_CLIENT_ID, ORCID_JWKS_URI } from "../../../config/constants";
import colors from "~/config/themes/colors";
import { modalStyles } from "~/config/themes/styles";
import { getFragmentParameterByName } from "~/config/utils";

import { AuthActions, AuthConstants } from "../../../redux/auth";

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
              pathname: `/orcid/connect/success`,
              query: { success: "true" },
            });
          } else {
            this.setState({ error: "ORCID connect failed" });
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
    return (
      <Modal
        className={css(modalStyles.modal)}
        isOpen={true}
        closeModal={null}
        shouldCloseOnOverlayClick={false}
        style={overlay}
        ariaHideApp={false}
      >
        <div className={css(styles.page)}>
          <div className={css(styles.content)}>
            <div className={css(styles.icons)}>
              <img
                className={css(styles.rhIcon)}
                src={"/static/ResearchHubLogo.webp"}
              />
              <img
                className={css(styles.orcidIcon)}
                src={"/static/icons/orcid.png"}
              />
            </div>
            <div className={css(styles.headerContainer)}>
              <React.Fragment>
                <h1 className={css(styles.header)}>Connecting</h1>
                <p className={css(styles.description)}>
                  {(this.state.error && this.state.error) || "Loading..."}
                </p>
              </React.Fragment>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

const overlay = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: "11",
    borderRadius: 5,
  },
};

const styles = StyleSheet.create({
  page: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    background: "url(/static/background/background-modal.png) #FCFCFC",
    backgroundSize: "cover",
    paddingTop: 50,
    height: "100vh",
    width: "100vw",
  },
  content: {
    padding: "30px 30px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    border: "1px solid #E7E7E7",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
  },
  headerContainer: {
    maringTop: 10,
    marginBottom: 10,
  },
  header: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 15,
  },
  description: {
    whiteSpace: "pre-wrap",
    lineHeight: "1.6",
    textAlign: "center",
    fontWeight: 400,
  },
  icons: {
    display: "flex",
    alignItems: "center",
  },
  rhIcon: {
    height: 30,
  },
  orcidIcon: {
    height: 25,
    maxHeight: 25,
    minHeight: 25,
    minWidth: 25,
    maxWidth: 25,
    width: 25,
    paddingLeft: 5,
  },
  linkIcon: {
    margin: "0px 13px",
    color: colors.GREY(),
    fontSize: 14,
  },
  buttonWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  error: {
    marginTop: 0,
    marginBottom: 15,
    color: colors.RED(),
    fontSize: 13,
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
  },
  errorIcon: {
    color: colors.RED(),
    fontSize: 14,
    marginRight: 5,
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default withRouter(connect(mapStateToProps)(OrcidConnectPage));
