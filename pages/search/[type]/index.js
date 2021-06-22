import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { AUTH_TOKEN } from "~/config/constants";
import FormSelect from "~/components/Form/FormSelect";
import { filterOptions } from "~/config/utils/options";

import Link from "next/link";
import Error from "next/error";
import { pick, keys, isString, isArray } from "underscore";
import { useRouter } from "next/router";

import { get, upperFirst } from "lodash";
import nookies from "nookies";
import parseUrl from "parse-url";

const SEARCH_TYPES = {
  paper: [
    "query",
    "hubs",
    "paper_publish_date__gte",
    "paper_publish_date__lte",
    "paper_publish_date",
    "post_type",
  ],
  hub: [],
  author: [],
};

const sortOpts = [
  {
    value: "relevance",
    label: "Relevance",
  },
  ...filterOptions,
];

const isAllowedSearchEntityType = (type) => SEARCH_TYPES.hasOwnProperty(type);

const getAllowedSearchFilters = ({ searchType, queryParams }) => {
  const allowedFilters = get(SEARCH_TYPES, `${searchType}`, []);
  return pick(queryParams, ...allowedFilters);
};

const Index = ({ resp }) => {
  const router = useRouter();
  const searchType = get(router, "query.type");

  if (!isAllowedSearchEntityType(searchType)) {
    return <Error statusCode={404} />;
  }

  const htmlLinks = keys(SEARCH_TYPES).map((type) => (
    <Link href={`/search/${type}`} key={type}>
      <a>
        {type + "s"} [{get(resp, `${type}_count`, "")}]
      </a>
    </Link>
  ));

  const handleFilterSelect = (filterId, selectedOpts) => {
    if (!isArray(selectedOpts)) {
      selectedOpts = [selectedOpts];
    }

    router.push({
      pathname: "/search/[type]",
      query: {
        ...router.query,
        [`${filterId}`]: (selectedOpts || []).map((v) => v.value),
      },
    });
  };

  const handleSortSelect = (sortId, selectedOpt) => {
    let query = {
      ...router.query,
    };

    delete query["sort_by"];

    if (selectedOpt.value !== "relevance") {
      query["sort_by"] = selectedOpt.value;
    }

    router.push({
      pathname: "/search/[type]",
      query,
    });
  };

  const availFacetOpts = get(resp, "facets._filter_hubs.hubs.buckets", []).map(
    (b) => ({
      label: `${b.key} (${b.doc_count})`,
      value: b.key,
    })
  );

  let selectedHubs = [];
  if (isArray(router.query.hubs)) {
    selectedHubs = router.query.hubs;
  } else if (isString(router.query.hubs)) {
    selectedHubs = [router.query.hubs];
  }
  const selectedValues = selectedHubs.map((v) => ({ label: v, value: v }));

  const availDateOpts = [
    { label: "Last year", value: "last_year" },
    { label: "Last five years", value: "last_five_years" },
  ];
  let selectedPublishDate = null;
  if (router.query.paper_publish_date) {
    switch (router.query.paper_publish_date) {
      case "last_year":
        selectedPublishDate = { value: "last_year", label: "Last year" };
      case "last_five_years":
        selectedPublishDate = {
          value: "last_five_years",
          label: "Last five years",
        };
    }
  }

  return (
    <div>
      <FormSelect
        id={"hubs"}
        options={availFacetOpts}
        containerStyle={null}
        inputStyle={null}
        onChange={handleFilterSelect}
        isSearchable={true}
        placeholder={"Hubs"}
        value={selectedValues}
        isMulti={true}
        multiTagStyle={null}
        multiTagLabelStyle={null}
        isClearable={true}
      />

      <FormSelect
        id={"sortBy"}
        options={sortOpts}
        value={null}
        containerStyle={null}
        inputStyle={{
          fontWeight: 500,
          minHeight: "unset",
          backgroundColor: "#FFF",
          display: "flex",
          justifyContent: "space-between",
        }}
        onChange={handleSortSelect}
        isSearchable={false}
      />
      <FormSelect
        id={"paper_publish_date"}
        options={availDateOpts}
        containerStyle={null}
        inputStyle={null}
        onChange={handleFilterSelect}
        isSearchable={true}
        placeholder={"Date Published"}
        value={selectedPublishDate}
        isMulti={false}
        multiTagStyle={null}
        multiTagLabelStyle={null}
        isClearable={true}
      />

      {htmlLinks}
    </div>
  );
};

Index.getInitialProps = async (ctx) => {
  const cookies = nookies.get(ctx);
  const authToken = cookies[AUTH_TOKEN];

  const filters = getAllowedSearchFilters({
    searchType: ctx.query.type,
    queryParams: ctx.query,
  });

  let facet = [];
  if (ctx.query.type.indexOf("paper") >= 0) {
    facet = ["hubs"];
  }

  const config = {
    route: ctx.query.type,
  };

  return fetch(
    API.SEARCH({ filters, facet, config }),
    API.GET_CONFIG(authToken)
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((resp) => {
      //       const initial = keys(SEARCH_TYPES).reduce((map, k) => { map[k] = []; return map } , {})
      //
      //       const hitsByIdxMap = resp.results.reduce((map, hit) => {
      //         const idx = get(hit,"meta.index", "undefined");
      //         if (!map[idx]) {
      //           map[idx] = []
      //         }
      //
      //         map[idx].push(hit);
      //         return map
      //       }, initial);

      return { resp };
    });
};

export default Index;
