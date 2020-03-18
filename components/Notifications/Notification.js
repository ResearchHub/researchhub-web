import { StyleSheet, css } from "aphrodite";
import InfiniteScroll from "react-infinite-scroller";

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
    };
  }

  toggleMenu = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  renderMenu = () => {
    let { isOpen } = this.state;
    if (isOpen) {
      return <div className={css(styles.notificationMenu)}></div>;
    } else {
      return <div className={css(styles.bellIcon)}>{icons.bell}</div>;
    }
  };

  renderNotifications = () => {};

  render() {
    return <div className={css(styles.container)}>{this.renderMenu()}</div>;
  }
}

const styles = StyleSheet.create({
  container: {},
  bellIcon: {
    fontSize: 18,
    cursor: "pointer",
    padding: "3px 5px",
    ":hover": {
      backgroundColor: "#FAFAFA",
    },
    // color: colors.BLUE()
  },
  notificationMenu: {},
});

export default Notification;
