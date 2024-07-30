import { AuthorProfile } from "~/config/types/root_types";
import Avatar from "@mui/material/Avatar";
import { isEmpty } from "~/config/utils/nullchecks";
import { css, StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup } from "@fortawesome/pro-duotone-svg-icons";

const CoAuthors = ({ coauthors }: { coauthors: AuthorProfile[] }) => {
  return (
    <div>
      <div className={css(styles.sectionHeader)}>Coauthors</div>
      {coauthors.length === 0 &&
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 15 }}>
          <FontAwesomeIcon icon={faUserGroup} color={colors.GREY()} fontSize={35} />
          <span style={{ color: colors.MEDIUM_GREY2()}}>No coauthors, yet.</span>
        </div>
      }
      <div>
        {coauthors.map((coauthor) => (
          <Link href={`/author/${coauthor.id}`} className={css(styles.author)} key={coauthor.id}>
            <Avatar src={coauthor.profileImage} sx={{ width: 25, height: 25, fontSize: 13, }}>
              {isEmpty(coauthor.profileImage) && ((coauthor?.firstName?.[0] ?? "") + (coauthor.lastName?.[0] ?? ""))}
            </Avatar>
            <div>{coauthor.firstName} {coauthor.lastName}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

const styles = StyleSheet.create({
  sectionHeader: {
    color: "rgb(139, 137, 148, 1)",
    textTransform: "uppercase",
    fontWeight: 500,
    letterSpacing: "1.2px",
    fontSize: 12,
    display: "flex",
    alignItems: "center",
    gap: 5,
    marginBottom: 20,
  },    
  author: {
    display: "flex",
    alignItems: "center",
    columnGap: "10px",
    marginBottom: 10,
    textDecoration: "none",
    color: colors.BLACK(0.9),
    ":last-child": {
      marginBottom: 0,
    },
    ":hover": {
      color: colors.NEW_BLUE(),
      cursor: "pointer",
    }
  }
})

export default CoAuthors;