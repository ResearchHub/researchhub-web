import React from "react";
import { useRouter } from "next/router";
import { StyleSheet, css } from "aphrodite";
import Progress from "react-progressbar";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { EditorState, convertFromRaw } from "draft-js";

// Component
import CheckBox from "../Form/CheckBox";
import FormInput from "../Form/FormInput";
import FormSelect from "../Form/FormSelect";
import FormTextArea from "../Form/FormTextArea";
import DragNDrop from "../Form/DragNDrop";
import Button from "../Form/Button";
import AuthorCardList from "../SearchSuggestion/AuthorCardList";
import dynamic from "next/dynamic";
import AuthorInput from "../SearchSuggestion/AuthorInput.js";
import TextEditor from "~/components/TextEditor";

// Modal
import AddAuthorModal from "../modal/AddAuthorModal";

// Redux
import { ModalActions } from "../../redux/modals";
import { PaperActions } from "~/redux/paper";

// Config
import colors from "../../config/themes/colors";
import API from "../../config/api";
import { Helpers } from "@quantfive/js-web-config";
import * as Options from "../../config/utils/options";

const authors = [
  {
    first_name: "Amanda",
    last_name: "Collins",
    email: "amandacollins@gmail.com",
  },
  {
    first_name: "Kevin",
    last_name: "Miller",
    email: "kevinwest4852@gmail.com",
  },
  {
    first_name: "Amanda",
    last_name: "Collins",
    email: "amandacollins@gmail.com",
  },
  {
    first_name: "Kevin",
    last_name: "Miller",
    email: "kevinwest4852@gmail.com",
  },
];

class PaperUploadInfo extends React.Component {
  constructor(props) {
    super(props);
    let initialState = {
      form: {
        title: "",
        doi: "",
        published: {
          year: null,
          month: null,
          day: null,
        },
        author: {
          // TODO: Use authors as a list instead
          self_author: false,
        },
        type: {
          journal: false,
          conference: false,
          other: false,
        },
        hubs: [],
      },

      discussion: {
        title: "",
        question: "",
      },

      error: {
        year: false,
        month: false,
        day: false,
        hubs: false,
        dnd: false,
        author: false,
      },

      summary: EditorState.createEmpty(),
      showAuthorList: false,
      progress: 33.33,
      activeStep: 1,
      searchAuthor: "",
      selectedAuthors: [],
      authors: [], // TODO: Rename this to inididcate authors from search result
      tags: [], // TODO: Remove this and use form.authors instead
      loading: false,
      uploadingPaper: false,
      suggestedHubs: [],
    };

    this.state = {
      ...initialState,
    };
  }

  componentDidMount() {
    let { paper, modalActions } = this.props;
    modalActions.openUploadPaperModal(false);
    let form = { ...this.state.form };
    form.title = paper.uploadedPaper.name;
    this.setState({ form });
    this.getHubs();
  }

  handleAuthorSelect = (value) => {
    if (this.state.selectedAuthors.length !== 3) {
      let error = { ...this.state.error };
      error.author = false;
      this.setState({
        selectedAuthors: [...this.state.selectedAuthors, value],
        searchAuthor: "",
        error,
      });
    }
  };

  handleAuthorChange = (selectedAuthors) => {
    if (selectedAuthors.length < this.state.selectedAuthors.length) {
      this.setState({ selectedAuthors });
    }
  };

  handleCheckBoxToggle = (id, state) => {
    let form = JSON.parse(JSON.stringify(this.state.form));
    let type = { ...form.type };
    // set all values to false (so only 1 option can be selected)
    type.journal = false;
    type.conference = false;
    type.other = false;
    // set appropriate button to correct state
    type[id] = state;
    form.type = type;
    this.setState({ form });
  };

  handleInputChange = (id, value) => {
    let form = JSON.parse(JSON.stringify(this.state.form));
    let error = { ...this.state.error };
    let keys = id.split(".");
    if (keys.length < 2) {
      form[keys[0]] = value;
    } else {
      form[keys[0]][keys[1]] = value;
      keys[0] === "published" ? (error[keys[1]] = false) : null; // removes red border on select fields
      keys[0] === "author" ? (error[keys[0]] = false) : null;
    }
    this.setState({ form, error });
  };

  handleDiscussionInputChange = (id, value) => {
    let discussion = { ...this.state.discussion };
    discussion[id] = value;
    this.setState({ discussion });
  };

  handleHubSelection = (id, value) => {
    let form = JSON.parse(JSON.stringify(this.state.form));
    let error = { ...this.state.error };
    value = value || [];
    if (value.length > 3) {
      let mostRecent = [...value].pop();
      form.hubs[2] = mostRecent;
    } else {
      form.hubs = [...value];
    }
    if (error.hubs) {
      error.hubs = form.hubs.length > 0 ? false : true;
    }
    this.setState({ form, error });
  };

  onEditorStateChange = (editorState) => {
    this.setState({ summary: editorState });
  };

  searchAuthors = (value) => {
    clearTimeout(this.searchAuthorsTimeout);
    if (value === "") {
      return this.setState({
        loading: false,
        showAuthorList: false,
        searchAuthor: value,
      });
    }

    this.setState({
      searchAuthor: value,
      loading: true,
      showAuthorList: true,
    });

    this.searchAuthorsTimeout = setTimeout(() => {
      fetch(API.AUTHOR({ search: value }), API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((resp) => {
          this.setState({
            authors: resp.results,
            loading: false,
          });
        });
    }, 1000);
  };

  uploadPaper = async (acceptedFiles, binaryStr) => {
    let { paperActions } = this.props;
    let error = { ...this.state.error };
    let form = JSON.parse(JSON.stringify(this.state.form));
    let uploadedFile = acceptedFiles[0];
    await this.setState({ uploadingPaper: true });

    let grabName = () => {
      let arr = uploadedFile.name.split(".");
      arr.pop();
      return arr.join(".");
    };
    let name = grabName();
    form.title = name;

    setTimeout(async () => {
      await paperActions.uploadPaperToState(uploadedFile);
      error.dnd = false;
      this.setState({
        uploadingPaper: false,
        form,
        error,
      });
    }, 400);
  };

  openAddAuthorModal = async () => {
    let { modals, modalActions } = this.props;
    await modalActions.openAddAuthorModal(true);
  };

  removePaper = () => {
    let { paperActions } = this.props;
    paperActions.removePaperFromState();
  };

  renderTitle = () => {
    let { activeStep } = this.state;
    switch (activeStep) {
      case 1:
        return (
          <div className={css(styles.titleContainer)}>
            <div className={css(styles.title, styles.text)}>Paper Upload</div>
            <div className={css(styles.subtitle, styles.text)}>
              Step 1: Main Information
            </div>
          </div>
        );
      case 2:
        return (
          <div className={css(styles.titleContainer)}>
            <div className={css(styles.title, styles.text)}>Paper Upload</div>
            <div className={css(styles.subtitle, styles.text)}>
              Step 2: Add a summary that concisely highlights the main aspects
              of the paper
            </div>
          </div>
        );
      case 3:
        return (
          <div className={css(styles.titleContainer)}>
            <div className={css(styles.title, styles.text)}>Paper Upload</div>
            <div className={css(styles.subtitle, styles.text)}>
              Step 3: Start a discussion on the paper
            </div>
          </div>
        );
    }
  };

  addNewUser = (params) => {
    fetch(API.AUTHOR({}), API.POST_CONFIG(params))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((resp) => {
        let selectedAuthors = [...this.state.selectedAuthors, resp];
        this.setState({
          selectedAuthors,
        });
      });
  };

  getHubs = () => {
    fetch(API.HUB({}), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((resp) => {
        let hubs = resp.results.map((hub, index) => {
          return { ...hub, value: hub.id, label: hub.name };
        });
        this.setState({
          suggestedHubs: hubs,
        });
      });
  };

  renderHeader = (label, header = false) => {
    return (
      <div className={css(styles.header, styles.text)}>
        {label}
        {header && (
          <div className={css(styles.headerButton, styles.text)}>{header}</div>
        )}
      </div>
    );
  };

  renderContent = () => {
    let {
      progress,
      form,
      discussion,
      summary,
      showAuthorList,
      loading,
      activeStep,
      uploadingPaper,
      error,
      searchAuthor,
      authors,
    } = this.state;
    switch (activeStep) {
      case 1:
        return (
          <span>
            {this.renderHeader("Academic Paper")}
            <div className={css(styles.section)}>
              <div className={css(styles.paper)}>
                <div className={css(styles.label)}>
                  Paper PDF
                  <span className={css(styles.asterick)}>*</span>
                </div>
                <DragNDrop
                  pasteUrl={false}
                  handleDrop={this.uploadPaper}
                  loading={uploadingPaper}
                  uploadFinish={
                    Object.keys(this.props.paper.uploadedPaper).length > 0
                  }
                  uploadedPaper={this.props.paper.uploadedPaper}
                  reset={this.removePaper}
                  error={error.dnd}
                  isDynamic={true}
                />
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
                value={form.title}
                id={"paper_title"}
                onChange={this.handleInputChange}
              />
              <AuthorInput
                tags={this.state.selectedAuthors}
                onChange={this.handleAuthorChange}
                onChangeInput={this.searchAuthors}
                inputValue={searchAuthor}
                label={"Authors"}
                required={true}
                error={error.author}
              />
              <AuthorCardList
                show={showAuthorList}
                authors={authors}
                loading={loading}
                addAuthor={this.openAddAuthorModal}
                onAuthorClick={this.handleAuthorSelect}
              />
              <div className={css(styles.row, styles.authorCheckboxContainer)}>
                <CheckBox
                  isSquare={true}
                  active={form.author.self_author}
                  label={"I am an author of this paper"}
                  id={"author.self_author"}
                  onChange={this.handleInputChange}
                />
              </div>
              <div className={css(styles.row)}>
                <FormSelect
                  label={"Year of Publication"}
                  placeholder="yyyy"
                  required={true}
                  containerStyle={styles.smallContainer}
                  inputStyle={styles.smallInput}
                  value={form.published.year}
                  id={"published.year"}
                  options={Options.range(1960, 2019)}
                  onChange={this.handleInputChange}
                  error={error.year}
                />
                <FormSelect
                  label={"Month of Publication"}
                  placeholder="month"
                  required={true}
                  containerStyle={styles.smallContainer}
                  inputStyle={styles.smallInput}
                  value={form.published.month}
                  id={"published.month"}
                  options={Options.months}
                  onChange={this.handleInputChange}
                  error={error.month}
                />
                <FormSelect
                  label={"Day of Publication"}
                  placeholder="dd"
                  required={true}
                  containerStyle={styles.smallContainer}
                  inputStyle={styles.smallInput}
                  value={form.published.day}
                  id={"published.day"}
                  options={Options.range(1, 31)}
                  onChange={this.handleInputChange}
                  error={error.day}
                />
              </div>
              <div className={css(styles.section, styles.leftAlign)}>
                <p className={css(styles.label)}>Type</p>
                <div className={css(styles.row)}>
                  <div className={css(styles.checkboxRow)}>
                    <CheckBox
                      active={form.type.journal}
                      label={"Journal"}
                      id={"journal"}
                      onChange={this.handleCheckBoxToggle}
                    />
                    <CheckBox
                      active={form.type.conference}
                      label={"Conference"}
                      id={"conference"}
                      onChange={this.handleCheckBoxToggle}
                    />
                    <CheckBox
                      active={form.type.other}
                      label={"Other"}
                      id={"other"}
                      onChange={this.handleCheckBoxToggle}
                    />
                  </div>
                </div>
              </div>
              <FormSelect
                label={"Hubs"}
                placeholder="Select up to 3 hubs"
                required={true}
                containerStyle={styles.container}
                inputStyle={customStyles.input}
                isMulti={true}
                value={form.hubs}
                id={"hubs"}
                options={this.state.suggestedHubs}
                onChange={this.handleHubSelection}
                error={error.hubs}
              />
            </div>
          </span>
        );
      case 2:
        return (
          <span>
            {this.renderHeader("Summary", "Summary Guideline")}
            <div className={css(styles.draftEditor)}>
              <TextEditor canEdit={true} readOnly={false} />
            </div>
          </span>
        );
      case 3:
        return (
          <span>
            {this.renderHeader("Discussion")}
            <div className={css(styles.section)}>
              <FormInput
                label={"Title"}
                placeholder="Title of discussion"
                containerStyle={styles.container}
                inputStyle={styles.inputStyle}
                value={discussion.title}
                id={"title"}
                onChange={this.handleDiscussionInputChange}
              />
              <FormTextArea
                label={"Question"}
                placeholder="Leave a question or a comment"
                value={discussion.question}
                id={"question"}
                onChange={this.handleDiscussionInputChange}
              />
            </div>
          </span>
        );
    }
  };

  renderButtons = () => {
    let { activeStep } = this.state;
    switch (activeStep) {
      case 1:
        return (
          <div className={css(styles.buttonRow, styles.buttons)}>
            <div className={css(styles.button, styles.buttonLeft)}>
              <span className={css(styles.buttonLabel, styles.text)}>
                Cancel
              </span>
            </div>
            <Button
              label={"Next Step"}
              customButtonStyle={styles.button}
              type={"submit"}
              onClick={this.submitForm}
            />
          </div>
        );
      case 2:
        return (
          <div className={css(styles.buttonRow, styles.buttons)}>
            <div className={css(styles.backButton)} onClick={this.prevStep}>
              <img
                src={"/static/icons/back-arrow-blue.png"}
                className={css(styles.backButtonIcon)}
              />
              Back to previous step
            </div>
            <div className={css(styles.button, styles.buttonLeft)}>
              <Button
                label={"Skip for now"}
                customButtonStyle={styles.button}
                isWhite={true}
              />
            </div>
            <Button
              label={"Save"}
              customButtonStyle={styles.button}
              onClick={this.nextStep}
            />
          </div>
        );
      case 3:
        return (
          <div className={css(styles.buttonRow, styles.buttons)}>
            <div className={css(styles.backButton)} onClick={this.prevStep}>
              <img
                src={"/static/icons/back-arrow-blue.png"}
                className={css(styles.backButtonIcon)}
              />
              Back to previous step
            </div>
            <div className={css(styles.button, styles.buttonLeft)}>
              <Button
                label={"Skip for now"}
                customButtonStyle={styles.button}
                isWhite={true}
              />
            </div>
            <Button
              label={"Save"}
              customButtonStyle={styles.button}
              onClick={this.nextStep}
            />
          </div>
        );
    }
  };

  submitForm = async () => {
    if (this.validateSelectors()) {
      await this.postPaper();
      this.nextStep();
    }
  };

  validateSelectors = () => {
    let { published, hubs, author } = this.state.form;
    let { paper } = this.props;
    let error = { ...this.state.error };
    let pass = true;
    if (!published.year) {
      pass = false;
      error.year = true;
    }
    if (!published.month) {
      pass = false;
      error.month = true;
    }
    if (!published.day) {
      pass = false;
      error.day = true;
    }
    if (hubs.length < 1) {
      pass = false;
      error.hubs = true;
    }
    if (!(Object.keys(paper.uploadedPaper).length > 0)) {
      pass = false;
      error.dnd = true;
    }
    if (author.self_author === false && this.state.selectedAuthors.length < 1) {
      pass = false;
      error.author = true;
    }
    this.setState({ error });
    return pass;
  };

  postPaper = async () => {
    const body = this.state.form;
    body.file = this.props.paper.uploadedPaper;
    console.log("postPaper body", body);
    await this.props.paperActions.postPaper(body);
  };

  nextStep = () => {
    let { activeStep } = this.state;

    this.setState({
      progress: this.state.progress + 33.33,
      activeStep: activeStep + 1,
    });
  };

  prevStep = () => {
    let { activeStep } = this.state;
    this.setState({
      progress: this.state.progress - 33.33,
      activeStep: activeStep - 1,
    });
  };

  render() {
    let {
      progress,
      form,
      discussion,
      showAuthorList,
      loading,
      activeStep,
      error,
    } = this.state;
    let { modals } = this.props;
    return (
      <div className={css(styles.background)}>
        <AddAuthorModal
          isOpen={modals.openAddAuthorModal}
          addNewUser={this.addNewUser}
        />
        {this.renderTitle()}
        <form
          className={css(styles.form)}
          onSubmit={(e) => {
            e.preventDefault();
            activeStep === 1 && this.nextStep();
          }}
        >
          <div className={css(styles.pageContent)}>
            <div className={css(styles.progressBar)}>
              <Progress completed={progress} />
            </div>
            {this.renderContent()}
            {/* {errorMessage && <div className={css(styles.errorMessage)}>Oops! Looks like your form is incomplete.</div>} */}
          </div>
          {this.renderButtons()}
        </form>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#FCFCFC",
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
  form: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  pageContent: {
    width: "70%",
    minWidth: 820,
    minHeight: 500,
    // maxHeight: 1128,
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
    justifyContent: "space-between",
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
    marginBottom: 10,
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
  buttonRow: {
    width: "70%",
    minWidth: 820,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    padding: 60,
  },
  buttons: {
    marginTop: 20,
    justifyContent: "center",
    // width: "100%",
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
    marginRight: 20,
  },
  buttonLabel: {
    color: colors.BLUE(1),
    cursor: "pointer",
    ":hover": {
      textDecoration: "underline",
    },
  },
  backButton: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    color: colors.BLUE(1),
    fontFamily: "Roboto",
    fontSize: 16,
    position: "absolute",
    left: 0,
    cursor: "pointer",
    ":hover": {
      textDecoration: "underline",
    },
  },
  backButtonIcon: {
    height: 12,
    width: 7,
    marginRight: 10,
  },
  headerButton: {
    fontSize: 16,
    color: colors.BLUE(1),
    cursor: "pointer",
    ":hover": {
      textDecoration: "underline",
    },
  },
  draftEditor: {
    marginTop: 25,
    height: 800,
    minHeight: 800,
    maxHeight: 800,
    overflowY: "scroll",
    "::-webkit-scrollbar": {
      marginLeft: 15,
    },
  },
});

const customStyles = {
  container: {
    width: 600,
  },
  input: {
    width: 600,
    display: "flex",
  },
};

const mapStateToProps = (state) => ({
  modals: state.modals,
  paper: state.paper,
});

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(ModalActions, dispatch),
  paperActions: bindActionCreators(PaperActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaperUploadInfo);
