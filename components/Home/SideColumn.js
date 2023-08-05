import { Component } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import ReactPlaceholder from "react-placeholder/lib";
import Ripples from "react-ripples";

// Config
import colors from "../../config/themes/colors";

class SideColumn extends Component {
  constructor(props) {
    super(props);
    this.initialState = {};
    this.state = {
      ...this.initialState,
    };
  }

  isActive = (id) => {
    return this.props.activeItem === id;
  };

  renderListItem = (list = []) => {
    const { onItemClick, id } = this.props;

    return list.map((entry, i) => {
      const { href, query, linkAs, name, icon } = entry;

      const body = href ? (
        <Link
          href={{
            pathname: href,
            query,
          }}
          as={linkAs}
          className={css(styles.link)}
        >
          <span className={css(styles.icon)}>{icon}</span>
          <span className={"clamp1"}>{name}</span>
        </Link>
      ) : (
        <div className={css(styles.link)}>
          <span className={css(styles.icon)}>{icon}</span>
          <span className={"clamp1"}>{name}</span>
        </div>
      );

      return (
        <Ripples
          className={css(
            styles.listItem,
            this.isActive(id) && styles.current,
            i === list.length - 1 && styles.last
          )}
          onClick={() => onItemClick(entry)}
        >
          {body}
        </Ripples>
      );
    });
  };

  render() {
    const {
      overrideStyle,
      data,
      title,
      icon,
      ready,
      customPlaceholder,
      renderListItem,
      listItems,
    } = this.props;

    return (
      <div className={css(styles.root, overrideStyle && overrideStyle)}>
        <div className={css(styles.container)}>
          <h5 className={css(styles.header)}>
            <span>{title && title}</span>
            {icon && icon}
          </h5>
          <div className={css(styles.list)}>
            <ReactPlaceholder
              showLoadingAnimation
              ready={ready}
              customPlaceholder={
                customPlaceholder ? (
                  customPlaceholder
                ) : (
                  <customPlaceholderPlaceholder
                    color={colors.PLACEHOLDER_CARD_BACKGROUND}
                    rows={5}
                  />
                )
              }
            >
              {listItems ??
                (renderListItem ? renderListItem() : this.renderListItem(data))}
            </ReactPlaceholder>
          </div>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "15px 0 1px",
    backgroundColor: colors.WHITE(),
    border: `1px solid ${colors.LIGHT_GREY_BACKGROUND}`,
    borderRadius: 4,
    boxSizing: "border-box",
    width: "100%",
    marginTop: 20,
  },
  container: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    textAlign: "left",
    cursor: "default",
  },
  header: {
    textTransform: "uppercase",
    fontWeight: 500,
    fontSize: 12,
    letterSpacing: 1.2,
    display: "flex",
    justifyContent: "space-between",
    color: colors.DARK_GREYISH_BLUE5(),
    transition: "all ease-out 0.1s",
    width: "100%",
    boxSizing: "border-box",
    margin: 0,
    padding: "0px 15px 0px 20px",
    marginBottom: 10,
  },
  cogButton: {
    color: colors.DARK_GREYISH_BLUE5(),
    opacity: 0.7,
    fontSize: 14,
    cursor: "pointer",
    ":hover": {
      opacity: 1,
    },
  },
  topIcon: {
    color: colors.RED(),
    marginLeft: 6,
    fontSize: 13,
  },
  listItem: {
    fontSize: 16,
    fontWeight: 300,
    cursor: "pointer",
    textTransform: "capitalize",
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
    width: "100%",
    transition: "all ease-out 0.1s",
    borderRadius: 3,
    borderLeft: `3px solid ${colors.WHITE()}`,
    borderBottom: `1px solid ${colors.VERY_LIGHT_GREY()}`,
    padding: "10px 15px",
    color: colors.BLACK(0.6),
    ":hover": {
      borderLeft: `3px solid ${colors.NEW_BLUE()}`,
      backgroundColor: colors.INPUT_BACKGROUND_GREY,
      color: colors.NEW_BLUE(),
    },
    ":active": {
      color: colors.NEW_BLUE(),
      background: `linear-gradient(90deg, ${colors.NEW_BLUE(0.1)} 0%, 
      ${colors.NEW_BLUE(0)} 100%)`,
      borderLeft: `3px solid ${colors.NEW_BLUE()}`,
    },
    ":focus": {
      color: colors.NEW_BLUE(),
      background: `linear-gradient(90deg, ${colors.NEW_BLUE(0.1)} 0%, 
      ${colors.NEW_BLUE(0)} 100%)`,
      borderLeft: `3px solid ${colors.NEW_BLUE()}`,
    },
  },
  last: {
    borderBottom: "none",
  },
  hubImage: {
    height: 35,
    width: 35,
    minWidth: 35,
    maxWidth: 35,
    borderRadius: 4,
    objectFit: "cover",
    marginRight: 10,
    background: colors.LIGHT_GREY2(),
    border: `1px solid ${colors.LIGHT_GREY_BACKGROUND}`,
  },
  current: {
    color: colors.NEW_BLUE(),
    background: `linear-gradient(90deg, ${colors.NEW_BLUE(0.1)} 0%, 
      ${colors.NEW_BLUE(0)} 100%)`,
    borderLeft: `3px solid ${colors.NEW_BLUE()}`,
  },
  list: {
    width: "100%",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  reveal: {
    opacity: 1,
  },
  space: {
    height: 10,
  },
  subscribedIcon: {
    marginLeft: "auto",
    color: colors.DARK_YELLOW(),
    fontSize: 11,
  },
  link: {
    textDecoration: "none",
    width: "100%",
    display: "flex",
    alignItems: "center",
    fontWeight: 500,
  },
  icon: {
    fontSize: 22,
    marginRight: 12,
    width: 30,
    display: "flex",
  },
  viewMoreButton: {
    color: colors.BLUE(),
    fontWeight: 300,
    textTransform: "capitalize",
    fontSize: 16,
    padding: 20,
    borderTop: `1px solid ${colors.VERY_LIGHT_GREY()}`,
    boxSizing: "border-box",
    width: "100%",
    cursor: "pointer",
    ":hover": {
      color: colors.BLUE(0.5),
      textDecoration: "underline",
    },
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SideColumn);
