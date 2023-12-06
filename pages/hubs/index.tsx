import { GetStaticProps, NextPage } from "next";
import { getHubs } from "~/components/Hubs/api/fetchHubs";
import { StyleSheet, css } from "aphrodite";
import Error from "next/error";
import { connect, useSelector } from "react-redux";
import { ModalActions } from "~/redux/modals";
import HubSelect from "~/components/Hubs/HubSelect";
import Button from "~/components/Form/Button";
import { breakpoints } from "~/config/themes/screen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-regular-svg-icons";
import AddHubModal from "~/components/Modals/AddHubModal";
import { useState } from "react";
import { Hub } from "~/config/types/hub";
import { RootState } from "~/redux";
import { isEmpty } from "~/config/utils/nullchecks";
import { parseUser } from "~/config/types/root_types";

type Props = {
  hubs: any[];
  errorCode?: number;
  count: number;
  openAddHubModal: Function;
  handleClick?: (event) => void;
  maxPerRow?: number;
};

const HubsPage: NextPage<Props> = ({
  hubs,
  errorCode,
  openAddHubModal,
  count,
}) => {
  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  const currentUser = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );

  const isModerator = currentUser?.moderator;
  const isHubEditor = currentUser?.editorOf && currentUser?.editorOf.length > 0;
  const [_hubs, _setHubs] = useState<Hub[]>(hubs);

  const addHub = (newHub) => {
    _setHubs([newHub, ..._hubs]);
  };

  return (
    <div className={css(styles.container)}>
      <div className={css(styles.titleContainer)}>
        <h1 className={css(styles.title) + " clamp2"}>Hubs</h1>
        {(isModerator || isHubEditor) && (
          <Button
            customButtonStyle={styles.createHubButton}
            label={
              <div className={css(styles.createHubButtonContainer)}>
                <FontAwesomeIcon
                  style={{ marginRight: 8 }}
                  // @ts-ignore icon prop works with FontAwesome
                  icon={faPlus}
                />
                <div>Create a Hub</div>
              </div>
            }
            onClick={() => {
              openAddHubModal && openAddHubModal(true);
            }}
            isWhite
          />
        )}
      </div>
      <div className={css(styles.description)}>
        Hubs are collections of papers that are related to a specific topic. Use
        this page to explore hubs.
      </div>
      <HubSelect count={count} hubs={_hubs} canEdit={isModerator || isHubEditor} />
      <AddHubModal addHub={addHub} />
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 1340,
    margin: "0 auto",
    marginTop: 40,
    paddingLeft: 25,
    paddingRight: 25,
    boxSizing: "border-box",
    marginBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: 500,
    textOverflow: "ellipsis",
    marginBottom: 0,
  },
  titleContainer: {
    alignItems: "center",
    display: "flex",
    width: "100%",
    marginBottom: 15,
  },
  createHubButton: {
    marginLeft: "auto",
  },
  pagination: {
    marginTop: 24,
    marginBottom: 24,
    display: "flex",
    justifyContent: "flex-end",
    // mobile
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      justifyContent: "center",
      width: "100%",
    },
  },
  description: {
    fontSize: 15,
    marginBottom: 15,
    maxWidth: 790,
    lineHeight: "22px",
  },
  createHubButtonContainer: {
    display: "flex",
    alignItems: "center",
  },
});

export const getStaticProps: GetStaticProps = async (ctx) => {
  try {
    // @ts-ignore
    const { hubs, count } = await getHubs({});

    return {
      props: {
        hubs,
        count,
      },
      revalidate: 600,
    };
  } catch (error) {
    return {
      props: {
        errorCode: 500,
      },
      revalidate: 5,
    };
  }
};

const mapDispatchToProps = {
  openAddHubModal: ModalActions.openAddHubModal,
};
export default connect(null, mapDispatchToProps)(HubsPage);
