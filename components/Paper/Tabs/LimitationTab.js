import React, { Fragment } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import Ripples from "react-ripples";
import ReactPlaceholder from "react-placeholder/lib";
import "react-placeholder/lib/reactPlaceholder.css";

import BulletPlaceholder from "~/components/Placeholders/BulletPlaceholder";
import FormTextArea from "~/components/Form/FormTextArea";
import Button from "~/components/Form/Button";
import SummaryBulletPoint from "~/components/Paper/SummaryBulletPoint";
import Loader from "~/components/Loader/Loader";

// redux
import { LimitationsActions } from "~/redux/limitations";
import { ModalActions } from "~/redux/modals";
import { MessageActions } from "~/redux/message";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import EmptySummarySection from "./Summary/EmptySummary";

const LIMITATIONS_COUNT = 5;

class LimitationTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      limitationText: "", // value of input
      limits: this.props.limitations.limits
        ? this.props.limitations.limits
        : [],
      showDropdown: false, // boolean to show dropdown menu
      showForm: false, // boolean to determine whether to show form or not
      pendingSubmission: false, // boolean to show if api call is being made
      loading: true, // boolean for initial fetch
      transition: false,
    };
    this.dropdownIcon;
    this.dropdownMenu;
    this.textInput;
  }

  componentDidMount = async () => {
    window.addEventListener("mousedown", this.handleOutsideClick);
    // this.fetchLimitations();
    this.setState({ loading: false });
  };

  componentDidUpdate = async (prevProps) => {
    if (prevProps !== this.props) {
      if (prevProps.paperId !== this.props.paperId) {
        this.setState({
          limits: this.props.limitations.limits
            ? this.props.limitations.limits
            : [],
          loading: false,
        });
      } else if (
        JSON.stringify(prevProps.limitations.limits) !==
        JSON.stringify(this.props.limitations.limits)
      ) {
        this.setState({
          limits: this.props.limitations.limits,
          loading: false,
        });
      }
    }
  };

  componentWillUnmount() {
    window.addEventListener("mousedown", this.handleOutsideClick);
  }

  fetchLimitations = async () => {
    this.setState({ loading: true });
    await this.props.getLimitations(this.props.paperId);
    this.props.setLimitCount(this.props.limitations.limits.length);
    this.setState({ loading: false });
  };

  handleOutsideClick = (e) => {
    if (this.dropdownIcon && this.dropdownIcon.contains(e.target)) {
      return;
    }
    if (this.dropdownMenu && !this.dropdownMenu.contains(e.target)) {
      e.stopPropagation();
      this.setState({ showDropdown: false });
    }
  };

  handleLimitationText = (id, value) => {
    this.setState({ [id]: value });
  };

  transitionWrapper = (fn) => {
    this.setState({ transition: true }, () => {
      setTimeout(() => {
        fn();
        this.setState({ transition: false });
      }, 400);
    });
  };

  toggleDropdown = () => {
    this.setState({ showDropdown: !this.state.showDropdown });
  };

  toggleForm = () => {
    this.setState(
      {
        showForm: !this.state.showForm,
        limitationText: this.state.showForm ? "" : this.state.limitationText,
      },
      () => {
        this.state.showFocus && this.textInput && this.textInput.focus();
        this.state.showDropdown && this.setState({ showDropdown: false });
      }
    );
  };

  formatNewLimitation = () => {
    let ordinal = this.state.limits.length + 1;

    if (ordinal > LIMITATIONS_COUNT) {
      ordinal = null;
    }

    let newBullet = {
      plain_text: this.state.limitationText,
      ordinal,
      bullet_type: "LIMITATION",
    };

    return newBullet;
  };

  onEditCallback = (limit, index) => {
    let limits = [...this.state.limits];
    limits[index] = limit;
    this.setState({ limits }, () => {
      this.props.updateStateByKey("limits", limits);
    });
  };

  submitLimitation = async () => {
    let { limitations, postLimitation, showMessage, setMessage } = this.props;
    this.props.showMessage({ load: true, show: true });
    let paperId = this.props.paperId;
    let limitation = this.formatNewLimitation();

    this.setState({ pendingSubmission: true });
    await postLimitation({ paperId, limitation, prevState: limitations });
    if (!this.props.limitations.pending && this.props.limitations.success) {
      showMessage({ show: false });
      setMessage("Limitation successfully added!");
      showMessage({ show: true });
      this.setState({
        pendingSubmission: false,
        limitationText: "",
        showForm: false,
      });
    } else {
      showMessage({ show: false });
      setMessage("Something went wrong.");
      showMessage({ show: true, error: true });
      this.setState({
        pendingSubmission: false,
      });
    }
  };

  renderLimitations = () => {
    let { loading, limits, showForm } = this.state;
    if (loading) {
      return (
        <ReactPlaceholder
          ready={false}
          showLoadingAnimation
          customPlaceholder={<BulletPlaceholder color="#efefef" />}
        />
      );
    } else if (limits.length === 0 && !showForm) {
      return (
        <Ripples
          className={css(styles.emptyStateContainer)}
          onClick={() => {
            this.transitionWrapper(this.toggleForm);
          }}
        >
          <div className={css(styles.text)}>
            <div className={css(styles.mainText)}>
              No limitations have been added yet
            </div>
            <div className={css(styles.subText)}>
              Add a limitation to the paper's research
            </div>
          </div>
        </Ripples>
      );
    } else
      return limits.map((bullet, index) => {
        return (
          <SummaryBulletPoint
            key={`limitation-${index}`}
            data={bullet}
            onEditCallback={this.onEditCallback}
            type={"LIMITATION"}
            index={index}
          />
        );
      });
  };

  renderDropdown = () => {
    let { showDropdown } = this.state;
    let { openManageBulletPointsModal } = this.props;
    return (
      <div
        className={css(dropdownStyles.row)}
        ref={(ref) => (this.dropdownMenu = ref)}
      >
        <Ripples
          className={css(dropdownStyles.item)}
          onClick={() => openManageBulletPointsModal(true, "limitations")}
        >
          <span className={css(dropdownStyles.dropdownItemIcon)}>
            <i className="fal fa-tasks-alt" />
          </span>
          Manage
        </Ripples>
        <Ripples
          className={css(dropdownStyles.item, dropdownStyles.itemLast)}
          onClick={() => this.transitionWrapper(this.toggleForm)}
        >
          <span className={css(dropdownStyles.dropdownItemIcon)}>
            {icons.plusCircle}
          </span>
          Add Limitation
        </Ripples>
      </div>
    );
  };

  render() {
    let { showForm, pendingSubmission, transition } = this.state;
    let { openManageBulletPointsModal } = this.props;
    return (
      <div className={css(dropdownStyles.bulletContainer)}>
        <div className={css(styles.bulletHeaderContainer)}>
          <div className={css(styles.bulletTitle)}>Limitations</div>
          <div className={css(dropdownStyles.dropdownContainer)}>
            {this.renderDropdown()}
          </div>
        </div>
        <div
          className={css(styles.bulletPoints, transition && styles.transition)}
        >
          {showForm && (
            <div
              className={css(
                styles.bulletForm,
                showForm && styles.showBulletForm
              )}
            >
              <FormTextArea
                id={"limitationText"}
                containerStyle={inputStyles.formContainer}
                labelStyle={inputStyles.formLabel}
                inputStyle={inputStyles.formInput}
                onChange={this.handleLimitationText}
                value={this.state.limitationText}
                passedRef={this.textInput}
                autoFocus={true}
              />
              <div className={css(styles.buttonRow)}>
                <Ripples
                  className={css(
                    styles.cancelButton,
                    pendingSubmission && styles.disabled
                  )}
                  onClick={
                    pendingSubmission
                      ? null
                      : () => this.transitionWrapper(this.toggleForm)
                  }
                >
                  Cancel
                </Ripples>
                <Button
                  label={
                    pendingSubmission ? (
                      <Loader loading={true} size={20} color={"#fff"} />
                    ) : (
                      "Submit"
                    )
                  }
                  size={"small"}
                  onClick={this.submitLimitation}
                  disabled={pendingSubmission}
                />
              </div>
            </div>
          )}
          {this.renderLimitations()}
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  bulletContainer: {
    width: "100%",
    backgroundColor: "#fff",
    marginBottom: 20,
    boxSizing: "border-box",
  },
  bulletpointIcon: {
    color: "#3971FF",
    height: 50,
    width: 50,
    fontSize: 25,
    borderRadius: "50%",
    boxSizing: "border-box",
    paddingTop: 3,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: `1.5px solid #3971FF`,
  },
  bulletHeaderContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,

    "@media only screen and (max-width: 767px)": {
      flexDirection: "column",
      alignItems: "flex-start",
    },
  },
  bulletTitle: {
    fontSize: 22,
    fontWeight: 500,
    color: colors.BLACK(),
    textAlign: "left",
    "@media only screen and (max-width: 415px)": {
      fontSize: 20,
    },
  },
  bulletAddIcon: {
    fontSize: 20,
    cursor: "pointer",
    padding: "0px 1px",
    borderRadius: 4,
    boxSizing: "border-box",
  },
  transition: {
    opacity: 0,
  },
  bulletPoints: {
    boxSizing: "border-box",
    opacity: 1,
    transition: "all ease-in-out 0.1s",
  },
  bulletForm: {
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
    transition: "all ease-in-out 0.1s",
    height: 0,
    paddingBottom: 16,
    overflow: "hidden",
  },
  showBulletForm: {
    height: "unset",
    overflow: "unset",
  },
  buttonRow: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 15,
  },
  cancelButton: {
    height: 37,
    width: 126,
    minWidth: 126,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    cursor: "pointer",
    borderRadius: 4,
    userSelect: "none",
    ":hover": {
      color: "#3971FF",
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
  disabled: {
    opacity: "0.4",
  },
  emptyStateContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    boxSizing: "border-box",
    borderRadius: 3,
    padding: 16,
    border: `1px solid #F0F0F0`,
    backgroundColor: "#FBFBFD",
    cursor: "pointer",
    ":hover": {
      borderColor: colors.BLUE(),
    },
  },
  emptyStateIcon: {
    color: "#3971FF",
    height: 30,
    minHeight: 30,
    maxHeight: 30,
    width: 30,
    minWidth: 30,
    maxWidth: 30,
    borderRadius: "50%",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    paddingTop: 2,
    border: `1.5px solid #3971FF`,
  },
  text: {
    textAlign: "center",
    width: "100%",
  },
  mainText: {
    fontSize: 20,
    fontWeight: 500,
    "@media only screen and (max-width: 415px)": {
      fontSize: 16,
    },
  },
  subText: {
    fontSize: 16,
    color: "rgba(36, 31, 58, 0.8)",
    marginTop: 5,
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
      textAlign: "center",
    },
  },
});

const dropdownStyles = StyleSheet.create({
  dropdownContainer: {
    position: "relative",
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  dropdownMenu: {
    position: "absolute",
    bottom: -75,
    right: 0,
    boxShadow: "rgba(129,148,167,0.39) 0px 3px 10px 0px",
    boxSizing: "border-box",
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: 4,
    zIndex: 2,
  },
  dropdownIcon: {
    position: "absolute",
    top: 4,
    right: 5,
    padding: "1px 5px",
    borderRadius: 4,
    cursor: "pointer",
  },
  dropdownItem: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    boxSizing: "border-box",
    padding: 8,
    width: "100%",
    color: colors.BLACK(),
    cursor: "pointer",
    userSelect: "none",
    borderBottom: "1px solid #F3F3F8",
    width: "100%",
    fontSize: 14,
    ":hover": {
      background: "#F3F3F8",
    },
  },
  itemLast: {
    marginLeft: 16,
    widht: 119,
    minWidth: 119,
    maxWidth: 119,
    "@media only screen and (max-width: 767px)": {
      marginLeft: 32,
    },
  },
  item: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    boxSizing: "border-box",
    whiteSpace: "nowrap",
    width: "100%",
    color: colors.BLACK(),
    cursor: "pointer",
    opacity: 0.6,
    fontSize: 14,
    padding: 8,
    ":hover": {
      color: colors.PURPLE(),
      textDecoration: "underline",
      opacity: 1,
    },

    "@media only screen and (max-width: 767px)": {
      padding: 0,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  dropdownItemIcon: {
    fontSize: 14,
    marginRight: 6,
  },
});

const inputStyles = StyleSheet.create({
  formContainer: {
    margin: 0,
    padding: 0,
    width: "100%",
  },
  formLabel: {
    margin: 0,
    padding: 0,
    display: "none",
  },
  formInput: {
    margin: 0,
    minHeight: 50,
  },
});

const mapStateToProps = (state) => ({
  limitations: state.limitations,
});

const mapDispatchToProps = {
  openManageBulletPointsModal: ModalActions.openManageBulletPointsModal,
  getLimitations: LimitationsActions.getLimitations,
  postLimitation: LimitationsActions.postLimitation,
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LimitationTab);
