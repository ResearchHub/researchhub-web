import React from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";

// Component
import Button from "../../components/Form/Button";
import AddHubModal from "../../components/modal/AddHubModal";
import Message from "../../components/Loader/Message";
import PermissionNotificationWrapper from "../../components/PermissionNotificationWrapper";
import Head from "~/components/Head";

// Config
import colors from "../../config/themes/colors";

// Redux
import { HubActions } from "~/redux/hub";
import { ModalActions } from "../../redux/modals";
import { MessageActions } from "../../redux/message";
import { finished } from "stream";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      width: null,
      hubsByAlpha: {},
      finishedLoading: false,
    };
    this.state = {
      ...this.initialState,
    };
  }

  componentDidMount = async () => {
    const { getHubs, showMessage, hubs } = this.props;
    window.addEventListener("resize", this.calculateWindowWidth);
    showMessage({ show: true, load: true });
    if (!hubs.fetchedHubs) {
      await getHubs();
    } else {
      this.setState({
        hubsByAlpha: JSON.parse(JSON.stringify(hubs.hubsByAlpha)),
        finishedLoading: true,
      });
      showMessage({ show: false });
    }
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.calculateWindowWidth);
  }

  componentDidUpdate(prevProps) {
    this.calculateWindowWidth();
    if (prevProps.hubs.hubsByAlpha !== this.props.hubs.hubsByAlpha) {
      const { showMessage, hubs } = this.props;
      showMessage({ show: true, load: true });
      this.setState(
        {
          hubsByAlpha: JSON.parse(JSON.stringify(hubs.hubsByAlpha)),
          finishedLoading: true,
        },
        () => {
          showMessage({ show: false });
        }
      );
    }
  }

  openAddHubModal = () => {
    this.props.openAddHubModal(true);
  };

  addNewHubToState = (newHub) => {
    let hubsByAlpha = { ...this.state.hubsByAlpha };
    let key = newHub.name[0];
    if (hubsByAlpha[key]) {
      hubsByAlpha[key].push(newHub);
      hubsByAlpha[key].sort((a, b) => a.name - b.name);
    } else {
      hubsByAlpha[key] = [newHub];
    }
    this.setState({ hubsByAlpha });
  };

  calculateWindowWidth = () => {
    if (window.innerWidth < 950 && window.innerWidth > 775) {
      return this.state.width !== 760 && this.setState({ width: 760 });
    }
    if (window.innerWidth <= 775 && window.innerWidth > 421) {
      return this.state.width !== 600 && this.setState({ width: 600 });
    }
    if (window.innerWidth <= 421 && window.innerWidth > 321) {
      return this.state.width !== 360 && this.setState({ width: 360 });
    }
    if (window.innerWidth <= 321) {
      return this.state.width !== 285 && this.setState({ width: 285 });
    } else {
      return this.state.width !== 950 && this.setState({ width: 950 });
    }
  };

  calculateColumnWidth = (i, numOfColumns, size) => {
    let noMargin = (i + 1) % numOfColumns === 0;
    let offset = (30 * numOfColumns - 1) / numOfColumns;
    let width = size / numOfColumns - offset;
    let styles = StyleSheet.create({
      customWidth: {
        width: `${width}px`,
        margin: noMargin ? "0 0 30px 0" : "0 30px 30px 0",
      },
    });

    return styles.customWidth;
  };

  renderColumn = (width) => {
    const { hubsByAlpha } = this.state;
    const letters = Object.keys(hubsByAlpha).sort();
    let numOfColumns = letters.length > 3 ? 4 : letters.length;
    if (width === 600) {
      numOfColumns = 2;
    }
    if (width <= 360) {
      numOfColumns = 1;
    }
    return letters.map((letter, i) => {
      return (
        <div
          key={`${letter}_${i}`}
          className={css(
            styles.column,
            this.calculateColumnWidth(i, numOfColumns, width)
          )}
        >
          <div className={css(styles.label)}>
            {`${letter.toUpperCase()}${letter}`}
          </div>
          <div className={css(styles.list)}>{this.renderList(letter)}</div>
        </div>
      );
    });
  };

  renderList = (key) => {
    const { hubsByAlpha } = this.state;
    return hubsByAlpha[key].map((hub) => {
      return (
        <Link
          href="/hubs/[slug]"
          as={`/hubs/${encodeURIComponent(hub.slug)}`}
          key={`hub_${hub.id}`}
        >
          <a className={css(styles.slugLink)}>
            <div key={hub.id} className={css(styles.hubEntry)}>
              {hub.name}
            </div>
          </a>
        </Link>
      );
    });
  };

  render() {
    let { finishedLoading } = this.state;

    return (
      <div className={css(styles.background)}>
        <AddHubModal addHub={this.addNewHubToState} />
        <Message />
        <Head
          title={"Hubs on Researchhub"}
          description={"View all of the communities on Researchhub"}
        />
        <div className={css(styles.container)}>
          <div className={css(styles.titleContainer)}>
            <span className={css(styles.title)}>Hubs</span>
            <PermissionNotificationWrapper
              modalMessage="suggest a hub"
              loginRequired={true}
              onClick={this.openAddHubModal}
            >
              <Button
                isWhite={true}
                label={"Suggest a Hub"}
                buttonStyle={styles.button}
                hideRipples={true}
              />
            </PermissionNotificationWrapper>
          </div>
          <div className={css(styles.body, finishedLoading && styles.reveal)}>
            {this.renderColumn(this.state.width)}
          </div>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    background: "#FCFCFC",
    minHeight: "100vh",
    width: "100vw",
  },
  container: {
    backgroundColor: "#FCFCFC",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    margin: "auto",
    width: 950,
    "@media only screen and (max-width: 1000px)": {
      width: 760,
    },
    "@media only screen and (max-width: 775px)": {
      width: 600,
    },
    "@media only screen and (max-width: 421px)": {
      width: "100%",
    },
  },
  titleContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    paddingTop: 40,
    paddingBottom: 40,
    "@media only screen and (max-width: 768px)": {
      justifyContent: "space-between",
      backgroundColor: "#FFF",
      marginBottom: 10,
      zIndex: 2,
      position: "sticky",
      top: 0,
    },
    "@media only screen and (max-width: 421px)": {
      justifyContent: "center",
    },
  },
  slugLink: {
    textDecoration: "none",
  },
  title: {
    fontSize: 33,
    fontWeight: 500,
    marginRight: 30,
    color: "#232038",
    cursor: "default",
    userSelect: "none",
  },
  body: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexWrap: "wrap",
    opacity: 0,
    transition: "all ease-in-out 0.3s",
    "@media only screen and (max-width: 421px)": {
      justifyContent: "center",
    },
  },
  reveal: {
    opacity: 1,
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  label: {
    fontSize: 33,
    fontWeight: 400,
    color: "#CCCBD0",
    marginBottom: 10,
    cursor: "default",
    userSelect: "none",
  },
  hubEntry: {
    fontSize: 18,
    color: "#241F3A",
    padding: "10px 0 10px 0",
    textTransform: "capitalize",
    cursor: "pointer",
    ":hover": {
      color: colors.BLUE(1),
    },
    "@media only screen and (max-width: 775px)": {
      fontSize: 16,
    },
  },
  list: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
  },
  button: {
    height: 45,
    width: 140,
    border: `${colors.BLUE()} 1px solid`,
  },
});

const mapStateToProps = (state) => ({
  hubs: state.hubs,
});

const mapDispatchToProps = {
  getHubs: HubActions.getHubs,
  openAddHubModal: ModalActions.openAddHubModal,
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);
