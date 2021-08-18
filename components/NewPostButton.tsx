import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-regular-svg-icons";
import React, { Fragment, SyntheticEvent, useState } from "react";
import Button from "./Form/Button";
import PermissionNotificationWrapper from "./PermissionNotificationWrapper";
import { css, StyleSheet } from "aphrodite";

// Dynamic modules
import dynamic from "next/dynamic";
const NewPostModal = dynamic(() => import("./Modals/NewPostModal"));

export type NewPostButtonProps = {
  customButtonStyle?: StyleSheet;
  onClick?: (e: SyntheticEvent) => void;
};

export default function NewPostButton({
  customButtonStyle,
  onClick,
}: NewPostButtonProps) {
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);

  return (
    <Fragment>
      <PermissionNotificationWrapper
        loginRequired
        modalMessage="create a new post"
        onClick={() => setIsNewPostModalOpen(true)}
        permissionKey="CreatePaper"
        styling={styles.rippleClass}
      >
        <Button
          customButtonStyle={customButtonStyle && customButtonStyle}
          hideRipples={true}
          label={
            // isLink prop does not allow onClick to trigger on link click
            <div className={css(styles.newPostLabel)}>
              <FontAwesomeIcon
                style={{ fontSize: "1.5em", marginRight: 8 }}
                icon={faPlus}
              />
              <span>{"New Post"}</span>
            </div>
          }
          onClick={onClick && onClick}
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
  rippleClass: {
    width: "100%",
  },
});
