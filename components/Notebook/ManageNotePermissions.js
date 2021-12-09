import { useState, useEffect, useMemo } from "react";
import FormInput from "~/components/Form/FormInput";
import Button from "~/components/Form/Button";
import { StyleSheet, css } from "aphrodite";
import {
  updateNoteUserPermissions,
  removePermissionsFromNote,
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
}) => {
  const permDropdownOptsForUser = [
    {
      title: "Full Access",
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
      title: "Remove Access",
      titleStyle: styles.deleteOpt,
      value: "REMOVE",
    },
  ];

  const permDropdownOptsForOrg = [
    {
      title: "Full Access",
      description: "Can edit and share with others.",
      value: "ADMIN",
    },
    {
      title: "Remove Access",
      titleStyle: styles.deleteOpt,
      value: "REMOVE",
    },
  ];

  const dropdownOptsForInvited = [
    {
      title: "Cancel Invite",
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
        await removePermissionsFromNote({
          noteId: noteId,
          userId: user.id,
        });

        refetchNotePerms();
      }
    } catch (error) {
      setMessage("Failed to change permission");
      showMessage({ show: true, error: true });
      captureError({
        error,
        msg: "Failed to change permission",
        data: { noteId, currentOrg, userIdToRemove: user.id },
      });
    }
  };

  const handleRemoveOrg = async (org) => {
    try {
      await removePermissionsFromNote({
        noteId: noteId,
        orgId: org.id,
      });

      refetchNotePerms();
    } catch (error) {
      setMessage("Failed to change permission");
      showMessage({ show: true, error: true });
      captureError({
        error,
        msg: "Failed to change permission",
        data: { noteId, currentOrg, orgToRemove: org },
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
    const isCurrentUser =
      accessObj.user?.id === currentUser?.id && !accessObj.organization;

    if (accessObj.organization) {
      return `${
        accessObj.organization?.member_count > 1 ? "Everyone at" : ""
      } ${accessObj.organization.name}`;
    } else if (accessObj.user) {
      return `${accessObj.user?.author_profile?.first_name} ${
        accessObj.user?.author_profile?.last_name
      } ${isCurrentUser ? "(you)" : ""}`;
    } else {
      return "Invited";
    }
  };

  const getPermLabel = (perm) => {
    switch (perm) {
      case "ADMIN":
        return "Full access";
      case "EDITOR":
        return "Editor";
      case "VIEWER":
        return "Viewer";
      case "NO_ACCESS":
        return "No access";
    }
  };

  const renderInvitedUser = (invitedUser) => {
    const perm = getPermLabel(invitedUser?.invite_type.toLowerCase());
    const key = `invited-user-${invitedUser.recipient_email}`;
    const canEdit = currentUserAccess >= PERMS.NOTE.ADMIN ? true : undefined;

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
        <div className={css(styles.entity)}>
          <AuthorAvatar />
          <div className={css(styles.nameWrapper)}>
            <span className={css(styles.name)}>
              {invitedUser.recipient_email}
            </span>
          </div>
        </div>

        {canEdit ? (
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

    const isCurrentUser =
      accessObj.user?.id === currentUser?.id && !accessObj.organization;
    const forEntity = accessObj.organization ? ENTITIES.ORG : ENTITIES.USER;
    const key =
      forEntity === ENTITIES.USER
        ? `access-user-${accessObj.user?.author_profile?.id}`
        : `access-org-${accessObj.organization?.slug}`;

    const perm = getPermLabel(accessObj.access_type);

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
            <OrgAvatar org={accessObj.organization} />
            <div className={css(styles.nameWrapper)}>
              <span className={css(styles.name)}>{displayName}</span>
              <div className={css(styles.memberCount)}>
                {accessObj?.organization?.member_count > 1
                  ? `${accessObj.organization.member_count} members`
                  : ""}
              </div>
            </div>
          </div>
        ) : null}

        {canEdit ? (
          <DropdownButton
            opts={
              forEntity === ENTITIES.ORG
                ? permDropdownOptsForOrg
                : permDropdownOptsForUser
            }
            label={perm}
            isOpen={key === permDropdownOpenForEntity}
            onClick={() => setPermDropdownOpenForEntity(key)}
            dropdownClassName="perm-popover"
            overridePopoverStyle={styles.permDropdown}
            onSelect={(newPerm) => {
              if (newPerm === "REMOVE") {
                if (forEntity === ENTITIES.ORG) {
                  handleRemoveOrg(accessObj.organization);
                } else {
                  handleRemoveUser(accessObj.user);
                }
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
            opts={permDropdownOptsForUser.slice(
              0,
              permDropdownOptsForUser.length - 1
            )}
            label={getPermLabel(userToBeInvitedPerm)}
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
            onClick={() => setPermDropdownOpenForEntity(null)}
          />
          {isInviteInProgress ? (
            <div className={css(styles.loaderWrapper)}>
              <Loader key={"loader"} loading={true} size={25} color={"white"} />
            </div>
          ) : (
            <Button
              type="submit"
              customButtonStyle={styles.button}
              label="Invite"
              rippleClass={styles.rippleClass}
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
    width: 100,
    height: 40,
    paddingTop: 11,
    backgroundColor: colors.BLUE(1),
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
    width: "60%",
    overflowX: "scroll",
  },
  permDropdown: {
    marginRight: 30,
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
  rippleClass: {
    height: 51,
  },
  inputContainer: {
    margin: 0,
  },
  inputStyle: {
    textAlign: "left",
    paddingRight: 120,
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
