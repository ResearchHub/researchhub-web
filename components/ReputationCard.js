import { Fragment, useEffect, useState } from "react";
import { css, StyleSheet } from "aphrodite";
import { useStore } from "react-redux";

import { modalStyles } from "~/config/themes/styles";
import { getCurrentUserReputation } from "~/config/utils/serializers";

const ReputationCard = (props) => {
  const store = useStore();
  const { permission } = store.getState();
  const [actions, setActions] = useState([]);
  const [actionCount, setActionCount] = useState(0);

  const reputation =
    props.reputation || getCurrentUserReputation(store.getState());

  const message = "Earn more reputation points by performing these actions";

  useEffect(() => {
    collectActions();
  }, [permission.success]);

  function collectActions() {
    const actionList = [];
    permission.success &&
      Object.keys(permission.data).map((k) => {
        const styling = [];
        const currentPermission = permission.data[k];

        if (
          reputation >= currentPermission.minimumReputation &&
          currentPermission.canEarn
        ) {
          setActionCount(actionCount + 1);
          styling.push(styles.available);
          actionList.push(
            <div key={k} className={css(...styling)}>
              {currentPermission.label}
            </div>
          );
        }
      });
    setActions(actionList);
  }

  return (
    <Fragment>
      <div className={css(modalStyles.subtitle, modalStyles.text)}>
        {actionCount > 0 && message}
      </div>
      {actions}
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
