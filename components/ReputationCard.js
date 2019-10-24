import { Fragment, useState } from "react";
import { css, StyleSheet } from "aphrodite";
import { useStore } from "react-redux";

import { modalStyles } from "~/config/themes/styles";
import { getCurrentUserReputation } from "~/config/utils";

const ReputationCard = (props) => {
  const store = useStore();
  const { permissions } = store.getState();
  const [availableActionCount, setAvailableActionCount] = useState(0);

  const reputation =
    props.reputation || getCurrentUserReputation(store.getState());

  const message = "Earn more reputation points by performing these actions";

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
          setAvailableActionCount(availableActionCount++);
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
        {availableActionCount > 0 && message}
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
