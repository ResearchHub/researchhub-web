import { useContext } from "react";
import { css, StyleSheet } from "aphrodite";
import { faPlus } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, SyntheticEvent } from "react";
import Button from "./Form/Button";
import dynamic from "next/dynamic";
import PermissionNotificationWrapper from "./PermissionNotificationWrapper";
import {
  NewPostButtonContext,
  NewPostButtonContextType,
} from "~/components/contexts/NewPostButtonContext";

const NewPostModal = dynamic(() => import("./Modals/NewPostModal"));

export type NewPostButtonProps = {
  customButtonStyle?: StyleSheet;
  onClick?: (e: SyntheticEvent) => void;
};

export default function NewPostButton({
  customButtonStyle,
  onClick,
}: NewPostButtonProps) {
  const { values: buttonValues, setValues: setButtonValues } =
    useContext<NewPostButtonContextType>(NewPostButtonContext);

  return (
    <Fragment>
      <PermissionNotificationWrapper
        loginRequired
        modalMessage="create a new post"
        onClick={(): void => setButtonValues({ ...buttonValues, isOpen: true })}
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
      <NewPostModal />
    </Fragment>
  );
}

const styles = StyleSheet.create({
  newPostLabel: {
    alignItems: "center",
    display: "flex",
    fontSize: 18,
    fontWeight: 500,
  },
  rippleClass: {
    width: "100%",
  },
});
