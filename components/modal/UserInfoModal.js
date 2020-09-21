import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import Ripples from "react-ripples";

// Component
import BaseModal from "./BaseModal";
import FormInput from "~/components/Form/FormInput";
import FormTextArea from "~/components/Form/FormTextArea";
import Loader from "~/components/Loader/Loader";
import Button from "~/components/Form/Button";

class UserInfoModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    handleFormChange = () => {};
  }

  render() {
    <BaseModal
      isOpen={isOpen}
      closeModal={this.closeModal}
      title={"Edit your personal information"}
      subtitle={props.subtitle && props.subtitle}
    >
      <FormInput label={"First Name"} required={true} />
      <FormInput label={"Last Name"} required={true} />
      <FormInput label={"Email Address"} required={true} />
      <FormInput label={"Education"} />
      <FormInput />
      <FormInput label={"Occupation"} />
      <FormInput label={"Tagline"} />
      <FormInput label={"About"} />
    </BaseModal>;
  }
}
