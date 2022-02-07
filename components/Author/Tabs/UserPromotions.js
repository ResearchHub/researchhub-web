import { useState } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import Ripples from "react-ripples";
import ReactPlaceholder from "react-placeholder";

// Components
import PromotionCard from "./Promotions/PromotionCard";
import Loader from "~/components/Loader/Loader";
import PaperPlaceholder from "~/components/Placeholders/PaperPlaceholder";
import EmptyState from "./EmptyState";

import { AuthorActions } from "~/redux/author";

import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

const UserPromotions = (props) => {
  const [loading, setLoading] = useState(false);

  const renderPromotions = () => {
    const { author, fetching, maxCardsToRender } = props;

    const promotions =
      author.promotions && author.promotions.results
        ? author.promotions.results
        : [];

    const promotionCards = [];
    for (let i = 0; i < promotions.length; i++) {
      if (i === maxCardsToRender) break;

      const p = promotions[i];
      const { source } = p;
      if (source) {
        promotionCards.push(
          <PromotionCard
            source={source}
            promotion={p}
            index={i}
            key={`promotion-${i}`}
            isLast={promotions.length - 1 === i}
          />
        );
      }
    }

    return (
      <ReactPlaceholder
        ready={!fetching}
        showLoadingAnimation
        customPlaceholder={<PaperPlaceholder color="#efefef" />}
      >
        {promotionCards.length > 0 ? (
          promotionCards.map((p) => p)
        ) : (
          <EmptyState
            message={"User has not supported any content"}
            icon={icons.bolt}
          />
        )}
      </ReactPlaceholder>
    );
  };

  const loadMore = () => {
    const { next, results } = props.author.promotions;
    setLoading(true);
    fetch(next, API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        const obj = { ...res };
        obj.results = [...results, ...res.results];
        props.dispatch(
          AuthorActions.updateAuthorByKey({
            key: "promotions",
            value: obj,
            prevState: props.author,
          })
        );
        setLoading(false);
      });
  };

  const renderLoadMoreButton = () => {
    const { fetching, author } = props;

    if (fetching) return;
    if (author && author.promotions) {
      const { next } = author.promotions;
      if (next !== null) {
        return (
          <div className={css(styles.buttonContainer)}>
            {!loading ? (
              <Ripples
                className={css(styles.loadMoreButton)}
                onClick={loadMore}
              >
                Load More Papers
              </Ripples>
            ) : (
              <Loader
                key={"paperLoader"}
                loading={true}
                size={25}
                color={colors.BLUE()}
              />
            )}
          </div>
        );
      }
    }
  };

  return (
    <div className={css(styles.feed)}>
      {renderPromotions()}
      {!props.maxCardsToRender && renderLoadMoreButton()}
    </div>
  );
};

const styles = StyleSheet.create({
  feed: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
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
  card: {
    width: "100%",
    marginBottom: 10,
    borderRadius: 3,
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  author: state.author,
});

export default connect(mapStateToProps, null)(UserPromotions);
