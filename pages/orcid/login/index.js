import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import Router, { withRouter } from "next/router";

import { AuthActions } from "~/redux/auth";

import FormInput from "~/components/Form/FormInput";
import Button from "~/components/Form/Button";
import Loader from "~/components/Loader/Loader";

import colors from "~/config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

class OrcidLoginSuccessPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount(props) {}

  render() {
    return null;
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
              src={
                "https://ndownloader.figshare.com/files/8439047/preview/8439047/preview.jpg"
              } // not sure how stable this link is
            />
          </div>
          <div className={css(styles.headerContainer)}>
            <React.Fragment>
              <h1 className={css(styles.header)}>Successfully Logged in.</h1>
            </React.Fragment>
          </div>
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

export default withRouter(connect(mapStateToProps)(OrcidLoginSuccessPage));
