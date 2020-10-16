import React, { useState, useEffect, Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import SupportList from "./Projects/SupportList";
import Button from "~/components/Form/Button";

import { ModalActions } from "~/redux/modals";

// Config
import colors from "~/config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

const UserSupport = (props) => {
  const [supporters, setSupporters] = useState([]);
  const [isSupporter, setIsSupporter] = useState(false);

  useEffect(() => {
    fetchSupporterList();
  }, []);

  function fetchSupporterList() {
    let endpoint = API.SUPPORT_USERS({ authorId: props.authorId });
    // let endpoint = API.SUPPORT_USERS({ authorId: 4 });
    fetch(endpoint, API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        setSupporters(res || []);
      });
  }

  function formatDescription() {
    let count = supporters.length;

    if (!count) {
      return `Be the first to support ${props.authorName}!`;
    }

    if (props.author && props.user) {
      if (props.author.id === props.user.id) {
        return `${count} people have supported you!`;
      }
    }

    let description = `${count} people have supported ${props.authorName}.`;

    if (!isSupporter) {
      return (description += " Join!");
    }

    return description;
  }

  function openAuthorSupportModal() {
    let authorName = props.authorName.split(" ");
    return props.openAuthorSupportModal(true, {
      paper: {
        uploaded_by: {
          author_profile: {
            first_name: authorName[0],
            last_name: authorName[1],
          },
        },
      },
    });
  }

  return (
    <div className={css(styles.root)}>
      <div className={css(styles.title)}>Supported by</div>
      <div className={css(styles.subtitle)}>{formatDescription()}</div>
      {supporters && supporters.length ? (
        <div className={css(styles.supporterList)}>
          <SupportList size={70} users={supporters} />
        </div>
      ) : null}
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
  buttonContainer: {},
});

const mapDispatchToProps = {
  openAuthorSupportModal: ModalActions.openAuthorSupportModal,
};

export default connect(
  null,
  mapDispatchToProps
)(UserSupport);
