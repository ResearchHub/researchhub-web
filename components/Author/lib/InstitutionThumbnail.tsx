import { css, StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";

const InstitutionThumbnail = ({ institution, size = 32 }) => {
  return (
    <div className={css(styles.thumbnailWrapper)} style={{ width: size, height: size }}>
      {institution.thumbnailImageUrl ? (
        <img
          src={institution.thumbnailImageUrl}
          className={css(styles.thumbnailImage)}
          alt={institution.name}
        />
      ) : (
        <div className={css(styles.thumbnailFallback)}>
          {(institution.name || "")[0]}
        </div>
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  thumbnailWrapper: {
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: colors.NEW_BLUE(0.1),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  thumbnailFallback: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.NEW_BLUE(0.1),
    color: colors.NEW_BLUE(),
    fontWeight: 500,
    fontSize: 14,
  },    
})

export default InstitutionThumbnail;