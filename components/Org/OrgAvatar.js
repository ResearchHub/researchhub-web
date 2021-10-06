import Image from "next/image";
import { StyleSheet, css } from "aphrodite";

const OrgAvatar = ({ org, size = 110 }) => {

  const getOrgInitials = (org) => {
    return org.name
      ? org.name.split(" ").map(s => s.charAt(0).toUpperCase())
      : "N/A";
  }

  return (
    <div className={css(styles.container)} style={{width: 100, height: 100}}>
      {org.cover_image
        ? <Image layout="fill" src={org.cover_image} />
        : <div className={css(styles.initials)}>{getOrgInitials(org)}</div>
      }
    </div>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  initials: {

  },
});

export default OrgAvatar;