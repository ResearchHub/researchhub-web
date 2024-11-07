import { css, StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/pro-solid-svg-icons";
import { faGoogleScholar, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { useCallback, useMemo } from 'react';

const editors = [
    {
      name: "Maulik M. Dhandha, MD FAAD",
      role: "Editor in Chief",
      bio: "Dr. Maulik Dhandha completed his medical school and residency training in Dermatology at Saint Louis University. He practices general dermatology and is actively involved in clinical research. His work is focused on autoimmune and inflammatory skin conditions including Pemphigus Vulgaris, Psoriasis, Hidradenitis Suppurative, Atopic Dermatitis and others. His work has been published in highly reputable journals like - Journal of American Academy of Dermatology, American Journal of Dermatopathology, Autoimmunity, and British Journal of Dermatology.",
      image: "/static/editorial-board/MaulikDhandha.jpeg",
      authorId: "931964",
      socialLinks: {
        email: "maulik.editor@researchhub.foundation",
        linkedin: "https://www.linkedin.com/in/maulik-dhandha-1836a5227/",
        scholar: "https://scholar.google.com/citations?user=M2JZCWMAAAAJ&hl=en"
      }
    },
    {
      name: "Emilio Merheb, PhD",
      role: "Associate Editor",
      bio: "Dr. Emilio Merheb is an Instructor at the Diabetes, Obesity, and Metabolism Institute (DOMI) at the Icahn School of Medicine at Mount Sinai. His scientific and research expertise specializes in endocrinology, metabolism, neuroscience, biochemistry, oncology, and molecular biology. Dr. Merheb completed his doctoral training and post-doctoral fellowship at the Albert Einstein College of Medicine. His research on neurodegeneration, islet biology, and β-cell therapies appears in top journals like Cell Metabolism, PNAS, and eLife. Notably, His dedication to science resulted in the recipient of multiple awards, including the Julius Marmur Award.",
      image: "/static/editorial-board/EmilioMerheb.jpeg",
      authorId: "1872316",
      socialLinks: {
        email: "emilio.editor@researchhub.foundation",
        linkedin: "https://www.linkedin.com/in/emilio-merheb-ph-d-29ba10154/",
        scholar: "https://scholar.google.com/citations?user=MY7E-6QAAAAJ&hl=en"
      }
    },
    {
      name: "Attila Karsi, PhD",
      role: "Associate Editor",
      bio: "Dr. Attila Karsi earned his MSc and PhD degrees from Auburn University and is a tenured professor in the College of Veterinary Medicine at Mississippi State University. His research focuses on bacterial pathogenesis, host-pathogen interactions, and vaccine development. He has published over 100 peer-reviewed articles in esteemed journals, including Nucleic Acids Research, Journal of Bacteriology, Frontiers in Microbiology, and PLOS One.",
      image: "/static/editorial-board/AttilaKarsi.jpeg",
      authorId: "984218",
      socialLinks: {
        email: "attila.editor@researchhub.foundation",
        linkedin: "https://www.linkedin.com/in/attilakarsi/",
        scholar: "https://scholar.google.com/citations?user=kkhhBZgAAAAJ&hl=en"
      }
    },
    {
      name: "Interested in joining as an Editor?",
      role: "Associate Editor",
      bio: "If you're interested in joining the Editorial Board, please apply here by emailing maulik.editor@researchhub.foundation. Relevant qualifications include a PhD, a strong publication record, and a passion for driving scientific progress through innovative peer review systems.",
      image: "/static/EinsteinAvatar.png",
      authorId: "3884973",
      socialLinks: {
        email: "maulik.editor@researchhub.foundation",
        linkedin: "",
        scholar: ""
      }
    }
];

const EditorialBoardSection = () => {
  // Memoize the editor cards since they're static
  const editorCards = useMemo(() => editors.map((editor, index) => (
    <EditorCard key={index} editor={editor} />
  )), []);

  return (
    <div className={css(styles.container)}>
      <div className={css(styles.headerContent)}>
        <h2 className={css(styles.title)}>Editorial Board</h2>
        <p className={css(styles.subtitle)}>
          Our goal at ResearchHub is to drive scientific progress by introducing innovative
          reward systems that compensate peer reviewers for their contributions.
        </p>
      </div>

      <div className={css(styles.editorsGrid)}>
        {editorCards}
      </div>
    </div>
  );
};

// 2. Split into smaller components for better re-render control
const EditorCard = ({ editor }) => {
  const isCallForEditors = editor.name === "Interested in joining as an Editor?";
  
  const handleEmailClick = useCallback(() => {
    const subject = "ResearchHub Journal: Editorial Board Position";
    const body = `Dear Dr. Dhandha,

I am writing to express my interest in joining the ResearchHub Journal Editorial Board as [Chief/Associate] Editor.

My qualifications include:
[Your qualifications]

Best,
[Your name]
`;
    
    const mailtoLink = `mailto:${editor.socialLinks.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  }, [editor.socialLinks.email]);

  const handleProfileClick = useCallback(() => {
    if (!isCallForEditors) {
      window.location.href = `./author/${editor.authorId}`;
    }
  }, [editor.authorId, isCallForEditors]);

  // Memoize social links since they're static per editor
  const socialLinks = useMemo(() => (
    <div className={css(styles.socialLinks)}>
      <a 
        onClick={(e) => {
          e.preventDefault();
          if (isCallForEditors) {
            handleEmailClick();
          } else {
            window.location.href = `mailto:${editor.socialLinks.email}`;
          }
        }}
        href="#"
        className={css(styles.socialIconLink)}
      >
        <FontAwesomeIcon icon={faEnvelope} className={css(styles.socialIcon)} />
      </a>
      {!isCallForEditors && (
        <>
          <SocialLink 
            href={editor.socialLinks.linkedin} 
            icon={faLinkedin} 
          />
          <SocialLink 
            href={editor.socialLinks.scholar} 
            icon={faGoogleScholar} 
          />
        </>
      )}
    </div>
  ), [editor.socialLinks, isCallForEditors, handleEmailClick]);

  return (
    <div className={css(styles.editorCard)}>
      <div className={css(styles.editorHeader)}>
        <div className={css(styles.avatarColumn)}>
          <img 
            src={editor.image} 
            className={css(styles.editorAvatar, isCallForEditors && styles.nonClickableAvatar)} 
            alt={editor.name}
            onClick={handleProfileClick}
            role={isCallForEditors ? undefined : "button"}
          />
          {socialLinks}
        </div>
        <div className={css(styles.editorContent)}>
          <div className={css(styles.editorInfo)}>
            <h3 
              className={css(styles.editorName, isCallForEditors ? styles.clickableEmail : styles.clickable)}
              onClick={isCallForEditors ? handleEmailClick : handleProfileClick}
              role="button"
            >
              {editor.name}
            </h3>
            <p className={css(styles.editorRole)}>{editor.role}</p>
          </div>
          <hr className={css(styles.divider)} />
          <p className={css(styles.editorBio)}>{editor.bio}</p>
        </div>
      </div>
    </div>
  );
};

// 3. Create reusable components for repeated elements
const SocialLink = ({ href, icon }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className={css(styles.socialIconLink)}
  >
    <FontAwesomeIcon icon={icon} className={css(styles.socialIcon)} />
  </a>
);

const styles = StyleSheet.create({
  container: {
    background: "linear-gradient(180deg, #587FFF 0%, #3B72FF 100%)",
    padding: "80px 32px",
    width: "100%",
    position: "relative",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      padding: "60px 0",
    },
  },
  headerContent: {
    maxWidth: 737,
    margin: "0 auto",
    textAlign: "center",
    marginBottom: 60,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      marginBottom: 40,
      padding: "0 24px",
    },
  },
  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: 500,
    lineHeight: "40px",
    marginBottom: 16,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 28,
      lineHeight: "34px",
    },
  },
  subtitle: {
    color: "#F1F5FF",
    fontSize: 16,
    lineHeight: "140%",
    opacity: 0.8,
    maxWidth: 633,
    margin: "0 auto",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 15,
      padding: "0 16px",
    },
  },
  editorsGrid: {
    maxWidth: 1200,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 40,
    width: "100%",
    padding: "0 60px",
    boxSizing: "border-box",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      gridTemplateColumns: "1fr",
      gap: 24,
      width: "70%",
      maxWidth: 400,
      margin: "0 auto",
      padding: 0,
      justifyItems: "center",
      alignItems: "center",
    },
  },
  editorCard: {
    background: "rgba(255, 255, 255, 0.1)",
    border: "1.4px solid rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(1px)",
    borderRadius: 12,
    padding: 32,
    width: "100%",
    boxSizing: "border-box",
    transition: "all 0.2s ease-in-out",
    ":hover": {
      background: "rgba(255, 255, 255, 0.15)",
      border: "1.4px solid rgba(255, 255, 255, 0.4)",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      padding: 24,
      width: "110%",
      position: "relative",
    },
  },
  editorHeader: {
    display: "flex",
    gap: 32,
    alignItems: "flex-start",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      gap: 20,
    },
  },
  editorAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    border: "1px solid rgba(255, 255, 255, 0.8)",
    background: "#3971FF",
    flexShrink: 0,
    cursor: "pointer",
    transition: "transform 0.2s ease",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: 80,
      height: 80,
    },
    ":hover": {
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    }
  },
  editorContent: {
    flex: 1,
    paddingTop: 8,
    width: "120%",
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
    position: "relative",
    display: "inline-block",
    transition: "all 0.2s ease",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 16,
      lineHeight: "20px",
      marginBottom: 4,
    },
  },
  editorRole: {
    color: "#F1F5FF",
    fontSize: 14,
    lineHeight: "140%",
    opacity: 0.8,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 13,
    },
  },
  divider: {
    border: "none",
    borderTop: "1px solid rgba(255, 255, 255, 0.4)",
    margin: "16px 0",
    width: "100%",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      //marginTop:40,
      //marginLeft: -100,
    },
  },
  editorBio: {
    color: "#F1F5FF",
    fontSize: 14,
    lineHeight: "140%",
    marginBottom: 24,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 13,
      marginTop: 30,
      marginBottom: 60,
      marginLeft: -100,
      maxWidth: "200%",
    },
  },
  socialLinks: {
    display: "flex",
    gap: 12,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      position: "absolute",
      bottom: 24,
      left: 24,
      flexDirection: "row",
      gap: 8,
      alignItems: "flex-start",
    },
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
    },
  },
  avatarColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    alignItems: "center",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      gap: 12,
      alignItems: "center",
      marginBottom: 40,
    },
  },
  clickable: {
    cursor: "pointer",
    ":hover": {
      transform: "scale(1.02)",
      color: "rgba(255, 255, 255, 0.95)",
      textDecoration: "underline",
      textUnderlineOffset: "4px",
      textDecorationThickness: "1px",
    }
  },
  clickableEmail: {
    cursor: "pointer",
    ":hover": {
      transform: "scale(1.02)",
      color: "rgba(255, 255, 255, 0.95)",
      textDecoration: "underline",
      textUnderlineOffset: "4px",
      textDecorationThickness: "1px",
    }
  },
  nonClickableAvatar: {
    cursor: "not-allowed",
    ":hover": {
      boxShadow: "none",
    }
  },
});

export default EditorialBoardSection;
