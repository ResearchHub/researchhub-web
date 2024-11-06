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
import { useRouter } from "next/router";

interface Args {
  versions: DocumentVersion[];
}

const buildVersionOptions = (versions: DocumentVersion[]) => {
  const reversedVersions = versions.reverse();
  let options: Array<MenuOption> = reversedVersions.map((version) => {
    return {
      group: "Select version",
      value: version.paperId,
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
  const router = useRouter();
  const currentPaperId = router.query.documentId as string;

  const versionOptions = buildVersionOptions(versions);
  const [selectedVersion, setSelectedVersion] = useState<DocumentVersion>(
    versions.find(v => String(v.paperId) === String(currentPaperId)) || versions[0]
  );
  const [isNewVersionModalOpen, setIsNewVersionModalOpen] = useState(false);

  return (
    <div>
      <PaperVersionModal
        isOpen={isNewVersionModalOpen}
        closeModal={() => setIsNewVersionModalOpen(false)}
        versions={versions}
      />
      <Menu
        softHide={true}
        options={versionOptions}
        width={"100%"}
        selected={currentPaperId}
        id="version-select-menu"
        direction="bottom-right"
        menuStyleOverride={styles.menuStyleOverride}
        onSelect={(option: MenuOption) => {
          
          if (option.value === "submit-new") {
            setIsNewVersionModalOpen(true);
            return;
          }
          else {
            setSelectedVersion(versions.find(v => String(v.paperId) === String(option.value)) || versions[0]);
            router.push(`/paper/${option.value}`);
          }
        }}
      >
        <IconButton overrideStyle={styles.versionTrigger}>
          <FontAwesomeIcon icon={faClockRotateLeft} />{selectedVersion.formattedLabel}{" "}
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
