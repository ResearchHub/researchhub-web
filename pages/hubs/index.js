import React from "react";
import { StyleSheet, css } from "aphrodite";

// Component
import Button from "../../components/Form/Button";
import ComponentWrapper from "../../components/ComponentWrapper";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderColumn = () => {};

  renderList = () => {};

  render() {
    return (
      <ComponentWrapper>
        <div className={css(styles.background)}>
          <div className={css(styles.titleContainer)}>
            <span className={css(styles.title)}>Hubs</span>
            <Button isWhite={true} label={"Create a Hub"} />
          </div>
          <div className={css(styles.body)}></div>
        </div>
      </ComponentWrapper>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#FCFCFC",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  titleContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    paddingTop: 40,
    paddingBottom: 40,
  },
  title: {
    fontSize: 33,
    fontWeight: 500,
    marginRight: 30,
    color: "#232038",
  },
  body: {
    width: "100%",
  },
  hubLabel: {},
  hubEntry: {},
});

export default Index;
