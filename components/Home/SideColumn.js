import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import { connect } from "react-redux";
import Ripples from "react-ripples";
import ReactPlaceholder from "react-placeholder/lib";

// Config
import colors from "../../config/themes/colors";

const DEFAULT_TRANSITION_TIME = 400;

class SideColumn extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {};
    this.state = {
      ...this.initialState,
    };
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {}

  isActive = (id) => {
    return this.props.activeItem === id;
  };

  renderListItem = (list = []) => {
    const { activeItem, onItemClick, id } = this.props;

    return list.map((entry, i) => {
      const { href, query, linkAs, name, icon } = entry;

      const body = href ? (
        <Link
          href={{
            pathname: href,
            query,
          }}
          as={linkAs}
        >
          <a className={css(styles.link)}>
            <span className={css(styles.icon)}>{icon}</span>
            <span className={"clamp1"}>{name}</span>
          </a>
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
              ready={true}
              customPlaceholder={
                customPlaceholder ? (
                  customPlaceholder
                ) : (
                  <customPlaceholderPlaceholder color="#efefef" rows={5} />
                )
              }
            >
              {renderListItem ? renderListItem() : this.renderListItem(data)}
            </ReactPlaceholder>
            {/* {pages > page && (
              <div
                className={css(styles.viewMoreButton)}
                onClick={this.nextPage}
              >
                View more
              </div>
            )} */}
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
    backgroundColor: "#FFF",
    border: "1px solid #ededed",
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
    color: "#a7a6b0",
    transition: "all ease-out 0.1s",
    width: "100%",
    boxSizing: "border-box",
    margin: 0,
    padding: "0px 15px 0px 20px",
    marginBottom: 10,
  },
  cogButton: {
    color: "#a7a6b0",
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
    borderLeft: "3px solid #fff",
    borderBottom: "1px solid #F0F0F0",
    padding: "10px 15px",
    color: colors.BLACK(0.6),
    ":hover": {
      borderLeft: `3px solid ${colors.NEW_BLUE()}`,
      backgroundColor: "#FAFAFA",
      color: colors.NEW_BLUE(),
    },
    ":active": {
      color: colors.NEW_BLUE(),
      background:
        "linear-gradient(90deg, rgba(57, 113, 255, 0.1) 0%, rgba(57, 113, 255, 0) 100%)",
      borderLeft: `3px solid ${colors.NEW_BLUE()}`,
    },
    ":focus": {
      color: colors.NEW_BLUE(),
      background:
        "linear-gradient(90deg, rgba(57, 113, 255, 0.1) 0%, rgba(57, 113, 255, 0) 100%)",
      borderLeft: `3px solid ${colors.NEW_BLUE()}`,
    },
  },
  last: {
    opacity: 1,
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
    background: "#EAEAEA",
    border: "1px solid #ededed",
  },
  current: {
    color: colors.NEW_BLUE(),
    background:
      "linear-gradient(90deg, rgba(57, 113, 255, 0.1) 0%, rgba(57, 113, 255, 0) 100%)",
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
    color: "rgba(78, 83, 255)",
    fontWeight: 300,
    textTransform: "capitalize",
    fontSize: 16,
    padding: 20,
    borderTop: "1px solid #F0F0F0",
    boxSizing: "border-box",
    width: "100%",
    cursor: "pointer",
    ":hover": {
      color: "rgba(78, 83, 255, .5)",
      textDecoration: "underline",
    },
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideColumn);
