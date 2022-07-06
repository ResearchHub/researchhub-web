import { css, StyleSheet } from "aphrodite";
import { faPlus } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, SyntheticEvent, useState } from "react";
import {
  NewPostButtonContext,
  NewPostButtonContextType,
} from "~/components/contexts/NewPostButtonContext";
import { useContext } from "react";
import Button from "./Form/Button";
import PermissionNotificationWrapper from "./PermissionNotificationWrapper";
import ResearchHubPopover from "./ResearchHubPopover";
import { getIsOnMobileScreenSize } from "~/config/utils/getIsOnMobileScreenSize";
import { getModalOptionItems } from "./Modals/NewPostModal";
import { getCurrentUser } from "~/config/utils/getCurrentUser";
import { filterNull } from "~/config/utils/nullchecks";
import ResearchhubOptionCard from "./ResearchhubOptionCard";
import colors from "~/config/themes/colors";

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
  const [popoverSelectedItemIndex, setPopoverSelectedItemIndex] =
    useState<number>(0);
  const isOnMobileScreen = getIsOnMobileScreenSize();
  const currentUser = getCurrentUser();

  const shouldOpenPopover = !isOnMobileScreen && buttonValues?.isOpen;
  const popoverOptionItems = getModalOptionItems(currentUser);
  const modalOptionCards = filterNull(popoverOptionItems).map(
    (option, index) => (
      <ResearchhubOptionCard
        description={option.description}
        header={option.header}
        icon={option.icon}
        isActive={index === popoverSelectedItemIndex}
        isCheckboxSquare={false}
        key={index}
        newFeature={option.newFeature}
        onSelect={(e: SyntheticEvent) => {
          e.stopPropagation();
          setPopoverSelectedItemIndex(index);
        }}
        whiteStyle
      />
    )
  );
  return (
    <PermissionNotificationWrapper
      loginRequired
      modalMessage="create a new post"
      onClick={(): void => {
        buttonValues.isOpen
          ? setButtonValues({ ...buttonValues, isOpen: false })
          : setButtonValues({ ...buttonValues, isOpen: true });
      }}
      permissionKey="CreatePaper"
      styling={styles.rippleClass}
    >
      <ResearchHubPopover
        containerStyle={{ zIndex: 1000 }}
        positions={["bottom", "right"]}
        onClickOutside={(): void =>
          setButtonValues({ ...buttonValues, isOpen: false })
        }
        popoverContent={
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: 4,
              boxShadow: `3px 2px 12px ${colors.STANDARD_BOX_SHADOW}`,
              position: "fixed",
              right: 28,
              top: 64,
            }}
          >
            {modalOptionCards}
          </div>
        }
        isOpen={shouldOpenPopover}
        targetContent={
          <Button
            customButtonStyle={customButtonStyle && customButtonStyle}
            hideRipples={true}
            label={
              // isLink prop does not allow onClick to trigger on link click
              <div className={css(styles.newPostLabel)}>
                <FontAwesomeIcon
                  style={{ marginRight: 8 }}
                  // @ts-ignore icon prop works with FontAwesome
                  icon={faPlus}
                />
                <span>{"New"}</span>
              </div>
            }
            onClick={() => onClick && onClick}
            size={"newPost"}
          />
        }
      />
    </PermissionNotificationWrapper>
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
