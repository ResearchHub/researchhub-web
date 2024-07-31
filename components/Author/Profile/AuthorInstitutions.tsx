import { AuthorInstitution, Institution } from "~/components/Institution/lib/types";
import { css, StyleSheet } from "aphrodite";
import { useState } from "react";
import colors from "~/config/themes/colors";

const AuthorInstitutions = ({ institutions }: { institutions: AuthorInstitution[] }) => {

  const [isShowingAll, setIsShowingAll] = useState(false);
  const visibleInstitutions = isShowingAll ? institutions : institutions.slice(0, 3);


  return (
    <div className={css(styles.wrapper)}>
      <div className={css(styles.listWrapper)}>
        {visibleInstitutions.map((authorInstitution, index) => (
          <span key={authorInstitution.id}>
            {authorInstitution.institution.displayName}
            {index < visibleInstitutions.length - 1 && ", "}
          </span>
        ))}
      </div>
      {institutions.length > 3 && (
        <div className={css(styles.showMore)} onClick={() => setIsShowingAll(!isShowingAll)}>
          {isShowingAll ? "Show less" : `+ ${institutions.length - visibleInstitutions.length} more`}
        </div>
      )}
    </div>
  )
}

const styles = StyleSheet.create({
  label: {
    fontWeight: 500,
  },
  wrapper: {
    display: "inline-flex",
    flexWrap: "wrap",
  },
  listWrapper: {
    display: "inline-flex",
    flexWrap: "wrap",
    columnGap: "5px",
  },
  showMore: {
    color: colors.NEW_BLUE(),
    cursor: "pointer",
    marginLeft: 5,
    marginTop: 1,
    fontSize: 14,
    ":hover": {
      textDecoration: "underline",
    }
  }
});

export default AuthorInstitutions;