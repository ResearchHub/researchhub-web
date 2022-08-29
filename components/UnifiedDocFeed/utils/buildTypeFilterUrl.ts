import { prepURL } from "~/config/api";

export const buildTypeFilterUrl = ({ tabObj, router }) => {
  const params = {
    querystring: {
      ...(tabObj.value !== "all" && { type: tabObj.value }),
      ...(router.query.sort && { sort: router.query.sort }),
    },
  };

  let path = router.asPath;
  const idx = path.indexOf("?");
  if (idx >= 0) {
    path = path.substring(0, idx);
  }

  const url = prepURL(path, params);

  return url;
};