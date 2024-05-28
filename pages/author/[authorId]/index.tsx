import { GetStaticPaths, GetStaticProps, NextPage } from "next";

const AuthorProfilePage: NextPage = ({}) => {
  return (
    <div>
      This is a test 
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (ctx) => {
    return {
        props: {
          
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
