import { StyleSheet, css } from "aphrodite";
import { Checkbox, FormControlLabel } from "@mui/material";
import colors from "~/config/themes/colors";

export type LicenseStepProps = {
  acceptedTerms: boolean;
  setAcceptedTerms: (value: boolean) => void;
  acceptedLicense: boolean;
  setAcceptedLicense: (value: boolean) => void;
  acceptedAuthorship: boolean;
  setAcceptedAuthorship: (value: boolean) => void;
  acceptedOriginality: boolean;
  setAcceptedOriginality: (value: boolean) => void;
};

const PaperVersionDeclarationStep = ({
  acceptedTerms,
  setAcceptedTerms,
  acceptedLicense,
  setAcceptedLicense,
  acceptedAuthorship,
  setAcceptedAuthorship,
  acceptedOriginality,
  setAcceptedOriginality,
}: LicenseStepProps) => {
  return (
    <div className={css(styles.container)}>
      <h3 className={css(styles.sectionTitle)}>License</h3>
      <p className={css(styles.description)}>
        ResearchHub publishes articles under the Creative Commons license. Please confirm your
        acceptance of the ResearchHub Terms and Conditions and the terms of the following Creative
        Commons Licenses in connection with the article being submitted ("our Article").
      </p>

      <div className={css(styles.checkboxGroup)}>
        <FormControlLabel
          control={
            <Checkbox 
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            />
          }
          label={
            <span>
              I accept the ResearchHub{" "}
              <a 
                href="/about/tos" 
                className={css(styles.link)}
                target="_blank"
                rel="noopener noreferrer"
              >Terms and Conditions</a>
              {" "}for publication
            </span>
          }
          sx={{ 
            alignItems: 'flex-start',
            '.MuiFormControlLabel-label': {
              marginTop: '9px'
            }
          }}
        />

        <FormControlLabel
          control={
            <Checkbox 
              checked={acceptedLicense}
              onChange={(e) => setAcceptedLicense(e.target.checked)}
            />
          }
          label={
            <span>
              I and my co-authors authorize the use of our Article in accordance with the{" "}
              <a 
                href="https://creativecommons.org/licenses/by/4.0/" 
                className={css(styles.link)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Creative Commons Attribution 4.0 International License (CC BY 4.0)
              </a>
              {" "}allowing others to share and adapt the work with proper attribution.
            </span>
          }
          sx={{ 
            alignItems: 'flex-start',
            '.MuiFormControlLabel-label': {
              marginTop: '9px'
            }
          }}
        />
      </div>

      <h3 className={css(styles.sectionTitle)}>Declarations</h3>
      <div className={css(styles.checkboxGroup)}>
        <FormControlLabel
          control={
            <Checkbox 
              checked={acceptedAuthorship}
              onChange={(e) => setAcceptedAuthorship(e.target.checked)}
            />
          }
          label="I confirm that all co-authors and I are authors of the Article, have agreed to the submission of this manuscript to ResearchHub, have all necessary rights and have obtained all necessary permissions and consents to grant the rights granted to our Article in the License section above."
          sx={{ 
            alignItems: 'flex-start',
            '.MuiFormControlLabel-label': {
              marginTop: '9px'
            }
          }}
        />

        <FormControlLabel
          control={
            <Checkbox 
              checked={acceptedOriginality}
              onChange={(e) => setAcceptedOriginality(e.target.checked)}
            />
          }
          label="I confirm that this manuscript is our original work, does not infringe on any existing copyrights or violate any laws including defamation, privacy, and data protection regulations, and that we as authors have obtained all necessary permissions for any third-party content included in the manuscript (e.g., figures, tables)."
          sx={{ 
            alignItems: 'flex-start',
            '.MuiFormControlLabel-label': {
              marginTop: '9px'
            }
          }}
        />
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 600,
    margin: 0,
  },
  description: {
    margin: 0,
    color: colors.MEDIUM_GREY2(),
    fontSize: 14,
    lineHeight: "1.4",
  },
  checkboxGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  link: {
    color: colors.NEW_BLUE(),
    textDecoration: "none",
    ":hover": {
      textDecoration: "underline",
    },
  },
});

export default PaperVersionDeclarationStep; 