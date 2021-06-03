import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Fragment, useState } from "react";
import Button from "./Form/Button";
import NewPostModal from "./Modals/NewPostModal";
import PermissionNotificationWrapper from "./PermissionNotificationWrapper";
import { css, StyleSheet } from "aphrodite";

export default function NewPostButton({ customButtonStyle, onClick }) {
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  return (
    <Fragment>
      <PermissionNotificationWrapper
        onClick={() => setIsNewPostModalOpen(true)}
        modalMessage="create a new post"
        loginRequired={true}
        permissionKey="CreatePaper"
      >
        <Button
          customButtonStyle={customButtonStyle}
          label={
            <div className={css(styles.newPostLabel)}>
              <span> New Post </span>{" "}
              <FontAwesomeIcon
                style={{ fontSize: "1.2em", marginLeft: 6 }}
                icon={["fal", "plus"]}
              />
            </div>
          }
          hideRipples={true}
          onClick={onClick}
        />
      </PermissionNotificationWrapper>
      <NewPostModal
        isOpen={isNewPostModalOpen}
        setIsOpen={setIsNewPostModalOpen}
      />
    </Fragment>
  );
}

const styles = StyleSheet.create({
  newPostLabel: {
    display: "flex",
    alignItems: "center",
  },
});
