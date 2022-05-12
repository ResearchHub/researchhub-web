import icons from "~/config/themes/icons";
import { css, StyleSheet } from "aphrodite";
import DropdownButton from "../Form/DropdownButton";
import { useState } from "react";
import excludeFromFeed from "./api/excludeDocFromFeedAPI";
import includeInFeed from "./api/includeDocInFeedAPI";
import CheckBox from "../Form/CheckBox";
import { MessageActions } from "~/redux/message";
import { connect } from "react-redux";
import { ID } from "~/config/types/root_types";
import colors from "~/config/themes/colors";

type Args = {
  unifiedDocumentId: ID,
  setMessage: Function,
  showMessage: Function,
}

function AdminButton({
  unifiedDocumentId,
  setMessage,
  showMessage,
}: Args) {

  const [excludeFromFeedSelectedChoices, setExcludeFromFeedSelectedChoices] = useState(["homepage", "hubs"]);
  const [isOpen, setIsOpen] = useState(false);
  const [isExcludeSubmenuOpen, setIsExcludeSubmenuOpen] = useState(false);

  const dropdownOpts = [{
    icon: icons.eyeSlash,
    label: "Exclude from Trending",
    value: "exclude",
    isVisible: true,
    onSelect: () => {
      const params = {
        excludeFromHomepage: excludeFromFeedSelectedChoices.includes("homepage"),
        excludeFromHubs: excludeFromFeedSelectedChoices.includes("hubs"),
      }
      
      excludeFromFeed({
        unifiedDocumentId,
        params,
        onSuccess: () => {
          setMessage("Excluded from Feed");
          showMessage({ show: true, error: false });
        },
        onError: () => {
          setMessage("Failed to exclude from feed");
          showMessage({ show: true, error: true });
        }
      })
    }
  },{
    icon: icons.eye,
    label: "Include in Trending",
    value: "include",
    isVisible: true,
    onSelect: () => {
      includeInFeed({
        unifiedDocumentId,
        onSuccess: () => {
          setMessage("Included in Feed");
          showMessage({ show: true, error: false });
        },
        onError: () => {
          setMessage("Failed to include in feed");
          showMessage({ show: true, error: true });
        }
      })
    }
  }].filter((opt) => opt.isVisible)

  const handleExcludeFromFeedCheckbox = (id, state, event) => {
    event.stopPropagation();
    const isSelected = excludeFromFeedSelectedChoices.includes(id);
    if (isSelected) {
      const newChoices = excludeFromFeedSelectedChoices.filter(c => c !== id)
      setExcludeFromFeedSelectedChoices(newChoices);
    }
    else {
      setExcludeFromFeedSelectedChoices([id, ...excludeFromFeedSelectedChoices]);  
    }    
  }

  const renderDropdownOpt = (opt: any) => {
    if (opt.value === "exclude") {
      return (
        <div>
          <div className={css(styles.opt)}>
            <span className={css(styles.iconWrapper)}>{opt.icon}</span>
            <span className={css(styles.optLabel)}>{opt.label}</span>
            <span className={css(styles.excludeSettingsBtn)} onClick={(event) => {
              event.stopPropagation();
              setIsExcludeSubmenuOpen(!isExcludeSubmenuOpen)
            }}>{icons.cog}</span>
          </div>
          <div className={css(styles.excludeMenuSettings, isExcludeSubmenuOpen && styles.excludeMenuSettingsVisible)}>
            <div className={css(styles.checkboxContainer)}>
              <CheckBox
                key={`${opt.value}-homepage`}
                label="Exclude from homepage"
                isSquare
                // @ts-ignore
                id={"homepage"}
                active={excludeFromFeedSelectedChoices.includes("homepage")}
                onChange={handleExcludeFromFeedCheckbox}
                labelStyle={styles.checkboxLabel}
                // @ts-ignore
                checkboxStyleOverride={styles.checkbox}
                // @ts-ignore
                checkStyleOverride={styles.checkIcon}
              />
            </div>
            <div className={css(styles.checkboxContainer)}>
              <CheckBox
                key={`${opt.value}-hubs`}
                label="Exclude from hubs"
                isSquare
                // @ts-ignore
                id={"hubs"}
                active={excludeFromFeedSelectedChoices.includes("hubs")}
                onChange={handleExcludeFromFeedCheckbox}
                labelStyle={styles.checkboxLabel}
                // @ts-ignore
                checkboxStyleOverride={styles.checkbox}
                // @ts-ignore
                checkStyleOverride={styles.checkIcon}
              />  
            </div>
          </div>
        </div>
      );      
    }
    return (
      <div>
        <span className={css(styles.iconWrapper)}>{opt.icon}</span>
        <span className={css(styles.optLabel)}>{opt.label}</span>
      </div>
    );
  };

  const optsAsHTML = dropdownOpts
    .map((opt) => renderDropdownOpt(opt))
    .map((opt, i) => ({ html: opt, ...dropdownOpts[i] }));

  return (
    <DropdownButton
      opts={optsAsHTML}
      // @ts-ignore
      labelAsHtml={icons.shield}
      isOpen={isOpen}
      onClick={() => setIsOpen(true)}
      onClickOutside={() => {
        setIsOpen(false);
      }}
      positions={["right", "bottom"]}
      onSelect={(selected) => {
        console.log(selected)
      }}
      // @ts-ignore
      overrideTargetButton={styles.overrideTargetButton}
      withDownIcon={false}
      onClose={() => setIsOpen(false)}
    />
  )
}

const styles = StyleSheet.create({
  "excludeSettingsBtn": {
    alignSelf: "flex-end",
    marginLeft: "auto",
    cursor: "pointer",
    ":hover": {
      opacity: 0.5,
    }
  },
  "excludeMenuSettings": {
    display: "none",    
    marginLeft: 15,
    marginTop: 15,
  },
  "excludeMenuSettingsVisible": {
    display: "block",    
  },  
  "iconWrapper": {

  },
  "checkIcon": {
    fontSize: 12,
  },
  "checkboxContainer": {
    marginTop: 10,
  },
  "checkbox": {
    minHeight: 16,
    minWidth: 16,
  },
  "checkboxLabel": {
    fontSize: 14,
  },
  "opt": {
    display: "flex",
  },
  "optLabel": {
    marginLeft: 10,
  },
  "overrideTargetButton": {
    backgroundColor: "none",
    paddingTop: 11,
    paddingLeft: 17,
    color: colors.RED(0.6),
    ":hover": {
      color: colors.RED(1),
      backgroundColor: "inherit",
      borderColor: "inherit",
    },    
  }
});

const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

const mapStateToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminButton);