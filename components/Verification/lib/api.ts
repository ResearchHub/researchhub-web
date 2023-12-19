import API, { generateApiUrl } from "~/config/api";
import helpers from "~/config/api/helpers";
import { captureEvent } from "~/config/utils/events";
import { VerificationPaperResult, parseVerificationPaperResult } from "./types";


export const verifyEmailOwnership = async ({ email }):Promise<any> => {

  return true;

  const url = generateApiUrl(`user_verification/verify_email`);

  return fetch(url, API.POST_CONFIG({ email })).then(helpers.checkStatus);
}

export const fetchPaperByDoi = async ({
  doi,
}): Promise<VerificationPaperResult> => {
  if (doi !== "https://doi.org/10.1155/2017/2925869") {
    throw new Error("DOI not found");
  }

  const mockResponse = {
    id: "https://openalex.org/W2594873390",
    doi: "https://doi.org/10.1155/2017/2925869",
    title:
      "Targeting Signaling Pathways in Cancer Stem Cells for Cancer Treatment",
    display_name:
      "Targeting Signaling Pathways in Cancer Stem Cells for Cancer Treatment",
    publication_year: 2017,
    publication_date: "2017-01-01",
    ids: {
      openalex: "https://openalex.org/W2594873390",
      doi: "https://doi.org/10.1155/2017/2925869",
      mag: "2594873390",
      pmid: "https://pubmed.ncbi.nlm.nih.gov/28356914",
      pmcid: "https://www.ncbi.nlm.nih.gov/pmc/articles/5357538",
    },
    language: "en",
    primary_location: {
      is_oa: true,
      landing_page_url: "https://doi.org/10.1155/2017/2925869",
      pdf_url: "http://downloads.hindawi.com/journals/sci/2017/2925869.pdf",
      source: {
        id: "https://openalex.org/S27922360",
        display_name: "Stem Cells International",
        issn_l: "1687-966X",
        issn: ["1687-9678", "1687-966X"],
        is_oa: true,
        is_in_doaj: true,
        host_organization: "https://openalex.org/P4310319869",
        host_organization_name: "Hindawi Publishing Corporation",
        host_organization_lineage: ["https://openalex.org/P4310319869"],
        host_organization_lineage_names: ["Hindawi Publishing Corporation"],
        type: "journal",
      },
      license: "cc-by",
      version: "publishedVersion",
      is_accepted: true,
      is_published: true,
    },
    type: "article",
    type_crossref: "journal-article",
    open_access: {
      is_oa: true,
      oa_status: "gold",
      oa_url: "http://downloads.hindawi.com/journals/sci/2017/2925869.pdf",
      any_repository_has_fulltext: true,
    },
    authorships: [
      {
        author_position: "first",
        author: {
          id: "https://openalex.org/A5081987607",
          display_name: "Jeffrey Koury",
          orcid: "https://orcid.org/0000-0002-7368-4891",
        },
        institutions: [
          {
            id: "https://openalex.org/I93393672",
            display_name: "Western University of Health Sciences",
            ror: "https://ror.org/05167c961",
            country_code: "US",
            type: "education",
            lineage: ["https://openalex.org/I93393672"],
          },
        ],
        countries: ["US"],
        is_corresponding: false,
        raw_author_name: "Jeffrey Koury",
        raw_affiliation_string:
          "Graduate College of Biomedical Sciences, Western University of Health Sciences, Pomona, CA 91766, USA",
        raw_affiliation_strings: [
          "Graduate College of Biomedical Sciences, Western University of Health Sciences, Pomona, CA 91766, USA",
        ],
      },
      {
        author_position: "middle",
        author: {
          id: "https://openalex.org/A5050507251",
          display_name: "Li Zhong",
          orcid: "https://orcid.org/0000-0003-1611-5171",
        },
        institutions: [
          {
            id: "https://openalex.org/I43337087",
            display_name: "Hebei University",
            ror: "https://ror.org/01p884a79",
            country_code: "CN",
            type: "education",
            lineage: ["https://openalex.org/I43337087"],
          },
          {
            id: "https://openalex.org/I93393672",
            display_name: "Western University of Health Sciences",
            ror: "https://ror.org/05167c961",
            country_code: "US",
            type: "education",
            lineage: ["https://openalex.org/I93393672"],
          },
        ],
        countries: ["CN", "US"],
        is_corresponding: false,
        raw_author_name: "Li Zhong",
        raw_affiliation_string:
          "Department of Basic Medical Sciences, College of Osteopathic Medicine of the Pacific, Western University of Health Sciences, Pomona, CA, USA; Department of Cell Biology, College of Life Sciences, Hebei University, Baoding, Hebei, China",
        raw_affiliation_strings: [
          "Department of Basic Medical Sciences, College of Osteopathic Medicine of the Pacific, Western University of Health Sciences, Pomona, CA, USA",
          "Department of Cell Biology, College of Life Sciences, Hebei University, Baoding, Hebei, China",
        ],
      },
      {
        author_position: "last",
        author: {
          id: "https://openalex.org/A5046138088",
          display_name: "Jijun Hao",
          orcid: "https://orcid.org/0000-0002-6769-9069",
        },
        institutions: [
          {
            id: "https://openalex.org/I93393672",
            display_name: "Western University of Health Sciences",
            ror: "https://ror.org/05167c961",
            country_code: "US",
            type: "education",
            lineage: ["https://openalex.org/I93393672"],
          },
        ],
        countries: ["US"],
        is_corresponding: true,
        raw_author_name: "Jijun Hao",
        raw_affiliation_string:
          "Graduate College of Biomedical Sciences, Western University of Health Sciences, Pomona, CA 91766, USA",
        raw_affiliation_strings: [
          "Graduate College of Biomedical Sciences, Western University of Health Sciences, Pomona, CA 91766, USA",
        ],
      },
    ],
    countries_distinct_count: 2,
    institutions_distinct_count: 2,
    corresponding_author_ids: ["https://openalex.org/A5046138088"],
    corresponding_institution_ids: ["https://openalex.org/I93393672"],
    apc_list: {
      value: 2150,
      currency: "USD",
      value_usd: 2150,
      provenance: "doaj",
    },
    apc_paid: {
      value: 2150,
      currency: "USD",
      value_usd: 2150,
      provenance: "doaj",
    },
    has_fulltext: true,
    fulltext_origin: "ngrams",
    cited_by_count: 110,
    cited_by_percentile_year: {
      min: 98,
      max: 99,
    },
    biblio: {
      volume: "2017",
      issue: null,
      first_page: "1",
      last_page: "10",
    },
    is_retracted: false,
    is_paratext: false,
    keywords: [
      {
        keyword: "cancer stem cells",
        score: 0.7565,
      },
      {
        keyword: "stem cells",
        score: 0.5502,
      },
      {
        keyword: "signaling pathways",
        score: 0.5398,
      },
    ],
    concepts: [
      {
        id: "https://openalex.org/C137620995",
        wikidata: "https://www.wikidata.org/wiki/Q155769",
        display_name: "Wnt signaling pathway",
        level: 3,
        score: 0.858853,
      },
      {
        id: "https://openalex.org/C2778539099",
        wikidata: "https://www.wikidata.org/wiki/Q6120",
        display_name: "Hedgehog",
        level: 3,
        score: 0.78517103,
      },
      {
        id: "https://openalex.org/C55427017",
        wikidata: "https://www.wikidata.org/wiki/Q1638475",
        display_name: "Cancer stem cell",
        level: 3,
        score: 0.72623885,
      },
      {
        id: "https://openalex.org/C502942594",
        wikidata: "https://www.wikidata.org/wiki/Q3421914",
        display_name: "Cancer research",
        level: 1,
        score: 0.6270919,
      },
      {
        id: "https://openalex.org/C88498014",
        wikidata: "https://www.wikidata.org/wiki/Q14859918",
        display_name: "Hedgehog signaling pathway",
        level: 3,
        score: 0.62419176,
      },
      {
        id: "https://openalex.org/C121608353",
        wikidata: "https://www.wikidata.org/wiki/Q12078",
        display_name: "Cancer",
        level: 2,
        score: 0.53738636,
      },
      {
        id: "https://openalex.org/C161879069",
        wikidata: "https://www.wikidata.org/wiki/Q904082",
        display_name: "Notch signaling pathway",
        level: 3,
        score: 0.5365135,
      },
      {
        id: "https://openalex.org/C62478195",
        wikidata: "https://www.wikidata.org/wiki/Q828130",
        display_name: "Signal transduction",
        level: 2,
        score: 0.5099846,
      },
      {
        id: "https://openalex.org/C86803240",
        wikidata: "https://www.wikidata.org/wiki/Q420",
        display_name: "Biology",
        level: 0,
        score: 0.5021832,
      },
      {
        id: "https://openalex.org/C2778287671",
        wikidata: "https://www.wikidata.org/wiki/Q7852676",
        display_name: "Tumor initiation",
        level: 4,
        score: 0.46039575,
      },
      {
        id: "https://openalex.org/C28328180",
        wikidata: "https://www.wikidata.org/wiki/Q48196",
        display_name: "Stem cell",
        level: 2,
        score: 0.42092082,
      },
      {
        id: "https://openalex.org/C95444343",
        wikidata: "https://www.wikidata.org/wiki/Q7141",
        display_name: "Cell biology",
        level: 1,
        score: 0.3597368,
      },
      {
        id: "https://openalex.org/C71924100",
        wikidata: "https://www.wikidata.org/wiki/Q11190",
        display_name: "Medicine",
        level: 0,
        score: 0.33828056,
      },
      {
        id: "https://openalex.org/C555283112",
        wikidata: "https://www.wikidata.org/wiki/Q1637543",
        display_name: "Carcinogenesis",
        level: 3,
        score: 0.27948135,
      },
      {
        id: "https://openalex.org/C54355233",
        wikidata: "https://www.wikidata.org/wiki/Q7162",
        display_name: "Genetics",
        level: 1,
        score: 0.09152639,
      },
    ],
    mesh: [],
    locations_count: 5,
    locations: [
      {
        is_oa: true,
        landing_page_url: "https://doi.org/10.1155/2017/2925869",
        pdf_url: "http://downloads.hindawi.com/journals/sci/2017/2925869.pdf",
        source: {
          id: "https://openalex.org/S27922360",
          display_name: "Stem Cells International",
          issn_l: "1687-966X",
          issn: ["1687-9678", "1687-966X"],
          is_oa: true,
          is_in_doaj: true,
          host_organization: "https://openalex.org/P4310319869",
          host_organization_name: "Hindawi Publishing Corporation",
          host_organization_lineage: ["https://openalex.org/P4310319869"],
          host_organization_lineage_names: ["Hindawi Publishing Corporation"],
          type: "journal",
        },
        license: "cc-by",
        version: "publishedVersion",
        is_accepted: true,
        is_published: true,
      },
      {
        is_oa: false,
        landing_page_url:
          "https://doaj.org/article/3ec2311db55a4fd2a5636998d37fb826",
        pdf_url: null,
        source: {
          id: "https://openalex.org/S4306401280",
          display_name: "DOAJ (DOAJ: Directory of Open Access Journals)",
          issn_l: null,
          issn: null,
          is_oa: true,
          is_in_doaj: false,
          host_organization: null,
          host_organization_name: null,
          host_organization_lineage: [],
          host_organization_lineage_names: [],
          type: "repository",
        },
        license: null,
        version: null,
        is_accepted: false,
        is_published: false,
      },
      {
        is_oa: true,
        landing_page_url: "https://europepmc.org/articles/pmc5357538",
        pdf_url: "https://europepmc.org/articles/pmc5357538?pdf=render",
        source: {
          id: "https://openalex.org/S4306400806",
          display_name: "Europe PMC (PubMed Central)",
          issn_l: null,
          issn: null,
          is_oa: true,
          is_in_doaj: false,
          host_organization: "https://openalex.org/I1303153112",
          host_organization_name: "European Bioinformatics Institute",
          host_organization_lineage: ["https://openalex.org/I1303153112"],
          host_organization_lineage_names: [
            "European Bioinformatics Institute",
          ],
          type: "repository",
        },
        license: "cc-by",
        version: "publishedVersion",
        is_accepted: true,
        is_published: true,
      },
      {
        is_oa: true,
        landing_page_url:
          "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5357538",
        pdf_url: null,
        source: {
          id: "https://openalex.org/S2764455111",
          display_name: "PubMed Central",
          issn_l: null,
          issn: null,
          is_oa: true,
          is_in_doaj: false,
          host_organization: "https://openalex.org/I1299303238",
          host_organization_name: "National Institutes of Health",
          host_organization_lineage: ["https://openalex.org/I1299303238"],
          host_organization_lineage_names: ["National Institutes of Health"],
          type: "repository",
        },
        license: null,
        version: "publishedVersion",
        is_accepted: true,
        is_published: true,
      },
      {
        is_oa: false,
        landing_page_url: "https://pubmed.ncbi.nlm.nih.gov/28356914",
        pdf_url: null,
        source: {
          id: "https://openalex.org/S4306525036",
          display_name: "PubMed",
          issn_l: null,
          issn: null,
          is_oa: false,
          is_in_doaj: false,
          host_organization: "https://openalex.org/I1299303238",
          host_organization_name: "National Institutes of Health",
          host_organization_lineage: ["https://openalex.org/I1299303238"],
          host_organization_lineage_names: ["National Institutes of Health"],
          type: "repository",
        },
        license: null,
        version: null,
        is_accepted: false,
        is_published: false,
      },
    ],
    best_oa_location: {
      is_oa: true,
      landing_page_url: "https://doi.org/10.1155/2017/2925869",
      pdf_url: "http://downloads.hindawi.com/journals/sci/2017/2925869.pdf",
      source: {
        id: "https://openalex.org/S27922360",
        display_name: "Stem Cells International",
        issn_l: "1687-966X",
        issn: ["1687-9678", "1687-966X"],
        is_oa: true,
        is_in_doaj: true,
        host_organization: "https://openalex.org/P4310319869",
        host_organization_name: "Hindawi Publishing Corporation",
        host_organization_lineage: ["https://openalex.org/P4310319869"],
        host_organization_lineage_names: ["Hindawi Publishing Corporation"],
        type: "journal",
      },
      license: "cc-by",
      version: "publishedVersion",
      is_accepted: true,
      is_published: true,
    },
    sustainable_development_goals: [
      {
        id: "https://metadata.un.org/sdg/3",
        display_name: "Good health and well-being",
        score: 0.82,
      },
    ],
    grants: [
      {
        funder: "https://openalex.org/F4320321001",
        funder_display_name: "National Natural Science Foundation of China",
        award_id: "81472744",
      },
      {
        funder: "https://openalex.org/F4320321001",
        funder_display_name: "National Natural Science Foundation of China",
        award_id: "81272444",
      },
    ],
    referenced_works_count: 94,
    referenced_works: [
      "https://openalex.org/W1655178001",
      "https://openalex.org/W1756165953",
      "https://openalex.org/W1760611117",
      "https://openalex.org/W1861001175",
      "https://openalex.org/W1935464246",
      "https://openalex.org/W1965431780",
      "https://openalex.org/W1968861372",
      "https://openalex.org/W1971526515",
      "https://openalex.org/W1971707325",
      "https://openalex.org/W1973329885",
      "https://openalex.org/W1974083062",
      "https://openalex.org/W1974943679",
      "https://openalex.org/W1982087641",
      "https://openalex.org/W1994029539",
      "https://openalex.org/W1997379399",
      "https://openalex.org/W2001544973",
      "https://openalex.org/W2009886857",
      "https://openalex.org/W2010653264",
      "https://openalex.org/W2019264784",
      "https://openalex.org/W2020579083",
      "https://openalex.org/W2023427658",
      "https://openalex.org/W2031986169",
      "https://openalex.org/W2036041106",
      "https://openalex.org/W2040087348",
      "https://openalex.org/W2041935553",
      "https://openalex.org/W2046483038",
      "https://openalex.org/W2050754241",
      "https://openalex.org/W2051055358",
      "https://openalex.org/W2051385741",
      "https://openalex.org/W2051859926",
      "https://openalex.org/W2055296003",
      "https://openalex.org/W2056628299",
      "https://openalex.org/W2057881265",
      "https://openalex.org/W2060710804",
      "https://openalex.org/W2061965920",
      "https://openalex.org/W2072569544",
      "https://openalex.org/W2078510083",
      "https://openalex.org/W2080316304",
      "https://openalex.org/W2082210456",
      "https://openalex.org/W2083425643",
      "https://openalex.org/W2083812545",
      "https://openalex.org/W2087205490",
      "https://openalex.org/W2090982381",
      "https://openalex.org/W2095424699",
      "https://openalex.org/W2100553819",
      "https://openalex.org/W2100639629",
      "https://openalex.org/W2101616608",
      "https://openalex.org/W2107394975",
      "https://openalex.org/W2107503279",
      "https://openalex.org/W2107648723",
      "https://openalex.org/W2109805795",
      "https://openalex.org/W2113557972",
      "https://openalex.org/W2115001053",
      "https://openalex.org/W2116261578",
      "https://openalex.org/W2118453722",
      "https://openalex.org/W2124936055",
      "https://openalex.org/W2128175263",
      "https://openalex.org/W2128937038",
      "https://openalex.org/W2130552015",
      "https://openalex.org/W2131232783",
      "https://openalex.org/W2133117291",
      "https://openalex.org/W2139945482",
      "https://openalex.org/W2140350596",
      "https://openalex.org/W2143234817",
      "https://openalex.org/W2149154780",
      "https://openalex.org/W2149858252",
      "https://openalex.org/W2150014036",
      "https://openalex.org/W2153382986",
      "https://openalex.org/W2154861644",
      "https://openalex.org/W2158021558",
      "https://openalex.org/W2165908624",
      "https://openalex.org/W2167414381",
      "https://openalex.org/W2187201134",
      "https://openalex.org/W2269814587",
      "https://openalex.org/W2275077398",
      "https://openalex.org/W2284711770",
      "https://openalex.org/W2311462071",
      "https://openalex.org/W2334577496",
      "https://openalex.org/W2339187372",
      "https://openalex.org/W2410495669",
      "https://openalex.org/W2412509206",
      "https://openalex.org/W2416238130",
      "https://openalex.org/W2418808650",
      "https://openalex.org/W2443178225",
      "https://openalex.org/W2482151002",
      "https://openalex.org/W2505288790",
      "https://openalex.org/W2509039608",
      "https://openalex.org/W2509794319",
      "https://openalex.org/W2520112765",
      "https://openalex.org/W2520132464",
      "https://openalex.org/W2522404881",
      "https://openalex.org/W2554806785",
      "https://openalex.org/W2573357394",
      "https://openalex.org/W4213058179",
    ],
    related_works: [
      "https://openalex.org/W2039762497",
      "https://openalex.org/W2064272569",
      "https://openalex.org/W2009400743",
      "https://openalex.org/W2766051584",
      "https://openalex.org/W3082835005",
      "https://openalex.org/W1585922331",
      "https://openalex.org/W2127247587",
      "https://openalex.org/W2116707180",
      "https://openalex.org/W3139447365",
      "https://openalex.org/W2122598160",
    ],
    ngrams_url: "https://api.openalex.org/works/W2594873390/ngrams",
    abstract_inverted_index: {
      The: [0, 59],
      "Wnt,": [1, 77],
      "Hedgehog,": [2, 78],
      and: [3, 14, 27, 53, 67, 79, 85, 87, 97],
      Notch: [4, 80],
      pathways: [5, 9, 20, 34, 81, 93],
      are: [6, 21, 61],
      inherent: [7],
      signaling: [8],
      in: [10, 23, 37, 82],
      normal: [11],
      "embryogenesis,": [12],
      "development,": [13],
      "hemostasis.": [15],
      "However,": [16],
      dysfunctions: [17],
      of: [18, 32, 39, 47, 51, 76],
      these: [19, 33, 92],
      evident: [22],
      multiple: [24],
      tumor: [25, 57, 64],
      types: [26],
      "malignancies.": [28],
      "Specifically,": [29],
      aberrant: [30],
      activation: [31],
      is: [35],
      implicated: [36],
      modulation: [38],
      cancer: [40, 48, 100],
      stem: [41],
      cells: [42, 49],
      "(CSCs),": [43],
      a: [44],
      small: [45],
      subset: [46],
      capable: [50],
      "self-renewal": [52],
      differentiation: [54],
      into: [55],
      heterogeneous: [56],
      "cells.": [58],
      CSCs: [60, 96],
      accountable: [62],
      for: [63],
      "initiation,": [65],
      "growth,": [66],
      "recurrence.": [68],
      In: [69],
      this: [70],
      "review,": [71],
      we: [72],
      focus: [73],
      on: [74],
      roles: [75],
      "CSCs'": [83],
      stemness: [84],
      functions: [86],
      summarize: [88],
      therapeutic: [89],
      studies: [90],
      targeting: [91],
      to: [94],
      eliminate: [95],
      improve: [98],
      overall: [99],
      treatment: [101],
      "outcomes.": [102],
    },
    cited_by_api_url: "https://api.openalex.org/works?filter=cites:W2594873390",
    counts_by_year: [
      {
        year: 2023,
        cited_by_count: 5,
      },
      {
        year: 2022,
        cited_by_count: 23,
      },
      {
        year: 2021,
        cited_by_count: 22,
      },
      {
        year: 2020,
        cited_by_count: 14,
      },
      {
        year: 2019,
        cited_by_count: 23,
      },
      {
        year: 2018,
        cited_by_count: 18,
      },
      {
        year: 2017,
        cited_by_count: 5,
      },
    ],
    updated_date: "2023-12-12T17:56:24.642646",
    created_date: "2017-03-16",
  };

  return parseVerificationPaperResult(mockResponse, true);
};

type OpenAlexResponse = {
  count: number;
  perPage: number;
  results: any[];
  error: any;
};

export const fetchOpenAlexProfiles = async ({
  requestType,
  name,
  pageNumber,
}: {
  requestType: "ORCID" | "NAME";
  name?: string;
  pageNumber: number;
}): Promise<OpenAlexResponse> => {
  const url = generateApiUrl(
    `user_verification/get_openalex_author_profiles`,
    `?page=${pageNumber}`
  );

  return fetch(url, API.POST_CONFIG({ request_type: requestType, name }))
    .then(async (res) => {
      const parsed = await helpers.parseJSON(res);

      if (requestType === "ORCID") {
        return {
          count: parsed ? 1 : 0,
          perPage: 1,
          results: [parsed],
          error: res.ok
            ? null
            : {
                status: res.status,
                statusText: res.statusText,
              },
        };
      } else {
        return {
          count: parsed.meta.count,
          perPage: parsed.meta.per_page,
          results: parsed.results,
          error: res?.ok
            ? null
            : {
                status: res.status,
                statusText: res.statusText,
              },
        };
      }
    })
    .catch((error) => {
      captureEvent({
        error,
        msg: "[VERIFICATION] Failed to fetch openalex profiles",
        data: { requestType },
      });
      throw error;
    });
};

export const completeProfileVerification = async ({ openAlexProfileIds }) => {
  const url = generateApiUrl(`user/verify_user`);

  return fetch(url, API.POST_CONFIG({ openalex_ids: openAlexProfileIds })).then(
    helpers.checkStatus
  );
};
