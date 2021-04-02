import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import ReactPlaceholder from "react-placeholder/lib";

// Component
import ColumnContainer from "~/components/Paper/SideColumn/ColumnContainer";
import { SideColumnTitle } from "~/components/Typography";
import ActivityCard from "./ActivityCard";
import HubEntryPlaceholder from "../Placeholders/HubEntryPlaceholder";

// Config
import { fetchLatestActivity } from "~/config/fetch";
import { getAuthorName } from "~/config/utils/";
import colors from "~/config/themes/colors";

const STATIC_DATA = [
  {
    id: 1,
    created_date: "2021-03-27T20:30:00.049440Z",
    update_date: "2021-03-27T20:30:00.049440Z",
    paper: {
      id: 430,
      paper_title:
        "Stressful life events are not associated with the development of dementia",
      hubs: [
        {
          id: 2,
          name: "biology",
          is_locked: false,
          slug: "biology",
          is_removed: false,
          hub_image: null,
        },
      ],
      slug:
        "stressful-life-events-are-not-associated-with-the-development-of-dementia",
    },
    comment: {
      plain_text:
        "That's pretty neat - you learn something new every day. Does anyone have any guesses? I think it's kind of interesting that when they compared their significant results to a GWAS that looked",
      created_by: {
        academic_verification: null,
        author_score: 10,
        created_date: "2020-02-11T23:21:03.141902Z",
        description: "Here's a description.",
        facebook: null,
        first_name: "Joshua",
        headline: { title: "Software Engineer", isPublic: true },
        id: 11,
        last_name: "Lee",
        profile_image:
          "https://researchhub-paper-dev1.s3.amazonaws.com/uploads/author_profile_images/2020/09/29/blob?AWSAccessKeyId=AKIA3RZN3OVNNBYLSFM3&Signature=%2F8Dvt7pZ%2FFg6%2B5qi9DFrqJt10Yw%3D&Expires=1617482957",
        reputation: 1046,
        sift_link: "https://console.sift.com/users/4?abuse_type=content_abuse",
        total_score: 10,
        updated_date: "2021-03-12T17:57:57.556559Z",
        user: 4,
      },
    },
  },
  {
    id: 1,
    created_date: "2021-03-27T20:30:00.049440Z",
    update_date: "2021-03-27T20:30:00.049440Z",
    paper: {
      id: 430,
      paper_title:
        "Stressful life events are not associated with the development of dementia",
      hubs: [
        {
          id: 2,
          name: "biology",
          is_locked: false,
          slug: "biology",
          is_removed: false,
          hub_image: null,
        },
      ],
      slug:
        "stressful-life-events-are-not-associated-with-the-development-of-dementia",
    },
    comment: {
      plain_text:
        "That's pretty neat - you learn something new every day. Does anyone have any guesses? I think it's kind of interesting that when they compared their significant results to a GWAS that looked",
      created_by: {
        academic_verification: null,
        author_score: 10,
        created_date: "2020-02-11T23:21:03.141902Z",
        description: "Here's a description.",
        facebook: null,
        first_name: "Joshua",
        headline: { title: "Software Engineer", isPublic: true },
        id: 11,
        last_name: "Lee",
        profile_image:
          "https://researchhub-paper-dev1.s3.amazonaws.com/uploads/author_profile_images/2020/09/29/blob?AWSAccessKeyId=AKIA3RZN3OVNNBYLSFM3&Signature=%2F8Dvt7pZ%2FFg6%2B5qi9DFrqJt10Yw%3D&Expires=1617482957",
        reputation: 1046,
        sift_link: "https://console.sift.com/users/4?abuse_type=content_abuse",
        total_score: 10,
        updated_date: "2021-03-12T17:57:57.556559Z",
        user: 4,
      },
    },
  },
];

const DEFAULT_DATA = {
  count: 0,
  next: null,
  previous: null,
  results: [],
};

const ActivityList = (props) => {
  const { auth, setIsLatestActivityShown } = props;
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    if (auth.isLoggedIn) {
      setIsLatestActivityShown(true);
      fetchActivityFeed();
    } else {
      setIsLatestActivityShown(false);
    }
  }, [auth.isLoggedIn]);

  const fetchActivityFeed = async () => {
    const { id: userId } = auth.user;

    setIsFetching(true);
    const data = await fetchLatestActivity({ userId });
    setData(data || {});
    setIsFetching(false);
  };

  const renderActiviyList = () => {
    const results = data.results || [];

    if (results.length) {
      return results.map((activity, index) => {
        return (
          <ActivityCard
            activity={activity}
            key={`activityCard-${activity.id}`}
            last={results.length === index + 1}
          />
        );
      });
    } else {
      return <span>Empty State</span>;
    }
  };

  return (
    <ColumnContainer overrideStyles={styles.container}>
      <ReactPlaceholder
        ready={!isFetching}
        showLoadingAnimation
        customPlaceholder={<HubEntryPlaceholder color="#efefef" rows={3} />}
      >
        <SideColumnTitle
          title={"Latest Activity"}
          overrideStyles={styles.title}
        />
        {renderActiviyList()}
      </ReactPlaceholder>
    </ColumnContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    position: "sticky",
    top: 100,
    overflowY: "scroll",
    maxHeight: "100vh",
    boxShadow:
      "inset 25px 0px 25px -25px rgba(255,255,255,1), inset -25px 0px 25px -25px rgba(255,255,255,1)",
  },
  title: {
    position: "sticky",
    top: 0,
    padding: "15px 20px 10px 20px",
    zIndex: 2,
    background: "#FFF",
    boxShadow: "inset 25px 0px 25px -25px rgba(255,255,255,1)",
    "@media only screen and (max-width: 415px)": {
      padding: "15px 0 5px",
    },
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(ActivityList);
