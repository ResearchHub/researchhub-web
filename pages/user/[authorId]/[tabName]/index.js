import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faEdit,
  faUser,
  faUserSlash,
  faUserPlus,
  faArrowRight,
  faSpinnerThird,
} from "@fortawesome/pro-solid-svg-icons";
import {
  faXTwitter,
  faLinkedin,
  faGoogleScholar,
  faOrcid,
} from "@fortawesome/free-brands-svg-icons";
import { buildSlug } from "~/config/utils/buildSlug";
import { connect, useStore, useDispatch } from "react-redux";
import { Fragment, useEffect, useState, useRef, useMemo } from "react";
import { StyleSheet, css } from "aphrodite";
import { useRouter } from "next/router";
import get from "lodash/get";
import ReactTooltip from "react-tooltip";
import SafeURL from "safe-url";

// Redux
import { AuthActions } from "~/redux/auth";
import { AuthorActions } from "~/redux/author";
import { MessageActions } from "~/redux/message";
import { ModalActions } from "../../../../redux/modals";
import { TransactionActions } from "~/redux/transaction";

// Components
import AuthorAvatar from "~/components/AuthorAvatar";
import AvatarUpload from "~/components/AvatarUpload";
import Button from "~/components/Form/Button";
import ComponentWrapper from "~/components/ComponentWrapper";
import Head from "~/components/Head";
import Image from "next/image";
import Link from "next/link";
import Loader from "~/components/Loader/Loader";
import ModeratorDeleteButton from "~/components/Moderator/ModeratorDeleteButton";
import UserTransactions from "~/components/Author/Tabs/UserTransactions";
import AuthorActivityFeed from "~/components/Author/Feed/AuthorActivityFeed";
import HorizontalTabBar from "~/components/HorizontalTabBar";
import ReactPlaceholder from "react-placeholder/lib";
import AuthorDetailsPlaceholder from "~/components/Placeholders/AuthorDetailsPlaceholder";
// Dynamic modules
import dynamic from "next/dynamic";
const UserInfoModal = dynamic(() =>
  import("~/components/Modals/UserInfoModal")
);

// Config

import colors, { genericCardColors } from "~/config/themes/colors";
import { createUserSummary, createEduSummary } from "~/config/utils/user";
import {
  filterNull,
  isEmpty,
  isNullOrUndefined,
  silentEmptyFnc,
} from "~/config/utils/nullchecks";

import API, { generateApiUrl } from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { breakpoints } from "~/config/themes/screen";
import { captureEvent } from "~/config/utils/events";
import AuthorClaimModal from "~/components/AuthorClaimModal/AuthorClaimModal";
import VerifiedBadge from "~/components/Verification/VerifiedBadge";
import UserStateBanner from "~/components/Banner/UserStateBanner";
import useCurrentUser from "~/config/hooks/useCurrentUser";
import api from "~/config/api";

const AUTHOR_USER_STATUS = {
  EXISTS: "EXISTS",
  NONE: "NONE" /* Author does not have an existing User */,
  SPAMMER: "SPAMMER",
  SUSPENDED: "SUSPENDED",
};

const SECTIONS = {
  name: "name",
  description: "description",
  linkedin: "linkedin",
  twitter: "twitter",
  orcid: "orcid",
  scholar: "google_scholar",
  picture: "picture",
};

function AuthorPage(props) {
  const { auth, author, hostname, user, transactions, fetchedAuthor } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const store = useStore();
  const [tabName, setTabName] = useState(get(router, "query.tabName"));
  const [prevProps, setPrevProps] = useState(props.auth.isLoggedIn);
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // User External Links
  const [editGoogleScholar, setEditGoogleScholar] = useState(false);
  const [editLinkedin, setEditLinkedin] = useState(false);
  const [editXTwitter, setEditXTwitter] = useState(false);
  const [editOrcid, setEditOrcid] = useState(false);

  // User Profile Update
  const [avatarUploadIsOpen, setAvatarUploadIsOpen] = useState(false);
  const [hoverProfilePicture, setHoverProfilePicture] = useState(false);
  const [extraProfileOptionsIsOpen, setExtraProfileOptionsIsOpen] =
    useState(false);

  const [description, setDescription] = useState(fetchedAuthor.description);
  const [name, setName] = useState(
    fetchedAuthor.first_name + " " + fetchedAuthor.last_name
  );

  const [socialLinks, setSocialLinks] = useState({});
  const [allowEdit, setAllowEdit] = useState(false);
  // FetchingState
  const [fetching, setFetching] = useState(false);
  const [fetchingPromotions, setFetchingPromotions] = useState(false);
  const [isAuthorClaimModalOpen, setIsAuthorClaimModalOpen] = useState(false);
  const [fetchedUser, setFetchedUser] = useState(false);

  // KT Constants
  const [authorUserStatus, setAuthorUserStatus] = useState(
    AUTHOR_USER_STATUS.NONE
  );

  const authorUserID = author.user;
  const doesAuthorHaveUser = !isNullOrUndefined(authorUserID);
  const isAuthorUserSuspended =
    authorUserStatus === AUTHOR_USER_STATUS.SUSPENDED ||
    authorUserStatus === AUTHOR_USER_STATUS.SPAMMER;
  const isCurrentUserModerator =
    Boolean(auth.isLoggedIn) && Boolean(user.moderator);
  const doesAuthorHaveUserAndNotMe =
    !isNullOrUndefined(auth.user.id) &&
    doesAuthorHaveUser &&
    auth.user.id !== authorUserID;

  const googleScholarRef = useRef();
  const linkedinRef = useRef();
  const xTwitterRef = useRef();
  const orcidRef = useRef();
  const currentUser = useCurrentUser();

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  });

  useEffect(() => {
    const selectedTab = get(router, "query.tabName");

    if (selectedTab && selectedTab !== tabName) {
      setTabName(selectedTab);
    }
  }, [router]);

  const getTabs = (allowEdit = false) => {
    let tabs = [];
    if (doesAuthorHaveUser) {
      tabs = [
        {
          href: "overview",
          label: "Overview",
          value: "",
        },
        {
          href: "bounties",
          label: "Bounties",
          value: "bounties",
        },
        {
          href: "discussions",
          label: "Comments",
          value: "comments",
        },
        {
          href: "submissions",
          label: "Submissions",
          value: "submissions",
        },
        {
          href: "authored-papers",
          label: "Authored Papers",
          value: "authored-papers",
        },
      ];

      if (allowEdit) {
        tabs.push({
          href: "rsc",
          label: "RSC",
          value: "rsc",
        });
      }
    } else {
      tabs = [
        {
          href: "authored-papers",
          label: "Authored Papers",
          name: "Authored Papers",
        },
      ];
    }

    const tabsWithSelected = tabs.map((tab) =>
      tab.href === router.query.tabName ? { ...tab, isSelected: true } : tab
    );
    const tabsWithHref = tabsWithSelected.map((tab) => ({
      ...tab,
      href: `/author/${author.id}/${tab.href}`,
    }));

    const hasSelected = Boolean(tabsWithHref.find((t) => t.isSelected));
    if (!hasSelected) {
      tabsWithHref[0].isSelected = true;
    }

    return tabsWithHref;
  };

  const handleTabClick = (tab) => {
    const updatedQuery = {
      ...router.query,
      tabName: tab.href,
    };

    if (tab.href !== "bounties") {
      delete updatedQuery.sort;
    }

    if (tab.href.charAt(0) === "/") {
      router.push({
        pathname: tab.href,
      });
    } else {
      router.push(
        {
          pathname: "/author/[authorId]/[tabName]",
          query: updatedQuery,
        },
        undefined,
        { shallow: true }
      );
    }
  };

  function fetchAuthorSuspended() {
    return fetch(
      API.USER({ authorId: router.query.authorId }),
      API.GET_CONFIG()
    )
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        const authorUser = res.results[0];
        if (authorUser) {
          setAuthorUserStatus(
            authorUser.is_suspended
              ? AUTHOR_USER_STATUS.SUSPENDED
              : AUTHOR_USER_STATUS.EXISTS
          );
        } else {
          setAuthorUserStatus(AUTHOR_USER_STATUS.NONE);
        }
      });
  }

  function fetchUserTransactions() {
    return dispatch(
      TransactionActions.getWithdrawals(1, store.getState().transactions)
    );
  }

  async function refetchAuthor() {
    setFetchedUser(false); // needed for AuthorTabBar
    setFetching(true);
    const response = await dispatch(
      AuthorActions.getAuthor({ authorId: router.query.authorId })
    );
    setFetchedUser(true); // needed for AuthorTabBar
    setFetching(false);
    return response;
  }

  useEffect(() => {
    refetchAuthor().then(() => {
      fetchUserTransactions();
    });
  }, [router.query.authorId]);

  useEffect(() => {
    setAllowEdit(
      !isNullOrUndefined(authorUserID) &&
        !isNullOrUndefined(user) &&
        authorUserID === user.id
    );
    setDescription(author.description);

    if (author.first_name) {
      setName(`${author.first_name} ${author.last_name}`);
    }
    setSocialLinks({
      google_scholar: author.google_scholar,
      linkedin: author.linkedin,
      twitter: author.twitter,
      orcid: author.orcid_id ? `https://orcid.org/${author.orcid_id}` : null,
    });
  }, [author, user]);

  useEffect(() => {
    const isUnclaimedAuthor =
      author && author.id && !fetching && author.is_claimed === false;
    if (isUnclaimedAuthor) {
      router.push(
        {
          pathname: `/user/${author.id}/authored-papers`,
        },
        undefined,
        { shallow: true }
      );
    }
  }, [author, fetching]);

  useEffect(() => {
    setPrevProps(auth.isLoggedIn);
  }, [auth.isLoggedIn]);

  /* TODO: calvinhlee - what is this function? */
  function handleOutsideClick(e) {
    if (
      googleScholarRef.current &&
      !googleScholarRef.current.contains(e.target)
    ) {
      setEditGoogleScholar(false);
    }
    if (xTwitterRef.current && !xTwitterRef.current.contains(e.target)) {
      setEditXTwitter(false);
    }
    if (linkedinRef.current && !linkedinRef.current.contains(e.target)) {
      setEditLinkedin(false);
    }
    if (orcidRef.current && !orcidRef.current.contains(e.target)) {
      setEditOrcid(false);
    }
  }

  const onMouseEnter = (section) => {
    if (section === SECTIONS.picture) {
      setHoverProfilePicture(true);
    }
  };

  const onMouseLeave = (section) => {
    if (section === SECTIONS.picture) {
      setHoverProfilePicture(false);
    }
  };

  const renderTabTitle = () => {
    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i].href === tabName) {
        return tabs[i].label;
      }
    }
  };

  const downloadCSVFromBlob = (data) => {
    if (!data) {
      console.error("No CSV data found.");
      return;
    }

    // Create a URL for the Blob
    const url = URL.createObjectURL(data);

    // Create a temporary anchor element to trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv"; // You can name the file whatever you want
    document.body.appendChild(a); // Append the anchor to the body to make it clickable
    a.click(); // Programmatically click the anchor to trigger the download

    // Clean up by removing the anchor and revoking the Blob URL
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadCSV = async () => {
    setDownloading(true);
    const url = generateApiUrl("transactions/list_csv");
    const res = await fetch(url, api.GET_CONFIG());
    const blob = await res.blob();
    downloadCSVFromBlob(blob);
    setDownloading(false);
  };

  const tabs = getTabs(allowEdit);

  let tabContents = (
    <ComponentWrapper overrideStyle={styles.componentWrapperOverride}>
      <div
        className={css(tabName === "overview" ? styles.reveal : styles.hidden)}
      >
        <AuthorActivityFeed
          isVisible={tabName === "overview"}
          author={author}
          contributionType="overview"
          isFetchingAuthor={fetching}
        />
      </div>
      <div
        className={css(
          tabName === "discussions" ? styles.reveal : styles.hidden
        )}
      >
        <AuthorActivityFeed
          isVisible={tabName === "discussions"}
          author={author}
          contributionType="comment"
          isFetchingAuthor={fetching}
        />
      </div>
      <div
        className={css(tabName === "bounties" ? styles.reveal : styles.hidden)}
      >
        <AuthorActivityFeed
          isVisible={tabName === "bounties"}
          author={author}
          contributionType={"bounty"}
          isFetchingAuthor={fetching}
        />
      </div>
      <div
        className={css(
          tabName === "submissions" ? styles.reveal : styles.hidden
        )}
      >
        <AuthorActivityFeed
          isVisible={tabName === "submissions"}
          author={author}
          contributionType="hypothesis,paper,discussion"
          isFetchingAuthor={fetching}
        />
      </div>
      <div
        className={css(
          tabName === "authored-papers" ? styles.reveal : styles.hidden
        )}
      >
        <AuthorActivityFeed
          isVisible={tabName === "authored-papers"}
          author={author}
          contributionType="authored-papers"
          isFetchingAuthor={fetching}
        />
      </div>
      <div
        className={css(
          tabName === "replication-votes" ? styles.reveal : styles.hidden
        )}
      >
        <AuthorActivityFeed
          isVisible={tabName === "replication-votes"}
          author={author}
          contributionType="replication_vote"
          isFetchingAuthor={fetching}
        />
      </div>
      {allowEdit && (
        <div className={css(tabName === "rsc" ? styles.reveal : styles.hidden)}>
          <div className={css(styles.downloadAsCSV)}>
            <Button
              label={
                downloading ? (
                  <FontAwesomeIcon
                    icon={faSpinnerThird}
                    color={colors.BLUE()}
                    spin
                  />
                ) : (
                  "Download as CSV"
                )
              }
              isWhite
              onClick={downloadCSV}
            />
          </div>
          <UserTransactions fetching={fetching} />
        </div>
      )}
    </ComponentWrapper>
  );

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
    const changes = {};
    let change = socialLinks[section];
    const http = "http://";
    const https = "https://";
    if (!change) {
      return;
    }
    if (!change.startsWith(https)) {
      if (change.startsWith(http)) {
        change = change.replace(http, https);
      }
      change = https + change;
    }
    if (section === SECTIONS.scholar) {
      changes.google_scholar = change;
    } else if (section === SECTIONS.linkedin) {
      changes.linkedin = change;
    } else if (section === SECTIONS.twitter) {
      changes.twitter = change;
    } else if (section === SECTIONS.orcid) {
      const orcidId = change.split("https://orcid.org/").pop().trim();
      if (orcidId) {
        changes.orcid_id = orcidId;
      }
    }

    setEditGoogleScholar(false);
    setEditLinkedin(false);
    setEditXTwitter(false);
    setEditOrcid(false);

    await dispatch(
      AuthorActions.saveAuthorChanges({ changes, authorId: author.id })
    );
  };

  const saveName = async () => {
    const splitName = name.split(" ");
    await dispatch(
      AuthorActions.saveAuthorChanges({
        changes: {
          first_name: splitName.length > 0 ? splitName[0] : null,
          last_name: splitName.length > 1 ? splitName[1] : null,
        },
        authorId: author.id,
      })
    );
  };

  const saveDescription = async () => {
    await dispatch(
      AuthorActions.saveAuthorChanges({
        changes: {
          description,
        },
        authorId: author.id,
      })
    );
  };

  const onSocialLinkChange = (e, social) => {
    const newSocialLinks = { ...socialLinks };
    newSocialLinks[social] = e.target.value;
    setSocialLinks(newSocialLinks);
  };

  const saveProfilePicture = async (picture) => {
    let byteCharacters;
    if (picture.split(",")[0].indexOf("base64") >= 0) {
      byteCharacters = atob(picture.split(",")[1]);
    } else {
      byteCharacters = unescape(picture.split(",")[1]);
    }

    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/jpg" });

    const changes = new FormData();
    changes.append("profile_image", blob);

    const authorReturn = await dispatch(
      AuthorActions.saveAuthorChanges({
        changes,
        authorId: author.id,
        file: true,
      })
    );
    const { updateUser, user } = props;
    updateUser({ ...user, author_profile: authorReturn.payload });
    onCloseAvatarModal();
  };

  const renderSocialEdit = (social) => {
    let title = `${social} Link`;
    if (social === "google_scholar") {
      title = "Google Scholar Link";
    }
    if (social === "twitter") {
      title = "X / Twitter Link";
    }
    if (social === "orcid") {
      title = "ORCiD Link";
    }
    return (
      <div className={css(styles.socialEditContainer)}>
        <div className={css(styles.socialTitle)}>{title}</div>
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
            {<FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon>}
          </div>
        </div>
      </div>
    );
  };

  const onOpenUserInfoModal = () => {
    props.openUserInfoModal(true);
  };

  const onCloseAvatarModal = () => {
    setAvatarUploadIsOpen(false);
  };

  const openRemoveProfile = () => {
    setExtraProfileOptionsIsOpen(true);
    setIsAuthorClaimModalOpen(false);
  };

  const closeRemoveProfile = () => {
    setExtraProfileOptionsIsOpen(false);
  };

  const authorRscBalance =
    !isNullOrUndefined(author.user) &&
    !isNullOrUndefined(user) &&
    author.user === user.id ? (
      <div className={css(styles.rscBalance)}>
        <span className={css(styles.icon)}>
          <img
            src="/static/icons/coin-filled.png"
            className={css(styles.rscIcon)}
            alt="researchhub-coin-icon"
          />
        </span>
        <div className={css(styles.reputationTitle)}>{"RSC Balance:"}</div>
        <div className={css(styles.amount)}>
          {isBalanceVisible ? (
            <span className={css(styles.visibleBalance)}>
              <span>{props.user.balance}</span>
              <span
                className={css(styles.showAmount)}
                onClick={() => setIsBalanceVisible(false)}
              >
                hide
              </span>
            </span>
          ) : (
            <span className={css(styles.hiddenBalance)}>
              <span>********</span>
              <span
                className={css(styles.showAmount)}
                onClick={() => setIsBalanceVisible(true)}
              >
                show
              </span>
            </span>
          )}
        </div>
      </div>
    ) : null;

  const authorReputation = (
    <div className={css(styles.reputation)}>
      <span className={css(styles.icon)}>
        <img
          src="/static/ResearchHubIcon.png"
          className={css(styles.rhIcon)}
          alt="reserachhub-icon"
        />
      </span>
    </div>
  );

  const safeGuardURL = (url) =>
    !isNullOrUndefined(url) && !isEmpty(url) ? SafeURL(url) : null;
  const socialMediaLinkButtons = [
    {
      link: safeGuardURL(author.linkedin),
      icon: <FontAwesomeIcon icon={faLinkedin}></FontAwesomeIcon>,
      nodeRef: linkedinRef,
      dataTip: "Set LinkedIn Profile",
      onClick: () => setEditLinkedin(true),
      renderDropdown: () => editLinkedin && renderSocialEdit(SECTIONS.linkedin),
      customStyles: styles.linkedin,
      isEditing: editLinkedin,
    },
    {
      link: safeGuardURL(author.twitter),
      icon: <FontAwesomeIcon icon={faXTwitter}></FontAwesomeIcon>,
      nodeRef: xTwitterRef,
      dataTip: "Set X / Twitter Profile",
      onClick: () => setEditXTwitter(true),
      renderDropdown: () => editXTwitter && renderSocialEdit(SECTIONS.twitter),
      customStyles: styles.xTwitter,
      isEditing: editXTwitter,
    },
    {
      link: safeGuardURL(author.google_scholar),
      icon: <FontAwesomeIcon icon={faGoogleScholar}></FontAwesomeIcon>,
      nodeRef: googleScholarRef,
      dataTip: "Set Google Scholar Profile",
      onClick: () => setEditGoogleScholar(true),
      renderDropdown: () =>
        editGoogleScholar && renderSocialEdit(SECTIONS.scholar),
      customStyles: styles.googleScholar,
      isEditing: editGoogleScholar,
    },
    {
      link: safeGuardURL(
        author.orcid_id ? `https://orcid.org/${author.orcid_id}` : null
      ),
      icon: <FontAwesomeIcon icon={faOrcid}></FontAwesomeIcon>,
      nodeRef: orcidRef,
      dataTip: "Set ORCiD Profile",
      onClick: () => setEditOrcid(true),
      renderDropdown: () => editOrcid && renderSocialEdit(SECTIONS.orcid),
      customStyles: styles.orcid,
      isEditing: editOrcid,
    },
  ].map((app, i) => {
    const {
      link,
      icon,
      nodeRef,
      dataTip,
      onClick,
      renderDropdown,
      customStyles,
      isEditing,
    } = app;

    if (allowEdit) {
      return (
        <div
          className={css(
            styles.editSocial,
            !link && styles.noSocial,
            isEditing && styles.fullOpacity
          )}
          data-tip={dataTip}
          key={`social-media-${i}`}
          ref={nodeRef}
        >
          <div
            className={css(styles.socialMedia, customStyles)}
            onClick={onClick}
          >
            {icon}
          </div>
          {renderDropdown()}
        </div>
      );
    } else if (!isNullOrUndefined(link)) {
      return (
        <a
          className={css(styles.link)}
          href={link}
          key={`social-media-${i}`}
          rel="noreferrer noopener"
          target="_blank"
        >
          <span className={css(styles.socialMedia, customStyles)}>{icon}</span>
        </a>
      );
    } else {
      return (
        <div
          className={css(styles.editSocial, styles.noSocial)}
          key={`social-media-${i}`}
        >
          <span className={css(styles.socialMedia, customStyles)}>{icon}</span>
        </div>
      );
    }
  });

  const modButtons = (
    <div className={css(styles.modActions)}>
      {filterNull([
        isCurrentUserModerator && doesAuthorHaveUserAndNotMe ? (
          <div className={css(styles.adminButton)} key="banOrReinstate">
            <ModeratorDeleteButton
              actionType="user"
              containerStyle={styles.moderatorButton}
              icon={
                !fetchedUser ? (
                  " "
                ) : isAuthorUserSuspended ? (
                  <FontAwesomeIcon icon={faUserPlus}></FontAwesomeIcon>
                ) : (
                  <FontAwesomeIcon icon={faUserSlash}></FontAwesomeIcon>
                )
              }
              iconStyle={styles.moderatorIcon}
              key="user"
              labelStyle={styles.moderatorLabel}
              label={
                !fetchedUser ? (
                  <Loader loading={true} color={"#FFF"} size={15} />
                ) : isAuthorUserSuspended ? (
                  "Reinstate User"
                ) : (
                  "Ban User"
                )
              }
              metaData={{
                authorId: router.query.authorId,
                isSuspended: isAuthorUserSuspended,
                setIsSuspended: () =>
                  setAuthorUserStatus(AUTHOR_USER_STATUS.SUSPENDED),
              }}
            />
            {!isAuthorUserSuspended && (
              <ModeratorDeleteButton
                actionType="user"
                containerStyle={[styles.moderatorButton, styles.reinstateUser]}
                icon={
                  !fetchedUser ? (
                    " "
                  ) : isAuthorUserSuspended ? (
                    <FontAwesomeIcon icon={faUserPlus}></FontAwesomeIcon>
                  ) : (
                    <FontAwesomeIcon icon={faUserSlash}></FontAwesomeIcon>
                  )
                }
                iconStyle={styles.moderatorIcon}
                key="user"
                labelStyle={styles.moderatorLabel}
                label={
                  !fetchedUser ? (
                    <Loader loading={true} color={"#FFF"} size={15} />
                  ) : (
                    "Reinstate User"
                  )
                }
                metaData={{
                  authorId: router.query.authorId,
                  isSuspended: true,
                  setIsSuspended: () =>
                    setAuthorUserStatus(AUTHOR_USER_STATUS.SUSPENDED),
                }}
              />
            )}
          </div>
        ) : null,
        /* current user should not be able to ban / reinstate themselves */
        isCurrentUserModerator ? (
          <div
            className={css(styles.adminButton, styles.siftButton)}
            key="SiftButton"
          >
            <Button
              customButtonStyle={styles.editButtonCustom}
              label={() => (
                <Fragment>
                  <span style={{ marginRight: 10, userSelect: "none" }}>
                    {<FontAwesomeIcon icon={faUser}></FontAwesomeIcon>}
                  </span>
                  Sift Profile
                </Fragment>
              )}
              onClick={() => window.open(props.author.sift_link, "_blank")}
              rippleClass={styles.rippleClass}
            />
          </div>
        ) : null,
      ])}
    </div>
  );

  const editProfileBtn = (
    <div>
      {allowEdit ? (
        <div className={css(styles.editProfileButton)} key="editButton">
          <span onClick={onOpenUserInfoModal}>
            {<FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>}
          </span>
        </div>
      ) : null}
    </div>
  );

  const userLinks = (
    <div className={css(styles.socialLinks)}>{socialMediaLinkButtons}</div>
  );

  const authorEducationSummary = useMemo(
    () =>
      author?.education?.length ? (
        <div className={css(styles.educationSummaryContainer) + " clamp2"}>
          <div className={css(styles.educationSummary) + " clamp2"}>
            <span className={css(styles.icon)}>
              {<FontAwesomeIcon icon={faGraduationCap}></FontAwesomeIcon>}
            </span>
            {createEduSummary(author)}
          </div>
        </div>
      ) : null,
    [author]
  );

  const authorDescription = (
    <div
      className={css(
        styles.description,
        styles.editButtonContainer,
        !author.description && styles.defaultDescription
      )}
    >
      {description && (
        <span property="description">
          {description
            ? description
            : `${name} hasn't added a description yet.`}
        </span>
      )}
      {allowEdit && !description && (
        <span
          className={css(styles.addDescriptionText)}
          onClick={onOpenUserInfoModal}
        >
          Add description
        </span>
      )}
    </div>
  );

  const authorIsEditorOf = (author?.is_hub_editor_of ?? []).map((hub, i) => {
    const { name, slug } = hub;
    const sluggedName = buildSlug(hub.slug ?? "");
    return (
      <Link
        key={`hub-${i}`}
        href={"/hubs/[slug]"}
        as={`/hubs/${slug}`}
        className={css(styles.hubLinkTag)}
      >
        {i > 0 && ", "}
        {name}
      </Link>
    );
  });

  const shouldSeeSuspensionBanner =
    (currentUser?.moderator && author?.suspended_status) ||
    (currentUser?.editorOf && author?.suspended_status) ||
    author?.suspended_status?.is_suspended;

  return (
    <div
      className={css(styles.profilePageRoot)}
      vocab="https://schema.org/"
      typeof="Person"
    >
      {shouldSeeSuspensionBanner && (
        <UserStateBanner
          probable_spammer={author.suspended_status?.probable_spammer}
          is_suspended={author.suspended_status?.is_suspended}
        />
      )}
      <Head
        title={`${name} on ResearchHub`}
        description={`View contributions by ${name} on ResearchHub`}
      />
      <ReactTooltip />
      <ComponentWrapper>
        <UserInfoModal />
        <ReactPlaceholder
          ready={fetchedUser}
          showLoadingAnimation
          customPlaceholder={<AuthorDetailsPlaceholder />}
        >
          <div className={css(styles.profileHeader)}>
            <div className={css(styles.profileContainer)}>
              <div
                className={css(
                  styles.avatarContainer,
                  author.profile_image && styles.border
                )}
              >
                <div
                  className={css(styles.avatarContainer)}
                  onClick={allowEdit ? onOpenUserInfoModal : silentEmptyFnc}
                  onMouseEnter={() => onMouseEnter(SECTIONS.picture)}
                  onMouseLeave={() => onMouseLeave(SECTIONS.picture)}
                  draggable={false}
                >
                  <AuthorAvatar author={author} disableLink={true} size={120} />
                  <meta
                    property="image"
                    content={
                      author.profile_image
                        ? author.profile_image
                        : "author avatar"
                    }
                  />
                  {allowEdit && hoverProfilePicture && (
                    <div className={css(styles.profilePictureHover)}>
                      Update
                    </div>
                  )}
                </div>
              </div>
              <div className={css(styles.profileInfo)}>
                <div className={css(styles.nameLine)}>
                  <h1
                    className={css(
                      styles.authorName,
                      styles.editButtonContainer
                    )}
                    property="name"
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        columnGap: "5px",
                      }}
                    >
                      {name}
                      {author.is_verified && (
                        <VerifiedBadge height={24} width={24} />
                      )}
                    </div>
                    {editProfileBtn}
                  </h1>
                  <div className={css(styles.headline)}>
                    {author?.headline?.title}
                  </div>
                  {doesAuthorHaveUser && (
                    <div className={css(styles.reputationContainer)}>
                      {!isEmpty(authorIsEditorOf) && (
                        <div className={css(styles.reputationContainer)}>
                          <div className={css(styles.editorLabelWrap)}>
                            <img
                              height={17}
                              src="/static/user/editor-star.png"
                              width={17}
                              className={css(styles.editorImg)}
                            />
                            <span
                              style={{
                                fontWeight: 400,
                                marginLeft: 8,
                                marginRight: 10,
                                fontSize: 14,
                              }}
                            >
                              {"Editor of:"}
                            </span>
                            {authorIsEditorOf}
                          </div>
                        </div>
                      )}
                      {authorEducationSummary}
                      {authorReputation}
                      {authorRscBalance}
                    </div>
                  )}
                </div>
                {doesAuthorHaveUser && authorDescription}
              </div>
            </div>
            <div>
              {userLinks}
              {!author.user && (
                <div className={css(styles.modActions, styles.requestToRemove)}>
                  <Button
                    customButtonStyle={styles.editButtonCustom}
                    isWhite
                    onClick={() => setIsAuthorClaimModalOpen(true)}
                  >
                    Claim Profile
                  </Button>
                </div>
              )}
              {modButtons}
            </div>
          </div>
        </ReactPlaceholder>
      </ComponentWrapper>
      <div className={css(styles.tabMenuContainer)}>
        <ComponentWrapper overrideStyle={styles.componentWrapper}>
          <HorizontalTabBar
            id="tabBarForSearch"
            tabs={tabs}
            showBorderBottom={false}
            onClick={handleTabClick}
            containerStyle={styles.tabContainer}
            dragging={true}
            alignCenter={false}
            showArrowsOnWidth={breakpoints.xsmall.int}
            showArrows={Boolean(tabs.length > 2)}
          />
        </ComponentWrapper>
      </div>
      <AuthorClaimModal
        auth={auth}
        authors={[{ firstName: author.first_name, lastName: author.last_name }]}
        isOpen={isAuthorClaimModalOpen}
        setIsOpen={(isOpen) => setIsAuthorClaimModalOpen(isOpen)}
        removeProfileClick={() => openRemoveProfile()}
      />
      <div className={css(styles.contentContainer)}>{tabContents}</div>
      <AvatarUpload
        isOpen={avatarUploadIsOpen}
        closeModal={onCloseAvatarModal}
        saveButton={renderSaveButton}
        section={SECTIONS.picture}
      />
    </div>
  );
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

const fetchAuthor = ({ authorId }) => {
  return fetch(API.AUTHOR({ authorId }), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export async function getStaticProps(ctx) {
  const { authorId } = ctx.params;

  let fetchedAuthor = {};
  try {
    fetchedAuthor = await fetchAuthor({ authorId });
  } catch (error) {
    captureEvent({
      error,
      msg: "Failed to fetch author in author profile",
      data: { authorId, ctx },
    });
  }

  if (fetchedAuthor?.merged_with) {
    return {
      redirect: {
        destination: `/user/${fetchedAuthor?.merged_with}/overview`,
        permanent: true,
      },
    };
  }

  return {
    props: {
      fetchedAuthor,
    },
    revalidate: 600,
  };
}

const styles = StyleSheet.create({
  profilePageRoot: {
    background: "#FFF",
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      maxWidth: breakpoints.xxsmall.str,
    },
  },
  showAmount: {
    textDecoration: "underline",
    marginLeft: 5,
    cursor: "pointer",
    ":hover": {
      color: colors.BLUE(),
    },
  },
  downloadAsCSV: {
    marginBottom: 16,
    marginLeft: "auto",
  },
  tabMenuContainer: {
    // borderBottom: `1px solid ${colors.BLACK(0.1)}`,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      marginTop: 30,
    },
  },
  tabContainer: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-start",
    borderBottom: 0,
    flex: 1,
  },
  contentContainer: {
    padding: "30px 0px",
    margin: "auto",
    background: "#FAFAFA",
    minHeight: "55vh",
  },
  profileHeader: {
    padding: "30px 0",
    display: "flex",
    justifyContent: "space-between",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "block",
    },
  },
  profileContainer: {
    display: "flex",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
  },
  componentWrapper: {
    display: "flex",
    alignItems: "center",
  },
  requestToRemove: {
    marginTop: 16,
  },
  componentWrapperOverride: {
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      paddingLeft: 10,
      paddingRight: 10,
    },
  },
  profileInfo: {
    width: "100%",
    marginLeft: 30,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      margin: 0,
    },
  },
  headline: {
    fontSize: 16,
    marginBottom: 10,
  },
  modActions: {
    display: "flex",
    flexDirection: "column",
    alignItems: "end",

    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      marginLeft: "unset",
      flexDirection: "row",
    },
  },
  moderatorButton: {
    marginTop: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 400,
    fontSize: 16,
    height: 35,
    width: 175,
    background: colors.RED(0.9),
    color: "#FFF",
    border: `1px solid ${colors.RED()}`,
    borderRadius: 5,
    cursor: "pointer",
    highlight: "none",
    outline: "none",
    border: "none",
    userSelect: "none",
    ":hover": {
      color: "#FFF",
      background: colors.RED(1),
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: "100%",
    },
  },
  reinstateUser: {
    marginTop: 16,
    background: colors.DARK_GREEN(0.9),
    ":hover": {
      color: "#FFF",
      background: colors.DARK_GREEN(1),
    },
  },
  editorImg: {
    verticalAlign: "-3px",
  },
  hubLinkTag: {
    textDecoration: "unset",
    cursor: "pointer",
    color: "unset",
    textDecoration: "underline",
    fontWeight: 500,
    fontSize: 14,
    textTransform: "capitalize",
    ":hover": {
      color: colors.BLUE(),
    },
  },
  moderatorIcon: {
    color: "inherit",
    marginRight: 8,
  },
  moderatorLabel: {
    fontWeight: 400,
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 12,
    },
  },
  socialLinks: {
    display: "flex",
    position: "relative",
    justifyContent: "flex-end",
    width: "max-content",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      marginTop: 10,
    },
  },
  authorName: {
    fontWeight: 500,
    fontSize: 30,
    textTransform: "capitalize",
    padding: 0,
    margin: 0,
    marginBottom: 5,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 24,
      paddingRight: 0,
      justifyContent: "center",
      textAlign: "center",
    },
  },
  plusButton: {
    marginLeft: 10,
    fontSize: 20,
    cursor: "pointer",
    color: colors.BLACK(0.4),
    ":hover": {
      color: colors.NEW_BLUE(),
    },
  },
  nameLine: {
    display: "flex",
    alignItems: "start",
    justifyContent: "space-between",
    flexDirection: "column",
    width: "100%",
    "@media only screen and (max-width: 768px)": {
      flexDirection: "column",
      justifyContent: "flex-start",
      marginTop: 15,
      marginBottom: 0,
      alignItems: "start",
    },
  },
  educationSummaryContainer: {
    display: "flex",
    marginRight: 15,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "block",
      marginBottom: 5,
    },
  },
  educationSummary: {
    fontSize: 14,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      justifyContent: "initial",
    },
    "@media only screen and (max-width: 415px)": {
      marginTop: 10,
      fontSize: 14,
    },
  },
  description: {
    marginTop: 25,
    justifyContent: "center",
    flexDirection: "column",
    width: "100%",
    color: "#241F3A",
    lineHeight: 1.5,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      textAlign: "left",
    },
    "@media only screen and (max-width: 440px)": {
      justifyContent: "flex-start",
      fontSize: 14,
    },
  },
  defaultDescription: {
    fontStyle: "italic",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    marginLeft: "auto",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      marginLeft: 0,
      width: "70%",
      alignItems: "center",
    },
  },
  socialMedia: {
    width: 35,
    height: 35,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#fff",
    marginLeft: 5,
    marginRight: 5,
    textDecorations: "none",
    boxShadow: "0px 2px 4px rgba(185, 185, 185, 0.25)",
  },
  linkedin: {
    background: "#0077B5",
  },
  xTwitter: {
    background: "black",
  },
  googleScholar: {
    background: "#4285F4",
  },
  orcid: {
    background: "#A6CE39",
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
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
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
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
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
    padding: "24px 20px 24px 20px",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      padding: 20,
    },
  },
  title: {
    marginBottom: 0,
    textTransform: "capitalize",
    borderBottom: `1px solid ${genericCardColors.BORDER}`,
    paddingBottom: 10,
    color: colors.BLACK(0.5),
    fontWeight: 500,
    fontSize: 16,
    marginTop: 0,
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
    right: "0",
    background: "#fff",
    boxShadow: "0 5px 10px 0 #ddd",
    padding: 10,
    borderRadius: 8,
    zIndex: 2,
  },
  editSocial: {
    position: "relative",
    ":hover": {
      borderRadius: "50%",
    },
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
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      height: "min-content",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "start",
    },
  },
  border: {},
  profilePictureHover: {
    width: 120,
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
    display: "block",
    alignItems: "center",
    width: "100%",
    color: "#7C7989",
    lineHeight: "26px",
    flexWrap: "wrap",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      justifyContent: "center",
      display: "block",
      // lineHeight: "16px",
    },
    "@media only screen and (max-width: 440px)": {
      flexDirection: "column",
      alignItems: "flex-start",
    },
  },
  reputation: {
    display: "flex",
    alignItems: "center",
    marginRight: 15,
    fontSize: 14,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      justifyContent: "initial",
      // marginBottom: 5,
    },
  },
  reputationTitle: {
    marginRight: 10,
    fontWeight: 400,
    fontSize: 14,
    "@media only screen and (max-width: 415px)": {},
  },
  rscBalance: {
    display: "flex",
    alignItems: "center",
    fontWeight: 400,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      justifyContent: "initial",
      fontSize: 14,
    },
  },
  amount: {
    fontWeight: 400,
    fontSize: 14,
    display: "flex",
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
  icon: {
    width: 20,
    marginRight: 5,
    display: "block",
    alignItems: "center",
    color: "rgba(36, 31, 58, 0.25)",
  },
  rhIcon: {
    width: 13,
    paddingLeft: 1.5,
    verticalAlign: "-3px",
  },
  rscIcon: {
    width: 18,
    verticalAlign: "-3px",
  },
  hidden: {
    visibility: "hidden",
    height: 0,
    overflow: "hidden",
    zIndex: -10,
  },
  reveal: {
    display: "flex",
    zIndex: 1,
    width: "100%",
    justifyContent: "center",
    flexDirection: "column",
    marginTop: 16,
  },
  supportButton: {
    marginBottom: 20,
    marginRight: 10,
  },
  row: {
    display: "flex",
  },
  editProfileButton: {
    color: colors.BLUE(1),
    fontSize: 24,
    marginLeft: 12,
    cursor: "pointer",
    display: "inline",
    verticalAlign: "1px",
  },
  adminButton: {
    display: "block",
    marginTop: 16,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      marginTop: 0,
      marginRight: 10,
    },
  },
  siftButton: {
    borderRadius: 4,
  },
  editButtonCustom: {
    height: 35,
    width: 175,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      height: 35,
      minHeight: 35,
    },
    [`@media only screen and (max-width: 415px)`]: {
      height: 35,
      minHeight: 35,
    },
  },
  siftCustom: {
    background: colors.NEW_BLUE(1),
  },
  rippleClass: {
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: "100%",
    },
  },
  mobileEditButtonCustom: {},
  editProfileWrapper: {
    marginTop: 15,
  },
  btnDots: {
    fontSize: 22,
    borderRadius: "30px",
    color: colors.BLACK(1.0),
    background: colors.LIGHTER_GREY(),
    border: `1px solid ${colors.LIGHTER_GREY()}`,
    padding: "6px 8px",
    ":hover": {
      background: colors.DARKER_GREY(0.2),
      transition: "0.2s",
    },
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
  openUserInfoModal: ModalActions.openUserInfoModal,
  openAuthorSupportModal: ModalActions.openAuthorSupportModal,
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthorPage);
