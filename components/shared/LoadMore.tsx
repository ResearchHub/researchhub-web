import { faLongArrowDown } from "@fortawesome/pro-regular-svg-icons";
import { ClipLoader } from "react-spinners";
import IconButton from "../Icons/IconButton";
import colors from "~/config/themes/colors";
import { css, StyleSheet } from "aphrodite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LoadMore = ({ onClick, isLoading }: { onClick: () => void, isLoading: boolean }) => {
  return (
    <div className={css(loadMorestyles.loadMoreWrapper)}>
      <IconButton onClick={() => onClick()}>
        <span
          style={{
            color: colors.NEW_BLUE(),
            fontSize: 14,
            fontWeight: 500,
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          Load More
          {isLoading ? (
            <ClipLoader color={colors.NEW_BLUE()} loading={isLoading} size={15} />
          ) : (
            <FontAwesomeIcon icon={faLongArrowDown} />
          )}
        </span>
      </IconButton>
    </div>
  )
}

const loadMorestyles = StyleSheet.create({
  loadMoreWrapper: {
    marginTop: 15,
    justifyContent: "center",
    display: "flex",
    gap: 10,
  },
})

export default LoadMore;