import React from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import { withRouter } from "next/router";

// Component
import Button from "~/components/Form/Button";
import Input from "~/components/Form/FormInput";
import Message from "~/components/Loader/Message";
import ComponentWrapper from "~/components/ComponentWrapper";

import { RHLogo } from "~/config/themes/icons";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

// Redux
import { MessageActions } from "~/redux/message";

class OptOut extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      email: "",
    };
    this.state = {
      ...this.initialState,
    };
  }

  componentDidMount() {
    this.setState({
      email: this.props.router.query.email,
    });
  }

  onEmailChange = (id, email) => {
    this.setState({
      email,
    });
  };

  optOut = () => {
    let { setMessage, showMessage } = this.props;
    let params = API.POST_CONFIG({
      email: this.state.email,
      subscribe: false,
      opt_out: true,
    });
    fetch(API.EMAIL_PREFERENCE({ update_or_create: true }), params)
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((resp) => {
        setMessage("Opt-out Complete!");
        showMessage({ show: true });
      });
  };

  render() {
    let { finishedLoading } = this.state;

    return (
      <div className={css(styles.container)}>
        <ComponentWrapper>
          <div className={css(styles.body)}>
            <RHLogo iconStyle={styles.logo} />
            <h2 className={css(styles.title)}>
              Are you sure you want to opt-out?
            </h2>
            <div>
              After you have oupted out you won't receive anymore emails from
              ResearchHub.
            </div>
            <div>
              To opt-out, please confirm your email is correct before
              continuing.
            </div>
            <Input
              value={this.state.email}
              onChange={this.onEmailChange}
              placeholder={"Email"}
            />
            <Button label={"Opt-Out"} onClick={this.optOut} />
          </div>
        </ComponentWrapper>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: "100%",
  },
  body: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 150,
    height: "100%",
  },
  logo: {
    height: 60,
    marginBottom: 50,
  },
});

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(OptOut));
