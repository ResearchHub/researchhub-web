import { faAngleDown, faBookmark } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import IconButton from "~/components/Icons/IconButton";
import ProjectExplorer from "~/components/ReferenceManager/lib/ProjectExplorer";
import { StyleSheet, css } from "aphrodite";
import { fetchReferenceOrgProjects } from "~/components/ReferenceManager/references/reference_organizer/api/fetchReferenceOrgProjects";
import { useOrgs } from "~/components/contexts/OrganizationContext";
import Menu from "~/components/shared/GenericMenu";
import FormSelect from "~/components/Form/FormSelect";
import colors from "~/config/themes/colors";
import { ID } from "~/config/types/root_types";

interface Props {}

const SaveToRefManager = ({}: Props) => {
  const [orgProjects, setOrgProjects] = useState([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOrgSelectorOpen, setIsOrgSelectorOpen] = useState<boolean>(false);
  const [isProjectExplorerOpen, setIsProjectExplorerOpen] =
    useState<boolean>(false);
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<{
    label: string;
    id: ID | null;
  }>({ label: "All References", id: null });
  const { orgs } = useOrgs();

  useEffect(() => {
    if (selectedOrg) {
      fetchReferenceOrgProjects({
        onError: () => {
          alert("Failed to fetch projects");
        },
        onSuccess: (payload): void => {
          setOrgProjects(payload ?? []);
        },
        payload: {
          organization: selectedOrg.id,
        },
      });
    }
  }, [selectedOrg]);

  useEffect(() => {
    if (orgs && orgs.length > 0 && !selectedOrg) {
      setSelectedOrg(orgs[0]);
    }
  }, [orgs]);

  return (
    <div className={css(styles.wrapper)}>
      <IconButton variant="round" onClick={() => setIsOpen(!isOpen)}>
        <FontAwesomeIcon icon={faBookmark} style={{ marginRight: 3 }} />
        <span>Save</span>
      </IconButton>
      {isOpen && (
        <div className={css(styles.main)}>
          <div
            className={css(styles.dropdown)}
            onClick={() => setIsProjectExplorerOpen(!isProjectExplorerOpen)}
          >
            <div className={css(styles.dropdownValue)}>
              {selectedProject.label}
            </div>
            <div className={css(styles.dropdownDownIcon)}>
              <FontAwesomeIcon
                icon={faAngleDown}
                color={colors.MEDIUM_GREY2()}
              />
            </div>
          </div>
          {isProjectExplorerOpen && (
            <div className={css(styles.projects)}>
              <div className={css(styles.explorer)}>
                <div className={css(styles.select)}>All References</div>
                <div className={css(styles.select)}>
                  Organization References
                </div>
                <div className={css(styles.divider)}></div>
                <ProjectExplorer
                  currentOrgProjects={orgProjects}
                  handleClick={({ projectName, projectID }) => {
                    setSelectedProject({ label: projectName, id: projectID });
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    border: `1px solid #DEDEE6`,
    background: "#FAFAFC",
    borderRadius: 4,
    padding: "5px 10px",
    fontSize: 14,
    width: "100%",
    position: "relative",
    userSelect: "none",
    cursor: "pointer",
    ":hover": {
      background: "#F0F0F7",
    },
  },
  divider: {
    borderBottom: "1px solid #DEDEE6",
  },
  dropdownDownIcon: {
    borderLeft: "1px solid #DEDEE6",
    display: "flex",
    height: "100%",
    position: "absolute",
    right: 0,
    top: 0,
    width: 30,
    alignItems: "center",
    // flexDirection: "column",
    justifyContent: "center",
    fontSize: 16,
  },
  wrapper: {
    position: "relative",
  },
  projects: {
    position: "relative",
  },
  explorer: {
    width: "100%",
    position: "absolute",
  },
  select: {},
  main: {
    position: "absolute",
    background: "white",
    width: 300,
    height: 200,
    padding: "15px",
    zIndex: 2,
  },
});

export default SaveToRefManager;
