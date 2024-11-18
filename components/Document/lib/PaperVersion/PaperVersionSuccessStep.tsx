import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Button from "~/components/Form/Button";

interface Props {
  paperId: number;
  paperTitle: string;
  closeModal: () => void;
}

const PaperVersionSuccessStep = ({ paperId, paperTitle, closeModal }: Props) => {
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
      <Button
        isLink={{ href: `/paper/${paperId}` }}
        label={paperTitle || "View Paper"}
        variant="contained"
        customButtonStyle={styles.viewButton}
        onClick={() => {
            closeModal();
        }}
      />
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
  viewButton: {
    marginBottom: 40,
    maxWidth: "80%",
  },
});

export default PaperVersionSuccessStep; 