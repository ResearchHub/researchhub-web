import { useState } from "react";
import { StyleSheet, css } from "aphrodite";
import ReactPlaceholder from "react-placeholder";

// Components
import PaperPlaceholder from "../../Placeholders/PaperPlaceholder";
import Loader from "~/components/Loader/Loader";
import Ripples from "react-ripples";

// Config
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";
import SummaryBulletPoint from "../../Paper/SummaryBulletPoint";

const UserKeyTakeaways = ({ items, fetchItems, fetched, itemsNext }) => {
  const [fetchingMore, setFetchingMore] = useState(false);

  const loadMore = async () => {
    setFetchingMore(true);
    await fetchItems(itemsNext);
    setFetchingMore(false);
  };

  const renderLoadMoreButton = () => {
    if (!itemsNext) {
      return null;
    }
    return (
      <div className={css(styles.buttonContainer)}>
        {!fetchingMore ? (
          <Ripples className={css(styles.loadMoreButton)} onClick={loadMore}>
            Load More
          </Ripples>
        ) : (
          <Loader
            key={"discussionLoader"}
            loading={true}
            size={25}
            color={colors.BLUE()}
          />
        )}
      </div>
    );
  };

  let allItems = items.map((item, index) => {
    let path = `/paper/${item.paper}/${item.paper_slug}`;
    return (
      <div
        className={css(
          styles.discussionContainer,
          index === items.length - 1 && styles.noBorder
        )}
      >
        <SummaryBulletPoint
          key={`summaryBulletPoint-${item.id}`}
          data={item}
          editable={false}
          type={"KEY_TAKEAWAY"}
          index={index}
          authorProfile={item.created_by.author_profile}
          path={path}
        />
      </div>
    );
  });

  return (
    <ReactPlaceholder
      ready={fetched}
      showLoadingAnimation
      customPlaceholder={<PaperPlaceholder color="#efefef" />}
    >
      {allItems.length > 0 ? (
        <React.Fragment>
          <div className={css(styles.container)}>{allItems}</div>
          {renderLoadMoreButton()}
        </React.Fragment>
      ) : (
        <div className={css(styles.box)}>
          <div className={css(styles.icon)}>{icons.file}</div>
          <h2 className={css(styles.noContent)}>
            User has not created any summaries
          </h2>
        </div>
      )}
    </ReactPlaceholder>
  );
};

var styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    boxSizing: "border-box",
  },
  discussionContainer: {
    width: "100%",
    borderBottom: "1px solid rgba(36, 31, 58, 0.08)",
    "@media only screen and (max-width: 415px)": {
      borderBottom: "none",
    },
  },
  box: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  noContent: {
    color: colors.BLACK(1),
    fontSize: 20,
    fontWeight: 500,
    textAlign: "center",
    "@media only screen and (max-width: 415px)": {
      width: 280,
      fontSize: 16,
    },
  },
  icon: {
    fontSize: 50,
    color: colors.BLUE(1),
    height: 50,
    marginBottom: 10,
  },
  buttonContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
    height: 45,
    "@media only screen and (max-width: 768px)": {
      marginTop: 15,
      marginBottom: 15,
    },
  },
  noBorder: {
    border: "none",
  },
  loadMoreButton: {
    fontSize: 14,
    border: `1px solid ${colors.BLUE()}`,
    boxSizing: "border-box",
    borderRadius: 4,
    height: 45,
    width: 155,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: colors.BLUE(),
    cursor: "pointer",
    userSelect: "none",
    ":hover": {
      color: "#FFF",
      backgroundColor: colors.BLUE(),
    },
  },
});

export default UserKeyTakeaways;
