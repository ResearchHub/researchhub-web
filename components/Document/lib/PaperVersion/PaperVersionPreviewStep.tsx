import { StyleSheet, css } from "aphrodite";
import FormTextArea from "~/components/Form/FormTextArea";
import { Paper } from "../types";
import { Hub } from "~/config/types/hub";
import { SuggestedAuthor, SuggestedInstitution } from "~/components/SearchSuggestion/lib/types";
import colors from "~/config/themes/colors";
import { HubBadge } from "~/components/Hubs/HubTag";

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
}

const PaperVersionPreviewStep = ({
  paper,
  title,
  abstract,
  selectedHubs,
  authorsAndAffiliations,
  changeDescription,
  setChangeDescription,
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
            <p>{item.author.name}</p>
            <p className={css(styles.institution)}>{item.institution.name}</p>
            {item.isCorrespondingAuthor && (
              <span className={css(styles.corresponding)}>Corresponding Author</span>
            )}
          </div>
        ))}
      </div>

      <div className={css(styles.section)}>
        <h4 className={css(styles.label)}>Change Description</h4>
        <FormTextArea
          value={changeDescription}
          onChange={(e) => setChangeDescription(e.target.value)}
          placeholder="Describe the changes made in this version..."
          rows={4}
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
    marginBottom: 16,
  },
  institution: {
    color: colors.BLACK(0.6),
    fontSize: 14,
  },
  corresponding: {
    fontSize: 12,
    color: colors.NEW_BLUE(),
    marginLeft: 8,
  },
  subheading: {
    // fontSize: 16,
    color: colors.BLACK(0.6),
    marginBottom: 8,
  }
});

export default PaperVersionPreviewStep;
