import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { StyleSheet } from "aphrodite";

// Component
import Button from "~/components/Form/Button";
import Loader from "~/components/Loader/Loader";

// Redux
import { MessageActions } from "~/redux/message";

// Config
import colors from "~/config/themes/colors";
import { followUser, isFollowingUser } from "~/config/fetch";

const UserFollowButton = (props) => {
  const { auth, isUserOwnProfile, authorId, authorname } = props;

  const [isChecking, setIsChecking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    isReadyToCheck() && checkIsFollowingUser();
  }, [auth, isUserOwnProfile, authorId]);

  const isReadyToCheck = () => {
    const { auth } = props;
    return auth.isLoggedIn && !isChecking && !isUserOwnProfile;
  };

  const onClick = () => {
    const { auth, authorId: followeeId } = props;
    const userId = auth.user.id;
    setIsChecking(true);
    followUser({ followeeId, userId })
      .then(onFollowSucess)
      .catch(onFollowError);
  };

  const onFollowSucess = (state) => {
    const { showMessage, setMessage } = props;
    const message = state
      ? `Following ${authorname}`
      : `Unfollowed ${authorname}`;
    setIsFollowing(state);
    setIsChecking(false);
    setMessage(message);
    showMessage({ show: true });
  };

  const onFollowError = (err) => {
    const { showMessage, setMessage } = props;
    setMessage("Something went wrong Please try again!");
    showMessage({ error: true, show: true });
    setIsChecking(false);
  };

  const checkIsFollowingUser = () => {
    const { auth } = props;

    if (!auth.isLoggedIn) return;

    setIsChecking(true);
    isFollowingUser({ authorId }).then((state) => {
      setIsFollowing(state);
      setIsChecking(false);
    });
  };

  const handleLabel = () => {
    if (isChecking) {
      return (
        <Loader
          loading={true}
          size={10}
          color={isFollowing ? "#FFF" : colors.BLUE()}
        />
      );
    }

    if (isHovered && isFollowing) {
      return "Unfollow";
    }

    if (isFollowing) {
      return "Following";
    }

    return "Follow";
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Button
        onClick={onClick}
        label={handleLabel()}
        customButtonStyle={styles.editButtonCustom}
        rippleClass={styles.rippleClass}
        isWhite={!isFollowing || isHovered}
      />
    </div>
  );
};

const styles = StyleSheet.create({
  editButtonCustom: {
    height: 35,
    width: 175,
    "@media only screen and (max-width: 767px)": {
      height: 40,
      width: "100%",
      minWidth: "100%",
    },
  },
  rippleClass: {
    marginRight: 15,
    "@media only screen and (max-width: 767px)": {
      width: "100%",
    },
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserFollowButton);

// {!allowEdit && (
//   <div className={css(styles.editProfileButton)}>
//     <Button
//       label={() => (
//         <Fragment>
//           {/* <span style={{ marginRight: 10, userSelect: "none" }}>
//             {icons.user}
//           </span> */}
//           Follow
//         </Fragment>
//       )}
//       onClick={onUserFollow}
//       customButtonStyle={styles.editButtonCustom}
//       rippleClass={styles.rippleClass}
//       isWhite={true} // flip to normal when following
//     />
//   </div>
// )}
