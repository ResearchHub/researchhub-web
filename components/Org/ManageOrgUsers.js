import { useState, useEffect } from "react";
import FormInput from "~/components/Form/FormInput";
import Button from "~/components/Form/Button";
import { StyleSheet, css } from "aphrodite";
import {
  inviteUserToOrg,
  fetchOrgUsers,
  removeUserFromOrg,
  removeInvitedUserFromOrg,
  updateOrgUserPermissions,
} from "~/config/fetch";
import { connect } from "react-redux";
import { MessageActions } from "~/redux/message";
import AuthorAvatar from "~/components/AuthorAvatar";
import colors, { iconColors } from "~/config/themes/colors";
import { isNullOrUndefined } from "~/config/utils/nullchecks";
import { getOrgUserCount } from "./utils/orgHelper";
import Loader from "~/components/Loader/Loader";
import DropdownButton from "~/components/Form/DropdownButton";
import { captureEvent } from "~/config/utils/events";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinnerThird } from "@fortawesome/pro-light-svg-icons";

const ManageOrgUsers = ({ currentUser, org, setMessage, showMessage }) => {
  const dropdownOpts = [
    {
      title: "Admin",
      description:
        "Can change organization settings and invite new members to the organization.",
      value: "ADMIN",
    },
    {
      title: "Member",
      description:
        "Can contribute but not change organization settings or invite new members to the organization.",
      value: "MEMBER",
    },
    {
      title: "Remove from organization",
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
  const [orgUsers, setOrgUsers] = useState({});
  const [orgUserCount, setOrgUserCount] = useState(0);
  const [needsFetch, setNeedsFetch] = useState(true);
  const [isInviteInProgress, setIsInviteInProgress] = useState(false);
  const [statusDropdownOpenForUser, setStatusDropdownOpenForUser] =
    useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [_currentUser, _setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchAndSetOrgUsers = async () => {
      try {
        const orgUsers = await fetchOrgUsers({ orgId: org.id });

        setNeedsFetch(false);
        setOrgUsers(orgUsers);
        setOrgUserCount(getOrgUserCount(orgUsers));
        setIsAdmin(isCurrentUserOrgAdmin(currentUser, orgUsers));
      } catch (error) {
        setMessage("Failed to fetch data");
        showMessage({ show: true, error: true });
        captureEvent({
          error,
          msg: "Failed to fetch org users",
          data: { org },
        });
      }
    };

    if (needsFetch && _currentUser && !isNullOrUndefined(org)) {
      fetchAndSetOrgUsers();
    }
  }, [needsFetch, _currentUser, org]);

  useEffect(() => {
    if (!_currentUser) {
      _setCurrentUser(currentUser);
    }
  }, [currentUser]);

  const handleInvite = async (e) => {
    e && e.preventDefault();

    if (userToBeInvitedEmail.length === 0) {
      return;
    }

    setIsInviteInProgress(true);

    try {
      if (isUserAleadyInOrg(userToBeInvitedEmail, org)) {
        setMessage("User already in org");
        showMessage({ show: true, error: true });
        setIsInviteInProgress(false);
        return;
      }

      const invitedUser = await inviteUserToOrg({
        orgId: org.id,
        email: userToBeInvitedEmail,
      });
      setNeedsFetch(true);
      setUserToBeInvitedEmail("");
    } catch (error) {
      setMessage("Failed to invite user");
      showMessage({ show: true, error: true });
      captureEvent({
        error,
        msg: "Failed to invite user",
        data: { org, userToBeInvitedEmail },
      });
    }

    setIsInviteInProgress(false);
  };

  const handleKeyDown = (e) => {
    if (e?.key === 13 /*Enter*/) {
      handleInvite();
    }
  };

  const isUserAleadyInOrg = (email, org) => {
    return Boolean(
      [...orgUsers.admins, ...orgUsers.members].find((u) => u.email === email)
    );
  };

  const removeUser = async (user, org) => {
    try {
      if (!isNullOrUndefined(user.recipient_email)) {
        await removeInvitedUserFromOrg({
          orgId: org.id,
          email: user.recipient_email,
        });
      } else {
        await removeUserFromOrg({
          orgId: org.id,
          userId: user.id,
        });
      }

      setNeedsFetch(true);
    } catch (err) {
      setMessage("Failed to remove user");
      showMessage({ show: true, error: true });
    }
  };

  const handleUpdatePermission = async ({ selectedPerm, user, org }) => {
    if (selectedPerm === "REMOVE") {
      removeUser(user, org);
    } else {
      try {
        await updateOrgUserPermissions({
          userId: user.id,
          accessType: selectedPerm,
          orgId: org.id,
        });

        setNeedsFetch(true);
      } catch (error) {
        setMessage("Failed to update permission");
        showMessage({ show: true, error: true });
        captureEvent({
          error,
          msg: "Failed to update user permission",
          data: { org },
        });
      }
    }

    setStatusDropdownOpenForUser(null);
  };

  const isCurrentUserOrgAdmin = (currentUser, orgUsers) => {
    if (!currentUser) {
      return false;
    }

    const cuid = currentUser.author_profile.id;
    const isCurrentUserAdmin =
      cuid ===
      (orgUsers.admins || []).find((a) => a.author_profile.id === cuid)
        ?.author_profile.id;

    return isCurrentUserAdmin;
  };

  const renderOrgUser = (user, perm) => {
    const displayName =
      perm === "Invitation Pending"
        ? user.recipient_email
        : `${user?.author_profile?.first_name} ${user?.author_profile?.last_name}`;
    const isCurrentUser =
      user?.author_profile?.id === currentUser?.author_profile?.id;
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
            <DropdownButton
              opts={
                perm === "Invitation Pending"
                  ? dropdownOptsForInvited
                  : dropdownOpts
              }
              label={perm}
              isOpen={key === statusDropdownOpenForUser}
              onClick={() => setStatusDropdownOpenForUser(key)}
              onSelect={(selectedPerm) =>
                handleUpdatePermission({ selectedPerm, user, org })
              }
              onClose={() => setStatusDropdownOpenForUser(null)}
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
      {org.user_permission.access_type === "ADMIN" && (
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
          <Button
            type="submit"
            customButtonStyle={styles.button}
            label={
              isInviteInProgress ? (
                <FontAwesomeIcon
                  size={25}
                  icon={faSpinnerThird}
                  spin
                  color={"white"}
                />
              ) : (
                "Invite"
              )
            }
          />
        </form>
      )}
      <div>
        <div className={css(styles.subheader)}>Organization members:</div>
        <div className={css(styles.userList)}>
          {(orgUsers.invited_users || []).map((u) =>
            renderOrgUser(u, "Invitation Pending")
          )}
          {(orgUsers.admins || []).map((u) => renderOrgUser(u, "Admin"))}
          {(orgUsers.members || []).map((u) => renderOrgUser(u, "Member"))}
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  subheader: {
    fontWeight: 500,
    marginTop: 10,
    marginBottom: 10,
  },
  loaderWrapper: {
    width: 100,
    height: 40,
    paddingTop: 11,
    backgroundColor: colors.BLUE(1),
  },
  userList: {
    paddingTop: 8,
    paddingBottom: 20,
    borderRadius: "2px",
    overflowY: "scroll",
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
    marginRight: 23,
    color: colors.BLACK(0.8),
  },
  downIcon: {
    padding: 4,
    fontSize: 11,
  },
  userRow: {
    display: "flex",
    marginBottom: 15,
    ":last-child": {
      marginBottom: 0,
    },
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
    marginBottom: 20,
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
  deleteOpt: {
    color: colors.RED(),
  },
});

const mapStateToProps = (state) => ({
  currentUser: state.auth.user,
});
const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageOrgUsers);
