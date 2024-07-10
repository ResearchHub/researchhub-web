import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/pro-light-svg-icons";
import { Component } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import ReactPlaceholder from "react-placeholder/lib";
import { breakpoints } from "~/config/themes/screen";
import { isEmpty } from "~/config/utils/nullchecks";

// Component
import withWebSocket from "~/components/withWebSocket";
import NotificationEntry from "./NotificationEntry";
import NotificationPlaceholder from "~/components/Placeholders/NotificationPlaceholder";

// Redux
import { NotificationActions } from "~/redux/notification";

import { isNullOrUndefined } from "~/config/utils/nullchecks";
import colors, { mainNavIcons } from "~/config/themes/colors";
import { NAVBAR_HEIGHT } from "../Navbar";
import showGenericToast from "./lib/showGenericToast";

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      newNotif: false,
      count: null,
      fetching: true,
      notifications: [],
    };
    this.notifIcon;
    this.notifMenu;
    this.notifFeed;
  }

  componentDidMount = () => {
    document.addEventListener("mousedown", this.handleOutsideClick);
    this.props.getNotifications().then((res) => {
      const results = res.payload.notifications;
      this.setState({
        count: this.countReadNotifications(results),
        fetching: false,
        notifications: results,
      });
    });
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.wsResponse !== this.props.wsResponse) {
      const { wsResponse, addNotification, notifications } = this.props;
      const response = JSON.parse(wsResponse);
      const notification = response.data;

      if (
        this.props.auth?.isLoggedIn &&
        notification.notification_type === "PUBLICATIONS_ADDED"
      ) {
        showGenericToast({
          href: `/author/${this.props.auth?.user?.author_profile?.id}`,
          label: "View",
          body: "Profile is ready",
        });
      }

      addNotification(notification);
      let newNotifications = [notification, ...notifications];
      this.setState({
        count: this.countReadNotifications(),
        notifications: newNotifications,
      });
    }
    if (this.props.notifications.length > prevProps.notifications.length) {
      this.setState({
        count: this.countReadNotifications(this.props.notification),
      });
    }
  };

  componentWillUnmount() {
    document.addEventListener("mousedown", this.handleOutsideClick);
  }

  countReadNotifications(arr) {
    let count = 0;
    const notifications = arr ? arr : this.props.notifications;

    notifications.forEach((notification) => {
      if (!notification.read) {
        count++;
      }
    });
    return count;
  }

  handleOutsideClick = (e) => {
    if (this.notifIcon && this.notifIcon.contains(e.target)) {
      return;
    }
    if (this.notifMenu && !this.notifMenu.contains(e.target)) {
      e.stopPropagation();
      this.setState({ isOpen: false });
    }
  };

  toggleMenu = () => {
    this.setState({ isOpen: !this.state.isOpen }, () => {
      const ids = this.formatIds();
      this.state.isOpen && this.props.markAllAsRead(ids);
      this.setState({ count: 0 });
    });
  };

  formatIds = () => {
    return this.props.notifications.map((notification) => {
      return notification.id;
    });
  };

  formatNotification = (notification) => {
    const { action_user, body, created_date, navigation_url } = notification;

    return {
      body: body,
      created_by: action_user,
      created_date,
      navigation_url,
    };
  };

  renderMenu = () => {
    let { isOpen } = this.state;
    return (
      <div
        className={css(styles.notificationMenu, isOpen && styles.open)}
        ref={(ref) => (this.notifMenu = ref)}
      >
        <div className={css(styles.menuTitle)}>Notifications</div>
        <div
          className={css(styles.notificationFeed)}
          ref={(ref) => (this.notifFeed = ref)}
        >
          <ReactPlaceholder
            ready={!this.state.fetching}
            showLoadingAnimation
            customPlaceholder={<NotificationPlaceholder color="#efefef" />}
          >
            {this.state.notifications && this.state.notifications.length ? (
              this.renderNotifications()
            ) : (
              <div className={css(styles.emptyState)}>No Notifications</div>
            )}
          </ReactPlaceholder>
        </div>
      </div>
    );
  };

  renderNotifications = () => {
    return this.state.notifications.map((notification, index) => {
      const formattedNotifData = this.formatNotification(notification);
      if (!isNullOrUndefined(formattedNotifData)) {
        return (
          <NotificationEntry
            closeMenu={this.toggleMenu}
            data={notification}
            key={`notif-${index}`}
            notification={formattedNotifData}
          />
        );
      }
    });
  };
  render() {
    return (
      <div className={css(styles.container)}>
        <div
          className={css(styles.bellIcon)}
          onClick={this.toggleMenu}
          ref={(ref) => (this.notifIcon = ref)}
        >
          {<FontAwesomeIcon icon={faBell}></FontAwesomeIcon>}
          {this.state.count > 0 && (
            <div className={css(styles.notifCount)}>{this.state.count}</div>
          )}
        </div>
        {this.renderMenu()}
      </div>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  bellIcon: {
    fontSize: 21,
    cursor: "pointer",
    color: mainNavIcons.color,
    position: "relative",
    ":hover": {
      color: colors.NEW_BLUE(),
    },
  },
  notifCount: {
    alignItems: "center",
    backgroundColor: colors.BLUE(),
    borderRadius: "50%",
    color: "#fff",
    display: "flex",
    float: "left",
    fontSize: 8,
    height: 8,
    justifyContent: "center",
    maxHeight: 8,
    maxWidth: 8,
    minHeight: 8,
    minWidth: 8,
    padding: 3,
    position: "absolute",
    right: -8,
    top: -4,
    width: 8,
  },
  notificationMenu: {
    width: 430,
    position: "absolute",
    top: 38,
    right: 0,
    boxShadow: "rgba(129,148,167,0.39) 0px 3px 10px 0px",
    boxSizing: "border-box",
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: 4,
    opacity: 0,
    zIndex: -100,
    userSelect: "none",
    pointerEvents: "none",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: "100vw",
      position: "fixed",
      top: 58,
    },
  },
  open: {
    opacity: 1,
    zIndex: 2,
    pointerEvents: "unset",
  },
  notificationFeed: {
    maxHeight: 500,
    overflow: "auto",
  },
  menuTitle: {
    width: "100%",
    textAlign: "left",
    borderBottom: "1px solid #dddfe2",
    padding: "5px 10px",
    boxSizing: "border-box",
    fontSize: 13,
    fontWeight: 500,
  },
  emptyState: {
    display: "flex",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    boxSizing: "border-box",
    padding: 20,
    borderBottom: "1px solid #dddfe2",
    backgroundColor: "#FAFAFA",
    fontSize: 14,
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  notifications: state.livefeed.notifications,
});

const mapDispatchToProps = {
  getNotifications: NotificationActions.getNotifications,
  markAllAsRead: NotificationActions.markAllAsRead,
  addNotification: NotificationActions.addNotification,
};
// export default Notification;
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withWebSocket(Notification));
