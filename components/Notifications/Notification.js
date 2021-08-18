import { Component } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import ReactPlaceholder from "react-placeholder/lib";

// Component
import withWebSocket from "~/components/withWebSocket";
import NotificationEntry from "./NotificationEntry";
import NotificationPlaceholder from "~/components/Placeholders/NotificationPlaceholder";

// Redux
import { NotificationActions } from "~/redux/notification";

// Config
import colors from "../../config/themes/colors";
import icons from "../../config/themes/icons";
import { doesNotExist, isNullOrUndefined } from "~/config/utils/nullchecks";

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

  formatAction = (notification) => {
    const {
      extra,
      action_user,
      created_date,
      paper,
      paper_slug,
      action,
    } = notification;
    if (extra) {
      const {
        status,
        bullet_point,
        summary,
        content_type,
        bounty_object_id,
        bounty_content_type,
        bounty_approval,
      } = extra;

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
        if (!isNullOrUndefined(action[0])) {
          return {
            type: content_type.model,
            content_type: "support_content",
            created_by: action_user,
            created_date: created_date,
            id: action[0].paper_id || action[0].post_id,
            amount: extra.amount,
            slug: action[0].slug,
            support_type: action[0].support_type,
            parent_content_type: action[0].parent_content_type,
          };
        } else {
          return {
            type: content_type.model,
            content_type: "support_content",
            created_by: action_user,
            created_date: created_date,
            id: null,
            amount: extra.amount,
            slug: null,
            support_type: null,
            parent_content_type: null,
          };
        }
      } else if (bounty_object_id) {
        return {
          content_type: "bounty_moderator",
          type: bounty_content_type, // summary or takeaway,
          created_by: action_user,
          created_date: created_date,
          plain_text: extra.tip,
          paper_id: paper,
          paper_official_title: action[0] && action[0].paper_official_title,
          slug: paper_slug,
          bounty_amount: extra.bounty_amount,
          bounty_id: extra.bounty_object_id,
          bounty_approved: extra.bounty_approval,
        };
      } else if (!doesNotExist(bounty_approval)) {
        return {
          content_type: "bounty_contributor",
          type: bounty_content_type, // summary or takeaway,
          created_by: action_user,
          created_date: created_date,
          plain_text: action[0] && action[0].tip,
          paper_id: paper,
          paper_official_title: action[0] && action[0].paper_official_title,
          slug: paper_slug,
          bounty_amount: extra.bounty_amount,
          bounty_approval: bounty_approval,
        };
      }
    }

    return notification.action[0];
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
    "@media only screen and (max-width: 900px)": {
      fontSize: 16,
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
