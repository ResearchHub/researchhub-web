import { faBookmark } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import IconButton from "~/components/Icons/IconButton";
import ProjectExplorer from "~/components/ReferenceManager/lib/ProjectExplorer";
import { StyleSheet, css } from "aphrodite";
import { fetchReferenceOrgProjects } from "~/components/ReferenceManager/references/reference_organizer/api/fetchReferenceOrgProjects";
import { useOrgs } from "~/components/contexts/OrganizationContext";
import Menu from "~/components/shared/GenericMenu";
import FormSelect from "~/components/Form/FormSelect";

interface Props {}

const SaveToRefManager = ({}: Props) => {
  const [orgProjects, setOrgProjects] = useState([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOrgSelectorOpen, setIsOrgSelectorOpen] = useState<boolean>(false);
  const [isProjectExplorerOpen, setIsProjectExplorerOpen] =
    useState<boolean>(false);
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
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
        <div className={css(styles.optionsWrapper)}>
          <div className={css(styles.projects)}>
            <div
              className={css(styles.select)}
              onClick={() => setIsProjectExplorerOpen(!isProjectExplorerOpen)}
            >
              All References
            </div>
            {isProjectExplorerOpen && (
              <div className={css(styles.explorer)}>
                <ProjectExplorer currentOrgProjects={orgProjects} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },
  projects: {
    position: "relative",
  },
  explorer: {
    position: "absolute",
  },
  select: {
    border: "1px solid #DEDEE6",
  },
  optionsWrapper: {
    position: "absolute",
    background: "white",
    width: 300,
    height: 200,
    padding: "8px, 0px, 8px, 0px",
  },
});

export default SaveToRefManager;
