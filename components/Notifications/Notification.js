import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import ReactPlaceholder from "react-placeholder/lib";
import "react-placeholder/lib/reactPlaceholder.css";

// Component
import withWebSocket from "~/components/withWebSocket";
import NotificationEntry from "./NotificationEntry";
import NotificationPlaceholder from "~/components/Placeholders/NotificationPlaceholder";

// Redux
import { NotificationActions } from "~/redux/notification";

// Config
import colors from "../../config/themes/colors";
import icons from "../../config/themes/icons";

class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      newNotif: false,
      count: null,
      fetching: true,
    };
    this.notifIcon;
    this.notifMenu;
    this.notifFeed;
  }

  componentDidMount = async () => {
    await this.props.getNotifications();
    document.addEventListener("mousedown", this.handleOutsideClick);
    this.setState({
      count: this.countReadNotifications(),
      fetching: false,
    });
  };

  componentDidUpdate = async (prevProps) => {
    if (prevProps.wsResponse !== this.props.wsResponse) {
      let { wsResponse, addNotification, notifications } = this.props;
      let response = JSON.parse(wsResponse);
      let notification = response.data;
      await addNotification(notifications, notification);
      this.setState({
        count: this.countReadNotifications(),
      });
    }
    if (
      JSON.stringify(prevProps.notifications) !==
      JSON.stringify(this.props.notifications)
    ) {
      this.setState({
        // notifications: this.props.notifications,
        count: this.countReadNotifications(),
      });
    }
  };

  componentWillUnmount() {
    document.addEventListener("mousedown", this.handleOutsideClick);
  }

  countReadNotifications() {
    var count = 0;
    this.props.notifications.forEach((notification) => {
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
      let ids = this.formatIds();
      this.state.isOpen &&
        this.props.markAllAsRead(this.props.notifications, ids);
    });
  };

  formatIds = () => {
    return this.props.notifications.map((notification) => {
      return notification.id;
    });
  };

  renderMenu = () => {
    let { isOpen } = this.state;
    // if (isOpen) {
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
            {this.props.notifications && this.props.notifications.length ? (
              this.renderNotifications()
            ) : (
              <div className={css(styles.emptyState)}>No Notifications</div>
            )}
          </ReactPlaceholder>
        </div>
      </div>
    );
    // }
  };

  renderNotifications = () => {
    return this.props.notifications.map((notification, index) => {
      let action = notification.action[0];
      if (notification.extra && notification.extra.status) {
        // Stripe branch not yet integrated
        return null;
        // action = {
        //   content_type: "stripe",
        //   created_by: notification.recipient,
        //   created_date: notification.created_date,
        //   ...notification.extra,
        // };
      } else if (notification.extra && notification.extra.bullet_point) {
        action = {
          content_type: "vote_bullet",
          created_by: notification.action_user,
          created_date: notification.created_date,
          plain_text: notification.extra.bullet_point.plain_text,
          paper_id: notification.extra.bullet_point.paper,
        };
      } else if (notification.extra && notification.extra.summary) {
        action = {
          content_type: "vote_summary",
          created_by: notification.action_user,
          created_date: notification.created_date,
          plain_text: notification.extra.summary.summary_plain_text,
          paper_id: notification.extra.summary.paper,
          paper_official_title: notification.extra.summary.paper_title,
        };
      }

      return (
        <NotificationEntry
          data={notification}
          notification={action}
          key={`notif-${notification.id}`}
          closeMenu={this.toggleMenu}
        />
      );
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
          {icons.bell}
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
    fontSize: 20,
    cursor: "pointer",
    padding: "3px 5px",
    color: "#C1C1CE",
    position: "relative",
    ":hover": {
      color: colors.BLUE(),
    },
  },
  notifCount: {
    minWidth: 10,
    width: 10,
    maxWidth: 10,
    minHeight: 10,
    height: 10,
    maxHeight: 10,
    position: "absolute",
    top: 2,
    right: -8,
    padding: 3,
    float: "left",
    borderRadius: "50%",
    backgroundColor: colors.RED(),
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 10,
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
