import { useState, useEffect, useMemo } from "react";
import FormInput from "~/components/Form/FormInput";
import Button from "~/components/Form/Button";
import { StyleSheet, css } from "aphrodite";
import {
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
import colors, { iconColors, genericCardColors } from "~/config/themes/colors";
import DropdownButton from "~/components/Form/DropdownButton";
import { captureError } from "~/config/utils/error";
import {
  getUserNoteAccess,
  isNoteSharedWithUser,
} from "~/components/Notebook/utils/notePermissions";
import {
  PERMS,
  ENTITIES,
} from "~/components/Notebook/config/notebookConstants";

const ManageNotePermissions = ({
  currentUser,
  noteId,
  currentOrg,
  userOrgs,
  setMessage,
  showMessage,
  notePerms,
  refetchNotePerms,
  onNotePermChange,
}) => {
  const permDropdownOpts = [
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

  const dropdownOptsForInvited = [
    {
      title: "Cancel invite",
      titleStyle: styles.deleteOpt,
      value: "REMOVE",
    },
  ];

  const [userToBeInvitedEmail, setUserToBeInvitedEmail] = useState("");
  const [userToBeInvitedPerm, setUserToBeInvitedPerm] = useState("EDITOR");
  const [isUserToBeInvitedPermDdownOpen, setIsUserToBeInvitedPermDdownOpen] =
    useState(false);

  const [invitedUsersList, setInvitedUsersList] = useState([]);
  const [isInviteInProgress, setIsInviteInProgress] = useState(false);
  const [permDropdownOpenForEntity, setPermDropdownOpenForEntity] =
    useState(null);

  useEffect(() => {
    _fetchInvitedNoteUsers().then((invitedUsers) => {
      setInvitedUsersList(invitedUsers);
    });

    refetchNotePerms();
  }, []);

  const currentUserAccess = useMemo(() => {
    return getUserNoteAccess({
      user: currentUser,
      notePerms: notePerms,
      userOrgs,
    });
  }, [currentUser, notePerms, userOrgs]);

  const handleInvite = async (e) => {
    e && e.preventDefault();

    if (userToBeInvitedEmail.length === 0) {
      return;
    }

    setIsInviteInProgress(true);

    const userAlreadyInvitedOrInOrg = isNoteSharedWithUser({
      email: userToBeInvitedEmail,
      invitedUsers: invitedUsersList,
      notePerms,
    });

    try {
      if (userAlreadyInvitedOrInOrg) {
        setMessage("User already invited or in org");
        showMessage({ show: true, error: true });
        setIsInviteInProgress(false);
        return;
      }

      const invitedUser = await inviteUserToNote({
        noteId,
        email: userToBeInvitedEmail,
        accessType: userToBeInvitedPerm,
      });

      _fetchInvitedNoteUsers().then((invitedUsers) => {
        setInvitedUsersList(invitedUsers);
        setUserToBeInvitedEmail("");
      });

      refetchNotePerms();
    } catch (error) {
      setMessage("Failed to invite user");
      showMessage({ show: true, error: true });
      captureError({
        error,
        msg: "Failed to invite user",
        data: { noteId, currentOrg, userId: currentUser?.id },
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

  const _fetchInvitedNoteUsers = async () => {
    try {
      const invitedList = await fetchInvitedNoteUsers({ noteId });
      return Promise.resolve(invitedList);
    } catch (error) {
      captureError({
        error,
        msg: "Failed to fetch invited list",
        data: { noteId, currentOrg, userId: currentUser?.id },
      });
      setMessage("Failed to invite user");
      showMessage({ show: true, error: true });
      Promise.reject(error);
    }
  };

  const handleRemoveUser = async (user) => {
    try {
      if (!isNullOrUndefined(user.recipient_email)) {
        await removeInvitedUserFromNote({
          noteId: noteId,
          email: user.recipient_email,
        });

        const invitedUsers = await _fetchInvitedNoteUsers();
        setInvitedUsersList(invitedUsers);
      } else {
        await removeUserPermissionsFromNote({
          noteId: noteId,
          userId: user.id,
        });

        refetchNotePerms();
        onNotePermChange({ changeType: "REMOVE_USER" });
      }

      setUserToBeInvitedEmail("");
    } catch (error) {
      setMessage("Failed to remove user");
      showMessage({ show: true, error: true });
      captureError({
        error,
        msg: "Failed to remove user",
        data: { noteId, currentOrg, userIdToRemove: user.id },
      });
    }
  };

  const handleUpdatePermission = async ({ entity, entityType, newPerm }) => {
    try {
      if (entityType === ENTITIES.USER) {
        await updateNoteUserPermissions({
          userId: entity.id,
          noteId: noteId,
          accessType: newPerm,
        });
      } else if (entityType === ENTITIES.ORG) {
        await updateNoteUserPermissions({
          orgId: entity.id,
          noteId: noteId,
          accessType: newPerm,
        });
      }

      refetchNotePerms();
    } catch (error) {
      setMessage("Failed to update permission");
      showMessage({ show: true, error: true });
      captureError({
        error,
        msg: "Failed to update permission",
        data: {
          noteId,
          entityType,
          entity,
          newPerm,
        },
      });
    }
  };

  const getDisplayName = (accessObj) => {
    const isCurrentUser = accessObj.user?.id === currentUser?.id;

    if (accessObj.organization) {
      return `Everyone at ${accessObj.organization.name}`;
    } else if (accessObj.user) {
      return `${accessObj.user?.author_profile?.first_name} ${
        accessObj.user?.author_profile?.last_name
      } ${isCurrentUser ? "(you)" : ""}`;
    } else {
      return "Invited";
    }
  };

  const renderInvitedUser = (invitedUser) => {
    const perm = invitedUser?.invite_type.toLowerCase(); // temp
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

        {currentUserAccess >= PERMS.NOTE.ADMIN ? (
          <DropdownButton
            opts={dropdownOptsForInvited}
            label={`Invitation Pending`}
            isOpen={key === permDropdownOpenForEntity}
            onClick={() => setPermDropdownOpenForEntity(key)}
            dropdownClassName="perm-popover"
            onSelect={(newPerm) => {
              if (newPerm === "REMOVE") {
                handleRemoveUser(invitedUser);
              } else {
                handleUpdatePermission({
                  entity: invitedUser,
                  entityType: ENTITIES.USER_INVITE,
                  newPerm,
                });
              }
            }}
            onClose={() => setPermDropdownOpenForEntity(null)}
          />
        ) : (
          <div className={css(styles.permJustText)}>Invitation Pending</div>
        )}
      </div>
    );
  };

  const renderAccessRow = (accessObj) => {
    const displayName = getDisplayName(accessObj);

    const isCurrentUser = accessObj.user?.id === currentUser?.id;
    const forEntity = accessObj.organization ? ENTITIES.ORG : ENTITIES.USER;
    const key =
      forEntity === ENTITIES.USER
        ? `access-user-${accessObj.user?.author_profile?.id}`
        : `access-org-${accessObj.organization?.slug}`;

    const perm = accessObj.access_type.toLowerCase();
    const canEdit =
      currentUserAccess >= PERMS.NOTE.ADMIN && !isCurrentUser
        ? true
        : undefined;

    return (
      <div
        className={css(styles.userRow, canEdit && styles.userRowActive)}
        key={key}
        onClick={
          canEdit &&
          (() => {
            const isOpen = key === permDropdownOpenForEntity;
            if (!isOpen) {
              setPermDropdownOpenForEntity(key);
            } else {
              setPermDropdownOpenForEntity(null);
            }
          })
        }
      >
        {forEntity === ENTITIES.USER ? (
          <div className={css(styles.entity)}>
            <AuthorAvatar author={accessObj.user.author_profile} />
            <div className={css(styles.nameWrapper)}>
              <span className={css(styles.name)}>{displayName}</span>
              <span className={css(styles.email)}>{accessObj.user.email}</span>
            </div>
          </div>
        ) : forEntity === ENTITIES.ORG ? (
          <div className={css(styles.entity)}>
            <OrgAvatar org={currentOrg} />
            <div className={css(styles.nameWrapper)}>
              <span className={css(styles.name)}>{displayName}</span>
              <div className={css(styles.memberCount)}>
                {!accessObj.organization.member_count
                  ? "{X members}"
                  : accessObj.organization.member_count === 1
                  ? "1 member"
                  : `${accessObj.organization.member_count} members`}
              </div>
            </div>
          </div>
        ) : null}

        {currentUserAccess >= PERMS.NOTE.ADMIN && !isCurrentUser ? (
          <DropdownButton
            opts={permDropdownOpts}
            label={perm}
            isOpen={key === permDropdownOpenForEntity}
            onClick={() => setPermDropdownOpenForEntity(key)}
            dropdownClassName="perm-popover"
            onSelect={(newPerm) => {
              if (newPerm === "REMOVE") {
                handleRemoveUser(accessObj.user);
              } else {
                handleUpdatePermission({
                  entity:
                    forEntity === ENTITIES.USER
                      ? accessObj.user
                      : accessObj.organization,
                  entityType: forEntity,
                  newPerm,
                });
              }
            }}
            onClose={() => setPermDropdownOpenForEntity(null)}
          />
        ) : (
          <div className={css(styles.permJustText)}>{perm}</div>
        )}
      </div>
    );
  };

  return (
    <div className={css(styles.container)}>
      {currentUserAccess >= PERMS.NOTE.ADMIN && (
        <form
          className={css(styles.inviteForm)}
          onSubmit={(e) => handleInvite(e)}
        >
          <DropdownButton
            opts={permDropdownOpts.slice(0, permDropdownOpts.length - 1)}
            label={userToBeInvitedPerm.toLowerCase()}
            isOpen={isUserToBeInvitedPermDdownOpen}
            onClick={() => setIsUserToBeInvitedPermDdownOpen(true)}
            onSelect={(selectedPerm) => setUserToBeInvitedPerm(selectedPerm)}
            onClose={() => setIsUserToBeInvitedPermDdownOpen(false)}
            dropdownClassName="perm-popover"
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
      )}
      {notePerms.map((accessObj) => renderAccessRow(accessObj))}
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
    paddingTop: 10,
  },
  deleteOpt: {
    color: colors.RED(),
  },
  email: {
    color: colors.BLACK(0.5),
  },
  userRow: {
    display: "flex",
    padding: 8,
    ":last-child": {
      marginBottom: 0,
    },
    ":hover": {
      background: genericCardColors.BACKGROUND,
      transition: "0.2s",
    },
  },
  userRowActive: {
    ":hover": {
      cursor: "pointer",
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
    marginRight: 17,
    display: "flex",
    alignItems: "center",
  },
  memberCount: {
    color: colors.BLACK(0.5),
    fontSize: 13,
    marginTop: 2,
  },
  nameWrapper: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 10,
    marginRight: 30,
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
