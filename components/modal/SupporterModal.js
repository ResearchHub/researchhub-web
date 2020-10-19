// NPM Modules
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";

// Component
import BaseModal from "./BaseModal";
import SupporterCard from "~/components/Author/Tabs/Projects/SupporterCard";

// Redux
import { ModalActions } from "../../redux/modals";

import colors from "~/config/themes/colors";

const SupporterModal = (props) => {
  const closeModal = () => {
    props.openSupporterModal(false);
  };

  const renderSupporters = () => {
    return props.supporters.map((supporter, i) => (
      <SupporterCard
        key={`supporterCard-${supporter.id}`}
        supporter={supporter}
        index={i}
        count={props.supporters.length}
      />
    ));
  };

  return (
    <BaseModal
      isOpen={props.modals.openSupporterModal}
      closeModal={closeModal}
      title="Supported By"
    >
      <div className={css(styles.supporterList)}>{renderSupporters()}</div>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  supporterList: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 30,
    width: 300,
    boxSizing: "border-box",
  },
});

const mapStateToProps = (state) => ({
  modals: state.modals,
});

const mapDispatchToProps = {
  openSupporterModal: ModalActions.openSupporterModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SupporterModal);
