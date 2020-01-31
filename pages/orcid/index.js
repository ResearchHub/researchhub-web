import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import Router, { withRouter } from "next/router";

import { AuthActions } from "../../redux/auth";

import FormInput from "../../components/Form/FormInput";
import Button from "../../components/Form/Button";
import Loader from "../../components/Loader/Loader";

import colors from "~/config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

class OrcidLoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      loading: false,
      error: false,
    };
  }

  componentDidMount(props) {
    const token = this.props.router.query["token"];
    const hasEmail = this.props.router.query["hasEmail"];

    if (token) {
      this.props.dispatch(AuthActions.orcidLogin({ token }));
    }

    const hasEmailAlready = hasEmail == "true" ? true : false;
    if (hasEmailAlready) {
      Router.push({ pathname: `/orcid/login`, query: { success: "true" } });
    }
  }

  handleEmailChange = (id, value) => {
    if (!this.state.loading) {
      this.setState({ [id]: value });
    }
  };

  toggleLoadingState = () => {
    this.setState({ loading: !this.state.loading });
  };

  submitEmail = async (e) => {
    e && e.preventDefault();
    if (this.state.loading) return;

    this.toggleLoadingState();
    const body = { email: this.state.email };
    const userId = this.props.auth.user && this.props.auth.user.id;
    await fetch(API.USER({ userId }), API.PATCH_CONFIG(body))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        this.toggleLoadingState();
        Router.push({ pathname: `/orcid/login`, query: { success: "true" } });
      })
      .catch((err) => {
        this.toggleLoadingState();
        this.setState({ error: true });
      });
  };

  render() {
    return (
      <div className={css(styles.page)}>
        <div className={css(styles.content)}>
          <div className={css(styles.icons)}>
            <img
              className={css(styles.rhIcon)}
              src={"/static/ResearchHubLogo.png"}
            />
            <img
              className={css(styles.orcidIcon)}
              src={"/static/icons/orcid.png"}
            />
          </div>
          <div className={css(styles.headerContainer)}>
            <React.Fragment>
              <h1 className={css(styles.header)}>We're almost done!</h1>
              <p className={css(styles.description)}>
                Confirm your email address to complete login with Orcid.
              </p>
            </React.Fragment>
          </div>
          <form onSubmit={this.submitEmail}>
            <FormInput
              id={"email"}
              type={"email"}
              label={"Email Address"}
              placeholder={"Email"}
              required={true}
              onChange={this.handleEmailChange}
            />
            {this.state.error && (
              <div className={css(styles.error)}>
                <span className={css(styles.errorIcon)}>
                  <i className="fad fa-exclamation-triangle" />
                </span>
                Something went wrong. Please try again.
              </div>
            )}
            <div className={css(styles.buttonWrapper)}>
              <Button
                label={
                  this.state.loading ? (
                    <Loader loading={true} size={20} color={"#FFF"} />
                  ) : (
                    "Submit"
                  )
                }
                type={"submit"}
                disabled={this.state.loading}
              />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

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

export default withRouter(connect(mapStateToProps)(OrcidLoginPage));
