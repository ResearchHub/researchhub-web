import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { ID } from "~/config/types/root_types";
import { MessageActions } from "~/redux/message";
import { useState } from "react";
import CheckBox from "../Form/CheckBox";
import colors from "~/config/themes/colors";
import DropdownButton from "../Form/DropdownButton";
import excludeFromFeed from "./api/excludeDocFromFeedAPI";
import featureDoc from "./api/featureDocAPI";

import includeInFeed from "./api/includeDocInFeedAPI";
import removeDocFromFeatured from "./api/removeDocFromFeaturedAPI";
import {
  cog,
  downSolid,
  eye,
  eyeSlash,
  shield,
  upSolid,
} from "~/config/themes/icons";

type Args = {
  unifiedDocumentId: ID;
  setMessage: Function;
  showMessage: Function;
};

function AdminButton({ unifiedDocumentId, setMessage, showMessage }: Args) {
  const [excludeFromFeedSelectedChoices, setExcludeFromFeedSelectedChoices] =
    useState(["homepage"]);
  const [makeFeaturedChoices, setMakeFeaturedChoices] = useState(["homepage"]);
  const [isOpen, setIsOpen] = useState(false);
  const [isFeaturedSubmenuOpen, setIsFeaturedSubmenuOpen] = useState(false);

  const _includeInFeed = () => {
    includeInFeed({
      unifiedDocumentId,
      onSuccess: () => {
        setMessage("Included in Feed");
        showMessage({ show: true, error: false });
      },
      onError: () => {
        setMessage("Failed to include in feed");
        showMessage({ show: true, error: true });
      },
    });
  };

  const _excludeFromFeed = () => {
    const params = {
      excludeFromHomepage: excludeFromFeedSelectedChoices.includes("homepage"),
      excludeFromHubs: excludeFromFeedSelectedChoices.includes("hubs"),
    };

    excludeFromFeed({
      unifiedDocumentId,
      params,
      onSuccess: () => {
        setIsOpen(false);
        setMessage("Excluded from Feed");
        showMessage({ show: true, error: false });
      },
      onError: () => {
        setIsOpen(false);
        setMessage("Failed to exclude from feed");
        showMessage({ show: true, error: true });
      },
    });
  };

  const _makeFeatured = () => {
    const params = {
      featureInHomepage: makeFeaturedChoices.includes("homepage"),
      featureInHubs: makeFeaturedChoices.includes("hubs"),
    };

    featureDoc({
      unifiedDocumentId,
      params,
      onSuccess: () => {
        setIsOpen(false);
        setMessage("Document is featured");
        showMessage({ show: true, error: false });
      },
      onError: () => {
        setIsOpen(false);
        setMessage("Failed to feature document");
        showMessage({ show: true, error: true });
      },
    });
  };

  const _removeFromFeatured = () => {
    removeDocFromFeatured({
      unifiedDocumentId,
      onSuccess: () => {
        setIsOpen(false);
        setMessage("Document removed from featured");
        showMessage({ show: true, error: false });
      },
      onError: () => {
        setIsOpen(false);
        setMessage("Failed to remove featured document");
        showMessage({ show: true, error: true });
      },
    });
  };

  const dropdownOpts = [
    {
      icon: eyeSlash,
      label: "Exclude from Trending",
      value: "exclude",
      isVisible: true,
      onSelect: () => {
        _excludeFromFeed();
      },
    },
    {
      icon: eye,
      label: "Include in Trending",
      value: "include",
      isVisible: true,
      onSelect: () => {
        _includeInFeed();
      },
    },
    {
      icon: upSolid,
      label: "Make Featured",
      value: "feature",
      isVisible: true,
      onSelect: () => {
        _makeFeatured();
      },
    },
    {
      icon: downSolid,
      iconStyle: styles.removeFromFeatureIcon,
      label: "Remove from Featured",
      value: "remove-feature",
      isVisible: true,
      onSelect: () => {
        _removeFromFeatured();
      },
    },
  ].filter((opt) => opt.isVisible);

  const handleExcludeFromFeedCheckbox = (id, state, event) => {
    event.stopPropagation();
    const isSelected = excludeFromFeedSelectedChoices.includes(id);
    if (isSelected) {
      const newChoices = excludeFromFeedSelectedChoices.filter((c) => c !== id);
      setExcludeFromFeedSelectedChoices(newChoices);
    } else {
      setExcludeFromFeedSelectedChoices([
        id,
        ...excludeFromFeedSelectedChoices,
      ]);
    }
  };

  const handleFeatureCheckbox = (id, state, event) => {
    event.stopPropagation();
    const isSelected = makeFeaturedChoices.includes(id);
    if (isSelected) {
      const newChoices = makeFeaturedChoices.filter((c) => c !== id);
      setMakeFeaturedChoices(newChoices);
    } else {
      setMakeFeaturedChoices([id, ...makeFeaturedChoices]);
    }
  };

  const renderDropdownOpt = (opt: any) => {
    if (opt.value === "exclude") {
      return (
        <div>
          <div className={css(styles.opt)}>
            <span className={css(styles.iconWrapper)}>{opt.icon}</span>
            <span className={css(styles.optLabel)}>{opt.label}</span>
          </div>
          <div className={css(styles.menuSettings)}></div>
        </div>
      );
    }
    if (opt.value === "feature") {
      return (
        <div>
          <div className={css(styles.opt)}>
            <span className={css(styles.iconWrapper, styles.iconMakeFeature)}>
              {opt.icon}
            </span>
            <span className={css(styles.optLabel)}>{opt.label}</span>
            <span
              className={css(styles.settingsBtn)}
              onClick={(event) => {
                event.stopPropagation();
                setIsFeaturedSubmenuOpen(!isFeaturedSubmenuOpen);
              }}
            >
              {cog}
            </span>
          </div>
          <div
            className={css(
              styles.menuSettings,
              isFeaturedSubmenuOpen && styles.featuredMenuSettingsVisible
            )}
          >
            <div className={css(styles.checkboxContainer)}>
              <CheckBox
                key={`${opt.value}-homepage`}
                label="Feature in homepage"
                isSquare
                // @ts-ignore
                id={"homepage"}
                active={makeFeaturedChoices.includes("homepage")}
                onChange={handleFeatureCheckbox}
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
                label="Feature in hubs"
                isSquare
                // @ts-ignore
                id={"hubs"}
                active={makeFeaturedChoices.includes("hubs")}
                onChange={handleFeatureCheckbox}
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
        <span className={css(styles.iconWrapper, opt.iconStyle)}>
          {opt.icon}
        </span>
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
      labelAsHtml={shield}
      isOpen={isOpen}
      onClick={() => setIsOpen(true)}
      onClickOutside={() => {
        setIsOpen(false);
      }}
      positions={["right", "bottom"]}
      onSelect={(_selected) => {}}
      // @ts-ignore
      overrideTargetButton={styles.overrideTargetButton}
      withDownIcon={false}
      onClose={() => {
        if (isFeaturedSubmenuOpen) {
          return setIsOpen(true);
        }
        return setIsOpen(false);
      }}
    />
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 10,
  },
  submitButton: {},
  settingsBtn: {
    alignSelf: "flex-end",
    marginLeft: "auto",
    cursor: "pointer",
    ":hover": {
      opacity: 0.5,
    },
  },
  menuSettings: {
    display: "none",
    marginLeft: 15,
    marginTop: 15,
  },
  excludeMenuSettingsVisible: {
    display: "block",
  },
  featuredMenuSettingsVisible: {
    display: "block",
  },
  iconWrapper: {},
  removeFromFeatureIcon: {
    color: colors.RED(),
  },
  iconMakeFeature: {
    color: colors.GREEN(),
  },
  checkIcon: {
    fontSize: 12,
  },
  checkboxContainer: {
    marginTop: 10,
  },
  checkbox: {
    minHeight: 16,
    minWidth: 16,
  },
  checkboxLabel: {
    fontSize: 14,
  },
  opt: {
    display: "flex",
  },
  optLabel: {
    marginLeft: 10,
  },
  overrideTargetButton: {
    backgroundColor: "none",
    paddingTop: 11,
    paddingLeft: 17,
    color: colors.RED(0.6),
    ":hover": {
      color: colors.RED(1),
      backgroundColor: "inherit",
      borderColor: "inherit",
    },
  },
});

const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(AdminButton);
