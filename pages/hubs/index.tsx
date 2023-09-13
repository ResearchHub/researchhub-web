import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import sharedGetStaticProps from "~/components/Document/lib/sharedGetStaticProps";
import HubTag from "~/components/Hubs/HubTag";
import { getHubs } from "~/components/Hubs/api/fetchHubs";
import { Hub, parseHub } from "~/config/types/hub";
import { StyleSheet, css } from "aphrodite";


type Props = {
  hubs: any[];  
}

const HubCard = ({ hub }: { hub: Hub }) => {
  return (
    <div className={css(styles.hubCard)}>
      <HubTag hub={hub} />
      <div className={css(styles.description)}>{hub.description}</div>
      <div></div>
    </div>
  )
} 

const styles = StyleSheet.create({
  hubCard: {
    border: "1px solid #E9EAEF",
    borderRadius: 4,
    width: `calc(25% - 20px)`,
    height: 220,
    padding: 15,
    boxSizing: "border-box",
    ":nth-child(4n)": {
      width: "25%",
    },
    [`@media only screen and (max-width: 1340px)`]: {
      width: "33.3%",
    }
  },
  description: {
    marginTop: 20,
    fontWeight: 400,
    fontSize: 16,
    lineHeight: "22px",
    color: "#7C7989",
  }
});

const HubsPage: NextPage<Props> = ({ hubs }) => {
  const parsedHubs = hubs.map(hub => parseHub(hub));

  console.log('parsedHubs', parsedHubs)

  return (
    <div className={css(pageStyles.container)}>
      <div className={css(pageStyles.cardsWrapper)}>
        {parsedHubs.map((h, index) => (
          <HubCard hub={h} key={index} />
        ))}
      </div>
    </div>
  );
};

const pageStyles = StyleSheet.create({
  container: {
    maxWidth: 1340,
    margin: "0 auto",
  },
  cardsWrapper: {
    display: "flex",
    maxWidth: "100%",
    flexWrap: "wrap",
    columnGap: "20px",
    rowGap: "20px",
  }
});

export const getStaticProps: GetStaticProps = async (ctx) => {

  // @ts-ignore
  const { hubs } = await getHubs();

  return {
    props: {
      errorCode: 500,
      hubs,
    },
    revalidate: 600
  };
};


export default HubsPage;
