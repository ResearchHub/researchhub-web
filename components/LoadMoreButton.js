import { StyleSheet, css } from "aphrodite";
import PropTypes from "prop-types";
import Ripples from "react-ripples";

import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";
import { ClipLoader } from "react-spinners";

const LoadMoreButton = ({
  onClick,
  key,
  label,
  isLoading = false,
  size = 25,
}) => {
  return (
    <div className={css(styles.loadMore)}>
      {!isLoading ? (
        <Ripples className={css(styles.loadMoreButton)} onClick={onClick}>
          {label}
        </Ripples>
      ) : (
        <ClipLoader
          sizeUnit={"px"}
          size={23}
          color={colors.BLUE(1)}
          loading={true}
        />
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  loadMore: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 25,
    height: 45,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      marginTop: 15,
      marginBottom: 15,
    },
  },
  loadMoreButton: {
    fontSize: 14,
    border: `1px solid ${colors.BLUE()}`,
    boxSizing: "border-box",
    borderRadius: 4,
    height: 45,
    width: 155,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: colors.BLUE(),
    cursor: "pointer",
    userSelect: "none",
    ":hover": {
      color: "white",
      backgroundColor: colors.BLUE(),
    },
  },
});

LoadMoreButton.propTypes = {
  isLoading: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string,
  key: PropTypes.string,
};

LoadMoreButton.defaultProps = {
  label: "Load More Results",
  key: "load-results",
};

export default LoadMoreButton;
