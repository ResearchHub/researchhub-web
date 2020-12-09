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
      const { wsResponse, addNotification, notifications } = this.props;
      const response = JSON.parse(wsResponse);
      const notification = response.data;
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

  formatAction = (notification) => {
    const {
      extra,
      action_user,
      created_date,
      paper,
      paper_slug,
    } = notification;
    if (extra) {
      const { status, bullet_point, summary, content_type } = extra;

      if (status) {
        // Stripe branch not yet integrated
        return null;
        // action = {
        //   content_type: "stripe",
        //   created_by: notification.recipient,
        //   created_date: notification.created_date,
        //   ...extra,
        // };
      } else if (bullet_point) {
        return {
          content_type: "vote_bullet",
          created_by: action_user,
          created_date: created_date,
          plain_text: bullet_point.plain_text,
          paper_id: bullet_point.paper,
          slug: paper_slug,
        };
      } else if (summary) {
        return {
          content_type: "vote_summary",
          created_by: action_user,
          created_date: created_date,
          plain_text: summary.summary_plain_text,
          paper_id: summary.paper,
          paper_official_title: summary.paper_title,
          slug: paper_slug,
        };
      } else if (content_type && content_type.model) {
        return {
          type: content_type.model,
          content_type: "support_content",
          created_by: action_user,
          created_date: created_date,
          paper_id: paper,
          amount: extra.amount,
          slug: paper_slug,
        };
      }
    }

    return notification.action[0];
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
      const action = this.formatAction(notification);

      if (action) {
        return (
          <NotificationEntry
            data={notification}
            notification={action}
            key={`notif-${notification.id}`}
            closeMenu={this.toggleMenu}
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
    fontSize: 18,
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
