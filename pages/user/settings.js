import React, { Component, Fragment } from "react";
import { css, StyleSheet } from "aphrodite";
import { connect } from "react-redux";
import Ripples from "react-ripples";

import FormSelect from "~/components/Form/FormSelect";
import CheckBox from "~/components/Form/CheckBox";

import { DIGEST_FREQUENCY } from "~/config/constants";
import {
  checkBoxStyles,
  defaultStyles,
  hubStyles,
  selectStyles,
} from "~/config/themes/styles";
import { updateEmailPreference, fetchEmailPreference } from "~/config/fetch";
import {
  buildSubscriptionPatch,
  digestSubscriptionPatch,
  emailPreferencePatch,
} from "~/config/shims";
import { MessageActions } from "~/redux/message";
import { HubActions } from "~/redux/hub";
import { subscribeToHub, unsubscribeFromHub } from "../../config/fetch";
import { doesNotExist } from "~/config/utils";

const frequencyOptions = Object.keys(DIGEST_FREQUENCY).map((key) => {
  return {
    value: DIGEST_FREQUENCY[key],
    label: key,
  };
});

const contentSubscriptionOptions = [
  {
    id: "paperSubscription",
    label: "Someone posts a thread on a paper I authored",
  },
  {
    id: "threadSubscription",
    label: "Someone comments on a thread I posted",
  },
  {
    id: "commentSubscription",
    label: "Someone replies to a comment I posted",
  },
  {
    id: "replySubscription",
    label: "Someone replies to a reply I posted",
  },
];

class UserSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      frequency: null,
      emailRecipientId: null,
      isOptedOut: null,
    };

    contentSubscriptionOptions.forEach((option) => {
      this.state[option.id] = true;
    });
  }

  componentDidMount() {
    if (doesNotExist(this.props.hubs)) {
      this.props.dispatch(HubActions.getHubs());
    }
    fetchEmailPreference().then((preference) => {
      const frequency = this.getInitialFrequencyOption(preference);
      const contentSubscriptions = this.getInitialContentSubscriptionOptions(
        preference
      );
      const isOptedOut = this.getInitialIsOptedOut(preference);
      this.setState({
        emailRecipientId: preference.id,
        frequency,
        ...contentSubscriptions,
        isOptedOut,
      });
    });
  }

  getInitialFrequencyOption = (emailPreference) => {
    const initial = frequencyOptions.filter((option) => {
      return (
        option.value ===
        emailPreference.digestSubscription.notificationFrequency
      );
    });
    return initial[0];
  };

  getInitialContentSubscriptionOptions = (emailPreference) => {
    const initial = {};
    const subscriptionKeys = Object.keys(emailPreference).filter((key) => {
      return key.includes("Subscription");
    });
    subscriptionKeys.forEach((key) => {
      initial[key] = !emailPreference[key].none;
    });
    return initial;
  };

  getInitialIsOptedOut = (emailPreference) => {
    return emailPreference.isOptedOut;
  };

  renderFrequencySelect() {
    return (
      <Fragment>
        <div className={css(defaultStyles.listLabel)} id={"hubListTitle"}>
          {"Hub Digest Frequency"}
        </div>
        <FormSelect
          id={"frequencySelect"}
          options={frequencyOptions}
          value={this.state.frequency}
          containerStyle={selectStyles.container}
          inputStyle={selectStyles.input}
          onChange={this.handleFrequencyChange}
          isSearchable={false}
        />
      </Fragment>
    );
  }

  handleFrequencyChange = (id, option) => {
    const currentFrequency = this.state.frequency;
    this.setState({
      frequency: option,
    });
    const data = digestSubscriptionPatch({
      notificationFrequency: option.value,
    });
    updateEmailPreference(this.state.emailRecipientId, data)
      .then(() => {
        this.props.dispatch(MessageActions.setMessage("Saved!"));
        this.props.dispatch(MessageActions.showMessage({ show: true }));
      })
      .catch((err) => {
        this.displayError(err);
        this.setState({
          frequency: currentFrequency,
        });
      });
  };

  renderSubscribedHubs = () => {
    return (
      <Fragment>
        <div className={css(defaultStyles.listLabel)} id={"hubListTitle"}>
          {"Currently Subscribed Hubs"}
        </div>
        <div className={css(hubStyles.list)}>
          {this.props.subscribedHubs.map((hub) => {
            return this.renderHub(hub);
          })}
        </div>
      </Fragment>
    );
  };

  renderHub = (hub) => {
    return (
      <Ripples
        key={hub.id}
        className={css(hubStyles.entry)}
        onClick={() => this.handleHubUnsubscribe(hub.id)}
      >
        {hub.name} X
      </Ripples>
    );
  };

  handleHubUnsubscribe = (hubId) => {
    const { hubs, topHubs } = this.props;
    unsubscribeFromHub(hubId)
      .then((res) => {
        this.props.dispatch(HubActions.updateHub(hubs, topHubs, { ...res }));
        this.props.dispatch(MessageActions.setMessage("Unsubscribed!"));
        this.props.dispatch(MessageActions.showMessage({ show: true }));
      })
      .catch(this.displayError);
  };

  renderHubSelect() {
    const subscribedHubIds = this.props.subscribedHubs.map((hub) => hub.id);
    const availableHubs = this.props.hubs.filter((hub) => {
      return !subscribedHubIds.includes(hub.id);
    });
    return (
      <Fragment>
        <div className={css(defaultStyles.listLabel)} id={"hubListTitle"}>
          {"Available Hubs"}
        </div>
        <FormSelect
          id={"hubSelect"}
          options={this.buildHubOptions(availableHubs)}
          containerStyle={selectStyles.container}
          inputStyle={selectStyles.input}
          onChange={this.handleHubSubscribe}
          isSearchable={true}
          placeholder={"Subscribe to a hub"}
        />
      </Fragment>
    );
  }

  buildHubOptions = (hubs) => {
    return (
      hubs &&
      hubs.map((hub) => {
        return {
          value: hub.id,
          label: hub.name,
        };
      })
    );
  };

  handleHubSubscribe = (id, option) => {
    const { hubs, topHubs } = this.props;

    subscribeToHub(option.value)
      .then((res) => {
        this.props.dispatch(HubActions.updateHub(hubs, topHubs, { ...res }));
        this.props.dispatch(MessageActions.setMessage("Subscribed!"));
        this.props.dispatch(MessageActions.showMessage({ show: true }));
      })
      .catch(this.displayError);
  };

  renderContentSubscriptions = () => {
    return contentSubscriptionOptions.map((option) => {
      return (
        <CheckBox
          key={option.id}
          isSquare={true}
          active={this.state[option.id]}
          label={option.label}
          id={option.id}
          onChange={this.handleContentSubscribe}
          labelStyle={checkBoxStyles.labelStyle}
        />
      );
    });
  };

  handleContentSubscribe = (id, nextActiveState) => {
    const startingActiveState = this.state[id];
    this.setState({
      [id]: nextActiveState,
    });

    const data = buildSubscriptionPatch(id, nextActiveState);
    updateEmailPreference(this.state.emailRecipientId, data)
      .then(() => {
        this.props.dispatch(MessageActions.setMessage("Saved!"));
        this.props.dispatch(MessageActions.showMessage({ show: true }));
      })
      .catch((err) => {
        this.displayError(err);
        this.setState({
          [id]: startingActiveState,
        });
      });
  };

  renderOptOut = () => {
    return (
      <Fragment>
        <p>I don't want emails</p>
        <CheckBox
          key={"optOut"}
          isSquare={true}
          active={this.state.isOptedOut}
          label={"Opt out of all email updates"}
          id={"optOut"}
          onChange={this.handleOptOut}
          labelStyle={checkBoxStyles.labelStyle}
        />
      </Fragment>
    );
  };

  handleOptOut = (id, nextActiveState) => {
    const startingActiveState = this.state.isOptedOut;
    this.setState({
      isOptedOut: nextActiveState,
    });

    const data = emailPreferencePatch({ isOptedOut: nextActiveState });
    updateEmailPreference(this.state.emailRecipientId, data)
      .then(() => {
        this.props.dispatch(MessageActions.setMessage("Saved!"));
        this.props.dispatch(MessageActions.showMessage({ show: true }));
      })
      .catch((err) => {
        this.displayError(err);
        this.setState({
          isOptedOut: startingActiveState,
        });
      });
  };

  displayError = (err) => {
    console.error(err);
    this.props.dispatch(
      MessageActions.setMessage("Oops! Something went wrong.")
    );
    this.props.dispatch(
      MessageActions.showMessage({ show: true, error: true })
    );
  };

  render() {
    return (
      <div>
        <div className={css(defaultStyles.title)}>User Settings</div>
        <div className={css(defaultStyles.subtitle)}>Email Preferences</div>
        {this.renderFrequencySelect()}
        {this.renderSubscribedHubs()}
        {this.renderHubSelect()}
        <p>Email me when...</p>
        {this.renderContentSubscriptions()}
        {this.renderOptOut()}
      </div>
    );
  }
}

const styles = StyleSheet.create({});

const mapStateToProps = (state) => ({
  ...state.hubs,
});

export default connect(
  mapStateToProps,
  null
)(UserSettings);
