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
import ResearchHubPopover from "~/components/ResearchHubPopover";
import colors, { iconColors } from "~/config/themes/colors";
import { DownIcon } from "~/config/themes/icons";
import { isNullOrUndefined } from "~/config/utils/nullchecks";
import Loader from "~/components/Loader/Loader";

const ManageNotePermissions = ({ currentUser, noteId, setMessage, showMessage }) => {
  const [userToBeInvitedEmail, setUserToBeInvitedEmail] = useState("");
  const [noteAccessList, setNoteAccessList] = useState([]);
  const [needsFetch, setNeedsFetch] = useState(true);
  const [isInviteInProgress, setIsInviteInProgress] = useState(false);
  const [statusDropdownOpenForUser, setStatusDropdownOpenForUser] =
    useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [_currentUser, _setCurrentUser] = useState(null);

  useEffect(() => {
    const _fetchNotePermissions = async() => {
      try {
        const noteAccessList = await fetchNotePermissions({ noteId });

        setNoteAccessList(noteAccessList);
        setIsAdmin(isCurrentUserNoteAdmin(currentUser, noteAccessList));
      }
      catch {
        console.error("Failed to fetch note permissions");
        setMessage("Unexpected error");
        showMessage({ show: true, error: true });
      }

      setNeedsFetch(false);
    }

    if (needsFetch && _currentUser && noteId) {
      _fetchNotePermissions();
    }
  }, [needsFetch, _currentUser, noteId]);

  useEffect(() => {
    if (!_currentUser) {
      _setCurrentUser(currentUser);
    }
  }, [currentUser]);

  const handleInvite = async (e) => {
    e && e.preventDefault();
    setIsInviteInProgress(true);

    try {
      if (doesUserHaveAccess(userToBeInvitedEmail, noteId)) {
        setMessage("User already in org");
        showMessage({ show: true, error: true });
        setIsInviteInProgress(false);
        return;
      }

      const invitedUser = await inviteUserToNote({
        note: noteId,
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

  const doesUserHaveAccess = (email, noteId) => {
    return Boolean(
      [...noteId.admins, ...noteId.editors, ...noteId.viewers].find(
        (u) => u.email === email
      )
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
      return `${user?.author_profile?.first_name} ${user?.author_profile?.last_name}`;
    }
    else if (accessObj.organization) {
      return accessObj.name;
    }
    else {
      return "Invited";
    }
  }

  const renderAccessRow = (accessObj) => {
    const displayName = getDisplayName(accessObj);

    const key =
      perm === "Invitation Pending"
        ? `user-${user.recipient_email}`
        : `user-${user?.author_profile?.id}`;

    return (
      <div className={css(styles.userRow)} key={key}>
        <div className={css(styles.user)}>
          <AuthorAvatar author={user.author_profile} />
          <div className={css(styles.nameWrapper)}>
            <span className={css(styles.name)}>
              {displayName} {isCurrentUser ? "(you)" : ""}
            </span>
            {perm !== "Invitation Pending" && (
              <span className={css(styles.email)}>{user.email}</span>
            )}
          </div>
        </div>
        <div className={css(styles.status)}>
          {isAdmin && !isCurrentUser ? (
            <ResearchHubPopover
              containerStyle={{ "z-index": 100 }}
              isOpen={key === statusDropdownOpenForUser}
              popoverContent={
                <div className={css(styles.popoverBodyContent, styles.perms)}>
                  {perm !== "Invitation Pending" && (
                    <div
                      className={css(styles.permOpt)}
                      onClick={() => handleUpdatePermission(user, org, "ADMIN")}
                    >
                      <div className={css(styles.permTitle)}>Admin</div>
                      <div className={css(styles.permDesc)}>
                        Can manage settings, edit documents and invite new
                        members to the organization.
                      </div>
                    </div>
                  )}
                  {perm !== "Invitation Pending" && (
                    <div
                      className={css(styles.permOpt)}
                      onClick={() =>
                        handleUpdatePermission(user, org, "EDITOR")
                      }
                    >
                      <div className={css(styles.permTitle)}>Editor</div>
                      <div className={css(styles.permDesc)}>
                        Can edit all documents. Cannot manage settings or invite
                        new members.
                      </div>
                    </div>
                  )}
                  {perm !== "Invitation Pending" && (
                    <div
                      className={css(styles.permOpt)}
                      onClick={() =>
                        handleUpdatePermission(user, org, "VIEWER")
                      }
                    >
                      <div className={css(styles.permTitle)}>Viewer</div>
                      <div className={css(styles.permDesc)}>
                        Can view all documents in the organization.
                      </div>
                    </div>
                  )}
                  {perm !== "Invitation Pending" && (
                    <div
                      className={css(styles.permOpt, styles.permOptRemove)}
                      onClick={() => handleRemoveUser(user, org)}
                    >
                      <div className={css(styles.permTitle)}>
                        Remove from organization
                      </div>
                    </div>
                  )}
                  {perm === "Invitation Pending" && (
                    <div
                      className={css(styles.permOpt, styles.permOptRemove)}
                      onClick={() => handleRemoveUser(user, org)}
                    >
                      <div className={css(styles.permTitle)}>
                        Cancel Invitation
                      </div>
                    </div>
                  )}
                </div>
              }
              positions={["bottom", "top"]}
              setIsPopoverOpen={() => setStatusDropdownOpenForUser(null)}
              targetContent={
                <div
                  className={css(styles.popoverTarget)}
                  onClick={() => setStatusDropdownOpenForUser(key)}
                >
                  <div className={css(styles.permBtn)}>
                    {perm}
                    <DownIcon
                      withAnimation={false}
                      overrideStyle={styles.downIcon}
                    />
                  </div>
                </div>
              }
              withArrow
            />
          ) : (
            <div className={css(styles.permJustText)}>{perm}</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={css(styles.container)}>
      <form
        className={css(styles.inviteForm)}
        onSubmit={(e) => handleInvite(e)}
      >
        <FormInput
          label="Invite users (optional)"
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
      {noteAccessList.map(accessObj => renderAccessRow(accessObj))}


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
  loaderWrapper: {
    width: 80,
    height: 40,
  },
  popoverBodyContent: {
    backgroundColor: "#fff",
    borderRadius: 4,
    boxShadow: "0px 0px 10px 0px #00000026",
    display: "flex",
    flexDirection: "column",
    marginLeft: 10,
    marginTop: -10,
    userSelect: "none",
    width: 270,
  },
  popoverTarget: {
    cursor: "pointer",
  },
  permOpt: {
    padding: "10px 14px",
    ":hover": {
      cursor: "pointer",
      backgroundColor: colors.GREY(0.2),
    },
  },
  permOptRemove: {
    color: colors.RED(),
  },
  permTitle: {
    fontWeight: 500,
  },
  permDesc: {
    fontSize: 14,
  },
  permBtn: {
    padding: "7px 10px",
    ":hover": {
      background: iconColors.BACKGROUND,
      borderRadius: 3,
      transition: "0.3s",
    },
  },
  permJustText: {
    marginRight: 27,
  },
  downIcon: {
    padding: 4,
    fontSize: 11,
  },
  userRow: {
    display: "flex",
    marginBottom: 15,
  },
  user: {
    display: "flex",
    alignItems: "center",
  },
  nameWrapper: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 10,
  },
  name: {},
  email: {
    color: colors.BLACK(0.5),
  },
  status: {
    display: "flex",
    alignItems: "center",
    marginLeft: "auto",
  },
  inviteForm: {
    display: "flex",
    justifyContent: "center",
    alignItems: "end",
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageNotePermissions);
