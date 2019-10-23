import { Fragment } from "react";
import { css, StyleSheet } from "aphrodite";
import { useStore } from "react-redux";

import { modalStyles } from "~/config/themes/styles";

const ReputationCard = (props) => {
  const store = useStore();
  const { permissions } = store.getState();

  const availableMessage =
    "Earn more reputation points by performing these actions";

  const { reputation } = props;

  function renderActions() {
    return (
      permissions.success &&
      Object.keys(permissions.data).map((k) => {
        const styling = [];
        const currentPermission = permissions.data[k];

        if (
          reputation >= currentPermission.minimumReputation &&
          currentPermission.canEarn
        ) {
          styling.push(styles.available);
          return (
            <div key={k} className={css(...styling)}>
              {currentPermission.label}
            </div>
          );
        }
      })
    );
  }

  return (
    <Fragment>
      <div className={css(modalStyles.subtitle, modalStyles.text)}>
        {availableMessage}
      </div>
      {renderActions()}
    </Fragment>
  );
};

const styles = StyleSheet.create({
  available: {
    textAlign: "left",
    textTransform: "capitalize",
  },
});

export default ReputationCard;
