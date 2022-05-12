import icons from "~/config/themes/icons";
import { css, StyleSheet } from "aphrodite";
import DropdownButton from "../Form/DropdownButton";
import { useState } from "react";
import excludeFromFeed from "./api/excludeDocFromFeed";
import includeInFeed from "./api/includeDocInFeed";
import CheckBox from "../Form/CheckBox";
import { MessageActions } from "~/redux/message";
import { connect } from "react-redux";

function AdminButton({ unifiedDocumentId, setMessage, showMessage }) {
  const [excludeFromFeedSelectedChoices, setExcludeFromFeedSelectedChoices] = useState(["homepage", "hubs"]);
  const [isOpen, setIsOpen] = useState(false);
  const [isExcludeSubmenuOpen, setIsExcludeSubmenuOpen] = useState(false);

  const dropdownOpts = [{
    icon: icons.eyeSlash,
    label: "Exclude from Trending",
    value: "exclude",
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
          setMessage("Error");
          showMessage({ show: true, error: true });
        }
      })
    }
  },{
    icon: icons.eye,
    label: "Include in Trending",
    value: "include",
    onSelect: () => {
      includeInFeed({
        unifiedDocumentId,
        onSuccess: () => {
          setMessage("Include in Feed");
          showMessage({ show: true, error: false });
        },
        onError: () => {
          setMessage("Error");
          showMessage({ show: true, error: true });
        }
      })
    }
  },{
    icon: icons.trash,
    label: "Remove page",
    value: "remove",
    onSelect: () => null
  }]

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
      // selected={filterBy.value}
      isOpen={isOpen}
      onClick={() => setIsOpen(true)}
      // dropdownClassName="adminSelect"
      onClickOutside={() => {
        setIsOpen(false);
      }}
      // overrideTitleStyle={styles.customTitleStyle}
      positions={["right", "bottom"]}
      // customButtonClassName={[
      //   styles.dropdownButtonOverride,
      //   styles.dropdownButtonOverrideForFilter,
      // ]}
      // overrideDownIconStyle={styles.overrideDownIconStyle}
      onSelect={(selected) => {
        // const selectedFilterObj = tabs.find(
        //   (t) => t.value === selectedFilter
        // );
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
    color: "rgba(36, 31, 58, 0.35)",
    paddingTop: 11,
    paddingLeft: 17,
    ":hover": {
      color: "inherit",
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