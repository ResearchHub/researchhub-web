import React, { Fragment } from "react";

// NPM Modules
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import ReactTooltip from "react-tooltip";

// Component
import AuthorAvatar from "../AuthorAvatar";

// Config
import colors from "../../config/themes/colors";
import API from "../../config/api";
import { Helpers } from "@quantfive/js-web-config";
import { timeAgo } from "~/config/utils";

class LiveFeedNotification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hideCard: false,
      user: {},
      username: "",
      profile: "",
    };
  }

  componentDidMount() {
    let userId = this.props.notification.created_by;
    fetch(API.USER({ userId }), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        let { first_name, last_name } = res;
        this.setState({
          user: { ...res },
          username: `${first_name} ${last_name}`,
          profile: res.author_profile.profile_image,
        });
      });
  }

  componentDidUpdate(prevProps) {
    let prevObj =
      prevProps.notification && JSON.stringify(prevProps.notification);
    let currentObj =
      this.props.notification && JSON.stringify(this.props.notification);
    if (prevObj !== currentObj) {
      let userId = this.props.notification.created_by;
      fetch(API.USER({ userId }), API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          console.log("called");
          let { first_name, last_name } = res;
          this.setState({
            user: { ...res },
            username: `${first_name} ${last_name}`,
            profile: res.author_profile.profile_image,
          });
        });
    }
  }

  renderNotification = () => {
    console.log("notification", this.props.notification);

    const { notification } = this.props;
    let { paper, created_date, content_type } = notification;
    let notificationType = content_type;
    const timestamp = this.formatTimestamp(created_date);
    switch (notificationType) {
      case "vote":
        return (
          <div className={css(styles.message)}>
            <b className={css(styles.username)}>{this.state.username}</b> voted
            on{" "}
            <Link
              href={"/paper/[paperId]/[tabName]"}
              as={`/paper/${paper && paper.id}/summary`}
            >
              <a className={css(styles.paper)}>{paper && paper.title}</a>
            </Link>
            <span className={css(styles.timestamp)}>
              <span className={css(styles.timestampDivider)}>•</span>
              {timestamp}
            </span>
          </div>
        );
      case "thread":
        let { first_name, last_name } = notification.created_by;
        return (
          <div className={css(styles.message)}>
            <b className={css(styles.username)}>
              {`${first_name} ${last_name}`}
            </b>{" "}
            created a{" "}
            <Link
              href={"/paper/[paperId]/[tabName]/[discussionThreadId"}
              as={`/paper/${paper.id}/discussion/${notification.id}`}
            >
              <a className={css(styles.paper)}>thread</a>
            </Link>
            {"in"}
            <Link
              href={"/paper/[paperId]/[tabName]"}
              as={`/paper/${paper.id}/summary`}
            >
              <a className={css(styles.paper)}>{paper.title}</a>
            </Link>
            <span className={css(styles.timestamp)}>
              <span className={css(styles.timestampDivider)}>•</span>
              {timestamp}
            </span>
          </div>
        );
      default:
        return;
    }
  };

  hideCard = (e) => {
    e && e.stopPropagation();
    this.setState({ hideCard: true });
  };

  convertDate = () => {
    return formatPublishedDate(transformDate(paper.paper_publish_date));
  };

  formatTimestamp = (date) => {
    date = new Date(date);
    return timeAgo.format(date);
  };

  render() {
    if (this.state.hideCard) {
      return null;
    } else {
      return (
        <div className={css(styles.column, styles.notification)}>
          {/* <div 
            className={css(styles.closeButton)}
            onClick={this.hideCard}
          >
            <i className="fal fa-times" />
          </div> */}
          <div className={css(styles.row, styles.container)}>
            <div className={css(styles.column, styles.left)}>
              <AuthorAvatar author={this.state.user} size={50} />
            </div>
            <div className={css(styles.column, styles.right)}>
              {this.renderNotification()}
            </div>
          </div>
        </div>
      );
    }
  }
}

const styles = StyleSheet.create({
  row: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  notification: {
    width: "80%",
    padding: "10px 15px 10px 15px",
    backgroundColor: "#FFF",
    height: 80,
    border: "1px solid rgb(237, 237, 237)",
    borderRadius: 5,
    cursor: "pointer",
    position: "relative",
    marginBottom: 15,
    ":hover": {
      borderColor: "#AAAAAA",
    },
  },
  left: {
    justifyContent: "center",
    marginRight: 20,
  },
  right: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  container: {
    width: "100%",
    height: "100%",
    // justifyContent: 'space-between'
  },
  paper: {
    color: colors.BLUE(),
    cursor: "pointer",
    textDecoration: "none",
    paddingRight: 4,
    ":hover": {
      textDecoration: "underline",
    },
  },
  message: {
    fontSize: 14,
    lineHeight: 1.5,
    width: "100%",
  },
  username: {
    cursor: "pointer",
    ":hover": {
      color: colors.BLUE(),
    },
  },
  timestamp: {
    fontWeight: "normal",
    color: "#918f9b",
    fontSize: 14,
    fontFamily: "Roboto",
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  timestampDivider: {
    fontSize: 18,
    paddingRight: 4,
    color: colors.GREY(1),
    lineHeight: "100%",
    verticalAlign: "middle",
  },
  closeButton: {
    position: "absolute",
    top: 5,
    right: 10,
    color: "#AAAAAA",
    ":hover": {
      color: "#000",
    },
  },
});

export default LiveFeedNotification;
