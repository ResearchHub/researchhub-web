import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { css, StyleSheet } from "aphrodite";
import { faPlus } from "@fortawesome/pro-regular-svg-icons";
import { SyntheticEvent } from "react";
import { DEFAULT_POST_BUTTON_VALUES, NewPostButtonContext } from "~/components/contexts/NewPostButtonContext";
import { useContext } from "react";
import Button from "./Form/Button";
import PermissionNotificationWrapper from "./PermissionNotificationWrapper";
import ResearchHubPopover from "./ResearchHubPopover";
import { getIsOnMobileScreenSize } from "~/config/utils/getIsOnMobileScreenSize";
import { getModalOptionItems } from "./Modals/NewPostModal";
import { getCurrentUser } from "~/config/utils/getCurrentUser";
import {
  emptyFncWithMsg,
  filterNull,
  isEmpty,
} from "~/config/utils/nullchecks";
import ResearchhubOptionCard from "./ResearchhubOptionCard";
import colors from "~/config/themes/colors";
import { useRouter } from "next/router";
import { createNewNote } from "~/config/fetch";
import { NOTE_GROUPS } from "./Notebook/config/notebookConstants";
import { breakpoints } from "~/config/themes/screen";

export type NewPostButtonProps = {
  customButtonStyle?: object;
  onClick?: (e: SyntheticEvent) => void;
  isMinimized?: boolean;
};

export default function NewPostButton({
  customButtonStyle,
  onClick,
  isMinimized,
}: NewPostButtonProps) {
  const { values: buttonValues, setValues: setButtonValues } =
    useContext<NewPostButtonContextType>(NewPostButtonContext);

  const router = useRouter();
  const isOnMobileScreen = getIsOnMobileScreenSize();
  const currentUser = getCurrentUser();
  // TODO: calvinhlee - reorganize these context values to better represent currently available post-types
  const shouldOpenPopover =
    !isOnMobileScreen &&
    buttonValues?.isOpen &&
    !buttonValues?.isQuestionType &&
    buttonValues?.type !== "bounty" &&
    isEmpty(buttonValues.wizardBodyType);

  const popoverOptionCards = filterNull(
    getModalOptionItems({ currentUser, router, setButtonValues })
  ).map((option, index) => (
    <ResearchhubOptionCard
      description={option.description}
      header={option.header}
      icon={option.icon}
      isActive={false}
      isCheckboxSquare={false}
      key={index}
      newFeature={option.newFeature}
      onSelect={async (e: SyntheticEvent) => {
        e.stopPropagation();
        switch (option.key) {
          case "paper_upload":
            setButtonValues({
              ...DEFAULT_POST_BUTTON_VALUES,
              isOpen: true,
              wizardBodyType: "url_or_doi_upload",
            });
            break;
          case "eln":
            /* @ts-ignore - legacy code */
            const note = await createNewNote({
              orgSlug: currentUser.organization_slug,
              grouping: NOTE_GROUPS.WORKSPACE,
            });
            router.push(
              /* @ts-ignore - faulty */
              `/${currentUser.organization_slug}/notebook/${note.id}`
            );
            setButtonValues({
              ...DEFAULT_POST_BUTTON_VALUES,
            });
            break;
          case "hypothesis":
            router.push("/hypothesis/create");
            setButtonValues({
              ...DEFAULT_POST_BUTTON_VALUES,
            });
            break;
          case "question":
            setButtonValues({
              ...DEFAULT_POST_BUTTON_VALUES,
              isOpen: true,
              isQuestionType: true,
            });
            break;
          case "bounty":
            setButtonValues({
              ...DEFAULT_POST_BUTTON_VALUES,
              isOpen: true,
              type: "bounty",
            });
            break;
          default:
            emptyFncWithMsg("No optionKey found");
        }
      }}
      whiteStyle
    />
  ));
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
        containerStyle={{ zIndex: 100 }}
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
              left: isMinimized ? 12 : 26,
              top: 124,
            }}
          >
            {popoverOptionCards}
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
                  // @ts-ignore icon prop works with FontAwesome
                  icon={faPlus}
                />
                {!isMinimized && <span>{"New"}</span>}
              </div>
            }
            onClick={() => onClick && onClick()}
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
    gap: 8,
  },
  rippleClass: {
    width: "100%",
  },
});
