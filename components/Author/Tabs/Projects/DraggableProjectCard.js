// NPM Modules
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { StyleSheet, css } from "aphrodite";
import Ripples from "react-ripples";

// Component
import PaperEntryCard from "~/components/Hubs/PaperEntryCard";

// Redux
import { ModalActions } from "~/redux/modals";
import { BulletActions } from "~/redux/bullets";
import { LimitationsActions } from "~/redux/limitations";
import { MessageActions } from "~/redux/message";

const DraggableProjectCard = (props) => {
  return (
    <div className={css(styles.root)}>
      <div className={css(styles.checkbox)}>
        <i className="fas fa-dot-circle" />
      </div>
      <div className={css(styles.paperRoot)}>
        <PaperEntryCard
          paper={props.data}
          key={`draggableProject-${props.data.id}`}
        />
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  root: {
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
});

export default DraggableProjectCard;
