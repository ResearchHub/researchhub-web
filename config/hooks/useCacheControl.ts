import API from "~/config/api";
import { useRouter } from "next/router";
import { revalidateTag } from "next/cache";

const revalidatePath = (path) => {
  return fetch(
    "/api/revalidate",
    API.POST_CONFIG({
      path,
    })
  );
};

export const revalidateAuthorProfile = (authorId) => {
  // Deprecated routes
  const basePath = `/user/${authorId}`;

  let pathsToRevalidate = [
    basePath + "/overview",
    basePath + "/bounties",
    basePath + "/discussions",
    basePath + "/submissions",
    basePath + "/authored-papers",
    basePath + "/rsc",
  ];

  // V2
  const basePathV2 = `/author/${authorId}`;

  pathsToRevalidate = pathsToRevalidate.concat([
    basePathV2,
    basePathV2 + "/publications",
    basePathV2 + "/bounties",
    basePathV2 + "/comments",
    basePathV2 + "/transactions",
  ]);

  // Next.js doesn't have a way to revalidate multiple paths at once
  // So we need to loops through each path
  pathsToRevalidate.forEach((path) => {
    revalidatePath(path);
  });
};

const useCacheControl = () => {
  const router = useRouter();
  const revalidateCurrentPath = () => {
    return revalidatePath(router.asPath);
  };

  const revalidateAuthorProfile = (authorId) => {
    return revalidateAuthorProfile(authorId);
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

  return {
    revalidateCurrentPath,
    revalidatePath,
    revalidateDocument,
    revalidateAuthorProfile,
  };
};

export default useCacheControl;
