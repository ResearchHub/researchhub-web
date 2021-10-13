import Image from "next/image";
import { StyleSheet, css } from "aphrodite";
import colors from "config/themes/colors";

const OrgAvatar = ({ org, size = 30, fontSize = 14 }) => {
  const getOrgInitials = (org) => {
    return org?.name
      ? org?.name
          .split(" ")
          .map((s) => s.charAt(0).toUpperCase())
          .slice(0, 2)
      : "";
  };

  return (
    <div
      className={css(styles.container)}
      style={{ width: size, height: size, fontSize }}
    >
      {org?.cover_image ? (
        <Image layout="fill" src={org?.cover_image} />
      ) : (
        <div className={css(styles.initialsContainer)}>
          <div className={css(styles.initials)}>{getOrgInitials(org)}</div>
        </div>
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    color: "black",
  },
  initialsContainer: {
    height: "100%",
    borderRadius: "100px",
    background: colors.GREY(),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {},
});

export default OrgAvatar;
