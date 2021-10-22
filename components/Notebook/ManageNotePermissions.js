import { useState, useEffect } from "react";
import FormInput from "~/components/Form/FormInput";
import Button from "~/components/Form/Button";
import { StyleSheet, css } from "aphrodite";
import {
  fetchNotePermissions,
  updateNoteUserPermissions,
  removeUserPermissionsFromNote,
  removeInvitedUserFromNote,
  inviteUserToNote,
  fetchInvitedNoteUsers,
} from "~/config/fetch";
import { connect } from "react-redux";
import { MessageActions } from "~/redux/message";
import AuthorAvatar from "~/components/AuthorAvatar";
import { isNullOrUndefined } from "~/config/utils/nullchecks";
import Loader from "~/components/Loader/Loader";
import OrgAvatar from "~/components/Org/OrgAvatar";
import colors, { iconColors } from "~/config/themes/colors";
import DropdownButton from "~/components/Form/DropdownButton";
import { captureError } from "~/config/utils/error";

const ManageNotePermissions = ({
  currentUser,
  noteId,
  org = null,
  setMessage,
  showMessage,
}) => {
  const dropdownOpts = [
    {
      title: "Admin",
      description: "Can edit and share with others.",
      value: "ADMIN",
    },
    {
      title: "Editor",
      description: "Can edit but not share with others.",
      value: "EDITOR",
    },
    {
      title: "Viewer",
      description: "Cannot edit or share.",
      value: "VIEWER",
    },
    {
      title: "Remove",
      titleStyle: styles.deleteOpt,
      value: "REMOVE",
    },
  ];

  const [userToBeInvitedEmail, setUserToBeInvitedEmail] = useState("");
  const [userToBeInvitedPerm, setUserToBeInvitedPerm] = useState("EDITOR");
  const [isUserToBeInvitedPermDdownOpen, setIsUserToBeInvitedPermDdownOpen] =
    useState(false);

  const [noteAccessList, setNoteAccessList] = useState([]);
  const [invitedUsersList, setInvitedUsersList] = useState([]);
  const [needsFetch, setNeedsFetch] = useState(true);
  const [needsInvitedFetch, setNeedsInvitedFetch] = useState(true);
  const [isInviteInProgress, setIsInviteInProgress] = useState(false);
  const [statusDropdownOpenForEntity, setStatusDropdownOpenForEntity] =
    useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [_currentUser, _setCurrentUser] = useState(null);
  const [currentOrg, setCurrentOrg] = useState(org);

  useEffect(() => {
    const _fetchNotePermissions = async () => {
      try {
        const noteAccessList = await fetchNotePermissions({ noteId });
        setNoteAccessList(noteAccessList);
        setIsAdmin(isCurrentUserNoteAdmin(currentUser, noteAccessList));
      } catch (error) {
        captureError({
          error,
          msg: "Failed to fetch note permissions",
          data: { noteId, org, userId: _currentUser?.id },
        });
        setMessage("Unexpected error");
        showMessage({ show: true, error: true });
      }

      setNeedsFetch(false);
    };

    if (needsFetch && _currentUser && noteId) {
      _fetchNotePermissions();
    }
  }, [needsFetch, _currentUser, noteId]);

  useEffect(() => {
    const _fetchInvitedNoteUsers = async () => {
      try {
        const invitedList = await fetchInvitedNoteUsers({ noteId });

        setInvitedUsersList(invitedList);
      } catch (error) {
        captureError({
          error,
          msg: "Failed to fetch invited list",
          data: { noteId, org, userId: _currentUser?.id },
        });
        console.error("Failed to fetch invited list", error);
        setMessage("Unexpected error");
        showMessage({ show: true, error: true });
      } finally {
        setNeedsInvitedFetch(false);
      }
    };

    if (needsInvitedFetch && _currentUser && noteId) {
      _fetchInvitedNoteUsers();
    }
  }, [needsInvitedFetch, _currentUser, noteId]);

  useEffect(() => {
    if (!_currentUser) {
      _setCurrentUser(currentUser);
    }
  }, [currentUser]);

  const handleInvite = async (e) => {
    e && e.preventDefault();
    setIsInviteInProgress(true);

    try {
      if (doesUserHaveAccess(userToBeInvitedEmail)) {
        setMessage("User already in org");
        showMessage({ show: true, error: true });
        setIsInviteInProgress(false);
        return;
      }

      const invitedUser = await inviteUserToNote({
        noteId,
        email: userToBeInvitedEmail,
      });

      setNeedsInvitedFetch(true);
      setUserToBeInvitedEmail("");
    } catch (error) {
      setMessage("Failed to invite user");
      showMessage({ show: true, error: true });
      captureError({
        error,
        msg: "Failed to invite user",
        data: { noteId, org, userId: _currentUser?.id },
      });
    } finally {
      setIsInviteInProgress(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e?.key === 13 /*Enter*/) {
      handleInvite();
    }
  };

  const doesUserHaveAccess = (email) => {
    return Boolean(
      noteAccessList.find((accessObj) => accessObj?.user?.email === email)
    );
  };

  const handleRemoveUser = async (user, noteId) => {
    try {
      if (!isNullOrUndefined(user.recipient_email)) {
        await removeInvitedUserFromNote({
          noteId: noteId,
          email: user.recipient_email,
        });
      } else {
        await removeUserPermissionsFromNote({
          noteId: noteId,
          userId: user.author_profile.id,
        });
      }

      setNeedsFetch(true);
    } catch (error) {
      setMessage("Failed to remove user");
      showMessage({ show: true, error: true });
      captureError({
        error,
        msg: "Failed to remove user",
        data: { noteId, org, userIdToRemove: user.author_profile.id },
      });
    }
  };

  const handleUpdatePermission = async (entity, noteId, accessType) => {
    try {
      await updateNoteUserPermissions({
        userId: user.author_profile.id,
        noteId: noteId,
        accessType,
      });

      setNeedsFetch(true);
    } catch (error) {
      setMessage("Failed to update permission");
      showMessage({ show: true, error: true });
      captureError({
        error,
        msg: "Failed to update permission",
        data: {
          noteId,
          org,
          accessType,
          userIdToUpdate: user.author_profile.id,
        },
      });
    }
  };

  const isCurrentUserNoteAdmin = (currentUser, noteAccessList) => {
    if (!currentUser) {
      return false;
    }

    const uid = currentUser.author_profile.id;
    const isCurrentUserAdmin =
      uid ===
      (noteAccessList.admins || []).find((a) => a.author_profile.id === uid)
        ?.author_profile.id;

    return isCurrentUserAdmin ? true : false;
  };

  const getDisplayName = (accessObj) => {
    if (accessObj.user) {
      return `${accessObj.user?.author_profile?.first_name} ${accessObj.user?.author_profile?.last_name}`;
    } else if (accessObj.organization) {
      return accessObj.organization.name;
    } else {
      return "Invited";
    }
  };

  const canEditPermission = ({ accessObj = null, invitedUser = null }) => {
    const isOrgContext = Boolean(currentOrg);
    const isPrivateContext = !isOrgContext;

    if (isOrgContext) {
      const userIsCurrOrgMember = ["ADMIN", "MEMBER"].includes(
        currentOrg.user_permission.access_type
      );

      if (userIsCurrOrgMember) {
        return true;
      }
    } else if (isPrivateContext) {
    }

    return false;
  };

  const renderInvitedUser = (invitedUser) => {
    const _canEditPermission = canEditPermission({ invitedUser });
    const perm = "Editor"; // temp
    const key = `invited-user-${invitedUser.recipient_email}`;

    return (
      <div className={css(styles.userRow)} key={key}>
        <div className={css(styles.entity)}>
          <AuthorAvatar />
          <div className={css(styles.nameWrapper)}>
            <span className={css(styles.name)}>
              {invitedUser.recipient_email}
            </span>
          </div>
        </div>

        {_canEditPermission ? (
          <DropdownButton
            opts={dropdownOpts}
            label={perm}
            isOpen={key === statusDropdownOpenForEntity}
            onClick={() => setStatusDropdownOpenForEntity(key)}
            onSelect={(selectedPerm) =>
              handleUpdatePermission({ selectedPerm, forUser: invitedUser })
            }
            onClose={() => setStatusDropdownOpenForEntity(null)}
          />
        ) : (
          <div className={css(styles.permJustText)}>{perm}</div>
        )}
      </div>
    );
  };

  const renderAccessRow = (accessObj) => {
    const displayName = getDisplayName(accessObj);

    const forEntity = accessObj.organization ? "org" : "user";
    const key = accessObj.organization
      ? `access-org-${accessObj.organization.slug}`
      : `access-user-${accessObj.user?.author_profile?.id}`;

    const _canEditPermission = canEditPermission({ accessObj });
    const perm = accessObj.access_type.toLowerCase();

    return (
      <div className={css(styles.userRow)} key={key}>
        {forEntity === "user" ? (
          <div className={css(styles.entity)}>
            <AuthorAvatar author={accessObj.user.author_profile} />
            <div className={css(styles.nameWrapper)}>
              <span className={css(styles.name)}>{displayName}</span>
            </div>
          </div>
        ) : forEntity === "org" ? (
          <div className={css(styles.entity)}>
            <OrgAvatar org={currentOrg} />
            <div className={css(styles.nameWrapper)}>
              <span className={css(styles.name)}>{displayName}</span>
            </div>
          </div>
        ) : null}

        {_canEditPermission ? (
          <DropdownButton
            opts={dropdownOpts}
            label={perm}
            isOpen={key === statusDropdownOpenForEntity}
            onClick={() => setStatusDropdownOpenForEntity(key)}
            onSelect={(selectedPerm) =>
              handleUpdatePermission({
                selectedPerm,
                entity:
                  forEntity === "user"
                    ? accessObj.user.author_profile.id
                    : accessObj.organization.slug,
              })
            }
            onClose={() => setStatusDropdownOpenForEntity(null)}
          />
        ) : (
          <div className={css(styles.permJustText)}>{perm}</div>
        )}
      </div>
    );
  };

  return (
    <div className={css(styles.container)}>
      <form
        className={css(styles.inviteForm)}
        onSubmit={(e) => handleInvite(e)}
      >
        <DropdownButton
          opts={dropdownOpts.slice(0, dropdownOpts.length - 1)}
          label={userToBeInvitedPerm.toLowerCase()}
          isOpen={isUserToBeInvitedPermDdownOpen}
          onClick={() => setIsUserToBeInvitedPermDdownOpen(true)}
          onSelect={(selectedPerm) => setUserToBeInvitedPerm(selectedPerm)}
          onClose={() => setIsUserToBeInvitedPermDdownOpen(false)}
          overrideTargetStyle={styles.newUserPermButton}
        />
        <FormInput
          id="org-invite-user"
          onChange={(id, val) => setUserToBeInvitedEmail(val)}
          containerStyle={styles.inputContainer}
          value={userToBeInvitedEmail}
          inputStyle={styles.inputStyle}
          placeholder="User's email"
          type="email"
          onKeyDown={handleKeyDown}
        />
        {isInviteInProgress ? (
          <div className={css(styles.loaderWrapper)}>
            <Loader
              key={"loader"}
              loading={true}
              size={25}
              color={colors.BLUE()}
            />
          </div>
        ) : (
          <Button
            type="submit"
            customButtonStyle={styles.button}
            label="Invite"
          />
        )}
      </form>
      {noteAccessList.map((accessObj) => renderAccessRow(accessObj))}
      {invitedUsersList.map((invitedUser) => renderInvitedUser(invitedUser))}
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 450,
  },
  loaderWrapper: {
    width: 80,
    height: 40,
  },
  deleteOpt: {
    color: colors.RED(),
  },
  userRow: {
    display: "flex",
    marginBottom: 15,
    ":last-child": {
      marginBottom: 0,
    },
  },
  entity: {
    display: "flex",
    alignItems: "center",
  },
  permJustText: {
    textTransform: "capitalize",
    color: colors.BLACK(0.8),
    marginLeft: "auto",
    marginRight: 28,
  },
  nameWrapper: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 10,
  },
  inviteForm: {
    display: "flex",
    justifyContent: "center",
    position: "relative",
  },
  newUserPermButton: {
    position: "absolute",
    top: 10,
    right: 90,
  },
  button: {
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 0,
    height: 51,
    width: 100,
  },
  inputContainer: {
    margin: 0,
  },
  inputStyle: {
    textAlign: "left",
  },
});

const mapStateToProps = (state) => ({
  currentUser: state.auth.user,
});
const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageNotePermissions);
