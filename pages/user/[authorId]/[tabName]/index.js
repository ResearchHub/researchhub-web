import Router, { useRouter } from "next/router";
import Link from "next/link";
import { StyleSheet, css } from "aphrodite";
import { useEffect, useState } from "react";
import { connect, useDispatch, useStore } from "react-redux";
import moment from "moment";
import Avatar from "react-avatar";

import { AuthorActions } from "~/redux/author";
import TabBar from "~/components/TabBar";

// Components
import ComponentWrapper from "~/components/ComponentWrapper";

// Config
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import { absoluteUrl, getNestedValue, getVoteType } from "~/config/utils";

const AuthorPage = (props) => {
  let { author } = props;
  let query = useRouter();
  let { tabName } = query;

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    async function refetchAuthor() {
      await dispatch(
        AuthorActions.getAuthor({ authorId: router.query.authorId })
      );
    }
    refetchAuthor();
  }, [props.isServer]);

  const tabs = [
    {
      href: "contributions",
      label: "contributions",
      showCount: true,
    },
    {
      href: "authored-papers",
      label: "authored papers",
      showCount: true,
    },
    {
      href: "discussions",
      label: "discussions",
      showCount: true,
    },
  ];

  let renderTabContent = () => {
    switch (tabName) {
      case "contributions":
        return null;
      case "authored-papers":
        return null;
      case "discussions":
        return null;
      case "citations":
        return null;
    }
  };

  return (
    <div className={css(styles.container)}>
      <ComponentWrapper>
        <div className={css(styles.profileContainer)}>
          <Avatar
            name={`${author.first_name} ${author.last_name}`}
            round={true}
          />
          <div className={css(styles.profileInfo)}>
            <div className={css(styles.authorName)}>
              {author.first_name} {author.last_name}
            </div>
            <div className={css(styles.reputation)}></div>
            <div className={css(styles.description)}>
              {author.user &&
                "This is a test description. We will use this until we get the description from the backend working. We also need to create some edit functionality on the frontend to be able to properly add a description for the author"}
            </div>
            <div className={css(styles.extraInfoContainer)}>
              <div className={css(styles.extraInfo)}>
                <i className={css(styles.icon) + " fas fa-graduation-cap"}></i>
                {author.university.name}
              </div>
            </div>
          </div>
          <div className={css(styles.socialLinks)}>
            <div className={css(styles.socialMedia, styles.linkedin)}>
              <i className="fab fa-linkedin-in"></i>
            </div>
            <div className={css(styles.socialMedia, styles.twitter)}>
              <i className="fab fa-twitter"></i>
            </div>
            <div className={css(styles.socialMedia, styles.facebook)}>
              <i className="fab fa-facebook-f"></i>
            </div>
            <div className={css(styles.socialMedia, styles.shareLink)}>
              <i className="far fa-link"></i>
            </div>
          </div>
        </div>
      </ComponentWrapper>
      <TabBar tabs={tabs} dynamic_href={"/user/[authorId]/[tabName]"} />
      <div className={css(styles.contentContainer)}>{renderTabContent()}</div>
    </div>
  );
};

AuthorPage.getInitialProps = async ({ isServer, req, store, query }) => {
  const { host } = absoluteUrl(req);
  const hostname = host;

  await store.dispatch(AuthorActions.getAuthor({ authorId: query.authorId }));

  return { isServer, hostname };
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: "30px 0px",
    margin: "auto",
  },
  profileContainer: {
    display: "flex",
    padding: "30px 0",
  },
  profileInfo: {
    width: "70%",
    marginLeft: 30,
    marginRight: 30,
  },
  socialLinks: {
    display: "flex",
  },
  authorName: {
    fontWeight: 500,
    fontSize: 33,
    textTransform: "capitalize",
    marginBottom: 10,
  },
  extraInfoContainer: {
    display: "flex",
  },
  extraInfo: {
    color: "#241F3A",
    opacity: 0.5,
    fontSize: 14,
  },
  icon: {
    marginRight: 5,
  },
  description: {
    marginBottom: 10,
  },
  socialMedia: {
    width: 35,
    height: 35,
    borderRadius: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#fff",
    marginLeft: 5,
    marginRight: 5,
  },
  linkedin: {
    background: "#0077B5",
  },
  twitter: {
    background: "#38A1F3",
  },
  facebook: {
    background: "#3B5998",
  },
  shareLink: {
    background: colors.BLUE(),
  },
});

const mapStateToProps = (state) => ({
  author: state.author,
});

export default connect(mapStateToProps)(AuthorPage);
