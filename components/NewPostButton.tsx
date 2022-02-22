import Button from "./Form/Button";
import PermissionNotificationWrapper from "./PermissionNotificationWrapper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, SyntheticEvent, useState } from "react";
import { css, StyleSheet } from "aphrodite";
import { faPlus } from "@fortawesome/pro-regular-svg-icons";

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
              <FontAwesomeIcon style={{ marginRight: 8 }} icon={faPlus} />
              <span>{"New"}</span>
            </div>
          }
          onClick={onClick && onClick}
          size={"newPost"}
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
    alignItems: "center",
    display: "flex",
    fontSize: 20,
    fontWeight: 500,
  },
  rippleClass: {
    width: "100%",
  },
});
