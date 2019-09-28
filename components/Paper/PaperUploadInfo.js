import React from "react";
import { useRouter } from "next/router";
import { StyleSheet, css } from "aphrodite";
import Progress from "react-progressbar";
import "./progressbar.css";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// Component
import CheckBox from "../CheckBox";
import FormInput from "../FormInput";
import PaperEntry from "../SearchSuggestion/PaperEntry";
import Button from "../Button";
// TODO: make component for author suggestion

// Redux
import { ModalActions } from "../../redux/modals";

// Config
import colors from "../../config/themes/colors";

class PaperUploadInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        paper_title: "",
        authors: [],
        published: {
          year: "",
          month: "",
          day: "",
        },
        type: {
          journal: false,
          confernce: false,
          other: false,
        },
        hubs: [],
        summary: "",
      },
      discussion: {
        title: "",
        question: "",
      },
      progress: 33.33,
    };
  }

  handleCheckBoxToggle = (id, state) => {
    let { form } = this.state;
    let type = { ...form.type };
    // set everything to false
    // set active to true // false
    // set state with new form object
  };

  renderTitle = () => {
    return (
      <div className={css(styles.titleContainer)}>
        <div className={css(styles.title, styles.text)}>Paper Upload</div>
        <div className={css(styles.subtitle, styles.text)}>
          Step 1: Main Information
        </div>
      </div>
    );
  };

  renderHeader = (label) => {
    return <div className={css(styles.header, styles.text)}>{label}</div>;
  };

  nextStep = () => {
    this.setState({ progress: this.state.progress + 33.33 });
  };

  render() {
    let { progress } = this.state;
    return (
      <div className={css(styles.background)}>
        {this.renderTitle()}
        <div className={css(styles.pageContent)}>
          <div className={css(styles.progressBar)}>
            <Progress completed={progress} />
          </div>
          {this.renderHeader("Academic Paper")}
          <div className={css(styles.section)}>
            <div className={css(styles.paper)}>
              <div className={css(styles.label)}>
                Paper PDF
                <span className={css(styles.asterick)}>*</span>
              </div>
              <PaperEntry fileUpload={true} file={this.props.uploadedPaper} />
            </div>
          </div>
          {this.renderHeader("Main Information")}
          <div className={css(styles.section, styles.padding)}>
            <FormInput
              label={"Paper Title"}
              placeholder="Enter title of paper"
              required={true}
              containerStyle={styles.container}
              inputStyle={styles.inputStyle}
            />
            <FormInput
              label={"Authors"}
              placeholder="Search for author"
              required={true}
              containerStyle={styles.container}
              inputStyle={styles.search}
              search={true}
            />
            <div className={css(styles.row, styles.authorCheckboxContainer)}>
              <CheckBox
                isSquare={true}
                active={false}
                label={"I am an author of this paper"}
              />
            </div>
            <div className={css(styles.row)}>
              <FormInput
                label={"Year of Publication"}
                placeholder="yyyy"
                required={true}
                containerStyle={styles.smallContainer}
                inputStyle={styles.smallInput}
              />
              <FormInput
                label={"Month of Publication"}
                placeholder="mm"
                required={true}
                containerStyle={styles.smallContainer}
                inputStyle={styles.smallInput}
              />
              <FormInput
                label={"Day of Publication"}
                placeholder="dd"
                required={true}
                containerStyle={styles.smallContainer}
                inputStyle={styles.smallInput}
              />
            </div>
            <div className={css(styles.section, styles.leftAlign)}>
              <p className={css(styles.label)}>Type</p>
              <div className={css(styles.row)}>
                <div className={css(styles.checkboxRow)}>
                  <CheckBox active={false} label={"Journal"} />
                  <CheckBox active={false} label={"Conference"} />
                  <CheckBox active={false} label={"Other"} />
                </div>
              </div>
            </div>
            <FormInput
              label={"Hubs"}
              placeholder="Select up to 3 hubs"
              required={true}
              containerStyle={styles.container}
              inputStyle={styles.inputStyle}
            />
          </div>
        </div>
        <div className={css(styles.row, styles.buttons)}>
          <div className={css(styles.button, styles.buttonLeft)}>
            <span className={css(styles.buttonLabel, styles.text)}>Cancel</span>
          </div>
          <Button
            label={"Next Step"}
            customButtonStyle={styles.button}
            onClick={this.nextStep}
          />
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#FCFCFC",
    // padding: '182px 320px 182px 320px',
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  text: {
    fontFamily: "Roboto",
  },
  title: {
    fontWeight: 500,
    fontSize: 33,
    color: "#232038",
  },
  subtitle: {
    fontSize: 16,
    color: "#6f6c7d",
    marginTop: 10,
  },
  titleContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
    marginTop: 80,
    marginBottom: 60,
  },
  pageContent: {
    width: "70%",
    minWidth: 820,
    minHeight: 928,
    maxHeight: 1128,
    position: "relative",
    backgroundColor: "#FFF",
    // todo: fix shadow properties
    boxShadow: "0 1px 8px rgba(0, 0, 0, 0.1), 0 1px 10px rgba(0, 0, 0, 0.1);",
    padding: 60,
    borderTop: "4px solid #dedee5",
  },
  progressBar: {
    position: "absolute",
    width: "100%",
    top: -4,
    left: 0,
  },
  header: {
    fontSize: 22,
    fontWeight: 500,
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    paddingBottom: 8,
    borderBottom: `1px solid #EBEBEB`,
  },
  section: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    width: 600,
    alignItems: "center",
  },
  paper: {
    width: 601,
    marginTop: 40,
    marginBottom: 40,
  },
  label: {
    fontFamily: "Roboto",
    fontWeight: 500,
    fontSize: 16,
    marginBottom: 5,
  },
  asterick: {
    color: colors.BLUE(1),
  },
  padding: {
    paddingTop: 40,
  },
  container: {
    width: 600,
    marginBottom: 20,
  },
  inputStyle: {
    width: 570,
  },
  search: {
    width: 555,
  },
  authorCheckboxContainer: {
    justifyContent: "flex-start",
    width: 600,
    marginBottom: 20,
  },
  smallContainer: {
    width: 186,
  },
  smallInput: {
    width: 156,
  },
  checkboxRow: {
    width: 326,
    height: 40,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftAlign: {
    alignItems: "flex-start",
  },
  buttons: {
    marginTop: 50,
    justifyContent: "center",
    width: "100%",
    marginBottom: 80,
  },
  button: {
    width: 180,
    height: 55,
  },
  buttonLeft: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonLabel: {
    color: colors.BLUE(1),
    cursor: "pointer",
    ":hover": {
      textDecoration: "underline",
    },
  },
});

export default PaperUploadInfo;
