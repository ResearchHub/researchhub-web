import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import colors from "~/config/themes/colors";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShareIcon from '@mui/icons-material/Share';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

interface Props {
  paperId: number;
  paperTitle: string;
}

const PaperVersionSuccessStep = ({ paperId, paperTitle }: Props) => {
  return (
    <div className={css(styles.container)}>
      <div className={css(styles.successIcon)}>
        <CheckCircleIcon 
          sx={{ 
            fontSize: 80,
            color: "#00A698",
          }} 
        />
      </div>
      <div className={css(styles.title)}>Congratulations</div>
      <div className={css(styles.message)}>
        A preprint version of your paper is live on ResearchHub
      </div>
      <Link href={`/paper/${paperId}`} className={css(styles.paperLink)}>
        {paperTitle}
      </Link>

      <div className={css(styles.shareSection)}>
        <div className={css(styles.sectionTitle)}>Let your colleagues know</div>
        <div className={css(styles.socialIcons)}>
          <div className={css(styles.iconWrapper)}><ShareIcon /></div>
          <div className={css(styles.iconWrapper)}><TwitterIcon /></div>
          <div className={css(styles.iconWrapper)}><LinkedInIcon /></div>
        </div>
      </div>

      <div className={css(styles.timelineSection)}>
        <div className={css(styles.sectionTitle, styles.timelineTitle)}>
          What happens next?
        </div>
        <div className={css(styles.timeline)}>
          <div className={css(styles.timelineItem)}>
            <CheckCircleIcon sx={{ color: "#00A698" }} />
            <span className={css(styles.timelineText)}>Preprint available on ResearchHub</span>
          </div>
          <div className={css(styles.timelineItem)}>
            <RadioButtonUncheckedIcon sx={{ color: "#FFB800" }} />
            <div className={css(styles.timelineContent)}>
              <div className={css(styles.timelineText)}>Editor reviews submission</div>
              <div className={css(styles.timelineSubtext)}>1-3 days</div>
            </div>
          </div>
          <div className={css(styles.timelineItem)}>
            <RadioButtonUncheckedIcon sx={{ color: colors.GREY() }} />
            <div className={css(styles.timelineContent)}>
              <div className={css(styles.timelineText)}>Decision on manuscript by peer reviewers</div>
              <div className={css(styles.timelineSubtext)}>1-14 days</div>
            </div>
          </div>
          <div className={css(styles.timelineItem)}>
            <RadioButtonUncheckedIcon sx={{ color: colors.GREY() }} />
            <span className={css(styles.timelineText)}>Paper published in ResearchHub Journal</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "30px 20px",
    textAlign: "center",
    maxWidth: 600,
    margin: "0 auto",
  },
  title: {
    fontSize: 26,
    fontWeight: 500,
    color: colors.BLACK(),
    marginBottom: 15,
  },
  message: {
    fontSize: 16,
    lineHeight: "22px",
    color: colors.BLACK(0.8),
    marginBottom: 20,
  },
  paperLink: {
    fontSize: 16,
    color: colors.NEW_BLUE(),
    textDecoration: "none",
    marginBottom: 40,
    ":hover": {
      textDecoration: "underline",
    },
  },
  shareSection: {
    width: "100%",
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 500,
    color: colors.BLACK(),
    marginBottom: 15,
  },
  socialIcons: {
    display: "flex",
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrapper: {
    cursor: "pointer",
    color: colors.MEDIUM_GREY(),
    width: 40,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    transition: "all 0.2s ease-in-out",
    ":hover": {
      backgroundColor: colors.GREY(0.1),
      color: colors.NEW_BLUE(),
    },
  },
  timelineSection: {
    width: "100%",
    maxWidth: 400,
    textAlign: "left",
  },
  timeline: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    margin: "0 auto",
  },
  timelineItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    textAlign: "left",
  },
  timelineContent: {
    display: "flex",
    flexDirection: "column",
  },
  timelineText: {
    fontSize: 16,
    color: colors.BLACK(0.8),
  },
  timelineSubtext: {
    fontSize: 14,
    color: colors.MEDIUM_GREY(),
    marginTop: 4,
  },
  "@media only screen and (max-width: 767px)": {
    container: {
      padding: "20px 15px",
    },
    title: {
      fontSize: 22,
    },
    message: {
      fontSize: 14,
    },
    paperLink: {
      fontSize: 14,
    },
    sectionTitle: {
      fontSize: 16,
    },
    timelineText: {
      fontSize: 14,
    },
    timelineSubtext: {
      fontSize: 12,
    },
  },
  successIcon: {
    // backgroundColor: colors.SUCCESS(0.12),
    borderRadius: "50%",
    padding: 16,
    marginBottom: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  timelineTitle: {
    textAlign: "center",
    marginBottom: 24,
  },
});

export default PaperVersionSuccessStep; 