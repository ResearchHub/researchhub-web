import { GetStaticProps, NextPage } from "next";
import { getHubs } from "~/components/Hubs/api/fetchHubs";
import { StyleSheet, css } from "aphrodite";
import Error from "next/error";
import { connect } from "react-redux";
import { ModalActions } from "~/redux/modals";
import HubSelect from "~/components/Hubs/HubSelect";
import { getCurrentUser } from "~/config/utils/getCurrentUser";
import Button from "~/components/Form/Button";
import { breakpoints } from "~/config/themes/screen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  hubs: any[];
  errorCode?: number;
  count: number;
  handleAddHub: Function;
  handleClick?: (event) => void;
  maxPerRow?: number;
};

const HubsPage: NextPage<Props> = ({
  hubs,
  errorCode,
  handleAddHub,
  count,
}) => {
  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  const currentUser = getCurrentUser();
  const isModerator = Boolean(currentUser?.moderator);
  const isHubEditor = Boolean(currentUser?.author_profile?.is_hub_editor);

  return (
    <div>
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
              handleAddHub && handleAddHub(true);
            }}
            isWhite
          />
        )}
      </div>
      <div className={css(styles.description)}>
        Hubs are collections of papers that are related to a specific topic. Use
        this page to explore hubs.
      </div>
      <HubSelect count={count} hubs={hubs} handleAddHub={handleAddHub} />
    </div>
  );
};

const styles = StyleSheet.create({
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
