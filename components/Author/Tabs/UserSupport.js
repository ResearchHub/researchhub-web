import React, { useState, useEffect, Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";

// Component
import SupportList from "./Projects/SupportList";
import Button from "~/components/Form/Button";
import SupportModal from "~/components/modal/SupporterModal";

// Redux
import { ModalActions } from "~/redux/modals";

// Config
import colors from "~/config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

const List = (props) => {
  const { supporters, openSupporterModal } = props;
  const [cutoff, setCutoff] = useState(props.mobile ? 4 : 6);
  const [diff, setDiff] = useState(supporters.length - cutoff);
  const [size, setSize] = useState(props.mobile ? 50 : 70);

  useEffect(() => {
    let hinge = props.mobile ? 4 : 6;

    if (supporters.length > hinge) {
      setDiff(supporters.length - hinge);
    }
    setCutoff(props.mobile ? 4 : 6);
    setSize(props.mobile ? 50 : 70);
  }, [props.mobile, props.supporters]);

  if (supporters && supporters.length) {
    return (
      <div className={css(styles.supporterList)}>
        <SupportList size={size} users={props.supporters} limit={cutoff} />
        {diff && (
          <div
            className={css(
              styles.supporterOverflow,
              props.mobile && styles.mobileSupporterOverflow
            )}
            onClick={openSupporterModal}
          >
            {diff}+
          </div>
        )}
      </div>
    );
  } else {
    return null;
  }
};

const UserSupport = (props) => {
  const [supporters, setSupporters] = useState([]);
  const [isAuthor, setIsAuthor] = useState(false);
  const [isSupporter, setIsSupporter] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    fetchSupporterList();
    determineIsAuthor();
  }, [props.auth.isLoggedIn, props.auth, props.auth.user]);

  function handleResize(e) {
    let width = e.target.innerWidth;

    if (width <= 767) {
      return setMobile(true);
    } else {
      return setMobile(false);
    }
  }

  function determineIsAuthor() {
    if (props.auth.isLoggedIn && props.user) {
      if (Number(props.authorId) == props.user.author_profile.id) {
        setIsAuthor(true);
      } else {
        isAuthor && setIsAuthor(false);
      }
    }
  }

  function determineIsSupporter(list) {
    if (!list.length) return;
    if (props.auth.isLoggedIn && props.user) {
      list.filter((support) => support.id === props.user.id).length
        ? setIsSupporter(true)
        : setIsSupporter(false);
    }
  }

  function fetchSupporterList() {
    return fetch(
      API.SUPPORT_USERS({ authorId: props.authorId }),
      API.GET_CONFIG()
    )
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        setSupporters([...res.results] || []);
        determineIsSupporter(res.results || []);
      });
  }

  function formatDescription() {
    let count = supporters.length;
    let prefix = count === 1 ? "person" : "people";
    let verb = count === 1 ? "has" : "have";

    let link = (
      <span className={css(styles.link)} onClick={openSupporterModal}>
        {`${count} ${prefix} `}
      </span>
    );

    if (!count) {
      return `Be the first to support ${props.authorName}!`;
    }

    if (isAuthor) {
      return (
        <Fragment>
          {link} {verb} supported you!
        </Fragment>
      );
    }

    let description = (
      <Fragment>
        {link} {verb} supported {props.authorName}.
      </Fragment>
    );

    if (!isSupporter) {
      return <Fragment>{description} Join!</Fragment>;
    }

    return description;
  }

  function openAuthorSupportModal() {
    return props.openAuthorSupportModal(true, {
      contentType: "author",
      author: props.author,
      setSupporters: setSupporters,
      supporters,
    });
  }

  function openSupporterModal() {
    return props.openSupporterModal(true);
  }

  return (
    <div className={css(styles.root)}>
      <SupportModal supporters={supporters} />
      <div className={css(styles.title)}>Supported by</div>
      <div className={css(styles.subtitle)}>{formatDescription()}</div>
      <List
        mobile={mobile}
        openSupporterModal={openSupporterModal}
        supporters={supporters}
      />
      <div className={css(styles.buttonContainer)}>
        <Button label="Join" onClick={openAuthorSupportModal} />
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: "15px 0",
  },
  title: {
    fontSize: 32,
    fontWeight: 500,
    color: colors.BLACK(),
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: colors.BLACK(),
    marginBottom: 30,
    // textAlign: 'center'
  },
  supporterList: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginBottom: 30,
  },
  supporterOverflow: {
    height: 73,
    width: 73,
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#FF9416",
    color: "#FFF",
    marginLeft: -9,
    zIndex: 2,
    cursor: "pointer",
    ":hover": {
      textDecoration: "underline",
    },
  },
  mobileSupporterOverflow: {
    height: 48,
    width: 48,
  },
  buttonContainer: {},
  link: {
    color: colors.BLUE(),
    cursor: "pointer",
    ":hover": {
      textDecoration: "underline",
    },
  },
});

const mapDispatchToProps = {
  openAuthorSupportModal: ModalActions.openAuthorSupportModal,
  openSupporterModal: ModalActions.openSupporterModal,
};

export default connect(
  null,
  mapDispatchToProps
)(UserSupport);
