import React, { Component, Fragment } from "react";
import { css, StyleSheet } from "aphrodite";
import { connect } from "react-redux";
import Ripples from "react-ripples";

import FormSelect from "~/components/Form/FormSelect";
import CheckBox from "~/components/Form/CheckBox";

import {
  checkBoxStyles,
  defaultStyles,
  hubStyles,
  selectStyles,
} from "~/config/themes/styles";
import { updateEmailPreference } from "../../config/fetch";

const frequencyOptions = [
  {
    value: "daily",
    label: "Daily",
  },
  {
    value: "immediately",
    label: "Immediately",
  },
  {
    value: "weekly",
    label: "Weekly",
  },
];

const contentOptions = [
  {
    id: "paperThreads",
    label: "Someone posts a thread on a paper I authored",
  },
  {
    id: "threadComments",
    label: "Someone comments on a thread I posted",
  },
  {
    id: "commentReplies",
    label: "Someone replies to a comment I posted",
  },
  {
    id: "replyReplies",
    label: "Someone replies to a reply I posted",
  },
];

class UserSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      frequency: frequencyOptions[0],
    };

    contentOptions.forEach((option) => {
      this.state[option.id] = true;
    });
  }

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
      <Ripples className={css(hubStyles.entry)} onClick={this.unsubscribe}>
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
    this.setState({
      frequency: option,
    });
  };

  renderContentOptions = () => {
    return contentOptions.map((option) => {
      return (
        <CheckBox
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
    const isActive = this.state[id];
    updateNotificationPreference({ id: !isActive });
    this.setState({
      [id]: !isActive,
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
