import { createContext, useContext } from "react";
import { css, StyleSheet } from "aphrodite";
import { faPlus } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, SyntheticEvent } from "react";
import { ID } from "~/config/types/root_types";
import Button from "./Form/Button";
import dynamic from "next/dynamic";
import PermissionNotificationWrapper from "./PermissionNotificationWrapper";
const NewPostModal = dynamic(() => import("./Modals/NewPostModal"));

export type NewPostButtonContextParams = { isOpen: boolean; paperID?: ID };

export type NewPostButtonContextType = {
  newPostButtonContext: NewPostButtonContextParams;
  setNewPostButtonContext: (NewPostButtonContextParams) => void;
};

export type NewPostButtonProps = {
  customButtonStyle?: StyleSheet;
  onClick?: (e: SyntheticEvent) => void;
};

export const NewPostButtonContext = createContext<NewPostButtonContextType>({
  newPostButtonContext: { isOpen: false, paperID: null },
  setNewPostButtonContext: () => {},
});

export default function NewPostButton({
  customButtonStyle,
  onClick,
}: NewPostButtonProps) {
  const { newPostButtonContext, setNewPostButtonContext } =
    useContext(NewPostButtonContext);

  const { isOpen, paperID } = newPostButtonContext ?? {};
  const setIsOpen = (flag: boolean): void =>
    setNewPostButtonContext({ ...newPostButtonContext, isOpen: flag });

  return (
    <Fragment>
      <PermissionNotificationWrapper
        loginRequired
        modalMessage="create a new post"
        onClick={(): void => setIsOpen(true)}
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
      <NewPostModal isOpen={isOpen} setIsOpen={setIsOpen} />
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
