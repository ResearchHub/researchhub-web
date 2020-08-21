import React, { Fragment } from "react";
import Router from "next/router";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Value } from "slate";
import { withAlert } from "react-alert";

// Component
import CheckBox from "../Form/CheckBox";
import FormInput from "../Form/FormInput";
import FormSelect from "../Form/FormSelect";
import Button from "../Form/Button";
import AuthorCardList from "../SearchSuggestion/AuthorCardList";
import AuthorInput from "../SearchSuggestion/AuthorInput.js";
import Message from "../Loader/Message";
import NewDND from "../Form/NewDND";
import PermissionNotificationWrapper from "~/components/PermissionNotificationWrapper";

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
import { formatPaperSlug } from "~/config/utils";

const discussionScaffoldInitialValue = Value.fromJSON(discussionScaffold);

class PaperUploadInfo extends React.Component {
  constructor(props) {
    super(props);
    let initialState = {
      form: {
        paper_title: "",
        title: "",
        doi: null,
        abstract: null,
        published: {
          year: null,
          month: null,
          day: null,
        },
        author: {
          self_author: false,
        },
        raw_authors: [],
        type: "",
        hubs: [],
      },
      error: {
        year: false,
        month: false,
        hubs: false,
        dnd: false,
        author: false,
        tagline: false,
      },
      showAuthorList: false,
      activeStep: 1,
      searchAuthor: "",
      suggestedAuthors: [], // TODO: Rename this to inididcate authors from search result
      selectedAuthors: [],
      loading: false,
      uploadingPaper: false,
      suggestedHubs: [],
      editMode: false,
      edited: false,
      suggestedPapers: false,
      urlView: true,
      showTitle: false,
    };

    this.state = {
      ...initialState,
    };
    this.titleRef = React.createRef();
  }

  componentDidMount() {
    let { messageActions, paperId } = this.props;
    this.props.authActions.getUser();
    this.getHubs();
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
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
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0;
      this.prefillPaperInfo();
    }
    if (
      Object.keys(prevProps.paper.uploadedPaper).length < 1 &&
      Object.keys(this.props.paper.uploadedPaper).length > 0
    ) {
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0;
      this.prefillPaperInfo();
    }
  }

  componentWillUnMount() {
    this.setState({ ...initialState });
  }

  /**
   * FORMATTING FORM
   */

  prefillPaperInfo = () => {
    let { uploadedPaper } = this.props.paper;
    let form = { ...this.state.form };
    let { DOI, url, title, abstract, issued, type, author } = uploadedPaper;
    if (title || this.props.paperTitle) {
      form.paper_title = this.props.paperTitle
        ? this.props.paperTitle
        : title && title;
    }
    if (abstract) {
      form.abstract = abstract;
    }
    if (DOI) {
      form.doi = DOI;
    }
    if (url) {
      form.url = url;
    }
    if (issued) {
      let date = issued["date-parts"][0];
      form.published.year = this.handleFormYear(date);
      form.published.month = this.handleFormMonth(date);
      form.published.day = this.handleFormDay(date);
      form.publishDate = `${form.published.year && form.published.year}-${
        form.published.month >= 10
          ? form.published.month
          : "0" + form.published.month
      }-${
        form.published.day >= 10 ? form.published.day : "0" + form.published.day
      }`;
    }
    if (author && author.length) {
      form.raw_authors = author.map((a, i) => {
        return {
          first_name: a.given ? a.given : "",
          last_name: a.family ? a.family : "",
        };
      });
    }
    if (type) {
      form.type = type;
    }

    this.setState(
      {
        form: form,
        showTitle: Object.keys(uploadedPaper).length && !form.paper_title,
      },
      () => {
        this.props.messageActions.showMessage({ show: false });
      }
    );
  };

  fetchAndPrefillPaperInfo = (paperId) => {
    fetch(API.PAPER({ paperId }), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        let userAuthorId =
          this.props.auth.user.author_profile &&
          this.props.auth.user.author_profile.id;
        let {
          authors,
          doi,
          hubs,
          paper_publish_date,
          publication_type,
          title,
          tagline,
          abstract,
          paper_title,
        } = res;
        let form = JSON.parse(JSON.stringify(this.state.form));
        form.doi = doi;
        form.title = title;
        form.paper_title = paper_title;
        form.abstract = abstract;
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
          showTitle: !form.paper_title && !form.title,
        });
        setTimeout(
          () =>
            this.props.messageActions.showMessage({ load: false, show: false }),
          300
        );
      });
  };

  formatPublishDate = (published) => {
    return `${published.year.value}-${published.month.value}-01`;
  };

  /**
   * INPUT HANDLERS
   */

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

  handleAuthorSelect = (value) => {
    let userAuthorId =
      this.props.auth.user.author_profile &&
      this.props.auth.user.author_profile.id;
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
      let userAuthorId =
        this.props.auth.user.author_profile &&
        this.props.auth.user.author_profile.id;
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

  handleInputChange = (id, value) => {
    let form = JSON.parse(JSON.stringify(this.state.form));
    let error = { ...this.state.error };
    let keys = id.split(".");
    if (keys.length < 2) {
      if (keys[0] === "tagline") {
        form[keys[0]] = value.slice(0, 255);
      } else if (keys[0] === "title") {
        if (value) {
          form[keys[0]] = value[0].toUpperCase() + value.slice(1);
        } else {
          form[keys[0]] = value;
        }
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
    let userAuthorId =
      this.props.auth.user.author_profile &&
      this.props.auth.user.author_profile.id;
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

  handleHubSelection = (id, value) => {
    let form = JSON.parse(JSON.stringify(this.state.form));
    let error = { ...this.state.error };
    value = value || [];
    form.hubs = [...value];
    if (error.hubs) {
      error.hubs = form.hubs.length > 0 ? false : true;
    }
    this.setState({ form, error, edited: true });
  };

  /**
   * PAPER PDF HANDLER
   */
  uploadPaper = (acceptedFiles, metaData) => {
    let { paperActions } = this.props;
    let error = { ...this.state.error };
    let uploadedFile = acceptedFiles[0];
    this.setState({ uploadingPaper: true });

    paperActions.uploadPaperToState(uploadedFile, metaData);
    error.dnd = false;
    this.setState({
      uploadingPaper: false,
      error,
      edited: true,
    });
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

  removePaper = () => {
    let { paperActions, modalActions } = this.props;
    paperActions.removePaperFromState();
    this.setState({ edited: true });
  };

  checkPaperSuggestions = (suggestedPapers) => {
    let length = suggestedPapers.length;
    if (length > 0) {
      this.setState({ suggestedPapers: true });
    } else {
      this.state.suggestedPapers && this.setState({ suggestedPapers: false });
    }
  };

  /**
   * COMPONENT API
   */

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

  getHubs = () => {
    fetch(API.HUB({ pageLimit: 1000 }), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((resp) => {
        let hubs = resp.results
          .map((hub, index) => {
            return {
              ...hub,
              value: hub.id,
              label: hub.name.charAt(0).toUpperCase() + hub.name.slice(1),
            };
          })
          .sort((a, b) => {
            return a.label.localeCompare(b.label);
          });
        this.setState({
          suggestedHubs: hubs,
        });
      });
  };

  openAddAuthorModal = async () => {
    let { modals, modalActions } = this.props;
    await modalActions.openAddAuthorModal(true);
  };

  /**
   * RENDERING FUNCTION
   */

  addNewUser = (params) => {
    fetch(API.AUTHOR({}), API.POST_CONFIG(params))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((resp) => {
        let selectedAuthors = [...this.state.selectedAuthors, resp];
        this.setState({
          selectedAuthors,
        });
      })
      .catch((err) => {
        if (err.response.status === 429) {
          this.props.modalActions.openRecaptchaPrompt(true);
        }
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
      showAuthorList,
      loading,
      error,
      searchAuthor,
      suggestedAuthors,
      editMode,
      showTitle,
      urlView,
    } = this.state;
    // let mobile = this.getWindowWidth();

    return (
      <span>
        {!editMode &&
          this.renderHeader("Add Paper", "Up to 15MB (.pdf)", false)}
        <div className={css(styles.section)}>
          {!editMode && (
            <div className={css(styles.paper)}>
              <div className={css(styles.label, styles.labelStyle)}>
                {this.state.urlView ? "Link to Paper" : "Paper PDF"}
                <span className={css(styles.asterick)}>*</span>
              </div>
              <NewDND
                handleDrop={this.uploadPaper}
                onDrop={null}
                toggleFormatState={() => {
                  this.setState({
                    urlView: !this.state.urlView,
                  });
                }}
                onSearch={this.checkPaperSuggestions}
                onDuplicate={() => this.setState({ disabled: true })}
              />
            </div>
          )}
        </div>
        <div className={css(styles.section, styles.padding)}>
          {(showTitle || !urlView) && (
            <FormInput
              label={"Paper Title"}
              placeholder="Enter title of paper"
              required={true}
              containerStyle={styles.container}
              labelStyle={styles.labelStyle}
              value={form.paper_title}
              id={"paper_title"}
              onChange={this.handleInputChange}
            />
          )}
          <FormInput
            label={"Editorialized Title (optional)"}
            placeholder="Jargon free version of the title that the average person would understand"
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
                  // required={true}
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
              <div className={css(styles.row, styles.authorCheckboxContainer)}>
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
                  options={Options.range(1960, new Date().getFullYear())}
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
            </Fragment>
          )}
          {editMode && (
            <div className={css(styles.section)}>
              <div className={css(styles.row)}>
                <span className={css(styles.doi)}>
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
          )}
          <FormSelect
            label={"Hubs"}
            placeholder="Search Hubs"
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
          {editMode && (
            <span className={css(styles.mobileDoi)}>
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
          )}
          {editMode && (
            <span className={css(styles.tagline)}>
              <FormTextArea
                label={"Abstract"}
                placeholder="Enter the paper"
                containerStyle={styles.taglineContainer}
                labelStyle={styles.labelStyle}
                value={form.abstract}
                id={"abstract"}
                onChange={this.handleInputChange}
              />
            </span>
          )}
        </div>
        <div className={css(styles.section)}></div>
      </span>
    );
  };

  renderButtons = () => {
    let { editMode, disabled } = this.state;

    return (
      <div className={css(styles.buttonRow, styles.buttons)}>
        <div
          className={css(styles.button, styles.buttonLeft)}
          onClick={this.cancel}
        >
          <span className={css(styles.buttonLabel, styles.text)}>Cancel</span>
        </div>
        <Button
          label={editMode ? "Save" : "Upload"}
          customButtonStyle={styles.button}
          disabled={disabled}
          type={"submit"}
        />
      </div>
    );
  };

  handleSubmitLogic = () => {
    if (this.validateSelectors()) {
      return this.submitForm();
    } else {
      this.props.messageActions.setMessage("Required fields must be filled.");
      this.props.messageActions.showMessage({
        load: false,
        show: true,
        error: true,
      });
    }
  };

  submitForm = async () => {
    if (!this.state.edited) {
      return this.state.editMode ? this.navigateToSummary() : this.nextStep();
    }
    this.props.messageActions.showMessage({ load: true, show: true });
    if (
      (this.props.paper.postedPaper &&
        Object.keys(this.props.paper.postedPaper).length > 0) ||
      this.state.editMode
    ) {
      await this.postPaper("PATCH");
    } else {
      await this.postPaper();
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
    body.doi = body.doi;
    if (this.state.editMode) {
      if (body.published && body.published.year) {
        body.publishDate = this.formatPublishDate(body.published);
      }
      body.url = ""; // TODO: Add this optional field
    }

    if (!body.title) {
      body.title = body.paper_title;
    }

    let { paper, paperActions, messageActions, authActions } = this.props;
    // send form object to the backend
    if (!this.state.editMode) {
      body.file = this.props.paper.uploadedPaper.url
        ? this.props.paper.uploadedPaper.url
        : this.props.paper.uploadedPaper; // if url, then file is a url. else file is a file object
    }
    let paperId =
      this.props.paper.postedPaper && this.props.paper.postedPaper.id;

    if (this.state.editMode) {
      paperId = this.props.paperId;
    }

    let resp =
      request === "POST"
        ? await paperActions.postPaper(body)
        : await paperActions.patchPaper(paperId, body);

    if (resp.payload.success) {
      messageActions.setMessage(
        `Paper successfully ${request === "POST" ? "uploaded" : "updated"}`
      );
      authActions.setUploadingPaper(true);
      messageActions.showMessage({ show: true });
      let firstTime = !this.props.auth.user.has_seen_first_coin_modal;
      authActions.checkUserFirstTime(firstTime);

      authActions.getUser();
      this.navigateToSummary();
    } else {
      if (resp.payload.errorBody.status === 429) {
        messageActions.showMessage({ show: false });
        return;
      }
      messageActions.setMessage(
        resp.payload.errorBody.error
          ? resp.payload.errorBody.error
          : "Hmm something went wrong"
      );
      messageActions.showMessage({ show: true, error: true });
      setTimeout(() => messageActions.showMessage({ show: false }), 2000);
    }
  };

  navigateToSummary = () => {
    this.props.messageActions.showMessage({ show: true, load: true });
    this.setState({ ...this.initialState });
    let paper = this.state.editMode
      ? this.props.paper
      : this.props.paper.postedPaper;
    let paperId = this.state.editMode
      ? this.props.paperId
      : this.props.paper.postedPaper.id;
    let paperName = paper.slug
      ? paper.slug
      : formatPaperSlug(paper.paper_title ? paper.paper_title : paper.title);
    this.props.paperActions.clearPostedPaper();
    this.props.paperActions.removePaperFromState();
    Router.push(
      "/paper/[paperId]/[paperName]",
      `/paper/${paperId}/${paperName}`
    );
  };

  cancel = () => {
    if (this.state.editMode) {
      this.setState({ ...this.initialState });
      this.props.paperActions.removePaperFromState();
      let { paperId, paper } = this.props;
      let paperName = paper.slug
        ? paper.slug
        : formatPaperSlug(paper.paper_title ? paper.paper_title : paper.title);
      Router.push(
        "/paper/[paperId]/[paperName]",
        `/paper/${paperId}/${paperName}`
      );
    } else {
      this.setState({ ...this.initialState });
      this.props.paperActions.removePaperFromState();

      Router.back();
    }
  };

  render() {
    let { activeStep } = this.state;
    let { modals } = this.props;
    return (
      <div className={css(styles.background)} ref={this.titleRef}>
        <Message />
        <AddAuthorModal
          isOpen={modals.openAddAuthorModal}
          addNewUser={this.addNewUser}
        />
        <form
          className={css(styles.form)}
          onSubmit={(e) => {
            e.preventDefault();
            this.handleSubmitLogic();
          }}
          autoComplete={"off"}
        >
          <div className={css(styles.pageContent)}>{this.renderContent()}</div>
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
    minHeight: "100vh",
  },
  text: {
    fontFamily: "Roboto",
  },
  title: {
    fontWeight: 500,
    fontSize: 28,
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
    marginTop: 20,
    marginBottom: 20,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  pageContent: {
    position: "relative",
    backgroundColor: "#FFF",
    border: "1px solid #ddd",
    borderRadius: 4,
    padding: "30px 60px",
    marginTop: 40,
    "@media only screen and (max-width: 935px)": {
      minWidth: "unset",
      width: 600,
      padding: 40,
      marginTop: 16,
    },
    "@media only screen and (max-width: 665px)": {
      width: "calc(100% - 16px)",
      padding: 16,
    },
    "@media only screen and (max-width: 415px)": {
      borderTop: "unset",
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
    position: "relative",
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
    marginTop: 15,
    // marginBottom: 40,
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
    margin: 0,
    "@media only screen and (max-width: 665px)": {
      paddingTop: 20,
    },
  },
  container: {
    marginBottom: 10,
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
  taglineContainer: {
    padding: 0,
    margin: 0,
    marginBottom: 20,
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
    marginTop: 10,
    marginBottom: 0,
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
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FCFCFC",
    marginTop: 30,
    paddingBottom: 20,
    marginBottom: 10,
    "@media only screen and (max-width: 935px)": {
      minWidth: "unset",
    },
    "@media only screen and (max-width: 665px)": {
      width: "90%",
    },
  },
  buttons: {
    justifyContent: "center",
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
    width: "100%",
    marginTop: 10,
    marginBottom: 0,
  },
  doi: {
    width: "100%",
    height: 90,
    transition: "all ease-in-out 0.2s",
    opacity: 1,
    overflow: "hidden",
    display: "unset",
    "@media only screen and (max-width: 665px)": {
      display: "none",
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
    // marginBottom: 40,
  },
  taglineCounter: {
    position: "absolute",
    bottom: 0,
    right: 0,
    fontSize: 12,
    color: "rgb(122, 120, 135)",
  },
  sidenote: {
    fontSize: 14,
    fontWeight: 400,
    color: "#7a7887",
    userSelect: "none",
    cursor: "default",
    display: "flex",
    alignItems: "flex-end",
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
  type: {
    color: colors.BLUE(),
    cursor: "pointer",
    backgroundColor: "#f7f7fb",
    padding: "3px 10px",
    border: "1px solid rgb(232, 232, 242)",
    borderBottomColor: "#f7f7fb",
    position: "absolute",
    right: -1,
    bottom: -2,
    zIndex: 2,
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
)(withAlert()(PaperUploadInfo));
