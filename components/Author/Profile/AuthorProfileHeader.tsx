import AuthorHeaderKeyStats from "~/components/Author/Profile/AuthorHeaderKeyStats";
import AuthorInstitutions from "~/components/Author/Profile/AuthorInstitutions";
import AuthorHeaderAchievements from "~/components/Author/Profile/AuthorHeaderAchievements";
import AuthorHeaderExpertise from "~/components/Author/Profile/AuthorHeaderExpertise";
import AuthorSocialMediaIcons from "~/components/Author/Profile/AuthorSocialMediaIcons";
import Avatar from "@mui/material/Avatar";
import { isEmpty } from "~/config/utils/nullchecks";
import { css, StyleSheet } from "aphrodite";
import { FullAuthorProfile, parseFullAuthorProfile } from "../lib/types";
import Pill from "~/components/shared/Pill";
import colors from "~/config/themes/colors";
import { Tooltip } from "@mui/material";
import PendingBadge from "~/components/shared/PendingBadge";
import { authorProfileContext } from "../lib/AuthorProfileContext";
import WelcomeToProfileBanner from "./WelcomeToProfileBanner";
import UserInfoModal from "~/components/Modals/UserInfoModal";
import { useDispatch } from "react-redux";
import { ModalActions } from "~/redux/modals";
import { useEffect, useState } from "react";
import { AuthorActions } from "~/redux/author";
import { fetchAuthorProfile } from "../lib/api";
import useCacheControl from "~/config/hooks/useCacheControl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard, faBirthdayCake, faBuildingColumns, faEdit, faUserSlash, faUserXmark } from "@fortawesome/pro-solid-svg-icons";
import { truncateText } from "~/config/utils/string";
import useCurrentUser from "~/config/hooks/useCurrentUser";
import GenericMenu, { MenuOption } from "~/components/shared/GenericMenu";
import IconButton from "~/components/Icons/IconButton";
import {
  faEllipsis,
} from "@fortawesome/pro-regular-svg-icons";
import VerifiedBadge from "~/components/Verification/VerifiedBadge";
import ModeratorDeleteButton from "~/components/Moderator/ModeratorDeleteButton";
import { faUser, faUserPlus } from "@fortawesome/pro-light-svg-icons";
import UserStateBanner from "~/components/Banner/UserStateBanner";
import { breakpoints } from "~/config/themes/screen";
import { fetchUserDetails } from "~/components/Moderator/lib/api";
import { parseUserDetailsForModerator, UserDetailsForModerator } from "~/components/Moderator/lib/types";
import { formatDateStandard, specificTimeSince } from "~/config/utils/dates";

const AuthorProfileHeader = () => {
  const dispatch = useDispatch();
  const { fullAuthorProfile: profile, setFullAuthorProfile, summaryStats, achievements } =
    authorProfileContext();

  const { revalidateAuthorProfile } = useCacheControl();
  const currentUser = useCurrentUser();


  const [userDetailsForModerator, setUserDetailsForModerator] = useState<UserDetailsForModerator | null>(null);
  const [fetchedUserDetailsForModerator, setFetchedUserDetailsForModerator] = useState<boolean>(false);

  useEffect(() => {
    (async() => {
      if (currentUser?.moderator && profile.user?.id && !fetchedUserDetailsForModerator) {

        const res = await fetchUserDetails({ userId: profile.user?.id });
        const userDetailsForModerator = parseUserDetailsForModerator(res);
        setUserDetailsForModerator(userDetailsForModerator);
        setFetchedUserDetailsForModerator(true);
      }
    })();
  }, [profile, currentUser, fetchedUserDetailsForModerator]);

  const authorMenuOptions: MenuOption[] = [
    ...(currentUser?.moderator ? [{
      label: "Sift profile",
      icon: <FontAwesomeIcon icon={faUser} />,
      value: "sift-profile",
      onClick: () => {
        window.open(profile.user?.siftUrl, "_blank")
      },
    }] : []),
    ...(currentUser?.authorProfile?.id === profile.id ? [{
      label: "Edit profile",
      icon: <FontAwesomeIcon icon={faEdit} />,
      value: "edit",
      onClick: () => {
        dispatch(ModalActions.openUserInfoModal(true))
      },
    }] : []),
    ...((currentUser?.moderator && !profile.user?.isSuspended) ? [{
      html: (
        <ModeratorDeleteButton
          actionType="user"
          isModerator={true}
          containerStyle={styles.moderatorButton}
          icon={
            <FontAwesomeIcon icon={faUserSlash} />
          }
          iconStyle={styles.moderatorIcon}
          labelStyle={styles.moderatorLabel}
          label="Ban User"
          metaData={{
            authorId: profile.id as string,
            isSuspended: profile.user?.isSuspended,
          }}
        />
      ),
      value: "ban",
    }] : []),
    ...((currentUser?.moderator && (profile.user?.isSuspended || profile.user?.isProbableSpammer)) ? [{
      html: (
        <ModeratorDeleteButton
        actionType="user"
        containerStyle={styles.moderatorButton}
        icon={<FontAwesomeIcon icon={faUserPlus}></FontAwesomeIcon>}
        iconStyle={styles.moderatorIcon}
        key="user"
        labelStyle={styles.moderatorLabel}
        label={"Reinstate User"}
        metaData={{
          authorId: profile.id as string,
          isSuspended: true,
        }}
      />),
      value: "reinstate",
    }] : []),    
  ];

  const getExpertiseTooltipContent = () => {
    return (
      <div className={css(styles.expertiseContent)}>
        <div className={css(styles.expertiseContentBody)}>
          The expertise shown below is only an estimate because the author has
          not yet verified the publications in their profile.
        </div>
      </div>
    );
  };

  const onProfileSave = async () => {
    const updatedProfile = await fetchAuthorProfile({
      authorId: profile.id as string,
    });
    const parsedUpdatedProfile = parseFullAuthorProfile(updatedProfile);

    setFullAuthorProfile(parsedUpdatedProfile);
    revalidateAuthorProfile(profile.id);
};

  
  const [isShowingAll, setIsShowingAll] = useState(false);
  const [isShowingFullDescription, setIsShowingFullDescription] = useState(false);
  const visibleInstitutions = isShowingAll ? profile.education : profile.education.slice(0, 1);
  const truncatedDescription = truncateText(profile.description, 300);
  const hasEducation = profile.education.length > 0 || profile.institutions.length > 0;
  
  useEffect(() => {
    (async () => {
      // This is necessary in order to have author data appear in the "edit profile" modal
      await dispatch(AuthorActions.getAuthor({ authorId: profile.id }));
    })();
  }, []);

  return (
    <div>
      {userDetailsForModerator && (
        <UserStateBanner
          probable_spammer={userDetailsForModerator?.isProbableSpammer}
          is_suspended={userDetailsForModerator?.isSuspended}
        />
      )}
      <UserInfoModal onSave={onProfileSave} />
      <div className={css(styles.bannerSection)}>
        <WelcomeToProfileBanner profile={profile} />
      </div>
      <div className={css(styles.bioSection, styles.section)}>
        <Avatar
          src={profile.profileImage}
          sx={{ width: 128, height: 128, fontSize: 48 }}
        >
          {isEmpty(profile.profileImage) &&
            profile.firstName?.[0] + profile.lastName?.[0]}
        </Avatar>
        <div className={css(styles.lineItems)}>
          <div className={css(styles.name)}>
            {profile.firstName} {profile.lastName}
            {profile.user?.isVerified && (
              <VerifiedBadge height={32} width={32} />
            )}
          </div>
          <div className={css(styles.headline)}>{profile.headline}</div>
          {hasEducation && (
            <div className={css(styles.inlineLineItem, styles.bioLineItem)}>
              <div className={css(styles.label)}>
                <FontAwesomeIcon icon={faBuildingColumns} fontSize={18} />
              </div>

              {profile.education.length === 0 ? (
                <>
                  {/* Kobe 07-27-24: Temporarily disabling rendering of new institutions */}
                  <AuthorInstitutions institutions={profile.institutions} />
                </>
              ): (
                <>
                {visibleInstitutions.map((edu, index) => (
                  <div>
                    {edu.summary} {index < visibleInstitutions.length - 1 ? ", " : ""}
                  </div>
                ))}
                {profile.education.length > 1 && (
                  <div className={css(styles.showMore)} onClick={() => setIsShowingAll(!isShowingAll)}>
                    {isShowingAll ? "Show less" : `+ ${profile.education.length - visibleInstitutions.length} more`}
                  </div>
                )}
                </>
              )}

            </div>
          )}
          {profile.user?.createdDate && (
            <div className={css(styles.inlineLineItem, styles.bioLineItem)} style={{ marginTop: 2, }}>
              <div className={css(styles.label)}>
                <FontAwesomeIcon icon={faBirthdayCake} fontSize={18} />
              </div>
              <div>Member for {specificTimeSince(profile.user.createdDate)}</div>
            </div>

          )}

          {(profile?.description?.length || 0) > 0 && (
            <div className={css(styles.inlineLineItem, styles.descriptionLineItem)}>
              <div className={css(styles.description)}>
                {isShowingFullDescription ? profile.description: truncatedDescription}
                {(truncatedDescription.length < (profile?.description?.length || 0)) && (
                  <div className={css(styles.showMore)} style={{ marginTop: 3, }} onClick={() => setIsShowingFullDescription(!isShowingFullDescription)}>
                    {isShowingFullDescription ? "Show less" : `Show more`}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className={css(styles.authorSocialMedia)}>
            <AuthorSocialMediaIcons profile={profile} />
          </div>


          {(currentUser?.authorProfile?.id === profile.id || currentUser?.moderator) && (
            <div className={css(styles.textBtn, styles.editProfileBtn)}>
              <GenericMenu
                softHide={true}
                options={authorMenuOptions}
                width={200}
                id="edit-profile-menu"
                direction="bottom-right"
              >
                <IconButton overrideStyle={styles.btnDots}>
                  <FontAwesomeIcon icon={faEllipsis} />
                </IconButton>
              </GenericMenu>
            </div>
          )}
        </div>
      </div>

      {currentUser?.moderator && (
        <div className={css(styles.section, styles.modSection)}>
          <div className={css(styles.sectionHeader)}>
            Moderation
          </div>
          <div className={css(styles.lineItemColumns)}>
            <div className={css(styles.lineItems)}>
              <div className={css(styles.inlineLineItem)}>
                <div className={css(styles.label)}>
                  Email:
                </div>
                <div>
                  {userDetailsForModerator?.email ? userDetailsForModerator?.email : "N/A"}
                </div>
              </div>
              <div className={css(styles.inlineLineItem)}>
                <div className={css(styles.label)}>
                  User id:
                </div>
                <div>
                  {userDetailsForModerator?.id ? userDetailsForModerator?.id : "N/A"}
                </div>
              </div>          
              <div className={css(styles.inlineLineItem)}>
                <div className={css(styles.label)}>
                  Likely spammer?
                </div>
                <div>
                  {userDetailsForModerator?.isProbableSpammer ? "Yes" : "No"}
                </div>
              </div>
              <div className={css(styles.inlineLineItem)}>
                <div className={css(styles.label)}>
                  Suspended?
                </div>
                <div>
                  {userDetailsForModerator?.isSuspended ? "Yes" : "No"}
                </div>
              </div>
              <div className={css(styles.inlineLineItem)}>
                <div className={css(styles.label)}>
                  Sift risk score:
                </div>
                <div>
                  {userDetailsForModerator?.riskScore ? userDetailsForModerator?.riskScore : "N/A"}
                </div>
              </div>            
            </div>

            <div className={css(styles.lineItems)}>
              <div className={css(styles.inlineLineItem)}>
                <div className={css(styles.label)}>
                  Verified name:
                </div>
                <div>
                  {userDetailsForModerator?.verification ? `${userDetailsForModerator?.verification?.firstName} ${userDetailsForModerator?.verification?.lastName}` : "N/A"}
                </div>
              </div>            
              <div className={css(styles.inlineLineItem)}>
                <div className={css(styles.label)}>
                  Verification via:
                </div>
                <div>
                  {userDetailsForModerator?.verification 
                  ? `${userDetailsForModerator?.verification?.verifiedVia} on ${formatDateStandard(userDetailsForModerator?.verification?.createdDate, "MMM D, YYYY")}`
                  : "N/A"}
                </div>
              </div>
              <div className={css(styles.inlineLineItem)}>
                <div className={css(styles.label)}>
                  Verification ID:
                </div>
                <div>
                  {userDetailsForModerator?.verification?.externalId ? userDetailsForModerator?.verification?.externalId : "N/A"}
                </div>
              </div>
              <div className={css(styles.inlineLineItem)}>
                <div className={css(styles.label)}>
                  Verified status:
                </div>
                <div>
                  {userDetailsForModerator?.verification?.status ? userDetailsForModerator?.verification?.status : "N/A"}
                </div>
              </div>            
            </div>

          </div>
        </div>
      )}

      <div className={css(styles.subSections)}>
        <div className={css(styles.section, styles.subSection)}>
          <div className={css(styles.sectionHeader)}>
            Achievements
            {/* FIXME: Uncomment once working */}
            {/* <Pill text={String(profile.achievements.length)} /> */}
          </div>
          <AuthorHeaderAchievements summaryStats={summaryStats} achievements={achievements} />
        </div>

        <div className={css(styles.section, styles.subSection)}>
          <div className={css(styles.sectionHeader)}>Key Stats</div>
          <AuthorHeaderKeyStats summaryStats={summaryStats} profile={profile} />
        </div>

        <div
          className={css(
            styles.section,
            styles.subSection,
            styles.repSubsection,
            !profile.hasVerifiedPublications &&
              styles.expertiseSectionUnverified
          )}
        >
          <div className={css(styles.sectionHeader)}>
            <div>
              {profile.hasVerifiedPublications && (
                <div className={css(styles.expertiseHeader)}>Reputation</div>
              )}
              {!profile.hasVerifiedPublications && (
                <Tooltip
                  title={getExpertiseTooltipContent()}
                  componentsProps={{
                    tooltip: {
                      sx: {
                        fontSize: 14,
                        bgcolor: colors.YELLOW2(),
                      },
                    },
                  }}
                >
                  <div
                    className={css(
                      styles.expertiseHeader,
                      styles.expertiseHeaderPending
                    )}
                  >
                    Reputation
                    <PendingBadge />
                  </div>
                </Tooltip>
              )}
            </div>
          </div>
          <AuthorHeaderExpertise profile={profile} />
        </div>
      </div>
    </div>
  );
};
const styles = StyleSheet.create({
  moderatorButton: {
    width: "100%",
  },
  moderatorLabel: {
    color: colors.RED(),
  },
  moderatorIcon: {
    width: 30,
  },
  moreOptionsBtn: {
    border: "none",
    color: colors.BLACK(0.6),
    ":hover": {
      background: colors.NEW_BLUE(0.1),
      color: colors.NEW_BLUE(1),
      transition: "0.3s",
    },
  },  
  btnDots: {
    fontSize: 22,
    borderRadius: "50px",
    color: colors.BLACK(1.0),
    background: colors.LIGHTER_GREY(),
    border: `1px solid ${colors.LIGHTER_GREY()}`,
    padding: "6px 12px",
    ":hover": {
      background: colors.DARKER_GREY(0.2),
      transition: "0.2s",
    },
  },  
  showMore: {
    color: colors.NEW_BLUE(),
    cursor: "pointer",
    marginTop: 1,
    fontSize: 14,
    ":hover": {
      textDecoration: "underline",
    }
  },  
  lineItemColumns: {
    display: "flex",
    flexDirection: "row",
    gap: 40,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      flexDirection: "column",
      gap: 5,
    }
  },
  lineItems: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  bioLineItem: {
    fontSize: 15,
  },
  inlineLineItem: {
    display: "flex",
    columnGap: "10px",
    color: colors.BLACK(0.9),
    alignItems: "flex-start",
    lineHeight: 1.25,
    flexWrap: "wrap",
    [`@media only screen and (max-width: ${breakpoints.desktop.str})`]: {
      flexWrap: "nowrap",
    }
  },
  label: {
    fontWeight: 500,
    color: colors.BLACK(1.0),
  },
  description: {
    display: "inline-flex",
    flexWrap: "wrap",
    fontSize: 15,
  },
  descriptionLineItem: {
    marginTop: 10,
  },
  textBtn: {
    cursor: "pointer",
    color: colors.NEW_BLUE(),
  },
  editProfileBtn: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  repSubsection: {
    display: "flex",
    flexDirection: "column",
    height: 230,
    boxSizing: "border-box",
    [`@media only screen and (max-width: ${breakpoints.desktop.str})`]: {
      width: "100%",
      flex: "0 0 100%",
    }
  },
  sectionHeader: {
    color: "rgb(139, 137, 148, 1)",
    textTransform: "uppercase",
    fontWeight: 500,
    letterSpacing: "1.2px",
    fontSize: 12,
    display: "flex",
    alignItems: "center",
    gap: 5,
    marginBottom: 20,
    justifyContent: "space-between",
  },
  expertiseHeader: {
    columnGap: "5px",
    display: "flex",
    alignItems: "center",
  },
  expertiseHeaderPending: {
    cursor: "pointer",
  },
  expertiseContentWrapper: {},
  expertiseContent: {},
  expertiseContentTitle: {
    fontSize: 16,
    fontWeight: 500,
    marginBottom: 5,
  },
  expertiseContentBody: {
    fontSize: 14,
  },
  expertiseSectionUnverified: {
    border: `1px solid ${colors.YELLOW2()}`,
    backgroundColor: "rgb(255, 252, 241)",
  },
  repScore: {
    fontWeight: 500,
    fontSize: 15,
    color: colors.BLACK(),
  },
  bannerSection: {
    marginTop: 20,
  },
  authorSocialMedia: {
    marginTop: 10,
  },
  headline: {
    fontSize: 18,
    marginBottom: 10,
    color: colors.BLACK(0.9),
  },
  institutions: {
    marginTop: 10,
  },
  profilePage: {
    width: "1000px",
    margin: "0 auto",
  },
  bioSection: {
    columnGap: "20px",
    display: "flex",
    marginTop: 20,
    position: "relative",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      flexDirection: "column",
      rowGap: 20,
    }
  },
  modSection: {
    marginTop: 20,
    fontSize: 14,
  },  
  section: {
    backgroundColor: "rgb(255, 255, 255)",
    borderRadius: 20,
    border: "1px solid #F5F5F9",
    padding: 20,
  },
  subSections: {
    display: "flex",
    gap: 20,
    marginTop: 20,
    [`@media only screen and (max-width: ${breakpoints.desktop.str})`]: {
      boxSizing: "border-box",
      flexWrap: "wrap",
    },    
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      flexDirection: "column",
    }
  },
  subSection: {
    height: 230,
    width: "33%",
    display: "flex",
    boxSizing: "border-box",
    flexDirection: "column",
    justifyContent: "space-between",
    [`@media only screen and (max-width: ${breakpoints.desktop.str})`]: {
      width: "50%",
      flex: 1,
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: "100%",
      height: "auto",
    }
  },
  name: {
    fontSize: 26,
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: 10
  },
});

export default AuthorProfileHeader;
