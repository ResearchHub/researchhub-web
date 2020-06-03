import React from "react";
import { StyleSheet, css } from "aphrodite";

// Config
import colors from "~/config/themes/colors";

class ThreadLine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 0,
      style: null,
      active: false,
      hovered: false,
    };
  }

  componentDidMount() {
    this.setState({
      height: this.props.parent && this.props.parentHeight,
      active: this.props.active,
      hovered: this.props.hovered,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.parent !== this.props.parent) {
      this.setState({
        height: this.props.parentHeight,
      });
    }

    if (prevProps !== this.props) {
      if (prevProps.parentHeight !== this.props.parentHeight) {
        let height = this.props.parent && this.props.parentHeight;
        height !== this.state.height && this.setState({ height: height });
      }

      if (prevProps.active !== this.props.active) {
        this.setState({ active: this.props.active });
      }

      if (prevProps.hovered !== this.props.hovered) {
        this.setState({ hovered: this.props.hovered });
      }
    }
  }

  render() {
    let styles = StyleSheet.create({
      container: {
        display: "flex",
        justifyContent: "center",
        width: 10,
        cursor: "pointer",
        ":hover #thread": {
          backgroundColor: colors.BLUE(1),
        },
      },
      threadline: {
        height:
          this.props.parent &&
          this.props.parent.clientHeight - this.props.offset,
        width: 2,
        backgroundColor: "#EEEFF1",
        cursor: "pointer",
        ":hover": {
          backgroundColor: colors.BLUE(1),
        },
      },
      active: {
        backgroundColor: colors.BLUE(0.3),
      },
      hovered: {
        backgroundColor: colors.BLUE(1),
      },
    });

    return (
      <div
        className={css(styles.container)}
        onClick={this.props.onClick && this.props.onClick}
      >
        <div
          className={css(
            styles.threadline,
            this.state.active && styles.active,
            this.state.hovered && styles.hovered
          )}
          height={this.state.height}
          id={"thread"}
        />
      </div>
    );
  }
}

export default ThreadLine;
