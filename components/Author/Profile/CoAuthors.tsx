import { AuthorProfile } from "~/config/types/root_types";
import Avatar from "@mui/material/Avatar";
import { isEmpty } from "~/config/utils/nullchecks";
import { css, StyleSheet } from "aphrodite";

const CoAuthors = ({ coauthors }: { coauthors: AuthorProfile[] }) => {
  return (
    <div>
      <div>Coauthors</div>
      <div>
        {coauthors.map((coauthor) => (
          <div key={coauthor.id}>
            <Avatar src={coauthor.profileImage} sx={{ width: 48, height: 48, fontSize: 24 }}>
              {isEmpty(coauthor.profileImage) && ((coauthor?.firstName?.[0] ?? "") + (coauthor.lastName?.[0] ?? ""))}
            </Avatar>
            <div>{coauthor.firstName} {coauthor.lastName}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = StyleSheet.create({
})

export default CoAuthors;