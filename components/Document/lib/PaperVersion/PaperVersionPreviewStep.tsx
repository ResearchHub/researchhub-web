import { StyleSheet, css } from "aphrodite";
import FormTextArea from "~/components/Form/FormTextArea";
import { Paper } from "../types";
import { Hub } from "~/config/types/hub";
import {
  SuggestedAuthor,
  SuggestedInstitution,
} from "~/components/SearchSuggestion/lib/types";
import colors from "~/config/themes/colors";
import { HubBadge } from "~/components/Hubs/HubTag";
import Avatar from "@mui/material/Avatar";
import { isEmpty } from "~/config/utils/nullchecks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuildingColumns,
  faEnvelope,
} from "@fortawesome/pro-solid-svg-icons";

interface Props {
  paper: Paper | null;
  title: string | null;
  abstract: string | null;
  selectedHubs: Hub[];
  authorsAndAffiliations: Array<{
    author: SuggestedAuthor;
    institution: SuggestedInstitution;
    isCorrespondingAuthor: boolean;
    email?: string;
    department?: string;
  }>;
  changeDescription: string;
  setChangeDescription: (value: string) => void;
  error?: string | null;
}

const PaperVersionPreviewStep = ({
  paper,
  title,
  abstract,
  selectedHubs,
  authorsAndAffiliations,
  changeDescription,
  setChangeDescription,
  error,
}: Props) => {
  return (
    <div className={css(styles.container)}>
      <h3 className={css(styles.sectionTitle)}>Preview changes</h3>

      <div className={css(styles.section)}>
        <h4 className={css(styles.label)}>Title</h4>
        <p>{title}</p>
      </div>

      <div className={css(styles.section)}>
        <h4 className={css(styles.label)}>Abstract</h4>
        <p>{abstract}</p>
      </div>

      <div className={css(styles.section)}>
        <h4 className={css(styles.label)}>Hubs</h4>
        <div className={css(styles.hubList)}>
          {selectedHubs.map((hub) => (
            <HubBadge key={hub.id} name={hub.name} />
          ))}
        </div>
      </div>

      <div className={css(styles.section)}>
        <h4 className={css(styles.label)}>Authors</h4>
        {authorsAndAffiliations.map((item, index) => (
          <div key={index} className={css(styles.author)}>
            <div className={css(styles.authorContent)}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Avatar
                  src={item.author.profileImage}
                  sx={{ width: 24, height: 24, fontSize: 14 }}
                >
                  {isEmpty(item.author.profileImage) &&
                    (item.author.fullName || "")[0]}
                </Avatar>
                <div className={css(styles.authorName)}>
                  {item.author.fullName}
                  {item.email && (
                    <>
                      - <div className={css(styles.email)}>{item.email}</div>
                    </>
                  )}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <FontAwesomeIcon
                  icon={faBuildingColumns}
                  style={{ width: 24 }}
                />
                <div>
                  <div className={css(styles.institutionName)}>
                    {item.institution.name}
                  </div>
                  {item.department && (
                    <div className={css(styles.departmentName)}>
                      Department: {item.department}
                    </div>
                  )}
                </div>
              </div>
              {item.isCorrespondingAuthor && (
                <div className={css(styles.correspondingAuthor)}>
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    style={{ marginRight: 12, fontSize: 16 }}
                  />
                  Corresponding author
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={css(styles.section)}>
        <h4 className={css(styles.label)}>Change Description</h4>
        <FormTextArea
          value={changeDescription || ""}
          onChange={(name, value) => {
            setChangeDescription(value)
          }}
          required={true}
          placeholder="Describe the changes made in this version..."
          rows={4}
          error={error}
        />
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: "20px 0",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 500,
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: 500,
    marginBottom: 8,
    color: colors.BLACK(0.6),
  },
  hubList: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  hub: {
    padding: "4px 12px",
    backgroundColor: colors.NEW_BLUE(0.1),
    borderRadius: 4,
    color: colors.NEW_BLUE(),
  },
  author: {
    padding: 16,
    background: "white",
    borderRadius: 4,
    border: `1px solid ${colors.GREY_LINE()}`,
    marginBottom: 12,
  },
  authorContent: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  authorName: {
    fontWeight: 500,
    fontSize: 15,
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  institutionName: {
    color: colors.BLACK(0.6),
    fontSize: 12,
    marginBottom: 4,
  },
  departmentName: {
    color: colors.BLACK(0.6),
    fontSize: 12,
  },
  email: {
    color: colors.BLACK(0.6),
    fontSize: 13,
  },
  correspondingAuthor: {
    fontSize: 13,
    color: colors.NEW_BLUE(),
    fontWeight: 400,
    display: "flex",
    alignItems: "center",
    marginLeft: 4,
  },
  subheading: {
    // fontSize: 16,
    color: colors.BLACK(0.6),
    marginBottom: 8,
  },
});

export default PaperVersionPreviewStep;
