import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import InfiniteScroll from "react-infinite-scroller";

// Component
import withWebSocket from "~/components/withWebSocket";
import NotificationEntry from "./NotificationEntry";

// Redux
import { NotificationActions } from "~/redux/notification";

// Config
import colors from "../../config/themes/colors";
import API from "../../config/api";
import { Helpers } from "@quantfive/js-web-config";
import icons from "../../config/themes/icons";

class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      newNotif: false,
      count: null,
      notifications: [],
    };
    this.notifIcon;
    this.notifMenu;
  }

  componentDidMount = async () => {
    this.props.getNotifications();
    window.addEventListener("mousedown", this.handleOutsideClick);
    this.setState({
      // notifications: this.props.notifications,
      count: this.countReadNotifications(),
    });
    let response = JSON.parse(this.props.wsResponse);
    console.log("response", response);
    console.log("this.props", this.props);
  };

  componentDidUpdate(prevProps) {
    console.log("this.props", this.props);
    if (prevProps !== this.props) {
      if (prevProps.wsResponse !== this.props.wsResponse) {
        let response = JSON.parse(this.props.wsResponse);
        console.log("response", response);
      }
      if (prevProps.notifications !== this.props.notifications) {
        this.setState({
          // notifications: this.props.notifications,
          count: this.countReadNotifications(),
        });
      }
    }
  }

  componentWillUnmount() {
    window.addEventListener("mousedown", this.handleOutsideClick);
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
    this.setState({ isOpen: !this.state.isOpen });
  };

  calculatePosition = () => {
    let length =
      this.props.notifications.length > 5 ? 5 : this.props.notifications.length;

    let position = StyleSheet.create({
      menu: {
        bottom: -30 + -100 * length,
      },
    });
    return position.menu;
  };

  renderMenu = () => {
    let { isOpen } = this.state;
    if (isOpen) {
      return (
        <div
          className={css(styles.notificationMenu, this.calculatePosition())}
          ref={(ref) => (this.notifMenu = ref)}
        >
          <div className={css(styles.menuTitle)}>Notifications</div>
          <div className={css(styles.notificationFeed)}>
            {this.renderNotifications()}
          </div>
        </div>
      );
    }
  };

  renderNotifications = () => {
    return this.props.notifications.map((notification, index) => {
      let action = notification.action[0];
      return (
        <NotificationEntry
          data={notification}
          notification={action}
          key={`notif-${notification.id}${index}`}
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
    bottom: -25,
    right: 0,
    boxShadow: "rgba(129,148,167,0.39) 0px 3px 10px 0px",
    boxSizing: "border-box",
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: 4,
    zIndex: 2,
  },
  notificationFeed: {
    maxHeight: 500,
    overflow: "scroll",
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
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  notifications: state.livefeed.notifications,
});

const mapDispatchToProps = {
  getNotifications: NotificationActions.getNotifications,
};
// export default Notification;
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withWebSocket(Notification));
