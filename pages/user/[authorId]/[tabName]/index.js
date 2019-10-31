import Router, { useRouter } from "next/router";
import Link from "next/link";
import { StyleSheet, css } from "aphrodite";
import { useEffect, useState } from "react";
import { connect, useDispatch, useStore } from "react-redux";
import moment from "moment";
import ReactTooltip from "react-tooltip";

import { AuthorActions } from "~/redux/author";
import { PaperActions } from "~/redux/paper";

// Components
import ComponentWrapper from "~/components/ComponentWrapper";
import AuthoredPapersTab from "~/components/Author/Tabs/AuthoredPapers";
import TabBar from "~/components/TabBar";
import UserDiscussionsTab from "~/components/Author/Tabs/UserDiscussions";
import UserContributionsTab from "~/components/Author/Tabs/UserContributions";
import AuthorAvatar from "~/components/AuthorAvatar";
import ShareModal from "~/components/ShareModal";
import ActionButton from "~/components/ActionButton";

// Config
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import { absoluteUrl, getNestedValue, getVoteType } from "~/config/utils";

const AuthorPage = (props) => {
  let { author, hostname, user } = props;
  let router = useRouter();
  let { tabName } = router.query;
  const dispatch = useDispatch();

  const [openShareModal, setOpenShareModal] = useState(false);
  const [hoverName, setHoverName] = useState(false);
  const [hoverDescription, setHoverDescription] = useState(false);
  const [editName, setEditName] = useState(false);
  const [editDescription, setEditDescription] = useState(false);
  const [editFacebook, setEditFacebook] = useState(false);
  const [editLinkedin, setEditLinkedin] = useState(false);
  const [editTwitter, setEditTwitter] = useState(false);

  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [socialLinks, setSocialLinks] = useState({});
  const [allowEdit, setAllowEdit] = useState(false);

  const SECTIONS = {
    name: "name",
    description: "description",
    facebook: "facebook",
    linkedin: "linkedin",
    twitter: "twitter",
  };

  async function fetchAuthoredPapers() {
    await dispatch(
      AuthorActions.getAuthoredPapers({ authorId: router.query.authorId })
    );
  }

  async function fetchUserDiscussions() {
    await dispatch(
      AuthorActions.getUserDiscussions({ authorId: router.query.authorId })
    );
  }

  async function fetchUserContributions() {
    let {
      commentOffset,
      replyOffset,
      paperUploadOffset,
    } = props.author.userContributions;
    await dispatch(
      AuthorActions.getUserContributions({
        authorId: router.query.authorId,
        commentOffset,
        replyOffset,
        paperUploadOffset,
      })
    );
  }

  useEffect(() => {
    async function refetchAuthor() {
      await dispatch(
        AuthorActions.getAuthor({ authorId: router.query.authorId })
      );
    }
    fetchAuthoredPapers();
    fetchUserDiscussions();
    fetchUserContributions();
    refetchAuthor();
  }, [props.isServer, router.query.authorId]);

  useEffect(() => {
    setDescription(author.description);
    setName(`${author.first_name} ${author.last_name}`);

    let social = {
      facebook: author.facebook,
      linkedin: author.linkedin,
      twitter: author.twitter,
    };

    setSocialLinks(social);
  }, [author]);

  useEffect(() => {
    if (author.user && user) {
      if (author.user === user.id) {
        setAllowEdit(true);
      }
    }
  }, [author, user]);

  let onMouseEnter = (section) => {
    if (section === SECTIONS.name) {
      setHoverName(true);
    } else if (section === SECTIONS.description) {
      setHoverDescription(true);
    }
  };

  let onMouseLeave = (section) => {
    if (section === SECTIONS.name) {
      setHoverName(false);
    } else if (section === SECTIONS.description) {
      setHoverDescription(false);
    }
  };

  function onEditToggle(section) {
    if (section === SECTIONS.name) {
      setEditName(!editName);
    } else if (section === SECTIONS.description) {
      setEditDescription(!editDescription);
    }
  }

  let tabs = [
    {
      href: "contributions",
      label: "contributions",
      showCount: true,
      count: author.userContributions.count,
    },
    {
      href: "authored-papers",
      label: "authored papers",
      showCount: true,
      count: author.authoredPapers.count,
    },
    {
      href: "discussions",
      label: "discussions",
      showCount: true,
      count: author.userDiscussions.count,
    },
  ];

  let renderTabContent = () => {
    switch (tabName) {
      case "contributions":
        return <UserContributionsTab />;
      case "authored-papers":
        return <AuthoredPapersTab />;
      case "discussions":
        return <UserDiscussionsTab hostname={hostname} />;
      case "citations":
        return null;
    }
  };

  let renderEditButton = (action) => {
    return (
      <div className={css(styles.editButton)} onClick={action}>
        <i className="fas fa-edit"></i>
      </div>
    );
  };

  let onDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  let onNameChange = (e) => {
    setName(e.target.value);
  };

  let renderCancelButton = (section) => {
    let action = null;

    if (section === SECTIONS.name) {
      action = () => setEditName(false);
    } else if (section === SECTIONS.description) {
      action = () => setEditDescription(false);
    }

    return (
      <button
        className={css(styles.button, styles.cancelButton)}
        onClick={action}
      >
        Cancel
      </button>
    );
  };

  let renderSaveButton = (section) => {
    let action = null;

    if (section === SECTIONS.name) {
      action = () => {
        saveName();
        setEditName(false);
      };
    } else if (section === SECTIONS.description) {
      action = () => {
        saveDescription();
        setEditDescription(false);
      };
    }

    return (
      <button
        className={css(styles.button, styles.saveButton)}
        onClick={action}
      >
        Save
      </button>
    );
  };

  let saveName = async () => {
    let splitName = name.split(" ");
    let first_name = null;
    let last_name = null;
    if (splitName.length >= 1) {
      first_name = splitName[0];
    }
    if (splitName.length >= 2) {
      last_name = splitName[1];
    }

    let changes = {
      first_name,
      last_name,
    };

    await dispatch(
      AuthorActions.saveAuthorChanges({ changes, authorId: author.id })
    );
  };

  let saveDescription = async () => {
    let changes = {
      description,
    };

    await dispatch(
      AuthorActions.saveAuthorChanges({ changes, authorId: author.id })
    );
  };

  let onSocialLinkChange = (e, social) => {
    let newSocialLinks = { ...socialLinks };
    newSocialLinks[social] = e.target.value;

    setSocialLinks(newSocialLinks);
  };

  let renderSocialEdit = (social) => {
    return (
      <div className={css(styles.socialEditContainer)}>
        <div className={css(styles.socialTitle)}>{`${social} Link`}</div>
        <div className={css(styles.socialInputContainer)}>
          <input
            className={css(styles.socialInput)}
            value={socialLinks[social]}
            onChange={(e) => onSocialLinkChange(e, social)}
          />
          <div className={css(styles.submitSocialButton)}>
            <i className="fas fa-arrow-right"></i>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={css(styles.container)}>
      <ComponentWrapper>
        <div className={css(styles.profileContainer)}>
          <AuthorAvatar author={author} disableLink={true} size={80} />
          <div className={css(styles.profileInfo)}>
            {!editName ? (
              <div
                className={css(styles.authorName, styles.editButtonContainer)}
                onMouseEnter={() => onMouseEnter(SECTIONS.name)}
                onMouseLeave={() => onMouseLeave(SECTIONS.name)}
              >
                {author.first_name} {author.last_name}
                {hoverName &&
                  allowEdit &&
                  renderEditButton(() => {
                    setHoverName(false);
                    onEditToggle(SECTIONS.name);
                  })}
              </div>
            ) : (
              allowEdit && (
                <div className={css(styles.editDescriptionContainer)}>
                  <input
                    className={css(styles.nameInput)}
                    value={name}
                    onChange={onNameChange}
                  />
                  <div className={css(styles.actionContainer)}>
                    {renderCancelButton(SECTIONS.name)}
                    {renderSaveButton(SECTIONS.name)}
                  </div>
                </div>
              )
            )}
            <div className={css(styles.reputation)}></div>
            {!editDescription ? (
              <div
                className={css(styles.description, styles.editButtonContainer)}
                onMouseEnter={() => onMouseEnter(SECTIONS.description)}
                onMouseLeave={() => onMouseLeave(SECTIONS.description)}
              >
                {author.description}
                {hoverDescription &&
                  allowEdit &&
                  renderEditButton(() => {
                    setHoverDescription(false);
                    onEditToggle(SECTIONS.description);
                  })}
              </div>
            ) : (
              allowEdit && (
                <div className={css(styles.editDescriptionContainer)}>
                  <textarea
                    className={css(styles.descriptionTextarea)}
                    value={description}
                    onChange={onDescriptionChange}
                    resize={false}
                  />
                  <div className={css(styles.actionContainer)}>
                    {renderCancelButton(SECTIONS.description)}
                    {renderSaveButton(SECTIONS.description)}
                  </div>
                </div>
              )
            )}
            <div className={css(styles.extraInfoContainer)}>
              {author.university && (
                <div className={css(styles.extraInfo)}>
                  <i
                    className={css(styles.icon) + " fas fa-graduation-cap"}
                  ></i>
                  {author.university.name}
                </div>
              )}
            </div>
          </div>
          <div className={css(styles.socialLinks)}>
            {!allowEdit ? (
              author.linkedin && (
                <a
                  className={css(styles.link)}
                  href={author.linkedin}
                  target="_blank"
                >
                  <div className={css(styles.socialMedia, styles.linkedin)}>
                    <i className="fab fa-linkedin-in"></i>
                  </div>
                </a>
              )
            ) : (
              <div
                className={css(
                  styles.editSocial,
                  !author.linkedin && styles.noSocial,
                  editLinkedin && styles.fullOpacity
                )}
                onClick={() => setEditLinkedin(true)}
              >
                <div className={css(styles.socialMedia, styles.linkedin)}>
                  <i className="fab fa-linkedin-in"></i>
                </div>
              </div>
            )}
            {!allowEdit ? (
              author.twitter && (
                <a
                  className={css(styles.link)}
                  href={author.twitter}
                  target="_blank"
                >
                  <div className={css(styles.socialMedia, styles.twitter)}>
                    <i className="fab fa-twitter"></i>
                  </div>
                </a>
              )
            ) : (
              <div
                className={css(
                  styles.editSocial,
                  !author.twitter && styles.noSocial,
                  editTwitter && styles.fullOpacity
                )}
                onClick={() => setEditTwitter(true)}
              >
                <div className={css(styles.socialMedia, styles.twitter)}>
                  <i className="fab fa-twitter"></i>
                </div>
              </div>
            )}
            {!allowEdit ? (
              author.facebook && (
                <a
                  className={css(styles.link)}
                  href={author.facebook}
                  target="_blank"
                >
                  <div className={css(styles.socialMedia, styles.facebook)}>
                    <i className="fab fa-facebook-f"></i>
                  </div>
                </a>
              )
            ) : (
              <div
                className={css(
                  styles.editSocial,
                  !author.facebook && styles.noSocial,
                  editFacebook && styles.fullOpacity
                )}
                onClick={() => setEditFacebook(true)}
              >
                <div className={css(styles.socialMedia, styles.facebook)}>
                  <i className="fab fa-facebook-f"></i>
                </div>
                {editFacebook && renderSocialEdit(SECTIONS.facebook)}
              </div>
            )}
            <div
              className={css(styles.socialMedia, styles.shareLink)}
              onClick={() => setOpenShareModal(true)}
            >
              <i className="far fa-link"></i>
            </div>
          </div>
        </div>
      </ComponentWrapper>
      <TabBar
        tabs={tabs}
        selectedTab={router.query.tabName}
        dynamic_href={"/user/[authorId]/[tabName]"}
      />
      <div className={css(styles.contentContainer)}>{renderTabContent()}</div>
      <ShareModal
        close={() => setOpenShareModal(false)}
        isOpen={openShareModal}
        title={"Share Author Profile"}
        url={`${hostname}${router.asPath}`}
      />
    </div>
  );
};

AuthorPage.getInitialProps = async ({ isServer, req, store, query }) => {
  const { host } = absoluteUrl(req);
  const hostname = host;

  await store.dispatch(AuthorActions.getAuthor({ authorId: query.authorId }));

  return { isServer, hostname };
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: "30px 0px",
    margin: "auto",
  },
  profileContainer: {
    display: "flex",
    padding: "30px 0",
  },
  profileInfo: {
    width: "70%",
    marginLeft: 30,
    marginRight: 30,
  },
  socialLinks: {
    display: "flex",
    height: 35,
    position: "relative",
  },
  authorName: {
    fontWeight: 500,
    fontSize: 33,
    textTransform: "capitalize",
    marginBottom: 10,
  },
  extraInfoContainer: {
    display: "flex",
  },
  extraInfo: {
    color: "#241F3A",
    opacity: 0.5,
    fontSize: 14,
  },
  icon: {
    marginRight: 5,
  },
  description: {
    marginBottom: 10,
  },
  socialMedia: {
    width: 35,
    height: 35,
    borderRadius: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#fff",
    marginLeft: 5,
    marginRight: 5,
    textDecorations: "none",
  },
  linkedin: {
    background: "#0077B5",
  },
  twitter: {
    background: "#38A1F3",
  },
  facebook: {
    background: "#3B5998",
  },
  shareLink: {
    background: colors.BLUE(),
  },
  link: {
    textDecoration: "None",
  },
  editButtonContainer: {
    display: "flex",
    position: "relative",
    width: "fit-content",
    paddingRight: 30,
  },
  editButton: {
    marginLeft: 10,
    opacity: 0.2,
    fontWeight: 400,
    fontSize: 14,
    cursor: "pointer",
    height: "fit-content",
    position: "absolute",
    right: 0,
    top: 0,

    ":hover": {
      opacity: 1,
    },
  },
  descriptionTextarea: {
    width: "100%",
    background: "#fff",
    height: 80,
    padding: 5,
    borderRadius: 8,
    resize: "none",
    fontSize: 16,
    fontFamily: "Roboto, sans-serif",
    outline: "none",
  },
  actionContainer: {
    display: "flex",
    marginBottom: 10,
  },
  button: {
    height: 35,
    width: 85,
    border: "1px solid",
    borderColor: colors.BLUE(),
    borderRadius: 8,
    fontSize: 18,
    outline: "none",
    cursor: "pointer",
  },
  cancelButton: {
    color: colors.BLUE(),
    background: "#fff",

    ":hover": {
      color: "#fff",
      background: colors.BLUE(),
    },
  },
  saveButton: {
    color: "#fff",
    background: colors.BLUE(),
    marginLeft: 5,

    ":hover": {
      backgroundColor: "#3E43E8",
    },
  },
  nameInput: {
    background: "#fff",
    border: "1px solid #000",
    borderRadius: 8,
    fontSize: 32,
    width: 300,
    padding: 5,
    fontWeight: 500,
    marginBottom: 5,
  },
  noSocial: {
    opacity: 0.2,

    ":hover": {
      opacity: 1,
    },
  },
  socialTitle: {
    textTransform: "capitalize",
    fontSize: 18,
    marginBottom: 5,
  },
  socialInput: {
    background: "#fff",
    border: "none",
    outline: "none",
    padding: 5,
    boxSizing: "border-box",
  },
  fullOpacity: {
    opacity: 1,
  },
  socialEditContainer: {
    position: "absolute",
    bottom: -90,
    left: "50%",
    transform: "translateX(-50%)",
    background: "#fff",
    boxShadow: "0 5px 10px 0 #ddd",
    padding: 10,
    borderRadius: 8,
  },
  editSocial: {
    position: "relative",
  },
  socialInputContainer: {
    display: "flex",
    border: "1px solid #000",
    borderRadius: 8,
    width: 300,
    height: 30,
    overflow: "hidden",
  },
  submitSocialButton: {
    background: colors.BLUE(1),
    //borderRadius: "0 8px 8px 0",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    cursor: "pointer",
    width: 20,
    ":hover": {
      background: "#3E43E8",
    },
  },
});

const mapStateToProps = (state) => ({
  author: state.author,
  user: state.auth.user,
});

export default connect(mapStateToProps)(AuthorPage);
