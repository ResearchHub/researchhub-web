import { useRouter } from "next/router";
import { StyleSheet, css } from "aphrodite";
import { useEffect, useState, useRef, Fragment } from "react";
import { connect, useStore, useDispatch } from "react-redux";
import "~/components/Paper/CitationCard.css";

// Redux
import { AuthActions } from "~/redux/auth";
import { AuthorActions } from "~/redux/author";
import { TransactionActions } from "~/redux/transaction";
import { ModalActions } from "../../../../redux/modals";

// Components
import AuthorAvatar from "~/components/AuthorAvatar";
import AuthoredPapersTab from "~/components/Author/Tabs/AuthoredPapers";
import AvatarUpload from "~/components/AvatarUpload";
import ComponentWrapper from "~/components/ComponentWrapper";
import Head from "~/components/Head";
import OrcidConnectButton from "~/components/OrcidConnectButton";
import ShareModal from "~/components/ShareModal";
import TabBar from "~/components/TabBar";
import UserDiscussionsTab from "~/components/Author/Tabs/UserDiscussions";
import UserContributionsTab from "~/components/Author/Tabs/UserContributions";
import UserTransactionsTab from "~/components/Author/Tabs/UserTransactions";
import UserPromotionsTab from "~/components/Author/Tabs/UserPromotions";
import UserInfoModal from "~/components/modal/UserInfoModal";
import Button from "~/components/Form/Button";
import ModeratorDeleteButton from "~/components/Moderator/ModeratorDeleteButton";

// Config
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import { absoluteUrl } from "~/config/utils";
import { createUserSummary } from "~/config/utils";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

const AuthorPage = (props) => {
  const { auth, author, hostname, user, transactions } = props;
  const router = useRouter();
  const { tabName } = router.query;
  const dispatch = useDispatch();
  const store = useStore();
  const [prevProps, setPrevProps] = useState(props.auth.isLoggedIn);

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
  const [eduSummary, setEduSummary] = useState(
    author && createUserSummary(author)
  );
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [socialLinks, setSocialLinks] = useState({});
  const [allowEdit, setAllowEdit] = useState(false);

  const [fetchingPromotions, setFetchingPromotions] = useState(false);
  const [mobileView, setMobileView] = useState(false);

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

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    window.addEventListener("resize", updateDimensions);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("resize", updateDimensions);
    };
  });

  useEffect(() => {
    setFetching(true);
    async function refetchAuthor() {
      await dispatch(
        AuthorActions.getAuthor({ authorId: router.query.authorId })
      );
    }
    let authored = fetchAuthoredPapers();
    let discussions = fetchUserDiscussions();
    let contributions = fetchUserContributions();
    let promotions = fetchUserPromotions();
    let transactions = fetchUserTransactions();
    let refetch = refetchAuthor();
    Promise.all([
      authored,
      discussions,
      contributions,
      promotions,
      transactions,
      refetch,
    ]).then((_) => {
      setFetching(false);
    });
  }, [router.query.authorId]);

  useEffect(() => {
    setDescription(author.description);
    setName(`${author.first_name} ${author.last_name}`);
    setEduSummary(createUserSummary(author));

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

  useEffect(() => {
    if (prevProps && !auth.isLoggedIn) {
      checkUserVotes(); // clears the state
    } else if (!prevProps && auth.isLoggedIn) {
      let papers = store.getState().author.authoredPapers.papers;
      checkUserVotes(papers, "authored");
      let contributions = store.getState().author.userContributions
        .contributions;
      checkUserVotes(contributions, "contributions");
    }
    setPrevProps(auth.isLoggedIn);
  }, [auth.isLoggedIn]);

  function updateDimensions() {
    if (window.innerWidth < 968) {
      setMobileView(true);
    } else {
      setMobileView(false);
    }
  }
  /**
   * When we click anywhere outside of the dropdown, close it
   * @param { Event } e -- javascript event
   */
  function handleOutsideClick(e) {
    if (facebookRef && !facebookRef.contains(e.target)) {
      setEditFacebook(false);
    }
    if (twitterRef && !twitterRef.contains(e.target)) {
      setEditTwitter(false);
    }
    if (linkedinRef && !linkedinRef.contains(e.target)) {
      setEditLinkedin(false);
    }
  }

  async function fetchAuthoredPapers() {
    await dispatch(
      AuthorActions.getAuthoredPapers({ authorId: router.query.authorId })
    );
    let papers = store.getState().author.authoredPapers.papers;
    return checkUserVotes(papers, "authored");
  }

  function fetchUserDiscussions() {
    return dispatch(
      AuthorActions.getUserDiscussions({ authorId: router.query.authorId })
    );
  }

  async function fetchUserContributions() {
    await dispatch(
      AuthorActions.getUserContributions({
        authorId: router.query.authorId,
      })
    );
    let contributions = store.getState().author.userContributions.contributions;
    return checkUserVotes(contributions, "contributions");
  }

  function fetchUserTransactions() {
    if (!auth.isLoggedIn) return;
    return dispatch(
      TransactionActions.getWithdrawals(1, store.getState().transactions)
    );
  }

  function fetchUserPromotions() {
    if (!author.user || !auth.isLoggedIn) return;
    setFetchingPromotions(true);
    return fetch(
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

  const onMouseEnter = (section) => {
    if (section === SECTIONS.name) {
      setHoverName(true);
    } else if (section === SECTIONS.description) {
      setHoverDescription(true);
    } else if (section === SECTIONS.picture) {
      setHoverProfilePicture(true);
    }
  };

  const onMouseLeave = (section) => {
    if (section === SECTIONS.name) {
      setHoverName(false);
    } else if (section === SECTIONS.description) {
      setHoverDescription(false);
    } else if (section === SECTIONS.picture) {
      setHoverProfilePicture(false);
    }
  };

  const checkUserVotes = (papers = [], type) => {
    if (!store.getState().auth.isLoggedIn && papers.length) {
      let authoredPapers = { ...store.getState().author.authoredPapers };

      authoredPapers.papers = authoredPapers.papers.map((paper) => {
        paper.user_vote = null;
        return paper;
      });

      dispatch(
        AuthorActions.updateAuthorByKey({
          key: "authoredPapers",
          value: authoredPapers,
        })
      );

      let contributions = { ...store.getState().author.userContributions };

      contributions.contributions = contributions.contributions.map((paper) => {
        paper.user_vote = null;
        return paper;
      });

      return dispatch(
        AuthorActions.updateAuthorByKey({
          key: "contributions",
          value: contributions,
        })
      );
    }

    let paperIds = papers.map((paper) => {
      return paper.id;
    });

    if (paperIds.length === 0) return;

    fetch(API.CHECK_USER_VOTE({ paperIds }), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        let updates = { ...res };
        let updatedPapers = papers.map((paper) => {
          if (updates[paper.id]) {
            paper.user_vote = updates[paper.id];
          }
          return paper;
        });

        if (type === "authored") {
          let newAuthored = { ...store.getState().author.authoredPapers };
          let oldState = { ...store.getState().author.authoredPapers };
          oldState.papers = [];
          newAuthored.papers = updatedPapers;
          dispatch(
            AuthorActions.updateAuthorByKey({
              key: "authoredPapers",
              value: oldState,
            })
          );
          dispatch(
            AuthorActions.updateAuthorByKey({
              key: "authoredPapers",
              value: newAuthored,
            })
          );
        } else if (type === "contributions") {
          let newContributions = {
            ...store.getState().author.userContributions,
          };
          let oldState = { ...store.getState().author.userContributions };
          oldState.contributions = [];
          newContributions.contributions = updatedPapers;
          dispatch(
            AuthorActions.updateAuthorByKey({
              key: "userContributions",
              value: oldState,
            })
          );
          dispatch(
            AuthorActions.updateAuthorByKey({
              key: "userContributions",
              value: newContributions,
            })
          );
        }
      });
  };

  const tabs = [
    {
      href: "contributions",
      label: "paper submissions",
      showCount: true,
      count: () => author.userContributions.count,
    },
    {
      href: "authored-papers",
      label: "authored papers",
      showCount: true,
      count: () => author.authoredPapers.count,
    },
    {
      href: "discussions",
      label: "discussions",
      showCount: true,
      count: () => author.userDiscussions.count,
    },
    {
      href: "transactions",
      label: "transactions",
      showCount: true,
      count: () => transactions.count,
    },
    {
      href: "boosts",
      label: "supported papers",
      showCount: true,
      count: () => author.promotions && author.promotions.count,
    },
  ];

  const renderTabTitle = () => {
    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i].href === tabName) {
        return tabs[i].label;
      }
    }
  };

  const renderTabContent = () => {
    return (
      // render all tab content on the dom, but only show if selected
      <ComponentWrapper>
        <div className={css(styles.tabMeta)}>
          <h2 className={css(styles.title)}>{renderTabTitle()}</h2>
          <div
            className={css(
              tabName === "contributions" ? styles.reveal : styles.hidden
            )}
          >
            <UserContributionsTab fetching={fetching} mobileView={mobileView} />
          </div>
          <div
            className={css(
              tabName === "authored-papers" ? styles.reveal : styles.hidden
            )}
          >
            <AuthoredPapersTab fetching={fetching} mobileView={mobileView} />
          </div>
          <div
            className={css(
              tabName === "discussions" ? styles.reveal : styles.hidden
            )}
          >
            <UserDiscussionsTab
              hostname={hostname}
              fetching={fetching}
              mobileView={mobileView}
            />
          </div>
          {/* <div
            className={css(
              tabName === "projects" ? styles.reveal : styles.hidden
            )}
          >
            <UserProjectsTab fetching={fetching} mobileView={mobileView} />
          </div> */}
          <div
            className={css(
              tabName === "transactions" ? styles.reveal : styles.hidden
            )}
          >
            <UserTransactionsTab fetching={fetching} mobileView={mobileView} />
          </div>
          <div
            className={css(
              tabName === "boosts" ? styles.reveal : styles.hidden
            )}
          >
            <UserPromotionsTab
              fetching={fetchingPromotions}
              mobileView={mobileView}
            />
          </div>
        </div>
      </ComponentWrapper>
    );
  };

  const renderEditButton = (action) => {
    return (
      <div className={css(styles.editButton)} onClick={action}>
        <i className="fas fa-edit"></i>
      </div>
    );
  };

  const onDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const onNameChange = (e) => {
    setName(e.target.value);
  };

  const renderCancelButton = (section) => {
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

  const renderSaveButton = (section, { picture }) => {
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

  const saveSocial = async (section) => {
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

  const saveName = async () => {
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

  const saveDescription = async () => {
    let changes = {
      description,
    };

    await dispatch(
      AuthorActions.saveAuthorChanges({ changes, authorId: author.id })
    );
  };

  const onSocialLinkChange = (e, social) => {
    let newSocialLinks = { ...socialLinks };
    newSocialLinks[social] = e.target.value;

    setSocialLinks(newSocialLinks);
  };

  const saveProfilePicture = async (picture) => {
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

  const renderSocialEdit = (social) => {
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

  const isModerator = () => {
    if (props.auth.isLoggedIn) {
      if (props.user.moderator) {
        return true;
      }
    }
    return false;
  };

  const openAvatarModal = () => {
    setAvatarUploadIsOpen(true);
  };

  const openUserInfoModal = () => {
    props.openUserInfoModal(true);
  };

  const closeAvatarModal = () => {
    setAvatarUploadIsOpen(false);
  };

  const getOrcidId = () => {
    return auth.user.author_profile && auth.user.author_profile.orcid_id;
  };

  const authorOrcidId = getOrcidId();

  const renderOrcid = (mobile = false) => {
    if (allowEdit) {
      return authorOrcidId
        ? null
        : !editName && (
            <OrcidConnectButton
              hostname={hostname}
              refreshProfileOnSuccess={false}
              customLabel={"Connect ORCiD"}
              styles={styles.orcidButton}
              iconButton={mobile}
            />
          );
    }
  };

  const renderRSCBalance = () => {
    if (author.user && user) {
      if (author.user === user.id) {
        return (
          <div className={css(styles.rscBalance)}>
            <span className={css(styles.icon)}>
              <img
                src={"/static/icons/coin-filled.png"}
                className={css(styles.rscIcon)}
                alt={"researchhub-coin-icon"}
              />
            </span>
            <div className={css(styles.reputationTitle)}>
              Current RSC Balance:
            </div>
            <div className={css(styles.amount)}>{props.user.balance}</div>
          </div>
        );
      }
    }
  };

  return (
    <div
      className={css(styles.container)}
      vocab="https://schema.org/"
      typeof="Person"
    >
      <Head
        title={`${name} on ResearchHub`}
        description={`View contributions by ${name} on ResearchHub`}
      />
      <ComponentWrapper>
        <UserInfoModal />
        <div
          className={css(
            styles.profileContainer,
            isModerator() && styles.profileContainerPadding
          )}
        >
          <div
            className={css(
              styles.avatarContainer,
              author.profile_image && styles.border
            )}
          >
            <div
              className={css(styles.avatarContainer)}
              onClick={(allowEdit && openUserInfoModal) || undefined}
              onMouseEnter={() => onMouseEnter(SECTIONS.picture)}
              onMouseLeave={() => onMouseLeave(SECTIONS.picture)}
              draggable={false}
            >
              <AuthorAvatar author={author} disableLink={true} size={120} />
              <meta
                property="image"
                content={
                  author.profile_image ? author.profile_image : "author avatar"
                }
              />
              {allowEdit && hoverProfilePicture && (
                <div className={css(styles.profilePictureHover)}>Update</div>
              )}
            </div>
            {isModerator() && (
              <ModeratorDeleteButton
                containerStyle={styles.moderatorButton}
                iconStyle={styles.moderatorIcon}
                labelStyle={styles.moderatorLabel}
                icon={<i className="fas fa-ban" />}
                label={"Ban User"}
                actionType={"user"}
                metaData={{ authorId: router.query.authorId }}
                // onRemove={this.removeContent}
              />
            )}
          </div>
          <div className={css(styles.profileInfo)}>
            <div className={css(styles.nameLine)}>
              {!editName ? (
                <Fragment>
                  <h1
                    className={css(
                      styles.authorName,
                      styles.editButtonContainer
                    )}
                    onMouseEnter={() => onMouseEnter(SECTIONS.name)}
                    onMouseLeave={() => onMouseLeave(SECTIONS.name)}
                    property="name"
                  >
                    {author.first_name} {author.last_name}
                    {allowEdit &&
                      renderEditButton(() => {
                        setHoverName(false);
                        openUserInfoModal();
                      })}
                  </h1>
                </Fragment>
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
            </div>

            <div className={css(styles.reputationContainer)}>
              {eduSummary && (
                <div className={css(styles.extraInfoContainer) + " clamp2"}>
                  {(author.headline || author.education) && (
                    <div className={css(styles.extraInfo) + " clamp2"}>
                      <i
                        className={css(styles.icon) + " fas fa-graduation-cap"}
                      ></i>
                      {eduSummary}
                    </div>
                  )}
                </div>
              )}
              <div className={css(styles.reputation)}>
                <span className={css(styles.icon)}>
                  <img
                    src={"/static/ResearchHubIcon.png"}
                    className={css(styles.rhIcon)}
                    alt={"reserachhub-icon"}
                  />
                </span>
                <div className={css(styles.reputationTitle)}>
                  Lifetime Reputation:
                </div>
                <div className={css(styles.amount)}>
                  {props.author.reputation}
                </div>
              </div>
              {renderRSCBalance()}
            </div>
            {!editDescription ? (
              <div
                className={css(
                  styles.description,
                  styles.editButtonContainer,
                  !author.description && styles.hidden
                )}
                onMouseEnter={() => onMouseEnter(SECTIONS.description)}
                onMouseLeave={() => onMouseLeave(SECTIONS.description)}
              >
                {!author.description && allowEdit && (
                  <span
                    className={css(styles.addDescriptionText)}
                    onClick={() => openUserInfoModal()}
                  >
                    Add description
                  </span>
                )}
                <span property="description">{author.description}</span>
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
          </div>
          <div className={css(styles.column)}>
            <div className={css(styles.socialLinks)}>
              {authorOrcidId && (
                <a
                  className={css(styles.link)}
                  target="_blank"
                  href={`https://orcid.org/${authorOrcidId}`}
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

              {authorOrcidId && (
                <div
                  className={css(
                    styles.socialMedia,
                    styles.facebook,
                    authorOrcidId && styles.mobileConnectOrcid,
                    !authorOrcidId && styles.noSocial,
                    authorOrcidId && styles.orcidAvailable
                  )}
                >
                  {renderOrcid(true)}
                </div>
              )}

              <div
                className={css(styles.socialMedia, styles.shareLink)}
                onClick={() => setOpenShareModal(true)}
              >
                <i className="far fa-share"></i>
              </div>
            </div>
            <div
              className={css(
                styles.connectOrcid,
                !authorOrcidId && styles.noSocial,
                authorOrcidId && styles.orcidAvailable
              )}
            >
              {renderOrcid()}
            </div>
            {allowEdit && (
              <div className={css(styles.editProfileButton)}>
                <Button
                  label={"Edit Profile"}
                  onClick={openUserInfoModal}
                  customButtonStyle={styles.editButtonCustom}
                  rippleClass={styles.rippleClass}
                  isWhite={true}
                />
              </div>
            )}
            {allowEdit && (
              <div className={css(styles.mobileEditProfileButton)}>
                <Button
                  label={"Edit Profile"}
                  onClick={openUserInfoModal}
                  customButtonStyle={styles.editButtonCustom}
                  rippleClass={styles.editButtonCustom}
                />
              </div>
            )}
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
    background: "#FAFAFA",
    minHeight: "55vh",
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
  moderatorButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
    borderRadius: 4,
    fontWeight: 400,
    fontSize: 16,
    height: 30,
    background: colors.RED(0.9),
    color: "#FFF",
    border: `1px solid ${colors.RED()}`,
    ":hover": {
      background: colors.RED(1),
    },
  },
  moderatorIcon: {
    color: "inherit",
    marginRight: 8,
  },
  moderatorLabel: {
    fontWeight: 400,
  },
  connectOrcid: {
    marginTop: 16,
    "@media only screen and (max-width: 767px)": {
      display: "none",
    },
  },
  mobileConnectOrcid: {
    display: "none",
    "@media only screen and (max-width: 767px)": {
      display: "flex",
      background: "#FFF",
    },
  },
  socialLinks: {
    display: "flex",
    height: 35,
    position: "relative",
    justifyContent: "flex-end",
    width: "30%",
    "@media only screen and (max-width: 767px)": {
      margin: 0,
      width: "max-content",
    },
  },
  authorName: {
    fontWeight: 500,
    fontSize: 30,
    textTransform: "capitalize",
    padding: 0,
    margin: 0,
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
    marginBottom: 10,
    "@media only screen and (max-width: 767px)": {
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 15,
    },
  },
  extraInfo: {
    color: "#241F3A",
    opacity: 0.5,
    fontSize: 15,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    "@media only screen and (max-width: 415px)": {
      fontSize: 13,
    },
  },
  description: {
    marginBottom: 16,
    justifyContent: "center",
    width: "100%",
    color: "#241F3A",
    lineHeight: 1.5,
  },
  column: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    marginLeft: "auto",
    "@media only screen and (max-width: 767px)": {
      marginLeft: 0,
      width: "70%",
      alignItems: "center",
    },
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
    // marginRight: 3,
    "@media only screen and (max-width: 767px)": {
      width: "unset",
      paddingRight: 0,
    },
  },
  editButton: {
    opacity: 0.2,
    fontWeight: 400,
    fontSize: 14,
    cursor: "pointer",
    height: "fit-content",
    marginLeft: 8,
    ":hover": {
      opacity: 1,
    },
    "@media only screen and (max-width: 767px)": {
      right: -20,
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
  tabMeta: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    background: "#fff",
    border: "1.5px solid #F0F0F0",
    boxShadow: "0px 3px 4px rgba(0, 0, 0, 0.02)",
    padding: 50,
    paddingTop: 24,
    "@media only screen and (max-width: 767px)": {
      padding: 20,
    },
  },
  title: {
    fontWeight: 500,
    textTransform: "capitalize",
    marginTop: 0,
    marginBottom: 16,
    // fontSize: 32,
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
    fontSize: 16,
    fontWeight: 400,
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
    zIndex: 2,
  },
  editSocial: {
    position: "relative",
  },
  socialInputContainer: {
    display: "flex",
    width: "fit-content",
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
    width: 120,
    height: 120,
    cursor: "pointer",
    position: "relative",
    borderRadius: "50%",
    "@media only screen and (max-width: 767px)": {
      height: "min-content",
      width: "70%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  },
  border: {},
  profilePictureHover: {
    width: 115,
    height: 60,
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
  reputationContainer: {
    marginBottom: 16,
    "@media only screen and (max-width: 767px)": {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  },
  reputation: {
    display: "flex",
    alignItems: "center",
    fontWeight: 500,
    color: "#241F3A",
    "@media only screen and (max-width: 767px)": {
      justifyContent: "center",
    },
  },
  reputationTitle: {
    marginRight: 10,
    "@media only screen and (max-width: 415px)": {
      fontSize: 13,
    },
  },
  rscBalance: {
    display: "flex",
    alignItems: "center",
    fontWeight: 500,
    color: "#241F3A",
    marginTop: 10,
    "@media only screen and (max-width: 767px)": {
      justifyContent: "center",
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 13,
    },
  },
  amount: {
    color: "rgba(36, 31, 58, 0.7)",
    fontWeight: 400,
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
  icon: {
    width: 20,
    marginRight: 5,
    paddingTop: 2,
    display: "flex",
    alignItems: "center",
  },
  rhIcon: {
    width: 13,
    paddingLeft: 1.5,
  },
  rscIcon: {
    width: 16,
  },
  orcidButton: {
    width: 180,
    fontSize: 14,
    "@media only screen and (max-width: 415px)": {
      height: 50,
      background: "#fff",
    },
  },
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
    width: "100%",
    justifyContent: "center",
    flexDirection: "column",
  },
  supportButton: {
    marginBottom: 20,
    marginRight: 10,
  },
  row: {
    display: "flex",
  },
  editProfileButton: {
    marginTop: 10,
    "@media only screen and (max-width: 767px)": {
      display: "none",
    },
  },
  mobileEditProfileButton: {
    marginTop: 20,
    display: "none",
    "@media only screen and (max-width: 767px)": {
      display: "flex",
      width: "100%",
    },
  },
  editButtonCustom: {
    height: 40,
    "@media only screen and (max-width: 767px)": {
      width: "100%",
      minWidth: "100%",
    },
  },
  mobileEditButtonCustom: {},
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  author: state.author,
  user: state.auth.user,
  transactions: state.transactions,
});

const mapDispatchToProps = {
  updateUser: AuthActions.updateUser,
  openUserInfoModal: ModalActions.openUserInfoModal,
  openAuthorSupportModal: ModalActions.openAuthorSupportModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthorPage);
