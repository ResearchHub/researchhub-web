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
} from "~/config/shims";
import { MessageActions } from "~/redux/message";

const frequencyOptions = Object.keys(DIGEST_FREQUENCY).map((key) => {
  return {
    value: DIGEST_FREQUENCY[key],
    label: key,
  };
});

const contentOptions = [
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
    };

    contentOptions.forEach((option) => {
      this.state[option.id] = true;
    });
  }

  componentDidMount() {
    fetchEmailPreference().then((preference) => {
      const frequency = this.getInitialFrequencyOption(preference);
      const contentState = this.getInitialContentState(preference);
      this.setState({
        emailRecipientId: preference.id,
        frequency,
        ...contentState,
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

  getInitialContentState = (emailPreference) => {
    const contentState = {};
    const subscriptionKeys = Object.keys(emailPreference).filter((key) => {
      return key.includes("Subscription");
    });
    subscriptionKeys.forEach((key) => {
      contentState[key] = !emailPreference[key].none;
    });
    return contentState;
  };

  subscribe = (hub) => {
    const config = API.POST_CONFIG();
    return fetch(API.HUB_SUBSCRIBE({ hubId: hub.id }), config)
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        this.props.dispatch(HubActions.updateHub(allHubs, topHubs, { ...res }));
        this.props.setMessage("Subscribed!");
        this.props.showMessage({ show: true });
      });
  };

  unsubscribe = (hub) => {
    return fetch(API.HUB_UNSUBSCRIBE({ hubId: hub.id }), config)
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        this.props.dispatch(HubActions.updateHub(allHubs, topHubs, { ...res }));
        this.props.setMessage("Unsubscribed!");
        this.props.showMessage({ show: true });
      });
  };

  renderHubs = () => {
    return (
      <Fragment>
        <div className={css(defaultStyles.listLabel)} id={"hubListTitle"}>
          {"Subscribed Hubs"}
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
        onClick={this.unsubscribe}
      >
        {hub.name} X
      </Ripples>
    );
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
        console.error(err);
        this.props.dispatch(MessageActions.setMessage("Oops! Update failed."));
        this.props.dispatch(
          MessageActions.showMessage({ show: true, error: true })
        );
        this.setState({
          frequency: currentFrequency,
        });
      });
  };

  renderContentOptions = () => {
    return contentOptions.map((option) => {
      return (
        <CheckBox
          key={option.id}
          isSquare={true}
          active={this.state[option.id]}
          label={option.label}
          id={option.id}
          onChange={this.handleCheckBox}
          labelStyle={checkBoxStyles.labelStyle}
        />
      );
    });
  };

  handleCheckBox = (id) => {
    const nextActiveState = !this.state[id];
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
        console.error(err);
        this.props.dispatch(MessageActions.setMessage("Oops! Update failed."));
        this.props.dispatch(
          MessageActions.showMessage({ show: true, error: true })
        );
        this.setState({
          [id]: !nextActiveState,
        });
      });
  };

  update = () => {
    updateEmailPreference().then((resp) => {
      setMessage("Opt-out Complete!");
      showMessage({ show: true });
    });
  };

  render() {
    return (
      <div>
        <div className={css(defaultStyles.title)}>User Settings</div>
        <div className={css(defaultStyles.subtitle)}>Email Preferences</div>
        {this.renderFrequencySelect()}
        {this.renderHubs()}
        <p>Email me when...</p>
        {this.renderContentOptions()}
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
