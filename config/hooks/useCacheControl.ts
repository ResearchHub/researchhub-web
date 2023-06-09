import API from "~/config/api";
import { useRouter } from "next/router";
import { revalidateTag } from "next/cache";

const useCacheControl = () => {
  const router = useRouter();
  const revalidateCurrentPath = () => {
    return revalidatePath(router.asPath);
  };

  const revalidatePath = (path) => {
    return fetch(
      "/api/revalidate",
      API.POST_CONFIG({
        path,
      })
    );
  };

  const revalidateDocument = (
    path = router.asPath,
    revalidateNested = true
  ) => {
    const isUserOnNestedDocumentPath = router.query.tabName !== undefined;
    let basePath = path;
    if (isUserOnNestedDocumentPath) {
      basePath = path.split("/").slice(0, -1).join("/");
    }

    let pathsToRevalidate = [basePath];
    if (revalidateNested) {
      pathsToRevalidate = pathsToRevalidate.concat([
        basePath + "/conversation",
        basePath + "/bounties",
        basePath + "/reviews",
      ]);
    }

    // Next.js doesn't have a way to revalidate multiple paths at once
    // So we need to loops through each path
    pathsToRevalidate.forEach((path) => {
      revalidatePath(path);
    });
  };

  return { revalidateCurrentPath, revalidatePath, revalidateDocument };
};

export default useCacheControl;
