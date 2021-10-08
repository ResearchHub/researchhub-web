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
} from "~/config/fetch";
import { connect } from "react-redux";
import { MessageActions } from "~/redux/message";
import AuthorAvatar from "~/components/AuthorAvatar";
import { isNullOrUndefined } from "~/config/utils/nullchecks";
import Loader from "~/components/Loader/Loader";
import OrgAvatar from "~/components/Org/OrgAvatar";
import colors, { iconColors } from "~/config/themes/colors";
import DropdownButton from "~/components/Form/DropdownButton";

const ManageNotePermissions = ({
  currentUser,
  noteId,
  org = null,
  setMessage,
  showMessage,
}) => {
  const opts = [
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
  const [needsFetch, setNeedsFetch] = useState(true);
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
      } catch {
        console.error("Failed to fetch note permissions");
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
    if (!_currentUser) {
      _setCurrentUser(currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    console.log("mount");
  }, []);

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

      setNeedsFetch(true);
      setUserToBeInvitedEmail("");
    } catch (err) {
      setMessage("Failed to invite user");
      showMessage({ show: true, error: true });
    }

    setIsInviteInProgress(false);
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
    } catch (err) {
      setMessage("Failed to remove user");
      showMessage({ show: true, error: true });
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
    } catch (err) {
      setMessage("Failed to update permission");
      showMessage({ show: true, error: true });
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

  const canEditPermission = (accessObj) => {
    const noteBelongsToCurrOrg = currentOrg ? true : false;
    const userIsCurrOrgMember = ["ADMIN", "MEMBER"].includes(
      currentOrg.user_permission.access_type
    );
    if (noteBelongsToCurrOrg && userIsCurrOrgMember) {
      return true;
    }

    if (accessObj.organization) {
      if (
        currentOrg &&
        accessObj.organization.slug === currentOrg.slug &&
        ["ADMIN", "MEMBER"].includes(currentOrg.user_permission.access_type)
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const renderAccessRow = (accessObj) => {
    const displayName = getDisplayName(accessObj);

    const forEntity = accessObj.organization ? "org" : "user";
    const key = accessObj.organization
      ? `access-org-${accessObj.organization.slug}`
      : `access-user-${accessObj.user?.author_profile?.id}`;

    const _canEditPermission = canEditPermission(accessObj);
    const perm = accessObj.access_type.toLowerCase();

    console.log("accessObj", accessObj);

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
            opts={opts}
            label={perm}
            isOpen={key === statusDropdownOpenForEntity}
            onClick={() => setStatusDropdownOpenForEntity(key)}
            onSelect={(selectedPerm) =>
              handleUpdatePermission(accessObj, selectedPerm)
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
          opts={opts.slice(0, opts.length - 1)}
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

      {/*orgUserCount > 0 && (
        <div>
          <div className={css(styles.userList)}>
            {(orgUsers.invited_users || []).map((u) =>
              renderAccessRow(u, "Invitation Pending")
            )}
            {(orgUsers.admins || []).map((u) => renderOrgUser(u, "Admin"))}
            {(orgUsers.editors || []).map((u) => renderOrgUser(u, "Editor"))}
            {(orgUsers.viewers || []).map((u) => renderOrgUser(u, "Viewer"))}
          </div>
        </div>
      )*/}
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
