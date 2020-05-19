/**
 * Import the necessary modules, components, redux, config
 *
 * This needs to look like the citation card container
 *
 * Link the file upload modal
 */
import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import Ripples from "react-ripples";
import ReactPlaceholder from "react-placeholder/lib";
import "react-placeholder/lib/reactPlaceholder.css";

// Components
import ComponentWrapper from "~/components/ComponentWrapper";
import PreviewPlaceholder from "~/components/Placeholders/PreviewPlaceholder";

// Redux
import { MessageActions } from "~/redux/message";
import { ModalActions } from "~/redux/modals";

// Config
import colors from "~/config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import icons from "~/config/themes/icons";
import { openExternalLink } from "~/config/utils";

class FileTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      page: 0,
      count: null,
      fetching: false,
    };
  }

  componentDidMount() {
    this.fetchFiles();
  }

  fetchFiles = () => {
    let paperId = this.props.paperId;
    this.setState({ fetching: true }, () => {
      return fetch(API.PAPER_FILES({ paperId }), API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          this.setState({
            files: res.results,
            count: null,
            fetching: false,
          });
        });
    });
  };

  openDndModal = () => {
    let props = {
      title: "Add Files",
      // fileAccept: "application/pdf",
      onSubmit: this.addFile,
    };
    this.props.openDndModal(true, props);
  };

  addFile = (newFiles, callback) => {
    let paperId = this.props.paperId;
    let { showMessage, setMessage } = this.props;
    showMessage({ load: true, show: true });

    let params = new FormData();
    newFiles.forEach((file) => {
      params.append("file", file);
    });

    return fetch(API.PAPER_FILES({ paperId }), API.POST_FILE_CONFIG(params))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        showMessage({ show: false });
        setMessage("File uploaded successfully");
        let files = [...this.state.files, res];
        this.setState({
          files,
        });
        callback();
      })
      .catch((err) => {
        console.log("err", err);
        showMessage({ show: false });
        setMessage("Something went wrong");
        showMessage({ show: true, error: true });
      });
  };

  navigateToFile = (link) => {
    openExternalLink(link);
  };

  renderPreview = (file) => {
    if (file.file) {
      return (
        <div
          className={css(styles.previewContainer)}
          onClick={() => this.navigateToFile(file.file)}
        >
          <iframe src={file.file} className={css(styles.image)} />
        </div>
      );
    } else {
      return (
        <div
          className={css(styles.previewContainer)}
          onClick={() => this.navigateToFile(file.file)}
        >
          <ReactPlaceholder
            ready={false}
            showLoadingAnimation={false}
            customPlaceholder={
              <PreviewPlaceholder hideAnimation={true} color="#efefef" />
            }
          />
        </div>
      );
    }
  };

  render() {
    return (
      <ComponentWrapper overrideStyle={styles.componentWrapperStyles}>
        <div className={css(styles.container)} id="file-tab">
          <div className={css(styles.header)}>
            <div className={css(styles.sectionTitle)}>
              <div className={css(styles.tile)}>Files</div>
              <span className={css(styles.count)}>
                {this.state.files.length}
              </span>
            </div>
            <Ripples className={css(styles.item)} onClick={this.openDndModal}>
              <span className={css(styles.dropdownItemIcon)}>
                {icons.plusCircle}
              </span>
              Add Files
            </Ripples>
          </div>
          <div className={css(styles.filesContainer)}>
            {this.state.files &&
              this.state.files.map((file, id) => {
                return this.renderPreview(file);
              })}
          </div>
        </div>
      </ComponentWrapper>
    );
  }
}

const styles = StyleSheet.create({
  componentWrapperStyles: {
    "@media only screen and (max-width: 415px)": {
      width: "100%",
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  container: {
    backgroundColor: "#fff",
    padding: 50,
    border: "1.5px solid #F0F0F0",
    boxSizing: "border-box",
    boxShadow: "0px 3px 4px rgba(0, 0, 0, 0.02)",
    borderRadius: 4,
    marginTop: 30,
    "@media only screen and (max-width: 767px)": {
      padding: 25,
    },
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  tile: {
    fontSize: 22,
    fontWeight: 500,
    "@media only screen and (max-width: 415px)": {
      fontSize: 20,
    },
  },
  count: {
    color: "rgba(36, 31, 58, 0.5)",
    fontSize: 17,
    fontWeight: 500,
    marginLeft: 15,
  },
  filesContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    minWidth: "100%",
    width: "100%",
    boxSizing: "border-box",
    overflowX: "scroll",
    paddingBottom: 10,
  },
  citationEmpty: {
    fontSize: 20,
    fontWeight: 500,
    width: "100%",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    "@media only screen and (max-width: 415px)": {
      fontSize: 16,
    },
  },
  icon: {
    fontSize: 50,
    color: "rgb(78, 83, 255)",
    height: 50,
    marginBottom: 25,
  },
  citationEmptySubtext: {
    fontSize: 16,
    color: "rgba(36, 31, 58, 0.8)",
    fontWeight: 400,
    marginTop: 10,
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 500,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    "@media only screen and (max-width: 415px)": {
      fontSize: 20,
    },
  },
  dropdownItemIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  item: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    boxSizing: "border-box",
    color: colors.BLACK(),
    cursor: "pointer",
    opacity: 0.6,
    fontSize: 14,
    padding: 8,
    paddingRight: 0,
    ":hover": {
      color: colors.PURPLE(),
      textDecoration: "underline",
      opacity: 1,
    },

    "@media only screen and (max-width: 767px)": {
      padding: 0,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  previewContainer: {
    minWidth: 160,
    width: 160,
    height: 220,
    minHeight: 220,
    border: "1.5px solid rgba(36, 31, 58, 0.1)",
    borderRadius: 3,
    marginRight: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    boxSizing: "border-box",
    marginBottom: 15,
    position: "relative",
  },
  image: {
    width: "100%",
    minWidth: "100%",
    maxWidth: "100%",
    height: 220,
    minHeight: 220,
    maxHeight: 220,
    objectFit: "fill",
  },
});

const mapStateToProps = (state) => ({
  modals: state.modals,
});

const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
  openDndModal: ModalActions.openDndModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileTab);
