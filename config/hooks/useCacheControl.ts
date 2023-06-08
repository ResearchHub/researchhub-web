import API from "~/config/api";
import { useRouter } from "next/router";

const useCacheControl = () => {
  const router = useRouter();
  const revalidatePage = () => {
    return fetch(
      "/api/revalidate",
      API.POST_CONFIG({
        path: router.asPath,
      })
    );
  };

  return [revalidatePage];
};

export default useCacheControl;
