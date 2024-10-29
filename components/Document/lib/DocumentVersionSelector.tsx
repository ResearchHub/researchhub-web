import Menu, { MenuOption } from "~/components/shared/GenericMenu";
import { DocumentVersion } from "./types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faPlus } from "@fortawesome/pro-light-svg-icons";
import { StyleSheet, css } from "aphrodite";
import { faClockRotateLeft } from "@fortawesome/pro-solid-svg-icons";
import IconButton from "~/components/Icons/IconButton";
import { useState } from "react";
import colors from "~/config/themes/colors";
import PaperVersionModal from "./PaperVersion/PaperVersionModal";

interface Args {
  versions: DocumentVersion[];
}

const buildVersionOptions = (versions: DocumentVersion[]) => {
  let options: Array<MenuOption> = versions.map((version) => {
    return {
      group: "Select version",
      value: version.id,
      label: version.formattedLabel,
    };
  });

  options = [
    ...options,
    {
      group: "Select version",
      value: "submit-new",
      html: (
        <div style={{ display: "flex", gap: 5 }}>
          <FontAwesomeIcon icon={faPlus} style={{ marginRight: 5 }} />
          Submit new version
        </div>
      ),
    },
  ];

  return options;
};

const DocumentVersionSelector = ({ versions }: Args) => {
  const versionOptions = buildVersionOptions(versions);
  const [selectedVersion, setSelectedVersion] = useState<DocumentVersion>(
    versions[0]
  );
  const [isNewVersionModalOpen, setIsNewVersionModalOpen] = useState(false);

  return (
    <div>
      <PaperVersionModal
        isOpen={true}
        closeModal={() => setIsNewVersionModalOpen(false)}
        versions={versions}
      />
      <Menu
        softHide={true}
        options={versionOptions}
        width={"100%"}
        id="version-select-menu"
        direction="bottom-right"
        menuStyleOverride={styles.menuStyleOverride}
        onSelect={(option: MenuOption) => {
          if (option.value === "submit-new") {
            setIsNewVersionModalOpen(true);
            return;
          }
        }}
      >
        <IconButton overrideStyle={styles.versionTrigger}>
          <FontAwesomeIcon icon={faClockRotateLeft} />v{selectedVersion.version}{" "}
          ({selectedVersion.publishedDate})
          <FontAwesomeIcon icon={faAngleDown} />
        </IconButton>
      </Menu>
    </div>
  );
};

const styles = StyleSheet.create({
  versionTrigger: {
    display: "flex",
    gap: 8,
    color: colors.MEDIUM_GREY2(),
    borderRadius: 4,
    border: `1px solid ${colors.GREY_LINE(1.0)}`,
    fontSize: 13,
    padding: "6px 10px 6px 10px",
  },
  menuStyleOverride: {},
});

export default DocumentVersionSelector;
