import { StyleSheet, css } from "aphrodite";
import PropTypes from "prop-types";

import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";

const SearchEmpty = ({ title, subtitle }) => {
  return (
    <div className={css(styles.wrapper)}>
      <img
        className={css(styles.emptyPlaceholderImage)}
        src={"/static/search/search-empty-state.png"}
        loading="lazy"
        alt={title}
      />
      <span className={css(styles.title)}>{title}</span>
      {subtitle && <span className={css(styles.subtitle)}>{subtitle}</span>}
    </div>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },
  emptyPlaceholderImage: {
    width: 400,
    objectFit: "contain",
    marginTop: 40,
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      width: "70%",
    },
  },
  title: {
    textAlign: "center",
    fontSize: 22,
    color: colors.BLACK(0.9),
    marginTop: 20,
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      fontSize: 16,
    },
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      width: "85%",
    },
  },
  subtitle: {
    textAlign: "center",
    fontSize: 18,
    color: colors.BLACK(0.5),
    marginTop: 10,
    marginBottom: 15,
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      fontSize: 14,
    },
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      width: "85%",
    },
  },
});

SearchEmpty.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
};

SearchEmpty.defaultProps = {
  title: "There are no results found for this criteria",
};

export default SearchEmpty;
