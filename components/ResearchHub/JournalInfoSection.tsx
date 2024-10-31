import { css, StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/pro-solid-svg-icons";
import { faTwitter, faGoogleScholar } from "@fortawesome/free-brands-svg-icons";

const editors = [
    {
      name: "Sam Monic",
      role: "Editor in Chief",
      bio: "David Warmflash, MD, is an astrobiologist, space medicine researcher, and medical educator. Recently, he has served as Co-Principal Investigator on the study of space medicine effects.",
      image: "/static/EinsteinAvatar.png",
      socialLinks: {
        website: "https://research.com/sam-monic",
        twitter: "https://twitter.com/sammonic",
        scholar: "https://scholar.google.com/sammonic"
      }
    },
    {
      name: "Elena Rodriguez",
      role: "Associate Editor",
      bio: "Dr. Rodriguez specializes in molecular biology and genetics. Her groundbreaking research on CRISPR applications has been featured in Nature and Science journals.",
      image: "/static/EinsteinAvatar.png",
      socialLinks: {
        website: "https://research.com/elena",
        twitter: "https://twitter.com/elenarod",
        scholar: "https://scholar.google.com/elenarod"
      }
    },
    {
      name: "James Chen",
      role: "Associate Editor",
      bio: "Professor Chen leads the Quantum Computing Initiative at MIT. His work bridges the gap between theoretical physics and practical computing applications.",
      image: "/static/EinsteinAvatar.png",
      socialLinks: {
        website: "https://research.com/jchen",
        twitter: "https://twitter.com/jameschen",
        scholar: "https://scholar.google.com/jchen"
      }
    },
    {
      name: "Sarah Thompson",
      role: "Associate Editor",
      bio: "Dr. Thompson's research focuses on climate science and environmental modeling. She has contributed to major IPCC reports and leads several international research collaborations.",
      image: "/static/EinsteinAvatar.png",
      socialLinks: {
        website: "https://research.com/sthompson",
        twitter: "https://twitter.com/sarahthompson",
        scholar: "https://scholar.google.com/sthompson"
      }
    }
];

const JournalInfoSection = () => {
  return (
    <div className={css(styles.container)}>
      <div className={css(styles.headerContent)}>
        <h2 className={css(styles.title)}>Editorial Board</h2>
        <p className={css(styles.subtitle)}>
          Our goal at ResearchHub Journal is to drive scientific progress by introducing innovative
          reward systems that compensate peer reviewers for their contributions.
        </p>
      </div>

      <div className={css(styles.editorsGrid)}>
        {editors.map((editor, index) => (
          <div key={index} className={css(styles.editorCard)}>
            <div className={css(styles.editorHeader)}>
              <img 
                src={editor.image} 
                className={css(styles.editorAvatar)} 
                alt={editor.name}
              />
              <div className={css(styles.editorContent)}>
                <div className={css(styles.editorInfo)}>
                  <h3 className={css(styles.editorName)}>{editor.name}</h3>
                  <p className={css(styles.editorRole)}>{editor.role}</p>
                </div>
                <hr className={css(styles.divider)} />
                <p className={css(styles.editorBio)}>{editor.bio}</p>
                <div className={css(styles.socialLinks)}>
                  <a 
                    href={editor.socialLinks.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={css(styles.socialIconLink)}
                  >
                    <FontAwesomeIcon icon={faLink} className={css(styles.socialIcon)} />
                  </a>
                  <a 
                    href={editor.socialLinks.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={css(styles.socialIconLink)}
                  >
                    <FontAwesomeIcon icon={faTwitter} className={css(styles.socialIcon)} />
                  </a>
                  <a 
                    href={editor.socialLinks.scholar} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={css(styles.socialIconLink)}
                  >
                    <FontAwesomeIcon icon={faGoogleScholar} className={css(styles.socialIcon)} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    background: "linear-gradient(180deg, #587FFF 0%, #3B72FF 100%)",
    padding: "80px 32px",
    width: "100%",
    position: "relative",
  },
  headerContent: {
    maxWidth: 737,
    margin: "0 auto",
    textAlign: "center",
    marginBottom: 60,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: 500,
    lineHeight: "40px",
    marginBottom: 16,
  },
  subtitle: {
    color: "#F1F5FF",
    fontSize: 16,
    lineHeight: "140%",
    opacity: 0.8,
    maxWidth: 633,
    margin: "0 auto",
  },
  editorsGrid: {
    maxWidth: 1200,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 24,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      gridTemplateColumns: "1fr",
    },
  },
  editorCard: {
    background: "rgba(255, 255, 255, 0.1)",
    border: "1.4px solid rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(1px)",
    borderRadius: 8,
    padding: 24,
    transition: "all 0.2s ease-in-out",
    ":hover": {
      background: "rgba(255, 255, 255, 0.15)",
      border: "1.4px solid rgba(255, 255, 255, 0.4)",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    }
  },
  editorHeader: {
    display: "flex",
    gap: 24,
  },
  editorContent: {
    flex: 1,
    paddingTop: 0,
  },
  editorAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    border: "1px solid rgba(255, 255, 255, 0.8)",
    background: "#3971FF",
  },
  editorInfo: {
    //flex: 1,
    paddingTop: 0,
  },
  editorName: {
    color: "#FFFFFF",
    fontSize: 18,
    lineHeight: "24px",
    marginBottom: 8,
  },
  editorRole: {
    color: "#F1F5FF",
    fontSize: 14,
    lineHeight: "140%",
    opacity: 0.8,
  },
  divider: {
    border: "none",
    borderTop: "1px solid rgba(255, 255, 255, 0.4)",
    margin: "0 0 16px 0",
    width: "100%",
  },
  editorBio: {
    color: "#F1F5FF",
    fontSize: 14,
    lineHeight: "140%",
    marginBottom: 24,
  },
  socialLinks: {
    display: "flex",
    gap: 12,
  },
  socialIcon: {
    color: "#FFFFFF",
    width: 16,
    height: 16,
    cursor: "pointer",
    opacity: 0.8,
    transition: "all 0.2s ease",
  },
  socialIconLink: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.1)",
    transition: "all 0.2s ease",
    ":hover": {
      background: "rgba(255, 255, 255, 0.2)",
      transform: "translateY(-1px)",
      "& svg": {
        opacity: 1,
      }
    }
  }
});

export default JournalInfoSection;
