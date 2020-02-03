import React, { Fragment } from "react";
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
import FormTextArea from "../Form/FormTextArea";
import { parseTwoDigitYear } from "moment";

const discussionScaffoldInitialValue = Value.fromJSON(discussionScaffold);

class PaperUploadInfo extends React.Component {
  constructor(props) {
    super(props);
    let initialState = {
      form: {
        title: "",
        doi: "",
        tagline: "",
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
    let { messageActions, paperId, paperTitle } = this.props;
    this.props.authActions.getUser();
    this.getHubs();
    if (paperId) {
      // this determines whether the user is coming from the upload modal or the summary of the paper
      messageActions.showMessage({ load: true, show: true });
      this.setState({ editMode: true });
      this.fetchAndPrefillPaperInfo(paperId);
    } else {
      this.prefillPaperInfo();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.paperTitle !== this.props.paperTitle) {
      this.prefillPaperInfo();
    }
    if (
      Object.keys(prevProps.paper.uploadedPaper).length < 1 &&
      Object.keys(this.props.paper.uploadedPaper).length > 0
    ) {
      this.prefillPaperInfo();
    }
  }

  prefillPaperInfo = () => {
    let { uploadedPaper } = this.props.paper;
    let form = { ...this.state.form };
    let { DOI, url, URL, title, abstract, issued } = uploadedPaper;

    form.title = this.props.paperTitle ? this.props.paperTitle : title && title;
    form.tagline = abstract && abstract.slice(0, 255);
    form.doi = DOI && DOI;
    form.url = url && url;
    if (issued) {
      let date = issued["date-parts"][0];
      form.published.year = this.handleFormYear(date);
      form.published.month = this.handleFormMonth(date);
      form.published.day = this.handleFormDay(date);
    }
    this.setState({ form: form }, () => {
      this.props.messageActions.showMessage({ show: false });
    });
  };

  fetchAndPrefillPaperInfo = (paperId) => {
    fetch(API.PAPER({ paperId }), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        let userAuthorId = this.props.auth.user.author_profile.id;
        let {
          authors,
          doi,
          hubs,
          paper_publish_date,
          publication_type,
          title,
          tagline,
        } = res;

        let form = JSON.parse(JSON.stringify(this.state.form));
        form.doi = doi;
        form.title = title;
        form.tagline = tagline;
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

        let published_date =
          paper_publish_date && paper_publish_date.split("-"); // ex. 2019-09-20 -> [2010, 09, 20]
        if (published_date) {
          form.published.year = {
            value: published_date[0],
            label: published_date[0],
          };

          if (published_date.length > 1) {
            form.published.month = Options.months
              .filter((month) => month.value === published_date[1])
              .pop();
          } else {
            form.published.month = Options.months[0];
          }

          if (published_date.length > 2) {
            form.published.day = {
              value: published_date[2],
              label: published_date[2],
            };
          }
        }
        form.author.self_author =
          authors.filter((author) => author.id === userAuthorId).length > 0;
        this.setState({
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

  handleFormYear = (date) => {
    return date[0];
  };
  handleFormMonth = (date) => {
    if (date.length > 1) {
      return date[1];
    } else {
      return "01";
    }
  };
  handleFormDay = (date) => {
    if (date.length > 2) {
      return date[2];
    } else {
      return "01";
    }
  };

  componentWillUnMount() {
    this.setState({ ...initialState });
  }

  handleAuthorSelect = (value) => {
    let userAuthorId = this.props.auth.user.author_profile.id;
    let form = { ...this.state.form };
    let error = { ...this.state.error };
    error.author = false;
    if (userAuthorId === value.id) {
      form.author.self_author = true;
    }
    this.setState({
      selectedAuthors: [...this.state.selectedAuthors, value],
      suggestedAuthors: [],
      searchAuthor: "",
      error,
      form,
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
      if (keys[0] === "tagline") {
        form[keys[0]] = value.slice(0, 255);
      } else {
        form[keys[0]] = value;
      }
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

  uploadPaper = (acceptedFiles) => {
    let { paperActions } = this.props;
    let error = { ...this.state.error };
    let uploadedFile = acceptedFiles[0];
    this.setState({ uploadingPaper: true });

    setTimeout(() => {
      paperActions.uploadPaperToState(uploadedFile);
      error.dnd = false;
      this.setState({
        uploadingPaper: false,
        error,
        edited: true,
      });
    }, 400);
  };

  uploadUrl = (urlData) => {
    let { paperActions } = this.props;
    let error = { ...this.state.error };
    this.setState({ uploadingPaper: true }, () => {
      let metaData = { ...urlData.csl_item };
      metaData.name = metaData.title;
      paperActions.uploadPaperToState(metaData);
      error.dnd = false;
      this.setState({
        uploadingPaper: false,
        error,
        edited: true,
      });
    });
  };

  openAddAuthorModal = async () => {
    let { modals, modalActions } = this.props;
    await modalActions.openAddAuthorModal(true);
  };

  removePaper = () => {
    let { paperActions, modalActions } = this.props;
    paperActions.removePaperFromState();
    this.setState({ edited: true }, () => {
      modalActions.openUploadPaperModal(true);
    });
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
          return {
            ...hub,
            value: hub.id,
            label: hub.name.charAt(0).toUpperCase() + hub.name.slice(1),
          };
        });
        this.setState({
          suggestedHubs: hubs,
        });
      });
  };

  renderHeader = (label, header = false, clickable = true) => {
    return (
      <div className={css(styles.header, styles.text)}>
        {label}
        {header && (
          <div
            className={css(
              styles.sidenote,
              clickable && styles.headerButton,
              styles.text
            )}
          >
            {clickable ? (
              <a
                className={css(styles.authorGuidelines)}
                href="https://www.notion.so/ResearchHub-Summary-Guidelines-7ebde718a6754bc894a2aa0c61721ae2"
                target="_blank"
              >
                {header}
              </a>
            ) : (
              header
            )}
          </div>
        )}
      </div>
    );
  };

  getWindowWidth = () => {
    return window && window.innerWidth < 665;
  };

  renderCharCount = () => {
    return this.state.form.tagline ? this.state.form.tagline.length : 0;
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
    // let mobile = this.getWindowWidth();

    switch (activeStep) {
      case 1:
        return (
          <span>
            {!editMode &&
              this.renderHeader("Academic Paper", "Up to 15MB (.pdf)", false)}
            <div className={css(styles.section)}>
              {!editMode && (
                <div className={css(styles.paper)}>
                  <div className={css(styles.label, styles.labelStyle)}>
                    Paper PDF
                    <span className={css(styles.asterick)}>*</span>
                  </div>
                  <DragNDrop
                    handleDrop={this.uploadPaper}
                    handleUrl={this.uploadUrl}
                    loading={uploadingPaper}
                    uploadFinish={
                      Object.keys(this.props.paper.uploadedPaper).length > 0
                    }
                    uploadedPaper={this.props.paper.uploadedPaper}
                    reset={this.removePaper}
                    error={error.dnd}
                    url={
                      Object.keys(this.props.paper.uploadedPaper).length > 0 &&
                      !this.props.paper.uploadedPaper.size
                    }
                    hideSuggestions={true}
                    openUploadPaperModal={() =>
                      this.props.modalActions.openUploadPaperModal(true)
                    }
                  />
                </div>
              )}
            </div>
            {this.renderHeader("Main Information")}
            <div className={css(styles.section, styles.padding)}>
              <FormInput
                label={"Paper Title"}
                placeholder="Enter title of paper"
                required={true}
                containerStyle={styles.container}
                labelStyle={styles.labelStyle}
                value={form.title}
                id={"title"}
                onChange={this.handleInputChange}
              />
              {editMode && (
                <Fragment>
                  <span className={css(styles.container)}>
                    <AuthorInput
                      tags={this.state.selectedAuthors}
                      onChange={this.handleAuthorChange}
                      onChangeInput={this.searchAuthors}
                      inputValue={searchAuthor}
                      label={"Authors"}
                      required={true}
                      error={error.author}
                      labelStyle={styles.labelStyle}
                    />
                  </span>
                  <span className={css(styles.container)}>
                    <AuthorCardList
                      show={showAuthorList}
                      authors={suggestedAuthors}
                      loading={loading}
                      addAuthor={this.openAddAuthorModal}
                      onAuthorClick={this.handleAuthorSelect}
                    />
                  </span>
                  <div
                    className={css(styles.row, styles.authorCheckboxContainer)}
                  >
                    <CheckBox
                      isSquare={true}
                      active={form.author.self_author}
                      label={"I am an author of this paper"}
                      id={"author.self_author"}
                      onChange={this.handleSelfAuthorToggle}
                      labelStyle={styles.labelStyle}
                    />
                  </div>
                  <div className={css(styles.row)}>
                    <FormSelect
                      label={"Year of Publication"}
                      placeholder="yyyy"
                      required={false}
                      containerStyle={styles.smallContainer}
                      inputStyle={styles.smallInput}
                      value={form.published.year}
                      id={"published.year"}
                      options={Options.range(1960, 2019)}
                      onChange={this.handleInputChange}
                      error={error.year}
                      labelStyle={styles.labelStyle}
                    />
                    <FormSelect
                      label={"Month of Publication"}
                      placeholder="month"
                      required={false}
                      containerStyle={styles.smallContainer}
                      inputStyle={styles.smallInput}
                      value={form.published.month}
                      id={"published.month"}
                      options={Options.months}
                      onChange={this.handleInputChange}
                      error={error.month}
                      labelStyle={styles.labelStyle}
                    />
                  </div>
                  <div className={css(styles.section, styles.leftAlign)}>
                    <div className={css(styles.row, styles.minHeight)}>
                      <span className={css(styles.section, styles.leftAlign)}>
                        <p className={css(styles.label, styles.labelStyle)}>
                          Type
                        </p>
                        <div className={css(styles.checkboxRow)}>
                          <CheckBox
                            active={form.type.journal}
                            label={"Journal"}
                            id={"journal"}
                            onChange={this.handleCheckBoxToggle}
                            labelStyle={styles.labelStyle}
                          />
                          <CheckBox
                            active={form.type.conference}
                            label={"Conference"}
                            id={"conference"}
                            onChange={this.handleCheckBoxToggle}
                            labelStyle={styles.labelStyle}
                          />
                          <CheckBox
                            active={form.type.other}
                            label={"Other"}
                            id={"other"}
                            onChange={this.handleCheckBoxToggle}
                            labelStyle={styles.labelStyle}
                          />
                        </div>
                      </span>
                      <span
                        className={css(
                          styles.doi
                          // !mobile && this.state.form.type.journal && styles.reveal,
                        )}
                      >
                        <FormInput
                          label={"DOI"}
                          placeholder="Enter DOI of paper"
                          id={"doi"}
                          value={form.doi}
                          containerStyle={styles.doiInput}
                          labelStyle={styles.labelStyle}
                          onChange={this.handleInputChange}
                        />
                      </span>
                    </div>
                  </div>
                </Fragment>
              )}
              <FormSelect
                label={"Hubs"}
                placeholder="Select up to 3 hubs"
                required={true}
                containerStyle={styles.container}
                inputStyle={
                  (customStyles.input,
                  form.hubs.length > 0 && customStyles.capitalize)
                }
                labelStyle={styles.labelStyle}
                isMulti={true}
                value={form.hubs}
                id={"hubs"}
                options={this.state.suggestedHubs}
                onChange={this.handleHubSelection}
                error={error.hubs}
              />
              <span
                className={css(
                  styles.mobileDoi
                  // mobile && this.state.form.type.journal && styles.reveal
                )}
              >
                <FormInput
                  label={"DOI"}
                  placeholder="Enter DOI of paper"
                  id={"doi"}
                  value={form.doi}
                  containerStyle={styles.doiInput}
                  labelStyle={styles.labelStyle}
                  onChange={this.handleInputChange}
                />
              </span>
            </div>
            <div className={css(styles.taglineHeader)}>
              {this.renderHeader("Overview")}
            </div>
            <div className={css(styles.section)}>
              <span className={css(styles.tagline)}>
                <FormTextArea
                  label={"Tag Line"}
                  placeholder="Enter a sentence or two describing the paper"
                  required={true}
                  containerStyle={styles.container}
                  labelStyle={styles.labelStyle}
                  value={form.tagline}
                  id={"tagline"}
                  onChange={this.handleInputChange}
                />
                <div className={css(styles.taglineCounter)}>
                  {this.renderCharCount()} / 255
                </div>
              </span>
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
                labelStyle={styles.labelStyle}
                value={discussion.title}
                id={"title"}
                onChange={this.handleDiscussionInputChange}
              />
              <div className={css(styles.discussionInputWrapper)}>
                <div className={css(styles.label, styles.labelStyle)}>
                  Question
                </div>
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
              label={editMode ? "Save" : "Upload"}
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
            <div className={css(styles.button)}>
              <Button
                label={"Continue"}
                customButtonStyle={styles.button}
                onClick={this.saveSummary}
              />
            </div>
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
    if (hubs.length < 1) {
      pass = false;
      error.hubs = true;
    }
    if (published.year && !published.month) {
      pass = false;
      error.month = true;
    }

    if (!published.year && published.month) {
      pass = false;
      error.year = true;
    }
    if (this.state.editMode) {
      //   if (
      //     author.self_author === false &&
      //     this.state.selectedAuthors.length < 1
      //   ) {
      //     pass = false;
      //     error.author = true;
      //   }
      //   if (!published.year) {
      //     pass = false;
      //     error.year = true;
      //   }
      //   if (!published.month) {
      //     pass = false;
      //     error.month = true;
      //   }
      //   if (hubs.length < 1) {
      //     pass = false;
      //     error.hubs = true;
      //   }
      if (
        !this.state.editMode &&
        !(Object.keys(paper.uploadedPaper).length > 0)
      ) {
        pass = false;
        error.dnd = true;
      }
    }
    this.setState({ error });
    return pass;
  };

  postPaper = async (request = "POST") => {
    const body = { ...this.state.form };
    body.hubs = body.hubs.map((hub) => hub.id);
    body.authors = this.state.selectedAuthors.map((author) => author.id);
    if (this.state.editMode) {
      if (body.published && body.published.year) {
        body.publishDate = this.formatPublishDate(body.published);
      }
      body.url = ""; // TODO: Add this optional field
      body.type = Object.keys(body.type)
        .filter((type) => body.type[type] && String(type))
        .pop();
    } else {
      body.type = null;
    }

    let { paper, paperActions, messageActions, authActions } = this.props;
    // send form object to the backend
    if (!this.state.editMode) {
      body.file =
        !this.props.paper.uploadedPaper.url && this.props.paper.uploadedPaper;
      let paperId =
        this.props.paper.postedPaper && this.props.paper.postedPaper.id;
      request === "POST"
        ? await this.props.paperActions.postPaper(body)
        : await this.props.paperActions.patchPaper(paperId, body);
      if (this.props.paper.success) {
        this.props.messageActions.setMessage(
          `Paper successfully ${request === "POST" ? "uploaded" : "updated"}`
        );
        this.props.authActions.setUploadingPaper(true);
        this.props.messageActions.showMessage({ show: true });
        let firstTime = !this.props.auth.user.has_seen_first_coin_modal;
        this.props.authActions.checkUserFirstTime(firstTime);
        this.props.authActions.getUser();
        this.navigateToSummary();
      } else {
        paperActions.patchPaper(paperId, body).then((resp) => {
          if (paper.success) {
            messageActions.setMessage(
              `Paper successfully ${
                request === "POST" ? "uploaded" : "updated"
              }`
            );
            authActions.setUploadingPaper(true);
            messageActions.showMessage({ show: true });
            let firstTime = !this.props.auth.user.has_seen_first_coin_modal;
            authActions.checkUserFirstTime(firstTime);

            // What is this getuser doing here?
            authActions.getUser();
            this.navigateToSummary();
          } else {
            messageActions.setMessage("Hmm something went wrong");
            messageActions.showMessage({ show: true, error: true });
            setTimeout(() => messageActions.showMessage({ show: false }), 400);
          }
        });
      }
    } else {
      paperActions.patchPaper(this.props.paperId, body).then((resp) => {
        if (resp.payload.success) {
          messageActions.setMessage(`Paper successfully updated`);
          messageActions.showMessage({ show: true });
          authActions.getUser();
          setTimeout(() => {
            this.navigateToSummary();
            setTimeout(() => {
              messageActions.showMessage({ show: false });
            }, 400);
          }, 800);
        } else {
          messageActions.setMessage("Hmm something went wrong");
          messageActions.showMessage({ show: true, error: true });
          setTimeout(() => messageActions.showMessage({ show: false }), 400);
        }
      });
    }
  };

  formatPublishDate = (published) => {
    return `${published.year.value}-${published.month.value}-01`;
  };

  nextStep = () => {
    let { activeStep } = this.state;
    if (activeStep < 3) {
      this.setState(
        {
          progress: this.state.progress + 33.33,
          activeStep: activeStep + 1,
          edited: false,
        },
        () => {
          setTimeout(
            () => this.props.messageActions.showMessage({ show: false }),
            400
          );
        }
      );
      window.scrollTo(0, this.titleRef.current.offsetTop);
    }
  };

  prevStep = () => {
    let { activeStep } = this.state;
    this.setState(
      {
        progress: this.state.progress - 33.33,
        activeStep: activeStep - 1,
      },
      () => {
        window.scrollTo(0, this.titleRef.current.offsetTop);
      }
    );
  };

  handleSummaryChange = (summary) => {
    this.setState({ summary });
  };

  saveSummary = async () => {
    this.props.messageActions.showMessage({ load: true, show: true });

    const param = {
      summary: this.state.summary.toJSON({ preserveKeys: true }),
      paper: this.props.paperId
        ? this.props.paperId
        : this.props.paper.postedPaper.id,
    };

    let config = API.POST_CONFIG(param);
    let url = API.FIRST_SUMMARY();

    if (this.state.summaryId) {
      // if there is a summaryid, then a paper exists
      const query = {};
      query.summaryId = this.state.summaryId;
      config = API.PATCH_CONFIG(param);
      url = API.SUMMARY(query);
    }

    return await fetch(url, config)
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        let response = { ...res };
        setTimeout(() => {
          this.props.messageActions.showMessage({ show: false });
          let summaryJSON = response.summary;
          let editorState = Value.fromJSON(summaryJSON);
          this.setState({
            summaryId: response.id,
            summary: editorState,
          });
          this.nextStep();
        }, 400);
      })
      .catch((err) => {
        this.props.messageActions.showMessage({ show: false });
        this.props.messageActions.setMessage("Unable to submit summary");
        this.props.messageActions.showMessage({ show: true, error: true });
        console.error(err);
      });
  };

  saveDiscussion = async () => {
    // if there's nothing to save, then don't save
    this.props.messageActions.showMessage({ show: true, load: true });
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
      text: this.state.discussion.question.toJSON(),
      paper: paperId,
    };

    let config = await API.POST_CONFIG(param);

    return fetch(API.DISCUSSION(paperId), config)
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((resp) => {
        let firstTime = !this.props.auth.user.has_seen_first_coin_modal;
        this.props.authActions.checkUserFirstTime(firstTime);
        this.props.authActions.getUser();
        Router.push(
          "/paper/[paperId]/[tabName]",
          `/paper/${this.props.paper.postedPaper.id}/summary`
        );
      });
  };

  navigateToSummary = () => {
    // this.props.messageActions.showMessage({ show: true, load: true });
    let paperId = this.state.editMode
      ? this.props.paperId
      : this.props.paper.postedPaper.id;

    this.props.paperActions.clearPostedPaper();
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
    let { progress, activeStep } = this.state;
    let { modals } = this.props;
    return (
      <div className={css(styles.background)} ref={this.titleRef}>
        <Message />
        <AddAuthorModal
          isOpen={modals.openAddAuthorModal}
          addNewUser={this.addNewUser}
        />
        {this.renderTitle()}
        <div className={css(styles.mobileProgressBar)}>
          <Progress completed={progress} />
        </div>
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
    position: "relative",
  },
  text: {
    fontFamily: "Roboto",
  },
  title: {
    fontWeight: 500,
    fontSize: 33,
    color: "#232038",
    "@media only screen and (max-width: 665px)": {
      fontSize: 25,
    },
  },
  subtitle: {
    fontSize: 16,
    color: "#6f6c7d",
    marginTop: 10,
    "@media only screen and (max-width: 665px)": {
      width: 300,
      textAlign: "center",
    },
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
    width: "100%",
  },
  pageContent: {
    width: "70%",
    minWidth: 820,
    minHeight: 500,
    position: "relative",
    backgroundColor: "#FFF",
    boxShadow: "0 1px 8px rgba(0, 0, 0, 0.1), 0 1px 10px rgba(0, 0, 0, 0.1);",
    padding: 60,
    borderTop: "4px solid #dedee5",
    "@media only screen and (max-width: 935px)": {
      minWidth: "unset",
      width: 600,
      padding: 40,
    },
    "@media only screen and (max-width: 665px)": {
      width: "calc(100% - 16px)",
      padding: 16,
    },
    "@media only screen and (max-width: 415px)": {
      borderTop: "unset",
    },
  },
  progressBar: {
    position: "absolute",
    width: "100%",
    backgroundColor: "#dedee4",
    top: -4,
    left: 0,
    "@media only screen and (max-width: 415px)": {
      display: "none",
    },
  },
  mobileProgressBar: {
    display: "none",
    "@media only screen and (max-width: 415px)": {
      backgroundColor: "#dedee4",
      display: "unset",
      position: "sticky",
      top: 0,
      zIndex: 2,
      width: "100%",
    },
  },
  header: {
    fontSize: 22,
    fontWeight: 500,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    paddingBottom: 8,
    borderBottom: `1px solid #EBEBEB`,
    "@media only screen and (max-width: 665px)": {
      fontSize: 18,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 16,
      paddingLeft: 9,
      paddingRight: 9,
      width: "calc(100% - 18px)",
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 14,
    },
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
    "@media only screen and (max-width: 665px)": {
      width: 380,
    },
    "@media only screen and (max-width: 415px)": {
      width: 338,
    },
    "@media only screen and (max-width: 321px)": {
      width: 270,
    },
  },
  minHeight: {
    height: 90,
  },
  mobileColumn: {
    "@media only screen and (max-width: 665px)": {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
    },
  },
  paper: {
    width: 601,
    marginTop: 40,
    marginBottom: 40,
    "@media only screen and (max-width: 665px)": {
      width: 380,
    },
    "@media only screen and (max-width: 415px)": {
      width: 338,
    },
    "@media only screen and (max-width: 321px)": {
      width: 270,
    },
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
    "@media only screen and (max-width: 665px)": {
      paddingTop: 20,
    },
  },
  container: {
    width: 600,
    "@media only screen and (max-width: 665px)": {
      width: 380,
    },
    "@media only screen and (max-width: 415px)": {
      width: 338,
    },
    "@media only screen and (max-width: 321px)": {
      width: 270,
    },
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
    "@media only screen and (max-width: 665px)": {
      width: 180,
    },
    "@media only screen and (max-width: 415px)": {
      width: 159,
    },
    "@media only screen and (max-width: 321px)": {
      width: 125,
    },
  },
  labelStyle: {
    "@media only screen and (max-width: 665px)": {
      fontSize: 14,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 13,
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 12,
    },
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
    "@media only screen and (max-width: 321px)": {
      width: 270,
    },
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
    "@media only screen and (max-width: 935px)": {
      minWidth: "unset",
      padding: "40px 0 50px 0",
    },
    "@media only screen and (max-width: 665px)": {
      padding: "30px 0 50px 0",
      width: "90%",
    },
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
    "@media only screen and (max-width: 551px)": {
      width: 160,
    },
    "@media only screen and (max-width: 415px)": {
      width: 130,
    },
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
    "@media only screen and (max-width: 935px)": {
      bottom: 0,
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
    height: 300,
    border: "1px solid #E8E8F2",
    backgroundColor: "#FBFBFD",
    "@media only screen and (max-width: 665px)": {
      width: 380,
    },
    "@media only screen and (max-width: 415px)": {
      width: 338,
    },
    "@media only screen and (max-width: 321px)": {
      width: 270,
    },
  },
  doiInput: {
    width: 290,
    marginTop: 10,
    marginBottom: 0,
    "@media only screen and (max-width: 665px)": {
      width: 380,
    },
    "@media only screen and (max-width: 415px)": {
      width: 338,
    },
    "@media only screen and (max-width: 321px)": {
      width: 270,
    },
  },
  doi: {
    width: 290,
    height: 90,
    transition: "all ease-in-out 0.2s",
    opacity: 1,
    overflow: "hidden",
    display: "unset",
    "@media only screen and (max-width: 665px)": {
      width: 380,
      height: 0,
      display: "none",
    },
    "@media only screen and (max-width: 415px)": {
      width: 338,
    },
    "@media only screen and (max-width: 321px)": {
      width: 270,
    },
  },
  mobileDoi: {
    width: 290,
    height: 0,
    transition: "all ease-in-out 0.2s",
    opacity: 0,
    overflow: "hidden",
    display: "none",
    "@media only screen and (max-width: 665px)": {
      width: 380,
      display: "unset",
      opacity: 1,
      height: 90,
    },
    "@media only screen and (max-width: 415px)": {
      width: 338,
    },
    "@media only screen and (max-width: 321px)": {
      width: 270,
    },
  },
  reveal: {
    height: 90,
    opacity: 1,
  },
  taglineHeader: {
    marginTop: 20,
  },
  tagline: {
    position: "relative",
    paddingTop: 20,
    marginBottom: 40,
  },
  taglineCounter: {
    position: "absolute",
    bottom: 0,
    right: 0,
    fontSize: 12,
  },
  sidenote: {
    fontSize: 14,
    fontWeight: 400,
    color: "#7a7887",
    userSelect: "none",
    cursor: "default",
    "@media only screen and (max-width: 665px)": {
      fontSize: 13,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 10,
    },
  },
});

const customStyles = {
  container: {
    width: 600,
    "@media only screen and (max-width: 665px)": {
      width: 380,
    },
    "@media only screen and (max-width: 415px)": {
      width: 338,
    },
    "@media only screen and (max-width: 321px)": {
      width: 270,
    },
  },
  input: {
    width: 600,
    display: "flex",
    "@media only screen and (max-width: 665px)": {
      width: 380,
    },
    "@media only screen and (max-width: 415px)": {
      width: 338,
    },
    "@media only screen and (max-width: 321px)": {
      width: 270,
    },
  },
  authorGuidelines: {
    "@media only screen and (max-width: 665px)": {
      fontSize: 13,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 10,
    },
  },
  capitalize: {
    textTransform: "capitalize",
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
