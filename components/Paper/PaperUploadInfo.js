import React from "react";
import Router from "next/router";
import { StyleSheet, css } from "aphrodite";
import Progress from "react-progressbar";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Value } from "slate";

// Component
import CheckBox from "../Form/CheckBox";
import FormInput from "../Form/FormInput";
import FormSelect from "../Form/FormSelect";
import DragNDrop from "../Form/DragNDrop";
import Button from "../Form/Button";
import AuthorCardList from "../SearchSuggestion/AuthorCardList";
import dynamic from "next/dynamic";
import AuthorInput from "../SearchSuggestion/AuthorInput.js";
import TextEditor from "~/components/TextEditor";
import Message from "../Loader/Message";

// Modal
import AddAuthorModal from "../modal/AddAuthorModal";

// Redux
import { ModalActions } from "../../redux/modals";
import { PaperActions } from "~/redux/paper";
import { AuthActions } from "~/redux/auth";
import { MessageActions } from "~/redux/message";

// Config
import colors from "../../config/themes/colors";
import API from "../../config/api";
import { Helpers } from "@quantfive/js-web-config";
import * as Options from "../../config/utils/options";
import discussionScaffold from "./discussionScaffold.json";

const discussionScaffoldInitialValue = Value.fromJSON(discussionScaffold);

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
        question: {},
      },
      error: {
        year: false,
        month: false,
        hubs: false,
        dnd: false,
        author: false,
      },
      summary: {},
      summaryId: null,
      showAuthorList: false,
      progress: 33.33,
      activeStep: 1,
      searchAuthor: "",
      suggestedAuthors: [], // TODO: Rename this to inididcate authors from search result
      selectedAuthors: [],
      loading: false,
      uploadingPaper: false,
      suggestedHubs: [],
      editMode: false,
      edited: false,
    };

    this.state = {
      ...initialState,
    };
    this.titleRef = React.createRef();
  }

  componentDidMount() {
    let {
      paper,
      modalActions,
      messageActions,
      paperId,
      paperTitle,
    } = this.props;
    this.props.authActions.getUser();
    this.getHubs();
    if (paperId) {
      // this determines whether the user is coming from the upload modal or the summary of the paper
      messageActions.showMessage({ load: true, show: true });
      this.setState({ editMode: true });
      this.fetchAndPrefillPaperInfo(paperId);
    } else {
      modalActions.openUploadPaperModal(false);
      let form = { ...this.state.form };
      form.title = paperTitle;
      this.setState({ form });
    }
  }

  fetchAndPrefillPaperInfo = (paperId) => {
    fetch(API.PAPER({ paperId }), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then(async (res) => {
        let userAuthorId = this.props.auth.user.author_profile.id;
        let {
          authors,
          doi,
          hubs,
          paper_publish_date,
          publication_type,
          title,
        } = res;

        let form = JSON.parse(JSON.stringify(this.state.form));
        form.doi = doi;
        form.title = title;
        form.hubs = hubs.map((hub) => {
          return {
            id: hub.id,
            name: hub.name,
            value: hub.id,
            label: hub.name,
          };
        });

        let type = {};
        Object.keys(form.type).forEach((key) => {
          if (key === publication_type) {
            type[key] = true;
          } else {
            type[key] = false;
          }
        });
        form.type = type;

        let published_date = paper_publish_date.split("-"); // ex. 2019-09-20 -> [2010, 09, 20]
        form.published.year = {
          value: published_date[0],
          label: published_date[0],
        };
        form.published.month = Options.months
          .filter((month) => month.value === published_date[1])
          .pop();
        if (published_date.length > 2) {
          form.published.day = {
            value: published_date[2],
            label: published_date[2],
          };
        }
        form.author.self_author =
          authors.filter((author) => author.id === userAuthorId).length > 0;

        await this.setState({
          selectedAuthors: [...authors],
          form,
          progress: 100,
        });
        setTimeout(
          () =>
            this.props.messageActions.showMessage({ load: false, show: false }),
          300
        );
      });
  };

  componentWillUnMount() {
    this.setState({ ...initialState });
  }

  handleAuthorSelect = (value) => {
    let error = { ...this.state.error };
    error.author = false;
    this.setState({
      selectedAuthors: [...this.state.selectedAuthors, value],
      suggestedAuthors: [],
      searchAuthor: "",
      error,
      edited: true,
    });
  };

  handleAuthorChange = (selectedAuthors) => {
    if (selectedAuthors.length < this.state.selectedAuthors.length) {
      let userAuthorId = this.props.auth.user.author_profile.id;
      let form = { ...this.state.form };
      if (
        this.state.selectedAuthors.filter((author) => {
          author.id === userAuthorId;
        }).length < 1
      ) {
        form.author.self_author = false;
      }
      this.setState({ selectedAuthors, form, edited: true });
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
    this.setState({ form, edited: true });
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
    }
    this.setState({ form, error, edited: true });
  };

  handleSelfAuthorToggle = (id, value) => {
    let error = { ...this.state.error };
    let form = JSON.parse(JSON.stringify(this.state.form));
    let userAuthorId = this.props.auth.user.author_profile.id;
    form.author.self_author = value;
    if (value) {
      error.author = false;
      this.setState({
        selectedAuthors: [
          ...this.state.selectedAuthors,
          userAuthorId && { ...this.props.auth.user.author_profile },
        ],
        suggestedAuthors: [],
        searchAuthor: "",
        form,
        error,
      });
    } else {
      let selectedAuthors = this.state.selectedAuthors.filter(
        (author) => author.id !== userAuthorId
      );
      this.setState({
        selectedAuthors,
        suggestedAuthors: [],
        searchAuthor: "",
        form,
        error: !!this.state.selectedAuthors.length < 1,
        edited: true,
      });
    }
  };

  handleDiscussionInputChange = (id, value) => {
    let discussion = { ...this.state.discussion };
    discussion[id] = value;
    this.setState({ discussion });
  };

  handleDiscussionTextEditor = (editorState) => {
    let discussion = { ...this.state.discussion };
    discussion.question = editorState;
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
    this.setState({ form, error, edited: true });
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

    let authors = this.state.selectedAuthors.map((author) => author.id);

    this.searchAuthorsTimeout = setTimeout(async () => {
      return fetch(
        API.AUTHOR({ search: value, excludeIds: authors }),
        API.GET_CONFIG()
      )
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((resp) => {
          this.setState({
            suggestedAuthors: resp.results,
            loading: false,
          });
        });
    }, 400);
  };

  uploadPaper = async (acceptedFiles, binaryStr) => {
    let { paperActions } = this.props;
    let error = { ...this.state.error };
    let form = JSON.parse(JSON.stringify(this.state.form));
    let uploadedFile = acceptedFiles[0];
    await this.setState({ uploadingPaper: true });

    setTimeout(async () => {
      await paperActions.uploadPaperToState(uploadedFile);
      error.dnd = false;
      this.setState({
        uploadingPaper: false,
        form,
        error,
        edited: true,
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
    this.setState({ edited: true });
  };

  renderTitle = () => {
    let { activeStep, editMode } = this.state;
    let title = editMode ? "Edit Paper Information" : "Paper Upload";

    switch (activeStep) {
      case 1:
        return (
          <div className={css(styles.titleContainer)}>
            <div className={css(styles.title, styles.text)}>{title}</div>
            <div className={css(styles.subtitle, styles.text)}>
              Step 1: Main Information
            </div>
          </div>
        );
      case 2:
        return (
          <div className={css(styles.titleContainer)}>
            <div className={css(styles.title, styles.text)}>{title}</div>
            <div className={css(styles.subtitle, styles.text)}>
              Step 2: Add a summary that concisely highlights the main aspects
              of the paper
            </div>
          </div>
        );
      case 3:
        return (
          <div className={css(styles.titleContainer)}>
            <div className={css(styles.title, styles.text)}>{title}</div>
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
      form,
      discussion,
      showAuthorList,
      loading,
      activeStep,
      uploadingPaper,
      error,
      searchAuthor,
      suggestedAuthors,
      editMode,
    } = this.state;
    switch (activeStep) {
      case 1:
        return (
          <span>
            {!editMode && this.renderHeader("Academic Paper")}
            <div className={css(styles.section)}>
              {!editMode && (
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
              )}
            </div>
            {this.renderHeader("Main Information")}
            <div className={css(styles.section, styles.padding)}>
              {/* <span className={css(styles.row)}> */}
              <FormInput
                label={"Paper Title"}
                placeholder="Enter title of paper"
                required={true}
                containerStyle={styles.container}
                value={form.title}
                id={"title"}
                onChange={this.handleInputChange}
              />
              {/* </span> */}
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
                authors={suggestedAuthors}
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
                  onChange={this.handleSelfAuthorToggle}
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
              </div>
              <div className={css(styles.section, styles.leftAlign)}>
                <div className={css(styles.row, styles.minHeight)}>
                  <span className={css(styles.section, styles.leftAlign)}>
                    <p className={css(styles.label)}>Type</p>
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
                  </span>
                  <span
                    className={css(
                      styles.doi,
                      this.state.form.type.journal && styles.reveal
                    )}
                  >
                    <FormInput
                      label={"DOI"}
                      placeholder="Enter DOI of paper"
                      id={"doi"}
                      value={form.doi}
                      containerStyle={styles.doiInput}
                      onChange={this.handleInputChange}
                    />
                  </span>
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
              <TextEditor
                canEdit={true}
                readOnly={false}
                onChange={this.handleSummaryChange}
                hideButton={true}
                initialValue={
                  Object.keys(this.state.summary).length > 0
                    ? this.state.summary
                    : null
                }
              />
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
                value={discussion.title}
                id={"title"}
                onChange={this.handleDiscussionInputChange}
              />
              <div className={css(styles.discussionInputWrapper)}>
                <div className={css(styles.label)}>Question</div>
                <div className={css(styles.discussionTextEditor)}>
                  <TextEditor
                    canEdit={true}
                    readOnly={false}
                    onChange={this.handleDiscussionTextEditor}
                    hideButton={true}
                    placeholder={"Leave a question or a comment"}
                    initialValue={
                      Object.keys(this.state.discussion.question).length > 0
                        ? this.state.discussion.question
                        : discussionScaffoldInitialValue
                    }
                  />
                </div>
              </div>
            </div>
          </span>
        );
    }
  };

  renderButtons = () => {
    let { activeStep, editMode } = this.state;
    switch (activeStep) {
      case 1:
        return (
          <div className={css(styles.buttonRow, styles.buttons)}>
            <div
              className={css(styles.button, styles.buttonLeft)}
              onClick={this.cancel}
            >
              <span className={css(styles.buttonLabel, styles.text)}>
                Cancel
              </span>
            </div>
            <Button
              label={editMode ? "Save" : "Next Step"}
              customButtonStyle={styles.button}
              type={"submit"}
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
                onClick={this.nextStep}
              />
            </div>
            <Button
              label={"Continue"}
              customButtonStyle={styles.button}
              onClick={this.saveSummary}
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
                onClick={this.navigateToSummary}
              />
            </div>
            <Button
              label={"Continue"}
              customButtonStyle={styles.button}
              onClick={this.saveDiscussion}
            />
          </div>
        );
    }
  };

  submitForm = async () => {
    if (this.validateSelectors()) {
      if (!this.state.edited) {
        return this.state.editMode ? this.navigateToSummary() : this.nextStep();
      }
      this.props.messageActions.showMessage({ load: true, show: true });
      if (
        this.props.paper.postedPaper &&
        Object.keys(this.props.paper.postedPaper).length > 0
      ) {
        await this.postPaper("PATCH");
      } else {
        await this.postPaper();
      }
    } else {
      this.props.messageActions.setMessage("Required fields must be filled.");
      this.props.messageActions.showMessage({
        load: false,
        show: true,
        error: true,
      });
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
    if (hubs.length < 1) {
      pass = false;
      error.hubs = true;
    }
    if (
      !this.state.editMode &&
      !(Object.keys(paper.uploadedPaper).length > 0)
    ) {
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

  postPaper = async (request = "POST") => {
    const body = { ...this.state.form };
    body.authors = this.state.selectedAuthors.map((author) => author.id);
    body.hubs = body.hubs.map((hub) => hub.id);
    body.publishDate = this.formatPublishDate(body.published);
    body.url = ""; // TODO: Add this optional field
    body.type = Object.keys(body.type)
      .filter((type) => body.type[type] && String(type))
      .pop();

    // send form object to the backend
    if (!this.state.editMode) {
      body.file = this.props.paper.uploadedPaper;
      let paperId =
        this.props.paper.postedPaper && this.props.paper.postedPaper.id;
      request === "POST"
        ? await this.props.paperActions.postPaper(body)
        : await this.props.paperActions.patchPaper(paperId, body);
      if (this.props.paper.success) {
        this.props.messageActions.setMessage(
          `Paper successfully ${request === "POST" ? "uploaded" : "updated"}`
        );
        this.props.messageActions.showMessage({ show: true });
        this.nextStep();
      } else {
        this.props.messageActions.setMessage("Hmm something went wrong");
        this.props.messageActions.showMessage({ show: true, error: true });
        setTimeout(
          () => this.props.messageActions.showMessage({ show: false }),
          400
        );
      }
    } else {
      await this.props.paperActions.patchPaper(this.props.paperId, body);
      if (this.props.paper.success) {
        this.props.messageActions.setMessage(
          `Paper successfully ${request === "POST" ? "uploaded" : "updated"}`
        );
        this.props.messageActions.showMessage({ show: true });
        setTimeout(() => {
          this.navigateToSummary();
        }, 800);
      } else {
        this.props.messageActions.setMessage("Hmm something went wrong");
        this.props.messageActions.showMessage({ show: true, error: true });
        setTimeout(
          () => this.props.messageActions.showMessage({ show: false }),
          400
        );
      }
    }
  };

  formatPublishDate = (published) => {
    return `${published.year.value}-${published.month.value}-01`;
  };

  nextStep = async () => {
    let { activeStep } = this.state;
    if (activeStep < 3) {
      await this.setState({
        progress: this.state.progress + 33.33,
        activeStep: activeStep + 1,
        edited: false,
      });
      setTimeout(
        () => this.props.messageActions.showMessage({ show: false }),
        400
      );
      window.scrollTo(0, this.titleRef.current.offsetTop);
    }
  };

  prevStep = async () => {
    let { activeStep } = this.state;
    await this.setState({
      progress: this.state.progress - 33.33,
      activeStep: activeStep - 1,
    });
    window.scrollTo(0, this.titleRef.current.offsetTop);
  };

  handleSummaryChange = (summary) => {
    this.setState({ summary });
  };

  saveSummary = async () => {
    let query = {};

    if (this.state.summaryId) {
      query.summaryId = this.state.summaryId;
    }

    let param = {
      summary: JSON.stringify(this.state.summary.toJSON()),
      paper: this.props.paperId
        ? this.props.paperId
        : this.props.paper.postedPaper.id,
    };

    let config = this.state.summaryId // if there is a summaryid, then a paper exists
      ? await API.PATCH_CONFIG(param)
      : await API.POST_CONFIG(param);

    return fetch(API.SUMMARY(query), config)
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        console.log("res", res);
        let summaryJSON = JSON.parse(res.summary);
        let editorState = Value.fromJSON(summaryJSON);
        this.setState({
          summaryId: res.id,
          summary: editorState,
        });
        this.nextStep();
      });
  };

  saveDiscussion = async () => {
    // if there's nothing to save, then don't save
    if (
      this.state.discussion.title === "" ||
      Object.keys(this.state.discussion.question).length < 1
    ) {
      this.navigateToSummary();
    }

    let paperId = this.props.paperId
      ? this.props.paperId
      : this.props.paper.postedPaper.id;

    let param = {
      title: this.state.discussion.title,
      text: JSON.stringify(this.state.discussion.question.toJSON()),
      paper: paperId,
    };

    let config = await API.POST_CONFIG(param);

    return fetch(API.DISCUSSION(paperId), config)
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((resp) => {
        Router.push(
          "/paper/[paperId]/[tabName]",
          `/paper/${this.props.paper.postedPaper.id}/summary`
        );
      });
  };

  navigateToSummary = () => {
    let paperId = this.state.editMode
      ? this.props.paperId
      : this.props.paper.postedPaper.id;
    Router.push("/paper/[paperId]/[tabName]", `/paper/${paperId}/summary`);
  };

  cancel = () => {
    if (this.state.editMode) {
      let { paperId } = this.props;
      Router.push("/paper/[paperId]/[tabName]", `/paper/${paperId}/summary`);
    } else {
      Router.back();
    }
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
      <div className={css(styles.background)} ref={this.titleRef}>
        <Message />
        <AddAuthorModal
          isOpen={modals.openAddAuthorModal}
          addNewUser={this.addNewUser}
        />
        {this.renderTitle()}
        <form
          className={css(styles.form)}
          onSubmit={(e) => {
            e.preventDefault();
            activeStep === 1 && this.submitForm();
          }}
        >
          <div className={css(styles.pageContent)}>
            <div className={css(styles.progressBar)}>
              <Progress completed={progress} />
            </div>
            {this.renderContent()}
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
    scrollBehavior: "smooth",
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
    marginTop: 10,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    width: 600,
    alignItems: "center",
  },
  minHeight: {
    height: 90,
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
    width: 290,
  },
  smallInput: {
    width: 156,
  },
  checkboxRow: {
    width: 290,
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
  discussionInputWrapper: {
    display: "flex",
    flexDirection: "column",
    marginTop: 20,
  },
  discussionTextEditor: {
    width: 600,
    border: "1px solid #E8E8F2",
    backgroundColor: "#FBFBFD",
  },
  doiInput: {
    width: 290,
    marginTop: 10,
    marginBottom: 0,
  },
  doi: {
    width: 290,
    height: 0,
    transition: "all ease-in-out 0.2s",
    opacity: 0,
    overflow: "hidden",
  },
  reveal: {
    height: 90,
    opacity: 1,
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
  auth: state.auth,
  message: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(ModalActions, dispatch),
  paperActions: bindActionCreators(PaperActions, dispatch),
  authActions: bindActionCreators(AuthActions, dispatch),
  messageActions: bindActionCreators(MessageActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaperUploadInfo);
