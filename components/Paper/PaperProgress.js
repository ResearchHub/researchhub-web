import { StyleSheet, css } from "aphrodite";

import colors, { discussionPageColors } from "~/config/themes/colors";
import icons from "~/config/themes/icons";

class PaperProgress extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sections: [],
    };
  }

  componentDidMount() {
    this.formatSection();
  }

  formatSection = () => {
    let list = [
      {
        label: "Key Takeaways",
      },
      {
        label: "Summary",
      },
      {
        label: "Figures",
      },
      {
        label: "Paper PDF",
      },
      {
        label: "Cited By",
      },
      {
        label: "Limitations",
      },
    ];

    this.setState({
      sections: list,
    });
  };

  renderMainText = () => {
    return "Paper content is incomplete.";
  };

  renderItems = () => {
    return this.state.sections.slice(0, 3).map((section, i) => {
      return (
        <div
          className={css(styles.section)}
          key={`paper${this.props.paper.id}-progress-${i}`}
        >
          <div className={css(styles.sectionIcon)}>{icons.checkCircle}</div>
          {section.label}
        </div>
      );
    });
  };

  render() {
    return (
      <div className={css(styles.container)}>
        <div className={css(styles.column, styles.left)}>
          <div className={css(styles.maintext)}>{this.renderMainText()}</div>
          <h2 className={css(styles.subtext)}></h2>
        </div>
        <div className={css(styles.column, styles.right)}>
          <div className={css(styles.sectionColumn)}>{this.renderItems()}</div>
          <div className={css(styles.sectionColumn)}>{this.renderItems()}</div>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: "100%",
    padding: "30px 40px",
    backgroundColor: "#F5F5F5",
    height: 80,
    border: "1px solid",
    borderColor: "#E7E7E7",
    borderTop: "none",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  maintext: {
    fontSize: 20,
    fontWeight: 400,
    color: "rgba(36, 31, 58)",
  },
  section: {
    fontSize: 16,
    display: "flex",
    alignItems: "center",
  },
  sectionIcon: {
    color: "#D0D0D0",
    marginRight: 10,
    fontSize: 25,
  },
  left: {
    width: "60%",
  },
  right: {
    width: "40%",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  },
});

export default PaperProgress;
