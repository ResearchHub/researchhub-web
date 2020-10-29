import AuthorAvatar from "~/components/AuthorAvatar";
import { StyleSheet, css } from "aphrodite";
import { useState, useEffect } from "react";

import { connect } from "react-redux";

const SupportList = (props) => {
  const [supporters, setSupporters] = useState(
    props.users ? formatList(props.users) : []
  );

  useEffect(() => {
    setSupporters(formatList(props.users));
  }, [props.users, props.size, props.limit]);

  /**
   *
   * @param {Array} arr list of supports { Object } user
   */
  function formatList(arr) {
    let users = [...arr];

    for (let i = 0; i < users.length; i++) {
      let user = users[i];
      if (props.user.id === user.id) {
        let temp = users[0];
        users[0] = user;
        users[i] = temp;
      }
    }

    return users.length > 2
      ? users.slice(0, props.limit ? props.limit : 3)
      : users;
  }

  function renderList() {
    return supporters.map((supporter, i) => {
      let { author_profile } = supporter;

      return (
        <div
          className={css(styles.supporter, i == 0 && styles.firstSupporter)}
          onClick={(e) => e.stopPropagation()}
          key={`supporter-${author_profile.id}`}
        >
          <AuthorAvatar
            author={author_profile}
            // disableLink={true}
            size={props.size ? props.size : 28}
          />
        </div>
      );
    });
  }

  return <div className={css(styles.root)}>{renderList()}</div>;
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  user: state.auth.user,
});

const styles = StyleSheet.create({
  root: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "max-content",
  },
  supporter: {
    marginLeft: -9,
  },
  firstSupporter: {
    marginLeft: 0,
  },
});

// const mapDispatchToProps = {

// }

export default connect(
  mapStateToProps,
  null
)(SupportList);
