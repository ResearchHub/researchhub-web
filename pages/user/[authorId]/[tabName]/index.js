import Router, { useRouter } from "next/router";
import Link from "next/link";
import { StyleSheet, css } from "aphrodite";
import { useEffect, useState } from "react";
import { connect, useDispatch, useStore } from "react-redux";
import moment from "moment";

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
  let { author, hostname } = props;
  let router = useRouter();
  let { tabName } = router.query;
  const dispatch = useDispatch();

  const [openShareModal, setOpenShareModal] = useState(false);
  const [hoverName, setHoverName] = useState(false);
  const [hoverDescription, setHoverDescription] = useState(false);
  const [editName, setEditName] = useState(false);
  const [editDescription, setEditDescription] = useState(false);

  const HOVER_SECTIONS = {
    name: "name",
    description: "description",
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

  function onHoverToggle(section) {
    if (section === HOVER_SECTIONS.name) {
      setHoverName(!hoverName);
    } else if (section === HOVER_SECTIONS.description) {
      setHoverDescription(!hoverDescription);
    }
  }

  function onEditToggle(section) {
    if (section === HOVER_SECTIONS.name) {
      setEditName(!editName);
    } else if (section === HOVER_SECTIONS.description) {
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

  return (
    <div className={css(styles.container)}>
      <ComponentWrapper>
        <div className={css(styles.profileContainer)}>
          <AuthorAvatar author={author} disableLink={true} size={80} />
          <div className={css(styles.profileInfo)}>
            {!editName && (
              <div
                className={css(styles.authorName, styles.editButtonContainer)}
                onMouseEnter={() => onHoverToggle(HOVER_SECTIONS.name)}
                onMouseLeave={() => onHoverToggle(HOVER_SECTIONS.name)}
              >
                {author.first_name} {author.last_name}
                {hoverName &&
                  renderEditButton(() => onEditToggle(HOVER_SECTIONS.name))}
              </div>
            )}
            <div className={css(styles.reputation)}></div>
            {!editDescription && (
              <div
                className={css(styles.description, styles.editButtonContainer)}
                onMouseEnter={() => onHoverToggle(HOVER_SECTIONS.description)}
                onMouseLeave={() => onHoverToggle(HOVER_SECTIONS.description)}
              >
                {author.user &&
                  "This is a test description. We will use this until we get the description from the backend working. We also need to create some edit functionality on the frontend to be able to properly add a description for the author"}
                {hoverDescription &&
                  renderEditButton(() =>
                    onEditToggle(HOVER_SECTIONS.description)
                  )}
              </div>
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
            {author.linkedin && (
              <a
                className={css(styles.link)}
                href={author.linkedin}
                target="_blank"
              >
                <div className={css(styles.socialMedia, styles.linkedin)}>
                  <i className="fab fa-linkedin-in"></i>
                </div>
              </a>
            )}
            {author.twitter && (
              <a
                className={css(styles.link)}
                href={author.twitter}
                target="_blank"
              >
                <div className={css(styles.socialMedia, styles.twitter)}>
                  <i className="fab fa-twitter"></i>
                </div>
              </a>
            )}
            {author.facebook && (
              <a
                className={css(styles.link)}
                href={author.facebook}
                target="_blank"
              >
                <div className={css(styles.socialMedia, styles.facebook)}>
                  <i className="fab fa-facebook-f"></i>
                </div>
              </a>
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
});

const mapStateToProps = (state) => ({
  author: state.author,
});

export default connect(mapStateToProps)(AuthorPage);
