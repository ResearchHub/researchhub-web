import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { css, StyleSheet } from "aphrodite";


type Args = {
  documents: any[];
};

const AuthorProfilePage: NextPage<Args> = ({ documents }) => {

  return (
    <div>
      <div className={css(styles.title)}>This week's preprints</div>
      <div className={css(styles.description)}>Cast your votes. Top 30 preprints will receive an expert peer review.</div>
    </div>
  );
};

const styles = StyleSheet.create({
  title: {

  },
  description: {

  }
});


export const getStaticProps: GetStaticProps = async (ctx) => {

  return {
    props: {  
      documents: []
    },
    revalidate: 86000,
  };
};


export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export default AuthorProfilePage;
