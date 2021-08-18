import { Component } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import Ripples from "react-ripples";
import ReactPlaceholder from "react-placeholder/lib";

import BulletPlaceholder from "../Placeholders/BulletPlaceholder";
import FormTextArea from "../Form/FormTextArea";
import Button from "../Form/Button";
import SummaryBulletPoint from "./SummaryBulletPoint";
import Loader from "~/components/Loader/Loader";
import SectionBounty from "./SectionBounty";

// redux
import { BulletActions } from "~/redux/bullets";
import { ModalActions } from "~/redux/modals";
import { MessageActions } from "~/redux/message";

// Config
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

const BULLET_COUNT = 5;

class BulletsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bulletText: "", // value of input
      bullets: this.props.bulletsRedux.bullets
        ? this.props.bulletsRedux.bullets
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
    this.fetchBullets();
  };

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (prevProps.paperId !== this.props.paperId) {
        this.fetchBullets();
      } else if (
        JSON.stringify(prevProps.bulletsRedux.bullets) !==
        JSON.stringify(this.props.bulletsRedux.bullets)
      ) {
        this.setState({ bullets: this.props.bulletsRedux.bullets });
      }
    }
  }

  fetchBullets = async () => {
    this.setState({ loading: true });
    await this.props.getBullets(this.props.paperId);
    this.setState({ loading: false }, () => {
      this.props.afterFetchBullets && this.props.afterFetchBullets();
    });
  };

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
        bulletText: this.state.showForm ? "" : this.state.bulletText,
      },
      () => {
        this.state.showFocus && this.textInput && this.textInput.focus();
        this.state.showDropdown && this.setState({ showDropdown: false });
      }
    );
  };

  formatNewBullet = () => {
    let ordinal = this.state.bullets.length + 1;

    if (ordinal > BULLET_COUNT) {
      ordinal = null;
    }

    let newBullet = {
      plain_text: this.state.bulletText,
      ordinal,
      bullet_type: "KEY_TAKEAWAY",
    };

    return newBullet;
  };

  onEditCallback = (bullet, index) => {
    let bullets = [...this.state.bullets];
    bullets[index] = bullet;
    this.setState({ bullets }, () => {
      this.props.updateStateByKey("bullets", bullets);
    });
  };

  onRemoveCallback = (index) => {
    let bullets = [...this.state.bullets];
    bullets.splice(index, 1);
    this.setState({ bullets }, () => {
      this.props.updateStateByKey("bullets", bullets);
    });
  };

  submitBulletPoint = async () => {
    let {
      bulletsRedux,
      postBullet,
      showMessage,
      setMessage,
      auth,
      openLoginModal,
    } = this.props;
    if (!auth.isLoggedIn) {
      return openLoginModal(true, "Please login to add a key takeaway");
    }
    this.props.showMessage({ load: true, show: true });
    let paperId = this.props.paperId;
    let bullet = this.formatNewBullet();
    let newBullets = [...this.state.bullets, bullet];
    this.setState({ pendingSubmission: true });
    await postBullet({ paperId, bullet, prevState: bulletsRedux });
    if (!this.props.bulletsRedux.pending && this.props.bulletsRedux.success) {
      showMessage({ show: false });
      setMessage("Key takeaway successfully added!");
      showMessage({ show: true });
      this.setState({
        pendingSubmission: false,
        bulletText: "",
        showForm: false,
      });
    } else {
      // handle error
      if (this.props.bulletsRedux.status === 429) {
        showMessage({ show: false });
        return this.setState({ pendingSubmission: false });
      }
      showMessage({ show: false });
      setMessage("Something went wrong.");
      showMessage({ show: true, error: true });
      this.setState({
        pendingSubmission: false,
      });
    }
  };

  renderBulletPoints = () => {
    let { loading, bullets, showForm } = this.state;

    let emptyBullets =
      bullets.filter((bullet) => !bullet.is_removed).length === 0;

    if (loading) {
      return (
        <ReactPlaceholder
          ready={false}
          showLoadingAnimation
          customPlaceholder={<BulletPlaceholder color="#efefef" />}
        >
          <div></div>
        </ReactPlaceholder>
      );
    } else if (emptyBullets && !showForm) {
      return (
        <Ripples
          className={css(styles.emptyStateContainer)}
          onClick={() => {
            this.transitionWrapper(this.toggleForm);
          }}
        >
          <div className={css(styles.text)}>
            <div className={css(styles.mainText)}>
              Add a key takeaway for this paper
            </div>
            <div className={css(styles.subText)}>
              Earn <SectionBounty value={1} /> for adding a key takeaway to the
              paper
            </div>
          </div>
        </Ripples>
      );
    } else
      return bullets.map((bullet, index) => {
        let editable = false;
        let { auth } = this.props;
        if (bullet.created_by.id === auth.user.id || auth.user.moderator) {
          editable = true;
        }
        return (
          <SummaryBulletPoint
            key={`summaryBulletPoint-${bullet.id}`}
            data={bullet}
            onEditCallback={this.onEditCallback}
            editable={editable}
            onRemoveCallback={this.onRemoveCallback}
            type={"KEY_TAKEAWAY"}
            index={index}
            authorProfile={bullet.created_by.author_profile}
          />
        );
      });
  };

  renderDropdown = () => {
    let { showDropdown } = this.state;
    const { openManageBulletPointsModal, paper, updatePaperState } = this.props;
    return (
      <div
        className={css(dropdownStyles.row)}
        ref={(ref) => (this.dropdownMenu = ref)}
      >
        <Ripples
          className={css(dropdownStyles.item)}
          onClick={() => openManageBulletPointsModal(true, "key_takeaway")}
        >
          <span className={css(dropdownStyles.dropdownItemIcon)}>
            {icons.manage}
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
          Add Takeaway
        </Ripples>
      </div>
    );
  };

  showForm = () => {
    let { showForm, pendingSubmission } = this.state;

    if (showForm) {
      return (
        <div
          className={css(styles.bulletForm, showForm && styles.showBulletForm)}
        >
          <FormTextArea
            id={"bulletText"}
            containerStyle={inputStyles.formContainer}
            labelStyle={inputStyles.formLabel}
            inputStyle={inputStyles.formInput}
            onChange={this.handleBulletText}
            value={this.state.bulletText}
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
              onClick={this.submitBulletPoint}
              disabled={pendingSubmission}
            />
          </div>
        </div>
      );
    }
  };

  render() {
    let { showForm, pendingSubmission, transition } = this.state;
    let { openManageBulletPointsModal, paper, updatePaperState } = this.props;
    return (
      <div className={css(styles.bulletContainer)}>
        <div className={css(styles.bulletHeaderContainer)}>
          <div className={css(styles.bulletTitle)}>Key Takeaways</div>
          <div className={css(dropdownStyles.dropdownContainer)}>
            {this.renderDropdown()}
          </div>
        </div>
        <div
          className={css(styles.bulletPoints, transition && styles.transition)}
        >
          {this.showForm()}
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
    position: "relative",
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
    "@media only screen and (max-width: 767px)": {
      marginBottom: 20,
    },
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
  moderatorButton: {
    position: "absolute",
    top: 0,
    right: 0,
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
    width: 119,
    minWidth: 119,
    maxWidth: 119,
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
      marginRight: 15,
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
  bulletsRedux: state.bullets,
  auth: state.auth,
});

const mapDispatchToProps = {
  openManageBulletPointsModal: ModalActions.openManageBulletPointsModal,
  getBullets: BulletActions.getBullets,
  postBullet: BulletActions.postBullet,
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
  updateStateByKey: BulletActions.updateStateByKey,
  openLoginModal: ModalActions.openLoginModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BulletsContainer);
