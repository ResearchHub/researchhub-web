import { useRouter } from "next/router";
import { StyleSheet, css } from "aphrodite";
import { useEffect, useState, Fragment } from "react";
import { connect, useStore, useDispatch } from "react-redux";

// Redux
import { AuthActions } from "~/redux/auth";
import { AuthorActions } from "~/redux/author";
import { TransactionActions } from "~/redux/transaction";

// Components
import AuthorAvatar from "~/components/AuthorAvatar";
import AuthoredPapersTab from "~/components/Author/Tabs/AuthoredPapers";
import AvatarUpload from "~/components/AvatarUpload";
import ComponentWrapper from "~/components/ComponentWrapper";
import Head from "~/components/Head";
import OrcidConnectButton from "~/components/OrcidConnectButton";
import Reputation from "~/components/Reputation";
import ShareModal from "~/components/ShareModal";
import TabBar from "~/components/TabBar";
import UserDiscussionsTab from "~/components/Author/Tabs/UserDiscussions";
import UserContributionsTab from "~/components/Author/Tabs/UserContributions";
import UserTransactionsTab from "~/components/Author/Tabs/UserTransactions";
import UserPromotionsTab from "~/components/Author/Tabs/UserPromotions";

// Config
import colors from "~/config/themes/colors";
import { absoluteUrl } from "~/config/utils";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

const AuthorPage = (props) => {
  let { auth, author, hostname, user, transactions } = props;
  let router = useRouter();
  let { tabName } = router.query;
  const dispatch = useDispatch();
  const store = useStore();
  const [fetching, setFetching] = useState(true);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [hoverName, setHoverName] = useState(false);
  const [hoverDescription, setHoverDescription] = useState(false);
  const [editName, setEditName] = useState(false);
  const [editDescription, setEditDescription] = useState(false);
  const [editFacebook, setEditFacebook] = useState(false);
  const [editLinkedin, setEditLinkedin] = useState(false);
  const [editTwitter, setEditTwitter] = useState(false);
  const [avatarUploadIsOpen, setAvatarUploadIsOpen] = useState(false);
  const [hoverProfilePicture, setHoverProfilePicture] = useState(false);

  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [socialLinks, setSocialLinks] = useState({});
  const [allowEdit, setAllowEdit] = useState(false);

  const [fetchingPromotions, setFetchingPromotions] = useState(false);

  let facebookRef;
  let linkedinRef;
  let twitterRef;

  const SECTIONS = {
    name: "name",
    description: "description",
    facebook: "facebook",
    linkedin: "linkedin",
    twitter: "twitter",
    picture: "picture",
  };

  /**
   * When we click anywhere outside of the dropdown, close it
   * @param { Event } e -- javascript event
   */
  const handleOutsideClick = (e) => {
    if (facebookRef && !facebookRef.contains(e.target)) {
      setEditFacebook(false);
    }
    if (twitterRef && !twitterRef.contains(e.target)) {
      setEditTwitter(false);
    }
    if (linkedinRef && !linkedinRef.contains(e.target)) {
      setEditLinkedin(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  });
  const authorName = `${author.first_name} ${author.last_name}`;

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
    if (!author.user) {
      return;
    }
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
    setFetching(false);
  }

  function fetchUserTransactions() {
    if (!auth.isLoggedIn) return;
    dispatch(
      TransactionActions.getWithdrawals(1, store.getState().transactions)
    );
  }

  async function fetchUserPromotions() {
    if (!auth.isLoggedIn) return;
    setFetchingPromotions(true);
    fetch(
      API.AGGREGATE_USER_PROMOTIONS({ userId: author.user }),
      API.GET_CONFIG()
    )
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then(async (res) => {
        await dispatch(
          AuthorActions.updateAuthorByKey({
            key: "promotions",
            value: res,
            prevState: store.getState().author,
          })
        );
        setFetchingPromotions(false);
      });
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
    fetchUserPromotions();
    fetchUserTransactions();
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
    } else if (section === SECTIONS.picture) {
      setHoverProfilePicture(true);
    }
  };

  let onMouseLeave = (section) => {
    if (section === SECTIONS.name) {
      setHoverName(false);
    } else if (section === SECTIONS.description) {
      setHoverDescription(false);
    } else if (section === SECTIONS.picture) {
      setHoverProfilePicture(false);
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
    {
      href: "transactions",
      label: "transactions",
      showCount: true,
      count: transactions.count,
    },
    {
      href: "boosts",
      label: "supported papers",
      showCount: true,
      count: author.promotions && author.promotions.count,
    },
  ];

  let renderTabContent = () => {
    return (
      // render all tab content on the dom, but only show if selected
      <div>
        <span
          className={css(
            tabName === "contributions" ? styles.reveal : styles.hidden
          )}
        >
          <UserContributionsTab />
        </span>
        <span
          className={css(
            tabName === "authored-papers" ? styles.reveal : styles.hidden
          )}
        >
          <AuthoredPapersTab />
        </span>
        <span
          className={css(
            tabName === "discussions" ? styles.reveal : styles.hidden
          )}
        >
          <UserDiscussionsTab hostname={hostname} />
        </span>
        <span
          className={css(
            tabName === "transactions" ? styles.reveal : styles.hidden
          )}
        >
          <UserTransactionsTab />
        </span>
        <span
          className={css(tabName === "boosts" ? styles.reveal : styles.hidden)}
        >
          <UserPromotionsTab fetching={fetchingPromotions} />
        </span>
      </div>
    );
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

  let renderSaveButton = (section, { picture }) => {
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
    } else if (section === SECTIONS.picture) {
      action = () => {
        saveProfilePicture(picture);
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

  let saveSocial = async (section) => {
    let changes = {};
    let change = socialLinks[section];
    let http = "http://";
    let https = "https://";
    if (!change) {
      return;
    }
    if (!change.startsWith(https)) {
      if (change.startsWith(http)) {
        change = change.replace(http, https);
      }
      change = https + change;
    }
    if (section === SECTIONS.facebook) {
      changes.facebook = change;
    } else if (section === SECTIONS.linkedin) {
      changes.linkedin = change;
    } else if (section === SECTIONS.twitter) {
      changes.twitter = change;
    }

    setEditFacebook(false);
    setEditLinkedin(false);
    setEditTwitter(false);

    await dispatch(
      AuthorActions.saveAuthorChanges({ changes, authorId: author.id })
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

  let saveProfilePicture = async (picture) => {
    let changes = new FormData();
    let byteCharacters;

    if (picture.split(",")[0].indexOf("base64") >= 0)
      byteCharacters = atob(picture.split(",")[1]);
    else byteCharacters = unescape(picture.split(",")[1]);

    let byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    let byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/jpg" });

    changes.append("profile_image", blob);

    let authorReturn = await dispatch(
      AuthorActions.saveAuthorChanges({
        changes,
        authorId: author.id,
        file: true,
      })
    );

    let { updateUser, user } = props;
    updateUser({ ...user, author_profile: authorReturn.payload });

    closeAvatarModal();
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
          <div
            className={css(styles.submitSocialButton)}
            onClick={() => saveSocial(social)}
          >
            <i className="fas fa-arrow-right"></i>
          </div>
        </div>
      </div>
    );
  };

  let openAvatarModal = () => {
    setAvatarUploadIsOpen(true);
  };

  let closeAvatarModal = () => {
    setAvatarUploadIsOpen(false);
  };

  let renderOrcid = () => {
    if (allowEdit) {
      return author.orcid_id
        ? null
        : !editName && (
            <OrcidConnectButton
              hostname={hostname}
              refreshProfileOnSuccess={true}
              customLabel={"Connect your ORCiD Profile"}
              styles={styles.orcidButton}
            />
          );
    }
  };

  return (
    <div className={css(styles.container)}>
      <Head
        title={`${authorName} on ResearchHub`}
        description={`View contributions by ${authorName} on ResearchHub`}
      />
      <ComponentWrapper>
        <div className={css(styles.profileContainer)}>
          <div
            className={css(allowEdit && styles.avatarContainer)}
            onClick={(allowEdit && openAvatarModal) || undefined}
            onMouseEnter={() => onMouseEnter(SECTIONS.picture)}
            onMouseLeave={() => onMouseLeave(SECTIONS.picture)}
          >
            <AuthorAvatar author={author} disableLink={true} size={80} />
            {allowEdit && hoverProfilePicture && (
              <div className={css(styles.profilePictureHover)}>Update</div>
            )}
          </div>
          <div className={css(styles.profileInfo)}>
            <div className={css(styles.nameLine)}>
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
                      {renderSaveButton(SECTIONS.name, {})}
                    </div>
                  </div>
                )
              )}
              <div
                className={css(
                  styles.connectOrcid,
                  author.orcid_id && styles.orcidAvailable
                )}
              >
                {renderOrcid()}
              </div>
            </div>
            <div className={css(styles.reputation)}>
              <div className={css(styles.reputationTitle)}>
                Lifetime Reputation:
              </div>
              <Reputation reputation={author.reputation} />
            </div>
            {!editDescription ? (
              <div
                className={css(styles.description, styles.editButtonContainer)}
                onMouseEnter={() => onMouseEnter(SECTIONS.description)}
                onMouseLeave={() => onMouseLeave(SECTIONS.description)}
              >
                {!author.description && allowEdit && (
                  <span
                    className={css(styles.addDescriptionText)}
                    onClick={() => onEditToggle(SECTIONS.description)}
                  >
                    Add description
                  </span>
                )}
                {author.description}
                {hoverDescription &&
                  author.description &&
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
                    {renderSaveButton(SECTIONS.description, {})}
                  </div>
                </div>
              )
            )}
            <div className={css(styles.extraInfoContainer)}>
              {author.university && author.university.name && (
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
            {author.orcid_id && (
              <a
                className={css(styles.link)}
                target="_blank"
                href={`https://orcid.org/${author.orcid_id}`}
              >
                <img
                  src="/static/icons/orcid.png"
                  className={css(styles.orcidLogo)}
                />
              </a>
            )}
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
                ref={(ref) => (linkedinRef = ref)}
              >
                <div
                  className={css(styles.socialMedia, styles.linkedin)}
                  onClick={() => setEditLinkedin(true)}
                >
                  <i className="fab fa-linkedin-in"></i>
                </div>
                {editLinkedin && renderSocialEdit(SECTIONS.linkedin)}
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
                ref={(ref) => (twitterRef = ref)}
              >
                <div
                  className={css(styles.socialMedia, styles.twitter)}
                  onClick={() => setEditTwitter(true)}
                >
                  <i className="fab fa-twitter"></i>
                </div>
                {editTwitter && renderSocialEdit(SECTIONS.twitter)}
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
                ref={(ref) => (facebookRef = ref)}
              >
                <div
                  className={css(styles.socialMedia, styles.facebook)}
                  onClick={() => setEditFacebook(true)}
                >
                  <i className="fab fa-facebook-f"></i>
                </div>
                {editFacebook && renderSocialEdit(SECTIONS.facebook)}
              </div>
            )}
            <div
              className={css(styles.socialMedia, styles.shareLink)}
              onClick={() => setOpenShareModal(true)}
            >
              <i className="far fa-share"></i>
            </div>
          </div>
        </div>
      </ComponentWrapper>
      <TabBar
        tabs={tabs}
        selectedTab={router.query.tabName}
        dynamic_href={"/user/[authorId]/[tabName]"}
        author={author}
        user={user}
        fetching={fetching}
      />
      <div className={css(styles.contentContainer)}>{renderTabContent()}</div>
      <ShareModal
        close={() => setOpenShareModal(false)}
        isOpen={openShareModal}
        title={"Share Author Profile"}
        url={`${hostname}${router.asPath}`}
      />
      <AvatarUpload
        isOpen={avatarUploadIsOpen}
        closeModal={closeAvatarModal}
        saveButton={renderSaveButton}
        section={SECTIONS.picture}
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

    "@media only screen and (max-width: 767px)": {
      padding: "32px 0px",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
  },
  profileInfo: {
    width: "70%",
    marginLeft: 30,
    marginRight: 30,
  },
  connectOrcid: {
    marginBottom: 16,
    marginLeft: 5,
  },
  socialLinks: {
    display: "flex",
    height: 35,
    position: "relative",
    justifyContent: "flex-end",
    width: "30%",
  },
  authorName: {
    fontWeight: 500,
    fontSize: 33,
    textTransform: "capitalize",
    marginBottom: 10,

    "@media only screen and (max-width: 767px)": {
      paddingRight: 0,
      justifyContent: "center",
      marginTop: 16,
      textAlign: "center",
    },
  },
  nameLine: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    "@media only screen and (min-width: 768px)": {
      alignItems: "flex-start",
    },
    "@media only screen and (min-width: 1280px)": {
      display: "flex",
      alignItems: "center",
      flexDirection: "row",
    },
  },
  orcidAvailable: {
    marginBottom: 10,
    marginLeft: 0,
    "@media only screen and (min-width: 1280px)": {
      flexDirection: "column",
    },
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
    marginBottom: 16,
    justifyContent: "center",
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
    minWidth: 35,
    minHeight: 35,
  },
  link: {
    textDecoration: "None",
  },
  editButtonContainer: {
    display: "flex",
    position: "relative",
    width: "fit-content",
    paddingRight: 20,
    marginRight: 3,
    "@media only screen and (max-width: 767px)": {
      width: "unset",
      paddingRight: 0,
    },
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
    resize: "none",
    fontSize: 16,
    marginBottom: 16,
    fontFamily: "Roboto, sans-serif",
    outline: "none",

    border: "1px solid #E8E8F2",
    backgroundColor: "#FBFBFD",
    ":focus": {
      borderColor: "#D2D2E6",
    },

    padding: 15,
    fontWeight: "400",
    color: "#232038",
    borderRadius: 2,
  },
  actionContainer: {
    display: "flex",
    marginBottom: 16,
  },
  button: {
    width: 126,
    height: 45,
    border: "1px solid",
    borderColor: colors.BLUE(),
    borderRadius: 4,
    fontSize: 15,
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
    width: 126,
    height: 45,
    fontSize: 15,

    background: colors.BLUE(),
    marginLeft: 5,

    ":hover": {
      backgroundColor: "#3E43E8",
    },
  },
  nameInput: {
    fontSize: 32,
    width: 300,
    marginBottom: 16,

    border: "1px solid #E8E8F2",
    backgroundColor: "#FBFBFD",
    ":focus": {
      borderColor: "#D2D2E6",
    },
    padding: 16,
    fontWeight: "500",
    color: "#232038",
    borderRadius: 2,
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
    width: 300,
    height: 30,
    overflow: "hidden",

    border: "1px solid #E8E8F2",
    backgroundColor: "#FBFBFD",
    ":focus": {
      borderColor: "#D2D2E6",
    },

    fontWeight: "400",
    borderRadius: 2,
    color: "#232038",
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
  addDescriptionText: {
    cursor: "pointer",
    opacity: 0.5,

    ":hover": {
      textDecoration: "underline",
      opacity: 1,
    },
  },
  avatarContainer: {
    width: 80,
    height: 80,
    cursor: "pointer",
    position: "relative",
  },
  profilePictureHover: {
    width: 80,
    height: 40,
    borderRadius: "0 0 100px 100px",
    display: "flex",
    justifyContent: "center",
    paddingTop: 5,
    boxSizing: "border-box",
    position: "absolute",
    background: "rgba(0, 0, 0, .3)",
    color: "#fff",
    bottom: 0,
  },
  reputation: {
    display: "flex",
    alignItems: "center",
    marginBottom: 16,

    "@media only screen and (max-width: 767px)": {
      justifyContent: "center",
    },
  },
  reputationTitle: {
    marginRight: 10,
  },
  orcidButton: {},
  orcidSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  orcidLogo: {
    height: 35,
    width: 35,
    objectFit: "contain",
    marginLeft: 5,
    marginRight: 5,
  },
  hidden: {
    display: "none",
    zIndex: -10,
  },
  reveal: {
    display: "flex",
    zIndex: 1,
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  author: state.author,
  user: state.auth.user,
  transactions: state.transactions,
});

const mapDispatchToProps = {
  updateUser: AuthActions.updateUser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthorPage);
