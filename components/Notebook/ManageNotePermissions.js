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
import {
  getUserNoteAccess,
  isNoteSharedWithUser,
} from "~/components/Notebook/utils/notePermissions";
import { PERMS } from "~/components/Notebook/config/notebookConstants";

const ManageNotePermissions = ({
  currentUser,
  noteId,
  currentOrg,
  userOrgs,
  setMessage,
  showMessage,
  notePerms,
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

  const [userToBeInvitedEmail, setUserToBeInvitedEmail] = useState("");
  const [userToBeInvitedPerm, setUserToBeInvitedPerm] = useState("EDITOR");
  const [isUserToBeInvitedPermDdownOpen, setIsUserToBeInvitedPermDdownOpen] =
    useState(false);

  const [invitedUsersList, setInvitedUsersList] = useState([]);
  const [isInviteInProgress, setIsInviteInProgress] = useState(false);
  const [permDropdownOpenForEntity, setPermDropdownOpenForEntity] =
    useState(null);

  useEffect(() => {
    const fetchAndSetInvitedNoteUsers = async () => {
      try {
        const invitedList = await fetchInvitedNoteUsers({ noteId });

        setInvitedUsersList(invitedList);
      } catch (error) {
        captureError({
          error,
          msg: "Failed to fetch invited list",
          data: { noteId, currentOrg, userId: currentUser?.id },
        });
        setMessage("Unexpected error");
        showMessage({ show: true, error: true });
      }
    };

    fetchAndSetInvitedNoteUsers();
  }, []);

  const handleInvite = async (e) => {
    e && e.preventDefault();
    setIsInviteInProgress(true);

    const userAlreadyInvitedOrInOrg = isNoteSharedWithUser({
      email: userToBeInvitedPerm,
      notePerms,
    });

    try {
      if (userAlreadyInvitedOrInOrg) {
        setMessage("User already in org");
        showMessage({ show: true, error: true });
        setIsInviteInProgress(false);
        return;
      }

      const invitedUser = await inviteUserToNote({
        noteId,
        email: userToBeInvitedEmail,
      });

      fetchAndSetInvitedNoteUsers();
      setUserToBeInvitedEmail("");
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
        data: { noteId, currentOrg, userIdToRemove: user.author_profile.id },
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
          currentOrg,
          accessType,
          userIdToUpdate: user.author_profile.id,
        },
      });
    }
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
            opts={permDropdownOpts}
            label={perm}
            isOpen={key === permDropdownOpenForEntity}
            onClick={() => setPermDropdownOpenForEntity(key)}
            onSelect={(selectedPerm) =>
              handleUpdatePermission({ selectedPerm, forUser: invitedUser })
            }
            onClose={() => setPermDropdownOpenForEntity(null)}
          />
        ) : (
          <div className={css(styles.permJustText)}>{perm}</div>
        )}
      </div>
    );
  };

  const renderAccessRow = (accessObj) => {
    const displayName = getDisplayName(accessObj);

    const key = accessObj.organization
      ? `access-org-${accessObj.organization.slug}`
      : `access-user-${accessObj.user?.author_profile?.id}`;

    const userAccess = getUserNoteAccess({
      user: currentUser,
      notePerms: notePerms,
      userOrgs,
    });

    const perm = accessObj.access_type.toLowerCase();
    console.log("access", userAccess);

    return (
      <div className={css(styles.userRow)} key={key}>
        <div className={css(styles.entity)}>
          <OrgAvatar org={accessObj.organization} />
          <div className={css(styles.nameWrapper)}>
            <span className={css(styles.name)}>{displayName}</span>
          </div>
        </div>

        {userAccess === PERMS.ADMIN ? (
          <DropdownButton
            opts={permDropdownOpts}
            label={perm}
            isOpen={key === permDropdownOpenForEntity}
            onClick={() => setPermDropdownOpenForEntity(key)}
            onSelect={(selectedPerm) =>
              handleUpdatePermission({
                selectedPerm,
                entity:
                  forEntity === "user"
                    ? accessObj.user.author_profile.id
                    : accessObj.organization.slug,
              })
            }
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
      {notePerms.map((accessObj) => renderAccessRow(accessObj))}
      {/*invitedUsersList.map((invitedUser) => renderInvitedUser(invitedUser))*/}
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