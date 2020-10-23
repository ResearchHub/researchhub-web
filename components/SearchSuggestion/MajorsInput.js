import React from "react";
import { StyleSheet, css } from "aphrodite";
import colors from "../../config/themes/colors";

// Component
import FormInput from "../Form/FormInput";
import Loader from "../Loader/Loader";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { capitalize } from "~/config/utils";

class MajorsInput extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      search: "",
      searching: false,
      showDropDown: false,
      majors: [],
      userUniversity: {},
    };
    this.state = {
      ...this.initialState,
    };
    this.dropdownRef;
  }

  componentDidMount() {
    if (this.props.value) {
      this.setState({ search: this.props.value });
    } else {
      this.setState({ ...this.initialState });
    }

    window.addEventListener("click", this.handleOutsideClick);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      if (this.props.value) {
        this.setState({ search: this.props.value });
      } else {
        this.setState({ ...this.initialState });
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.handleOutsideClick);
  }

  handleOutsideClick = (e) => {
    if (this.dropdownRef && !this.dropdownRef.contains(e.target)) {
      e.stopPropagation();
      this.setState({ showDropDown: false });
    }
  };

  handleSearch = (id, value) => {
    this.props.onChange && this.props.onChange(value);
    this.setState(
      {
        [id]: value,
        showDropDown: this.state.majors.length ? true : false,
        searching: this.state.search === "",
      },
      async () => {
        if (value === "") return;
        await fetch(API.MAJOR({ search: value }), API.GET_CONFIG())
          .then(Helpers.checkStatus)
          .then(Helpers.parseJSON)
          .then((res) => {
            let majors = [...res.results];
            this.setState({
              majors,
              searching: false,
              showDropDown: majors.length ? true : false,
            });
          });
      }
    );
  };

  handleClick = (e, index, majorObj) => {
    e.stopPropagation();
    let search = majorObj.major
      .split(" ")
      .map((el) => capitalize(el.toLowerCase()))
      .join(" ");
    this.setState({
      search,
      showDropDown: false,
      searching: false,
    });
    this.props.handleUserClick && this.props.handleUserClick(search, index);
  };

  renderOptions = () => {
    let { index } = this.props;
    let { majors } = this.state;
    if (majors.length) {
      return majors.map((entry, i) => {
        let { major, id } = entry;
        return (
          <div
            key={`uni-${i}`}
            className={css(styles.card)}
            onClick={(e) => this.handleClick(e, index, entry)}
          >
            <div className={css(styles.uniName)}>{major.toLowerCase()}</div>
          </div>
        );
      });
    } else {
      return (
        <div className={css(styles.emptyMessage)}>
          Sorry, there were no matches for your search.
        </div>
      );
    }
  };

  calcHeight = () => {
    let { majors } = this.state;
    switch (majors.length) {
      case 0:
      case 1:
        return styles.smallHeight;
      case 2:
        return styles.midHeight;
      default:
        break;
    }
  };

  render() {
    let {
      containerStyle,
      inputStyle,
      labelStyle,
      label,
      required,
      index,
      onClick,
      onSearch,
      value,
    } = this.props;
    let { searching, majors, showDropDown } = this.state;
    return (
      <div className={css(styles.container, containerStyle && containerStyle)}>
        {label && (
          <div
            className={css(
              styles.inputLabel,
              labelStyle && labelStyle,
              styles.text
            )}
          >
            {label && label}
            {required && <div className={css(styles.asterick)}>*</div>}
          </div>
        )}
        <span className={css(styles.inputWrapper)}>
          <FormInput
            id={"majorSearch"}
            value={this.state.search}
            onChange={this.handleSearch}
            required={required}
            placeholder={"Search major"}
            containerStyle={styles.removeMargin}
            autoComplete="off"
            onClick={onClick && onClick}
          />
          <div
            className={css(
              styles.dropDown,
              showDropDown && styles.show,
              this.calcHeight()
            )}
            ref={(ref) => (this.dropdownRef = ref)}
          >
            {searching ? (
              <div className={css(styles.emptyMessage)}>
                <Loader loading={true} />
              </div>
            ) : (
              this.renderOptions()
            )}
          </div>
        </span>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    maxHeight: 80,
    width: "100%",
  },
  inputLabel: {
    height: 19,
    fontWeight: "500",
    width: "100%",
    color: "#232038",
    display: "flex",
    justifyContent: "flex-start",
    textAlign: "left",
    marginBottom: 10,
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    flexDirection: "center",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  show: {
    opacity: 1,
    zIndex: 2,
  },
  removeMargin: {
    width: "100%",
    margin: 0,
    minHeight: "unset",
  },
  text: {
    fontFamily: "Roboto",
  },
  asterick: {
    color: colors.BLUE(1),
  },
  dropDown: {
    position: "absolute",
    boxSizing: "border-box",
    background: "#FFF",
    border: "#E8E8F2 1px solid",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
    top: 55,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    zIndex: -3,
    minHeight: 255,
    maxHeight: 255,
    height: 255,
    overflow: "scroll",
    transition: "opacity ease-in-out 0.3s",
    opacity: 0,
    paddingTop: 5,
  },
  smallHeight: {
    minHeight: 90,
    maxHeight: 90,
    height: 90,
  },
  midHeight: {
    minHeight: 180,
    maxHeight: 180,
    height: 180,
  },
  card: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "calc(95% - 40px)",
    padding: "10px 20px",
    minHeight: 35,
    maxHeight: 35,
    border: "1px solid #FAFAFA",
    backgroundColor: "#f7f7fb",
    cursor: "pointer",
    marginBottom: 5,
    ":hover": {
      borderColor: "#B3B3B3",
    },
  },
  uniName: {
    textTransform: "capitalize",
    fontSize: 16,
    "@media only screen and (max-width: 665px)": {
      fontSize: 16,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
  uniMeta: {
    fontSize: 14,
    fontWeight: 400,
    color: "#918F9B",
    "@media only screen and (max-width: 665px)": {
      fontSize: 13,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  emptyMessage: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MajorsInput;
