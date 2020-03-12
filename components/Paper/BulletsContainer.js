import React, { Fragment } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import Ripples from "react-ripples";

import FormTextArea from "../Form/FormTextArea";
import Button from "../Form/Button";
import SummaryBulletPoint from "./SummaryBulletPoint";
import Loader from "~/components/Loader/Loader";

// redux
import { BulletActions } from "~/redux/bullets";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

const bullets = [
  {
    plain_text: `Bitcoin falls 12% as one of the world's biggest cryptocurrency markets readies a bill to ban trading`,
  },
  {
    plain_text: `Bitcoin falls 12% as one of the world's biggest cryptocurrency markets readies a bill to ban trading`,
  },
  {
    plain_text: `Bitcoin falls 12% as one of the world's biggest cryptocurrency markets readies a bill to ban trading`,
  },
];

class BulletsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bulletText: "",
      bullets: this.props.bulletsRedux.bullets,
      showDropdown: false,
      showForm: false,
      pendingSubmission: false,
    };
    this.dropdownIcon;
    this.dropdownMenu;
    this.textInput;
  }

  componentDidMount() {
    window.addEventListener("mousedown", this.handleOutsideClick);
    this.props.dispatch(BulletActions.getBullets(this.props.paperId));
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (
        JSON.stringify(prevProps.bulletsRedux.bullets) !==
        JSON.stringify(this.props.bulletsRedux.bullets)
      ) {
        this.setState({ bullets: this.props.bulletsRedux.bullets });
      }
    }
  }

  componentWillUnmount() {
    window.addEventListener("mousedown", this.handleOutsideClick);
  }

  handleOutsideClick = (e) => {
    if (this.dropdownIcon && this.dropdownIcon.contains(e.target)) {
      return;
    }
    if (this.dropdownMenu && !this.dropdownMenu.contains(e.target)) {
      e.stopPropagation();
      this.setState({ showDropdown: false });
    }
  };

  handleBulletText = (id, value) => {
    this.setState({ [id]: value });
  };

  toggleDropdown = () => {
    this.setState({ showDropdown: !this.state.showDropdown });
  };

  toggleForm = () => {
    this.setState({ showForm: !this.state.showForm }, () => {
      this.state.showFocus && this.textInput && this.textInput.focus();
      this.state.showDropdown && this.setState({ showDropdown: false });
    });
  };

  formatNewBullet = () => {
    let ordinal = this.state.bullets.length + 1;

    if (ordinal > 10) {
      ordinal = null;
    }

    let newBullet = {
      plain_text: this.state.bulletText,
      ordinal,
    };

    return newBullet;
  };

  submitBulletPoint = async () => {
    let { dispatch, bulletsRedux } = this.props;
    let paperId = this.props.paperId;
    let bullet = this.formatNewBullet();
    let newBullets = [...this.state.bullets, bullet];
    this.setState({ pendingSubmission: true });
    await dispatch(
      BulletActions.postBullet({ paperId, bullet, prevState: bulletsRedux })
    );
    if (!this.props.bulletsRedux.pending && this.props.bulletsRedux.success) {
      this.setState({
        pendingSubmission: false,
        bulletText: "",
        showForm: false,
      });
    } else {
      //handle error
    }
  };

  renderBulletPoints = () => {
    return this.state.bullets.map((bullet, index) => {
      return (
        <SummaryBulletPoint key={`summaryBulletPoint-${index}`} data={bullet} />
      );
    });
  };

  renderDropdown = () => {
    let { showDropdown } = this.state;
    return (
      <Fragment>
        {showDropdown && (
          <div
            className={css(dropdownStyles.dropdownMenu)}
            ref={(ref) => (this.dropdownMenu = ref)}
          >
            <Ripples
              className={css(dropdownStyles.dropdownItem)}
              onClick={this.toggleForm}
            >
              <span className={css(dropdownStyles.dropdownItemIcon)}>
                {icons.plusCircle}
              </span>
              Add a Bullet
            </Ripples>
            <Ripples className={css(dropdownStyles.dropdownItem)}>
              <span className={css(dropdownStyles.dropdownItemIcon)}>
                <i class="fal fa-tasks-alt" />
              </span>
              Manage Bullets
            </Ripples>
          </div>
        )}
      </Fragment>
    );
  };

  render() {
    let { showForm, pendingSubmission } = this.state;
    return (
      <div className={css(dropdownStyles.bulletContainer)}>
        <div className={css(styles.bulletHeaderContainer)}>
          <div className={css(styles.bulletTitle)}>Main Points</div>
          <div className={css(dropdownStyles.dropdownContainer)}>
            <Ripples
              className={css(styles.bulletAddIcon)}
              onClick={this.toggleDropdown}
              ref={(ref) => (this.dropdownIcon = ref)}
            >
              {icons.ellipsisH}
            </Ripples>
            {this.renderDropdown()}
          </div>
        </div>
        <div className={css(styles.bulletPoints)}>
          <div
            className={css(
              styles.bulletForm,
              showForm && styles.showBulletForm
            )}
          >
            <FormTextArea
              id={"bulletText"}
              containerStyle={inputStyles.formContainer}
              labelStyle={inputStyles.formLabel}
              inputStyle={inputStyles.formInput}
              onChange={this.handleBulletText}
              passedRef={this.textInput}
              autoFocus={true}
            />
            <div className={css(styles.buttonRow)}>
              <Ripples
                className={css(
                  styles.cancelButton,
                  pendingSubmission && styles.disabled
                )}
                onClick={pendingSubmission ? null : this.toggleForm}
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
                onClick={this.submitBulletPoint}
                disabled={pendingSubmission}
              />
            </div>
          </div>
          {this.renderBulletPoints()}
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
    // border: '1px solid #F2F2F2'
  },
  bulletHeaderContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  bulletTitle: {
    fontSize: 26,
    fontWeight: 500,
    color: colors.BLACK(),
    textAlign: "left",
  },
  bulletAddIcon: {
    fontSize: 20,
    cursor: "pointer",
    padding: "0px 1px",
    borderRadius: 4,
    boxSizing: "border-box",
  },
  bulletPoints: {
    // padding: '0px 10px',
    boxSizing: "border-box",
  },
  bulletForm: {
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
    transition: "all ease-in-out 0.1s",
    height: 0,
    overflow: "hidden",
  },
  showBulletForm: {
    height: "unset",
    overflow: "unset",
    marginBottom: 15,
    // zIndex: 3
  },
  buttonRow: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 15,
    paddingBottom: 15,
    borderBottom: "1px solid #F0F0F0",
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
      // textDecoration: 'underline'
    },
  },
  disabled: {
    opacity: "0.4",
  },
});

const dropdownStyles = StyleSheet.create({
  dropdownContainer: {
    position: "relative",
  },
  dropdownMenu: {
    position: "absolute",
    bottom: -75,
    right: 0,
    width: 160,
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
  dropdownItemIcon: {
    color: "#918f9b",
    fontSize: 14,
    paddingLeft: 8,
    marginRight: 13,
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
    // padding: 0,
    minHeight: 50,
  },
});

const mapStateToProps = (state) => ({
  bulletsRedux: state.bullets,
});

export default connect(
  mapStateToProps,
  null
)(BulletsContainer);
