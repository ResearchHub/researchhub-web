import API from "../../../config/api";
import { Helpers } from "@quantfive/js-web-config";
import { emptyFncWithMsg, isEmpty } from "../../../config/utils/nullchecks";
import {
  ID,
  NullableString,
  RHUser,
  ValueOf,
  parseUser,
} from "../../../config/types/root_types";
import { AUTHOR_CLAIM_STATUS } from "../constants/AuthorClaimStatus";
import {
  Authorship,
  parseAuthorship,
  parsePaper,
} from "~/components/Document/lib/types";
import {
  PaperReward,
  parsePaperReward,
} from "~/components/ResearchCoin/lib/types";

type ApiArgs = {
  caseStatus: ValueOf<typeof AUTHOR_CLAIM_STATUS>;
  onError?: Function;
  onSuccess: (formattedResult: formattedResult) => void;
  page: number;
};
export type formattedResult = {
  claimCases: AuthorClaimCase[];
  hasMore: boolean;
  page: number;
};
export type AuthorClaimCase = {
  caseData: CaseData;
  requestor: RHUser;
};
export type CaseData = {
  createdDate: string;
  id: ID;
  paper: any;
  status: string;
  targetAuthorName?: NullableString;
  updatedDate: string;
  targetPaperTitle?: NullableString;
  targetPaperDOI?: NullableString;
  providedEmail?: NullableString;
  authorship?: Authorship;
  preregistrationUrl?: NullableString;
  openDataUrl?: NullableString;
  paperReward?: PaperReward;
};
export type PaginationInfo = {
  caseStatus: ValueOf<typeof AUTHOR_CLAIM_STATUS> | null;
  hasMore: boolean;
  isLoadingMore: boolean;
  isPageLoading: boolean;
  page: number;
};

export const defaultPaginationInfo: PaginationInfo = {
  caseStatus: null,
  hasMore: false,
  isLoadingMore: false,
  isPageLoading: true,
  page: 1,
};

export function getCases({
  caseStatus = AUTHOR_CLAIM_STATUS.OPEN,
  onSuccess,
  onError = emptyFncWithMsg,
  page,
}: ApiArgs): void {
  fetch(
    API.AUTHOR_CLAIM_MODERATORS({ case_status: caseStatus, page }),
    API.GET_CONFIG()
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then(() => {

      
      return {
        "count": 71,
        "next": "https://backend.prod.researchhub.com/api/author_claim_case/moderator/?case_status=OPEN&page=2",
        "previous": null,
        "results": [
            {
                "case_type": "PAPER_CLAIM",
                "created_date": "2024-08-05T23:02:00.451250Z",
                "creator": 66173,
                "id": 3819,
                "moderator": {},
                "requestor": {
                    "id": 66173,
                    "author_profile": {
                        "id": 1871990,
                        "user": 66173,
                        "first_name": "Farhan",
                        "last_name": "Anwar",
                        "created_date": "2024-07-11T21:23:40.260051Z",
                        "updated_date": "2024-08-05T03:54:43.206054Z",
                        "description": "I am an infectious disease microbiologist primarily focused on anaerobic bacterial infections causing antibiotic-associated diarrheal disease. My work includes the characterization of these bacteria and the development of novel therapeutics against them.",
                        "h_index": 6,
                        "i10_index": 6,
                        "profile_image": "https://storage.prod.researchhub.com/uploads/author_profile_images/2024/07/16/blob_H6EuGAN",
                        "author_score": 0,
                        "university": null,
                        "orcid_id": "https://orcid.org/0000-0002-1671-9939",
                        "openalex_ids": [
                            "https://openalex.org/A5000174637"
                        ],
                        "education": [
                            {
                                "id": 8118,
                                "city": "Tucson",
                                "name": "University of Arizona",
                                "year": {
                                    "label": "2023",
                                    "value": "2023"
                                },
                                "major": "Microbiology",
                                "state": "AZ",
                                "degree": {
                                    "label": "Doctor of Philosophy",
                                    "value": "PhD"
                                },
                                "country": "United States",
                                "summary": "Microbiology PhD '23, University of Arizona",
                                "is_public": true,
                                "created_date": "2020-11-24T21:44:27.625974Z",
                                "updated_date": "2020-11-24T21:44:27.625976Z"
                            }
                        ],
                        "headline": {
                            "title": "Infectious disease microbiologist",
                            "isPublic": true
                        },
                        "facebook": null,
                        "twitter": "",
                        "linkedin": "https://www.linkedin.com/in/anwarsol/",
                        "google_scholar": "https://scholar.google.com/citations?hl=en&user=T33xv4IAAAAJ&view_op=list_works&sortby=pubdate",
                        "claimed": true,
                        "is_verified": false,
                        "country_code": null,
                        "created_source": "RESEARCHHUB",
                        "last_full_fetch_from_openalex": null,
                        "two_year_mean_citedness": 0.6666666666666666,
                        "merged_with_author": null,
                        "added_as_editor_date": null,
                        "is_claimed": true,
                        "is_hub_editor_of": [],
                        "is_hub_editor": false,
                        "num_posts": 0,
                        "reputation": 115,
                        "reputation_v2": {
                            "hub": {
                                "id": 75232,
                                "name": "infectious diseases",
                                "slug": "infectious-diseases"
                            },
                            "score": 78604,
                            "percentile": 0.6905666666666667,
                            "bins": [
                                [
                                    0,
                                    1000
                                ],
                                [
                                    1000,
                                    10000
                                ],
                                [
                                    10000,
                                    100000
                                ],
                                [
                                    100000,
                                    1000000
                                ]
                            ]
                        },
                        "reputation_list": [
                            {
                                "hub": {
                                    "id": 75232,
                                    "name": "infectious diseases",
                                    "slug": "infectious-diseases"
                                },
                                "score": 78604,
                                "percentile": 0.6905666666666667,
                                "bins": [
                                    [
                                        0,
                                        1000
                                    ],
                                    [
                                        1000,
                                        10000
                                    ],
                                    [
                                        10000,
                                        100000
                                    ],
                                    [
                                        100000,
                                        1000000
                                    ]
                                ]
                            }
                        ],
                        "suspended_status": {
                            "probable_spammer": false,
                            "is_suspended": false
                        },
                        "sift_link": "https://console.sift.com/users/66173?abuse_type=content_abuse",
                        "total_score": null,
                        "wallet": null,
                        "is_verified_v2": true
                    },
                    "balance": null,
                    "bookmarks": [],
                    "created_date": "2024-07-11T21:23:40.248276Z",
                    "has_seen_first_coin_modal": true,
                    "has_seen_orcid_connect_modal": false,
                    "is_suspended": false,
                    "probable_spammer": false,
                    "is_verified": false,
                    "moderator": false,
                    "reputation": 115,
                    "subscribed": null,
                    "updated_date": "2024-07-13T22:31:31.219045Z",
                    "upload_tutorial_complete": false,
                    "hub_rep": null,
                    "time_rep": null
                },
                "updated_date": "2024-08-05T23:02:00.451268Z",
                "status": "OPEN",
                "token_generated_time": null,
                "validation_attempt_count": -1,
                "validation_token": null,
                "paper": {
                    "title": "Low-toxin <i>Clostridioides difficile</i> RT027 strains exhibit robust virulence",
                    "id": 1406384,
                    "slug": "low-toxin-iclostridioides-difficilei-rt027-strains-exhibit-robust-virulence",
                    "primary_hub": "infectious diseases"
                },
                "preregistration_url": null,
                "open_data_url": null,
                "version": 2,
                "authorship": {
                    "id": 1965005,
                    "created_date": "2024-08-05T03:53:17.007760Z",
                    "updated_date": "2024-08-05T03:53:17.007810Z",
                    "author_position": "first",
                    "is_corresponding": false,
                    "raw_author_name": "Farhan Anwar",
                    "paper": 1406384,
                    "author": 1871990,
                    "institutions": [
                        62
                    ]
                },
                "paper_reward": {
                    "id": 112,
                    "citation_change": 5,
                    "citation_count": 5,
                    "rsc_value": 5.167520616042792,
                    "is_open_data": false,
                    "is_preregistered": false,
                    "created_date": "2024-08-05T23:02:00.442701Z",
                    "updated_date": "2024-08-05T23:02:00.442721Z",
                    "paper": 1406384,
                    "author": 1871990,
                    "distribution": null,
                    "hub_citation_value": 131
                }
            },
            {
                "case_type": "PAPER_CLAIM",
                "created_date": "2024-08-05T16:40:55.343507Z",
                "creator": 66506,
                "id": 3818,
                "moderator": {},
                "requestor": {
                    "id": 66506,
                    "author_profile": {
                        "id": 1872316,
                        "user": 66506,
                        "first_name": "Emilio",
                        "last_name": "Merheb",
                        "created_date": "2024-07-15T14:47:03.713704Z",
                        "updated_date": "2024-08-05T16:39:40.180254Z",
                        "description": "PhD, Albert Einstein College of Medicine - Biomedical Sciences - \nResearch experience in biomedical sciences for over a decade, primarily in academic settings with expertise in endocrinology, metabolism, cellular and molecular biology, oncology, biochemistry and neuroscience.",
                        "h_index": 3,
                        "i10_index": 2,
                        "profile_image": "https://storage.prod.researchhub.com/uploads/author_profile_images/2024/07/15/blob_jMe1Gkb",
                        "author_score": 0,
                        "university": null,
                        "orcid_id": "https://orcid.org/0000-0002-1415-1075",
                        "openalex_ids": [
                            "https://openalex.org/A5074739065"
                        ],
                        "education": [],
                        "headline": {
                            "title": "Neuroscience Editor | Biomedical Scientist",
                            "isPublic": true
                        },
                        "facebook": null,
                        "twitter": "",
                        "linkedin": "https://www.linkedin.com/in/emilio-merheb-ph-d-29ba10154/",
                        "google_scholar": "https://scholar.google.com/citations?user=MY7E-6QAAAAJ&hl=en",
                        "claimed": true,
                        "is_verified": false,
                        "country_code": null,
                        "created_source": "RESEARCHHUB",
                        "last_full_fetch_from_openalex": null,
                        "two_year_mean_citedness": 4.0,
                        "merged_with_author": null,
                        "added_as_editor_date": "2024-07-16T23:10:55.340123Z",
                        "is_claimed": true,
                        "is_hub_editor_of": [
                            {
                                "editor_permission_groups": [
                                    {
                                        "id": 140006,
                                        "organization": null,
                                        "user": {
                                            "id": 66506,
                                            "author_profile": {
                                                "id": 1872316,
                                                "first_name": "Emilio",
                                                "last_name": "Merheb",
                                                "created_date": "2024-07-15T14:47:03.713704Z",
                                                "updated_date": "2024-08-05T16:39:40.180254Z",
                                                "description": "PhD, Albert Einstein College of Medicine - Biomedical Sciences - \nResearch experience in biomedical sciences for over a decade, primarily in academic settings with expertise in endocrinology, metabolism, cellular and molecular biology, oncology, biochemistry and neuroscience.",
                                                "h_index": 3,
                                                "i10_index": 2,
                                                "profile_image": "https://storage.prod.researchhub.com/uploads/author_profile_images/2024/07/15/blob_jMe1Gkb",
                                                "author_score": 0,
                                                "orcid_id": "https://orcid.org/0000-0002-1415-1075",
                                                "openalex_ids": [
                                                    "https://openalex.org/A5074739065"
                                                ],
                                                "education": [],
                                                "headline": {
                                                    "title": "Neuroscience Editor | Biomedical Scientist",
                                                    "isPublic": true
                                                },
                                                "facebook": null,
                                                "twitter": "",
                                                "linkedin": "https://www.linkedin.com/in/emilio-merheb-ph-d-29ba10154/",
                                                "google_scholar": "https://scholar.google.com/citations?user=MY7E-6QAAAAJ&hl=en",
                                                "claimed": true,
                                                "is_verified": false,
                                                "country_code": null,
                                                "created_source": "RESEARCHHUB",
                                                "last_full_fetch_from_openalex": null,
                                                "two_year_mean_citedness": 4.0,
                                                "user": 66506,
                                                "university": null,
                                                "merged_with_author": null
                                            }
                                        },
                                        "created_date": "2024-07-16T23:10:55.340123Z",
                                        "updated_date": "2024-07-16T23:10:55.340142Z",
                                        "access_type": "EDITOR",
                                        "object_id": 2,
                                        "content_type": 18
                                    }
                                ],
                                "hub_image": "https://storage.prod.researchhub.com/uploads/hub_images/2020/10/07/neuroscience.jpg",
                                "id": 2,
                                "is_locked": false,
                                "is_removed": false,
                                "name": "neuroscience",
                                "slug": "neuroscience"
                            }
                        ],
                        "is_hub_editor": true,
                        "num_posts": 0,
                        "reputation": 189,
                        "reputation_v2": {
                            "hub": {
                                "id": 75301,
                                "name": "endocrine and autonomic systems",
                                "slug": "endocrine-and-autonomic-systems"
                            },
                            "score": 61751,
                            "percentile": 0.6437527777777778,
                            "bins": [
                                [
                                    0,
                                    1000
                                ],
                                [
                                    1000,
                                    10000
                                ],
                                [
                                    10000,
                                    100000
                                ],
                                [
                                    100000,
                                    1000000
                                ]
                            ]
                        },
                        "reputation_list": [
                            {
                                "hub": {
                                    "id": 75301,
                                    "name": "endocrine and autonomic systems",
                                    "slug": "endocrine-and-autonomic-systems"
                                },
                                "score": 61751,
                                "percentile": 0.6437527777777778,
                                "bins": [
                                    [
                                        0,
                                        1000
                                    ],
                                    [
                                        1000,
                                        10000
                                    ],
                                    [
                                        10000,
                                        100000
                                    ],
                                    [
                                        100000,
                                        1000000
                                    ]
                                ]
                            },
                            {
                                "hub": {
                                    "id": 231,
                                    "name": "molecular biology",
                                    "slug": "molecular-biology-1"
                                },
                                "score": 752,
                                "percentile": 0.188,
                                "bins": [
                                    [
                                        0,
                                        1000
                                    ],
                                    [
                                        1000,
                                        10000
                                    ],
                                    [
                                        10000,
                                        100000
                                    ],
                                    [
                                        100000,
                                        1000000
                                    ]
                                ]
                            }
                        ],
                        "suspended_status": {
                            "probable_spammer": false,
                            "is_suspended": false
                        },
                        "sift_link": "https://console.sift.com/users/66506?abuse_type=content_abuse",
                        "total_score": null,
                        "wallet": null,
                        "is_verified_v2": true
                    },
                    "balance": null,
                    "bookmarks": [],
                    "created_date": "2024-07-15T14:47:03.701287Z",
                    "has_seen_first_coin_modal": true,
                    "has_seen_orcid_connect_modal": false,
                    "is_suspended": false,
                    "probable_spammer": false,
                    "is_verified": false,
                    "moderator": false,
                    "reputation": 189,
                    "subscribed": null,
                    "updated_date": "2024-07-18T21:57:37.419523Z",
                    "upload_tutorial_complete": false,
                    "hub_rep": null,
                    "time_rep": null
                },
                "updated_date": "2024-08-05T16:40:55.343528Z",
                "status": "OPEN",
                "token_generated_time": null,
                "validation_attempt_count": -1,
                "validation_token": null,
                "paper": {
                    "title": "Defective myelination in an RNA polymerase III mutant leukodystrophic mouse",
                    "id": 1378150,
                    "slug": "defective-myelination-in-an-rna-polymerase-iii-mutant-leukodystrophic-mouse",
                    "primary_hub": "molecular biology"
                },
                "preregistration_url": "https://www.biorxiv.org/content/10.1101/2020.12.09.418657v2",
                "open_data_url": "https://www.pnas.org/doi/10.1073/pnas.2024378118?url_ver=Z39.88-2003&rfr_id=ori%3Arid%3Acrossref.org&rfr_dat=cr_pub++0pubmed",
                "version": 2,
                "authorship": {
                    "id": 1951013,
                    "created_date": "2024-07-31T16:33:53.974279Z",
                    "updated_date": "2024-07-31T16:33:53.974306Z",
                    "author_position": "first",
                    "is_corresponding": false,
                    "raw_author_name": "Emilio Merheb",
                    "paper": 1378150,
                    "author": 1872316,
                    "institutions": [
                        309
                    ]
                },
                "paper_reward": {
                    "id": 111,
                    "citation_change": 5,
                    "citation_count": 5,
                    "rsc_value": 20.274936399545616,
                    "is_open_data": true,
                    "is_preregistered": true,
                    "created_date": "2024-08-05T16:40:55.322889Z",
                    "updated_date": "2024-08-05T16:40:55.322908Z",
                    "paper": 1378150,
                    "author": 1872316,
                    "distribution": null,
                    "hub_citation_value": 161
                }
            },
            {
                "case_type": "PAPER_CLAIM",
                "created_date": "2024-08-05T14:22:51.373079Z",
                "creator": 66702,
                "id": 3817,
                "moderator": {},
                "requestor": {
                    "id": 66702,
                    "author_profile": {
                        "id": 1872510,
                        "user": 66702,
                        "first_name": "Ryan J.",
                        "last_name": "Worthen, PhD",
                        "created_date": "2024-07-16T17:18:07.276447Z",
                        "updated_date": "2024-08-05T13:56:59.387448Z",
                        "description": "I completed my pre- and post-doctoral training under the mentorship of Dr. Eleonore Beurel in the Department of Psychiatry and Behavioral Sciences at the University of Miami Miller School of Medicine, investigating the neurobiological underpinnings of major depressive disorder and applying advanced techniques in cognitive and behavioral neuroscience. Utilizing the learned helplessness paradigm in mice, we developed a model to measure the effects of stress on mood and cognition, followed by the use of anti-inflammatory treatments to reverse neuroinflammation and depressive-like behavior. I am most deeply interested in the neurobiological foundations of conscious experience, including emotion, cognition, and behavior, with a focus on the potentially targetable biomolecular pathophysiology involved in the development of psychiatric disorders.",
                        "h_index": 8,
                        "i10_index": 8,
                        "profile_image": "https://storage.prod.researchhub.com/uploads/author_profile_images/2024/07/16/blob_o017bDQ",
                        "author_score": 0,
                        "university": null,
                        "orcid_id": "https://orcid.org/0000-0002-2010-5876",
                        "openalex_ids": [
                            "https://openalex.org/A5012725695"
                        ],
                        "education": [
                            {
                                "id": 8488,
                                "city": "Coral Gables",
                                "name": "University of Miami",
                                "year": {
                                    "label": "2020",
                                    "value": "2020"
                                },
                                "major": "Neuroscience",
                                "state": "FL",
                                "degree": {
                                    "label": "Doctor of Philosophy",
                                    "value": "PhD"
                                },
                                "country": "United States",
                                "summary": "Neuroscience PhD '20, University of Miami",
                                "is_public": true,
                                "created_date": "2020-11-24T21:44:27.627706Z",
                                "updated_date": "2020-11-24T21:44:27.627708Z"
                            },
                            {
                                "id": 8564,
                                "city": "",
                                "name": "University of North Carolina at Chapel Hill",
                                "year": {
                                    "label": "2008",
                                    "value": "2008"
                                },
                                "major": "Biology",
                                "state": "",
                                "degree": {
                                    "label": "Bachelor of Science",
                                    "value": "BS"
                                },
                                "country": "United States",
                                "summary": "Biology BS '08, University of North Carolina at Chapel Hill",
                                "is_public": false,
                                "created_date": "2020-11-24T21:44:27.628053Z",
                                "updated_date": "2020-11-24T21:44:27.628055Z"
                            },
                            {
                                "id": 8564,
                                "city": "",
                                "name": "University of North Carolina at Chapel Hill",
                                "year": {
                                    "label": "2008",
                                    "value": "2008"
                                },
                                "major": "Spanish",
                                "state": "",
                                "country": "United States",
                                "summary": "Spanish  '08, University of North Carolina at Chapel Hill",
                                "is_public": false,
                                "created_date": "2020-11-24T21:44:27.628053Z",
                                "updated_date": "2020-11-24T21:44:27.628055Z"
                            }
                        ],
                        "headline": {
                            "title": "Neuropsychiatry",
                            "isPublic": true
                        },
                        "facebook": null,
                        "twitter": "",
                        "linkedin": "https://www.linkedin.com/in/ryan-j-worthen-phd-59556622/",
                        "google_scholar": "https://scholar.google.com/citations?user=gAvlADUAAAAJ&hl=en",
                        "claimed": true,
                        "is_verified": false,
                        "country_code": null,
                        "created_source": "RESEARCHHUB",
                        "last_full_fetch_from_openalex": null,
                        "two_year_mean_citedness": 12.0,
                        "merged_with_author": null,
                        "added_as_editor_date": null,
                        "is_claimed": true,
                        "is_hub_editor_of": [],
                        "is_hub_editor": false,
                        "num_posts": 0,
                        "reputation": 100,
                        "reputation_v2": {
                            "hub": {
                                "id": 50498,
                                "name": "biological psychiatry",
                                "slug": "biological-psychiatry"
                            },
                            "score": 102819,
                            "percentile": 0.7507830555555556,
                            "bins": [
                                [
                                    0,
                                    1000
                                ],
                                [
                                    1000,
                                    10000
                                ],
                                [
                                    10000,
                                    100000
                                ],
                                [
                                    100000,
                                    1000000
                                ]
                            ]
                        },
                        "reputation_list": [
                            {
                                "hub": {
                                    "id": 50498,
                                    "name": "biological psychiatry",
                                    "slug": "biological-psychiatry"
                                },
                                "score": 102819,
                                "percentile": 0.7507830555555556,
                                "bins": [
                                    [
                                        0,
                                        1000
                                    ],
                                    [
                                        1000,
                                        10000
                                    ],
                                    [
                                        10000,
                                        100000
                                    ],
                                    [
                                        100000,
                                        1000000
                                    ]
                                ]
                            },
                            {
                                "hub": {
                                    "id": 75224,
                                    "name": "cellular and molecular neuroscience",
                                    "slug": "cellular-and-molecular-neuroscience"
                                },
                                "score": 24335,
                                "percentile": 0.5398194444444444,
                                "bins": [
                                    [
                                        0,
                                        1000
                                    ],
                                    [
                                        1000,
                                        10000
                                    ],
                                    [
                                        10000,
                                        100000
                                    ],
                                    [
                                        100000,
                                        1000000
                                    ]
                                ]
                            },
                            {
                                "hub": {
                                    "id": 244,
                                    "name": "cell biology",
                                    "slug": "cell-biology-1"
                                },
                                "score": 900,
                                "percentile": 0.225,
                                "bins": [
                                    [
                                        0,
                                        1000
                                    ],
                                    [
                                        1000,
                                        10000
                                    ],
                                    [
                                        10000,
                                        100000
                                    ],
                                    [
                                        100000,
                                        1000000
                                    ]
                                ]
                            }
                        ],
                        "suspended_status": {
                            "probable_spammer": true,
                            "is_suspended": false
                        },
                        "sift_link": "https://console.sift.com/users/66702?abuse_type=content_abuse",
                        "total_score": null,
                        "wallet": null,
                        "is_verified_v2": true
                    },
                    "balance": null,
                    "bookmarks": [],
                    "created_date": "2024-07-16T17:18:07.266298Z",
                    "has_seen_first_coin_modal": false,
                    "has_seen_orcid_connect_modal": false,
                    "is_suspended": false,
                    "probable_spammer": true,
                    "is_verified": false,
                    "moderator": false,
                    "reputation": 100,
                    "subscribed": null,
                    "updated_date": "2024-07-16T17:34:02.844286Z",
                    "upload_tutorial_complete": false,
                    "hub_rep": null,
                    "time_rep": null
                },
                "updated_date": "2024-08-05T14:22:51.373088Z",
                "status": "OPEN",
                "token_generated_time": null,
                "validation_attempt_count": -1,
                "validation_token": null,
                "paper": {
                    "title": "The Actin-Binding Protein Capulet Genetically Interacts with the Microtubule Motor Kinesin to Maintain Neuronal Dendrite Homeostasis",
                    "id": 6694996,
                    "slug": "the-actin-binding-protein-capulet-genetically-interacts-with-the-microtubule-motor-kinesin-to-maintain-neuronal-dendrite-homeostasis",
                    "primary_hub": "cell biology"
                },
                "preregistration_url": null,
                "open_data_url": null,
                "version": 2,
                "authorship": null,
                "paper_reward": {
                    "id": 110,
                    "citation_change": 20,
                    "citation_count": 20,
                    "rsc_value": 8.082000531478055,
                    "is_open_data": false,
                    "is_preregistered": false,
                    "created_date": "2024-08-05T14:22:51.371520Z",
                    "updated_date": "2024-08-05T14:22:51.371535Z",
                    "paper": 6694996,
                    "author": 1872510,
                    "distribution": null,
                    "hub_citation_value": 37
                }
            },
            {
                "case_type": "PAPER_CLAIM",
                "created_date": "2024-08-05T14:22:34.370063Z",
                "creator": 66702,
                "id": 3816,
                "moderator": {},
                "requestor": {
                    "id": 66702,
                    "author_profile": {
                        "id": 1872510,
                        "user": 66702,
                        "first_name": "Ryan J.",
                        "last_name": "Worthen, PhD",
                        "created_date": "2024-07-16T17:18:07.276447Z",
                        "updated_date": "2024-08-05T13:56:59.387448Z",
                        "description": "I completed my pre- and post-doctoral training under the mentorship of Dr. Eleonore Beurel in the Department of Psychiatry and Behavioral Sciences at the University of Miami Miller School of Medicine, investigating the neurobiological underpinnings of major depressive disorder and applying advanced techniques in cognitive and behavioral neuroscience. Utilizing the learned helplessness paradigm in mice, we developed a model to measure the effects of stress on mood and cognition, followed by the use of anti-inflammatory treatments to reverse neuroinflammation and depressive-like behavior. I am most deeply interested in the neurobiological foundations of conscious experience, including emotion, cognition, and behavior, with a focus on the potentially targetable biomolecular pathophysiology involved in the development of psychiatric disorders.",
                        "h_index": 8,
                        "i10_index": 8,
                        "profile_image": "https://storage.prod.researchhub.com/uploads/author_profile_images/2024/07/16/blob_o017bDQ",
                        "author_score": 0,
                        "university": null,
                        "orcid_id": "https://orcid.org/0000-0002-2010-5876",
                        "openalex_ids": [
                            "https://openalex.org/A5012725695"
                        ],
                        "education": [
                            {
                                "id": 8488,
                                "city": "Coral Gables",
                                "name": "University of Miami",
                                "year": {
                                    "label": "2020",
                                    "value": "2020"
                                },
                                "major": "Neuroscience",
                                "state": "FL",
                                "degree": {
                                    "label": "Doctor of Philosophy",
                                    "value": "PhD"
                                },
                                "country": "United States",
                                "summary": "Neuroscience PhD '20, University of Miami",
                                "is_public": true,
                                "created_date": "2020-11-24T21:44:27.627706Z",
                                "updated_date": "2020-11-24T21:44:27.627708Z"
                            },
                            {
                                "id": 8564,
                                "city": "",
                                "name": "University of North Carolina at Chapel Hill",
                                "year": {
                                    "label": "2008",
                                    "value": "2008"
                                },
                                "major": "Biology",
                                "state": "",
                                "degree": {
                                    "label": "Bachelor of Science",
                                    "value": "BS"
                                },
                                "country": "United States",
                                "summary": "Biology BS '08, University of North Carolina at Chapel Hill",
                                "is_public": false,
                                "created_date": "2020-11-24T21:44:27.628053Z",
                                "updated_date": "2020-11-24T21:44:27.628055Z"
                            },
                            {
                                "id": 8564,
                                "city": "",
                                "name": "University of North Carolina at Chapel Hill",
                                "year": {
                                    "label": "2008",
                                    "value": "2008"
                                },
                                "major": "Spanish",
                                "state": "",
                                "country": "United States",
                                "summary": "Spanish  '08, University of North Carolina at Chapel Hill",
                                "is_public": false,
                                "created_date": "2020-11-24T21:44:27.628053Z",
                                "updated_date": "2020-11-24T21:44:27.628055Z"
                            }
                        ],
                        "headline": {
                            "title": "Neuropsychiatry",
                            "isPublic": true
                        },
                        "facebook": null,
                        "twitter": "",
                        "linkedin": "https://www.linkedin.com/in/ryan-j-worthen-phd-59556622/",
                        "google_scholar": "https://scholar.google.com/citations?user=gAvlADUAAAAJ&hl=en",
                        "claimed": true,
                        "is_verified": false,
                        "country_code": null,
                        "created_source": "RESEARCHHUB",
                        "last_full_fetch_from_openalex": null,
                        "two_year_mean_citedness": 12.0,
                        "merged_with_author": null,
                        "added_as_editor_date": null,
                        "is_claimed": true,
                        "is_hub_editor_of": [],
                        "is_hub_editor": false,
                        "num_posts": 0,
                        "reputation": 100,
                        "reputation_v2": {
                            "hub": {
                                "id": 50498,
                                "name": "biological psychiatry",
                                "slug": "biological-psychiatry"
                            },
                            "score": 102819,
                            "percentile": 0.7507830555555556,
                            "bins": [
                                [
                                    0,
                                    1000
                                ],
                                [
                                    1000,
                                    10000
                                ],
                                [
                                    10000,
                                    100000
                                ],
                                [
                                    100000,
                                    1000000
                                ]
                            ]
                        },
                        "reputation_list": [
                            {
                                "hub": {
                                    "id": 50498,
                                    "name": "biological psychiatry",
                                    "slug": "biological-psychiatry"
                                },
                                "score": 102819,
                                "percentile": 0.7507830555555556,
                                "bins": [
                                    [
                                        0,
                                        1000
                                    ],
                                    [
                                        1000,
                                        10000
                                    ],
                                    [
                                        10000,
                                        100000
                                    ],
                                    [
                                        100000,
                                        1000000
                                    ]
                                ]
                            },
                            {
                                "hub": {
                                    "id": 75224,
                                    "name": "cellular and molecular neuroscience",
                                    "slug": "cellular-and-molecular-neuroscience"
                                },
                                "score": 24335,
                                "percentile": 0.5398194444444444,
                                "bins": [
                                    [
                                        0,
                                        1000
                                    ],
                                    [
                                        1000,
                                        10000
                                    ],
                                    [
                                        10000,
                                        100000
                                    ],
                                    [
                                        100000,
                                        1000000
                                    ]
                                ]
                            },
                            {
                                "hub": {
                                    "id": 244,
                                    "name": "cell biology",
                                    "slug": "cell-biology-1"
                                },
                                "score": 900,
                                "percentile": 0.225,
                                "bins": [
                                    [
                                        0,
                                        1000
                                    ],
                                    [
                                        1000,
                                        10000
                                    ],
                                    [
                                        10000,
                                        100000
                                    ],
                                    [
                                        100000,
                                        1000000
                                    ]
                                ]
                            }
                        ],
                        "suspended_status": {
                            "probable_spammer": true,
                            "is_suspended": false
                        },
                        "sift_link": "https://console.sift.com/users/66702?abuse_type=content_abuse",
                        "total_score": null,
                        "wallet": null,
                        "is_verified_v2": true
                    },
                    "balance": null,
                    "bookmarks": [],
                    "created_date": "2024-07-16T17:18:07.266298Z",
                    "has_seen_first_coin_modal": false,
                    "has_seen_orcid_connect_modal": false,
                    "is_suspended": false,
                    "probable_spammer": true,
                    "is_verified": false,
                    "moderator": false,
                    "reputation": 100,
                    "subscribed": null,
                    "updated_date": "2024-07-16T17:34:02.844286Z",
                    "upload_tutorial_complete": false,
                    "hub_rep": null,
                    "time_rep": null
                },
                "updated_date": "2024-08-05T14:22:34.370073Z",
                "status": "OPEN",
                "token_generated_time": null,
                "validation_attempt_count": -1,
                "validation_token": null,
                "paper": {
                    "title": "Insulin growth factor 2 (IGF2) as an emergent target in psychiatric and neurological disorders. Review",
                    "id": 6694995,
                    "slug": "insulin-growth-factor-2-igf2-as-an-emergent-target-in-psychiatric-and-neurological-disorders-review",
                    "primary_hub": "endocrinology, diabetes and metabolism"
                },
                "preregistration_url": null,
                "open_data_url": null,
                "version": 2,
                "authorship": null,
                "paper_reward": {
                    "id": 109,
                    "citation_change": 40,
                    "citation_count": 40,
                    "rsc_value": 20.92860447036997,
                    "is_open_data": false,
                    "is_preregistered": false,
                    "created_date": "2024-08-05T14:22:34.368347Z",
                    "updated_date": "2024-08-05T14:22:34.368362Z",
                    "paper": 6694995,
                    "author": 1872510,
                    "distribution": null,
                    "hub_citation_value": 80
                }
            },
            {
                "case_type": "PAPER_CLAIM",
                "created_date": "2024-08-05T14:21:48.518223Z",
                "creator": 66702,
                "id": 3815,
                "moderator": {},
                "requestor": {
                    "id": 66702,
                    "author_profile": {
                        "id": 1872510,
                        "user": 66702,
                        "first_name": "Ryan J.",
                        "last_name": "Worthen, PhD",
                        "created_date": "2024-07-16T17:18:07.276447Z",
                        "updated_date": "2024-08-05T13:56:59.387448Z",
                        "description": "I completed my pre- and post-doctoral training under the mentorship of Dr. Eleonore Beurel in the Department of Psychiatry and Behavioral Sciences at the University of Miami Miller School of Medicine, investigating the neurobiological underpinnings of major depressive disorder and applying advanced techniques in cognitive and behavioral neuroscience. Utilizing the learned helplessness paradigm in mice, we developed a model to measure the effects of stress on mood and cognition, followed by the use of anti-inflammatory treatments to reverse neuroinflammation and depressive-like behavior. I am most deeply interested in the neurobiological foundations of conscious experience, including emotion, cognition, and behavior, with a focus on the potentially targetable biomolecular pathophysiology involved in the development of psychiatric disorders.",
                        "h_index": 8,
                        "i10_index": 8,
                        "profile_image": "https://storage.prod.researchhub.com/uploads/author_profile_images/2024/07/16/blob_o017bDQ",
                        "author_score": 0,
                        "university": null,
                        "orcid_id": "https://orcid.org/0000-0002-2010-5876",
                        "openalex_ids": [
                            "https://openalex.org/A5012725695"
                        ],
                        "education": [
                            {
                                "id": 8488,
                                "city": "Coral Gables",
                                "name": "University of Miami",
                                "year": {
                                    "label": "2020",
                                    "value": "2020"
                                },
                                "major": "Neuroscience",
                                "state": "FL",
                                "degree": {
                                    "label": "Doctor of Philosophy",
                                    "value": "PhD"
                                },
                                "country": "United States",
                                "summary": "Neuroscience PhD '20, University of Miami",
                                "is_public": true,
                                "created_date": "2020-11-24T21:44:27.627706Z",
                                "updated_date": "2020-11-24T21:44:27.627708Z"
                            },
                            {
                                "id": 8564,
                                "city": "",
                                "name": "University of North Carolina at Chapel Hill",
                                "year": {
                                    "label": "2008",
                                    "value": "2008"
                                },
                                "major": "Biology",
                                "state": "",
                                "degree": {
                                    "label": "Bachelor of Science",
                                    "value": "BS"
                                },
                                "country": "United States",
                                "summary": "Biology BS '08, University of North Carolina at Chapel Hill",
                                "is_public": false,
                                "created_date": "2020-11-24T21:44:27.628053Z",
                                "updated_date": "2020-11-24T21:44:27.628055Z"
                            },
                            {
                                "id": 8564,
                                "city": "",
                                "name": "University of North Carolina at Chapel Hill",
                                "year": {
                                    "label": "2008",
                                    "value": "2008"
                                },
                                "major": "Spanish",
                                "state": "",
                                "country": "United States",
                                "summary": "Spanish  '08, University of North Carolina at Chapel Hill",
                                "is_public": false,
                                "created_date": "2020-11-24T21:44:27.628053Z",
                                "updated_date": "2020-11-24T21:44:27.628055Z"
                            }
                        ],
                        "headline": {
                            "title": "Neuropsychiatry",
                            "isPublic": true
                        },
                        "facebook": null,
                        "twitter": "",
                        "linkedin": "https://www.linkedin.com/in/ryan-j-worthen-phd-59556622/",
                        "google_scholar": "https://scholar.google.com/citations?user=gAvlADUAAAAJ&hl=en",
                        "claimed": true,
                        "is_verified": false,
                        "country_code": null,
                        "created_source": "RESEARCHHUB",
                        "last_full_fetch_from_openalex": null,
                        "two_year_mean_citedness": 12.0,
                        "merged_with_author": null,
                        "added_as_editor_date": null,
                        "is_claimed": true,
                        "is_hub_editor_of": [],
                        "is_hub_editor": false,
                        "num_posts": 0,
                        "reputation": 100,
                        "reputation_v2": {
                            "hub": {
                                "id": 50498,
                                "name": "biological psychiatry",
                                "slug": "biological-psychiatry"
                            },
                            "score": 102819,
                            "percentile": 0.7507830555555556,
                            "bins": [
                                [
                                    0,
                                    1000
                                ],
                                [
                                    1000,
                                    10000
                                ],
                                [
                                    10000,
                                    100000
                                ],
                                [
                                    100000,
                                    1000000
                                ]
                            ]
                        },
                        "reputation_list": [
                            {
                                "hub": {
                                    "id": 50498,
                                    "name": "biological psychiatry",
                                    "slug": "biological-psychiatry"
                                },
                                "score": 102819,
                                "percentile": 0.7507830555555556,
                                "bins": [
                                    [
                                        0,
                                        1000
                                    ],
                                    [
                                        1000,
                                        10000
                                    ],
                                    [
                                        10000,
                                        100000
                                    ],
                                    [
                                        100000,
                                        1000000
                                    ]
                                ]
                            },
                            {
                                "hub": {
                                    "id": 75224,
                                    "name": "cellular and molecular neuroscience",
                                    "slug": "cellular-and-molecular-neuroscience"
                                },
                                "score": 24335,
                                "percentile": 0.5398194444444444,
                                "bins": [
                                    [
                                        0,
                                        1000
                                    ],
                                    [
                                        1000,
                                        10000
                                    ],
                                    [
                                        10000,
                                        100000
                                    ],
                                    [
                                        100000,
                                        1000000
                                    ]
                                ]
                            },
                            {
                                "hub": {
                                    "id": 244,
                                    "name": "cell biology",
                                    "slug": "cell-biology-1"
                                },
                                "score": 900,
                                "percentile": 0.225,
                                "bins": [
                                    [
                                        0,
                                        1000
                                    ],
                                    [
                                        1000,
                                        10000
                                    ],
                                    [
                                        10000,
                                        100000
                                    ],
                                    [
                                        100000,
                                        1000000
                                    ]
                                ]
                            }
                        ],
                        "suspended_status": {
                            "probable_spammer": true,
                            "is_suspended": false
                        },
                        "sift_link": "https://console.sift.com/users/66702?abuse_type=content_abuse",
                        "total_score": null,
                        "wallet": null,
                        "is_verified_v2": true
                    },
                    "balance": null,
                    "bookmarks": [],
                    "created_date": "2024-07-16T17:18:07.266298Z",
                    "has_seen_first_coin_modal": false,
                    "has_seen_orcid_connect_modal": false,
                    "is_suspended": false,
                    "probable_spammer": true,
                    "is_verified": false,
                    "moderator": false,
                    "reputation": 100,
                    "subscribed": null,
                    "updated_date": "2024-07-16T17:34:02.844286Z",
                    "upload_tutorial_complete": false,
                    "hub_rep": null,
                    "time_rep": null
                },
                "updated_date": "2024-08-05T14:21:48.518233Z",
                "status": "OPEN",
                "token_generated_time": null,
                "validation_attempt_count": -1,
                "validation_token": null,
                "paper": {
                    "title": "Involvement of Innate and Adaptive Immune Systems Alterations in the Pathophysiology and Treatment of Depression",
                    "id": 6694993,
                    "slug": "involvement-of-innate-and-adaptive-immune-systems-alterations-in-the-pathophysiology-and-treatment-of-depression",
                    "primary_hub": "biological psychiatry"
                },
                "preregistration_url": null,
                "open_data_url": null,
                "version": 2,
                "authorship": null,
                "paper_reward": {
                    "id": 108,
                    "citation_change": 73,
                    "citation_count": 73,
                    "rsc_value": 30.745010439153457,
                    "is_open_data": false,
                    "is_preregistered": false,
                    "created_date": "2024-08-05T14:21:48.516453Z",
                    "updated_date": "2024-08-05T14:21:48.516473Z",
                    "paper": 6694993,
                    "author": 1872510,
                    "distribution": null,
                    "hub_citation_value": 26
                }
            },
            {
                "case_type": "PAPER_CLAIM",
                "created_date": "2024-08-05T14:21:26.974089Z",
                "creator": 66702,
                "id": 3814,
                "moderator": {},
                "requestor": {
                    "id": 66702,
                    "author_profile": {
                        "id": 1872510,
                        "user": 66702,
                        "first_name": "Ryan J.",
                        "last_name": "Worthen, PhD",
                        "created_date": "2024-07-16T17:18:07.276447Z",
                        "updated_date": "2024-08-05T13:56:59.387448Z",
                        "description": "I completed my pre- and post-doctoral training under the mentorship of Dr. Eleonore Beurel in the Department of Psychiatry and Behavioral Sciences at the University of Miami Miller School of Medicine, investigating the neurobiological underpinnings of major depressive disorder and applying advanced techniques in cognitive and behavioral neuroscience. Utilizing the learned helplessness paradigm in mice, we developed a model to measure the effects of stress on mood and cognition, followed by the use of anti-inflammatory treatments to reverse neuroinflammation and depressive-like behavior. I am most deeply interested in the neurobiological foundations of conscious experience, including emotion, cognition, and behavior, with a focus on the potentially targetable biomolecular pathophysiology involved in the development of psychiatric disorders.",
                        "h_index": 8,
                        "i10_index": 8,
                        "profile_image": "https://storage.prod.researchhub.com/uploads/author_profile_images/2024/07/16/blob_o017bDQ",
                        "author_score": 0,
                        "university": null,
                        "orcid_id": "https://orcid.org/0000-0002-2010-5876",
                        "openalex_ids": [
                            "https://openalex.org/A5012725695"
                        ],
                        "education": [
                            {
                                "id": 8488,
                                "city": "Coral Gables",
                                "name": "University of Miami",
                                "year": {
                                    "label": "2020",
                                    "value": "2020"
                                },
                                "major": "Neuroscience",
                                "state": "FL",
                                "degree": {
                                    "label": "Doctor of Philosophy",
                                    "value": "PhD"
                                },
                                "country": "United States",
                                "summary": "Neuroscience PhD '20, University of Miami",
                                "is_public": true,
                                "created_date": "2020-11-24T21:44:27.627706Z",
                                "updated_date": "2020-11-24T21:44:27.627708Z"
                            },
                            {
                                "id": 8564,
                                "city": "",
                                "name": "University of North Carolina at Chapel Hill",
                                "year": {
                                    "label": "2008",
                                    "value": "2008"
                                },
                                "major": "Biology",
                                "state": "",
                                "degree": {
                                    "label": "Bachelor of Science",
                                    "value": "BS"
                                },
                                "country": "United States",
                                "summary": "Biology BS '08, University of North Carolina at Chapel Hill",
                                "is_public": false,
                                "created_date": "2020-11-24T21:44:27.628053Z",
                                "updated_date": "2020-11-24T21:44:27.628055Z"
                            },
                            {
                                "id": 8564,
                                "city": "",
                                "name": "University of North Carolina at Chapel Hill",
                                "year": {
                                    "label": "2008",
                                    "value": "2008"
                                },
                                "major": "Spanish",
                                "state": "",
                                "country": "United States",
                                "summary": "Spanish  '08, University of North Carolina at Chapel Hill",
                                "is_public": false,
                                "created_date": "2020-11-24T21:44:27.628053Z",
                                "updated_date": "2020-11-24T21:44:27.628055Z"
                            }
                        ],
                        "headline": {
                            "title": "Neuropsychiatry",
                            "isPublic": true
                        },
                        "facebook": null,
                        "twitter": "",
                        "linkedin": "https://www.linkedin.com/in/ryan-j-worthen-phd-59556622/",
                        "google_scholar": "https://scholar.google.com/citations?user=gAvlADUAAAAJ&hl=en",
                        "claimed": true,
                        "is_verified": false,
                        "country_code": null,
                        "created_source": "RESEARCHHUB",
                        "last_full_fetch_from_openalex": null,
                        "two_year_mean_citedness": 12.0,
                        "merged_with_author": null,
                        "added_as_editor_date": null,
                        "is_claimed": true,
                        "is_hub_editor_of": [],
                        "is_hub_editor": false,
                        "num_posts": 0,
                        "reputation": 100,
                        "reputation_v2": {
                            "hub": {
                                "id": 50498,
                                "name": "biological psychiatry",
                                "slug": "biological-psychiatry"
                            },
                            "score": 102819,
                            "percentile": 0.7507830555555556,
                            "bins": [
                                [
                                    0,
                                    1000
                                ],
                                [
                                    1000,
                                    10000
                                ],
                                [
                                    10000,
                                    100000
                                ],
                                [
                                    100000,
                                    1000000
                                ]
                            ]
                        },
                        "reputation_list": [
                            {
                                "hub": {
                                    "id": 50498,
                                    "name": "biological psychiatry",
                                    "slug": "biological-psychiatry"
                                },
                                "score": 102819,
                                "percentile": 0.7507830555555556,
                                "bins": [
                                    [
                                        0,
                                        1000
                                    ],
                                    [
                                        1000,
                                        10000
                                    ],
                                    [
                                        10000,
                                        100000
                                    ],
                                    [
                                        100000,
                                        1000000
                                    ]
                                ]
                            },
                            {
                                "hub": {
                                    "id": 75224,
                                    "name": "cellular and molecular neuroscience",
                                    "slug": "cellular-and-molecular-neuroscience"
                                },
                                "score": 24335,
                                "percentile": 0.5398194444444444,
                                "bins": [
                                    [
                                        0,
                                        1000
                                    ],
                                    [
                                        1000,
                                        10000
                                    ],
                                    [
                                        10000,
                                        100000
                                    ],
                                    [
                                        100000,
                                        1000000
                                    ]
                                ]
                            },
                            {
                                "hub": {
                                    "id": 244,
                                    "name": "cell biology",
                                    "slug": "cell-biology-1"
                                },
                                "score": 900,
                                "percentile": 0.225,
                                "bins": [
                                    [
                                        0,
                                        1000
                                    ],
                                    [
                                        1000,
                                        10000
                                    ],
                                    [
                                        10000,
                                        100000
                                    ],
                                    [
                                        100000,
                                        1000000
                                    ]
                                ]
                            }
                        ],
                        "suspended_status": {
                            "probable_spammer": true,
                            "is_suspended": false
                        },
                        "sift_link": "https://console.sift.com/users/66702?abuse_type=content_abuse",
                        "total_score": null,
                        "wallet": null,
                        "is_verified_v2": true
                    },
                    "balance": null,
                    "bookmarks": [],
                    "created_date": "2024-07-16T17:18:07.266298Z",
                    "has_seen_first_coin_modal": false,
                    "has_seen_orcid_connect_modal": false,
                    "is_suspended": false,
                    "probable_spammer": true,
                    "is_verified": false,
                    "moderator": false,
                    "reputation": 100,
                    "subscribed": null,
                    "updated_date": "2024-07-16T17:34:02.844286Z",
                    "upload_tutorial_complete": false,
                    "hub_rep": null,
                    "time_rep": null
                },
                "updated_date": "2024-08-05T14:21:26.974098Z",
                "status": "OPEN",
                "token_generated_time": null,
                "validation_attempt_count": -1,
                "validation_token": null,
                "paper": {
                    "title": "Stressed and Inflamed, Can GSK3 Be Blamed?",
                    "id": 6694992,
                    "slug": "stressed-and-inflamed-can-gsk3-be-blamed",
                    "primary_hub": "molecular biology"
                },
                "preregistration_url": null,
                "open_data_url": null,
                "version": 2,
                "authorship": null,
                "paper_reward": {
                    "id": 107,
                    "citation_change": 91,
                    "citation_count": 91,
                    "rsc_value": 38.177526954764176,
                    "is_open_data": false,
                    "is_preregistered": false,
                    "created_date": "2024-08-05T14:21:26.972573Z",
                    "updated_date": "2024-08-05T14:21:26.972588Z",
                    "paper": 6694992,
                    "author": 1872510,
                    "distribution": null,
                    "hub_citation_value": 161
                }
            },
            {
                "case_type": "PAPER_CLAIM",
                "created_date": "2024-08-05T14:21:02.560216Z",
                "creator": 66702,
                "id": 3813,
                "moderator": {},
                "requestor": {
                    "id": 66702,
                    "author_profile": {
                        "id": 1872510,
                        "user": 66702,
                        "first_name": "Ryan J.",
                        "last_name": "Worthen, PhD",
                        "created_date": "2024-07-16T17:18:07.276447Z",
                        "updated_date": "2024-08-05T13:56:59.387448Z",
                        "description": "I completed my pre- and post-doctoral training under the mentorship of Dr. Eleonore Beurel in the Department of Psychiatry and Behavioral Sciences at the University of Miami Miller School of Medicine, investigating the neurobiological underpinnings of major depressive disorder and applying advanced techniques in cognitive and behavioral neuroscience. Utilizing the learned helplessness paradigm in mice, we developed a model to measure the effects of stress on mood and cognition, followed by the use of anti-inflammatory treatments to reverse neuroinflammation and depressive-like behavior. I am most deeply interested in the neurobiological foundations of conscious experience, including emotion, cognition, and behavior, with a focus on the potentially targetable biomolecular pathophysiology involved in the development of psychiatric disorders.",
                        "h_index": 8,
                        "i10_index": 8,
                        "profile_image": "https://storage.prod.researchhub.com/uploads/author_profile_images/2024/07/16/blob_o017bDQ",
                        "author_score": 0,
                        "university": null,
                        "orcid_id": "https://orcid.org/0000-0002-2010-5876",
                        "openalex_ids": [
                            "https://openalex.org/A5012725695"
                        ],
                        "education": [
                            {
                                "id": 8488,
                                "city": "Coral Gables",
                                "name": "University of Miami",
                                "year": {
                                    "label": "2020",
                                    "value": "2020"
                                },
                                "major": "Neuroscience",
                                "state": "FL",
                                "degree": {
                                    "label": "Doctor of Philosophy",
                                    "value": "PhD"
                                },
                                "country": "United States",
                                "summary": "Neuroscience PhD '20, University of Miami",
                                "is_public": true,
                                "created_date": "2020-11-24T21:44:27.627706Z",
                                "updated_date": "2020-11-24T21:44:27.627708Z"
                            },
                            {
                                "id": 8564,
                                "city": "",
                                "name": "University of North Carolina at Chapel Hill",
                                "year": {
                                    "label": "2008",
                                    "value": "2008"
                                },
                                "major": "Biology",
                                "state": "",
                                "degree": {
                                    "label": "Bachelor of Science",
                                    "value": "BS"
                                },
                                "country": "United States",
                                "summary": "Biology BS '08, University of North Carolina at Chapel Hill",
                                "is_public": false,
                                "created_date": "2020-11-24T21:44:27.628053Z",
                                "updated_date": "2020-11-24T21:44:27.628055Z"
                            },
                            {
                                "id": 8564,
                                "city": "",
                                "name": "University of North Carolina at Chapel Hill",
                                "year": {
                                    "label": "2008",
                                    "value": "2008"
                                },
                                "major": "Spanish",
                                "state": "",
                                "country": "United States",
                                "summary": "Spanish  '08, University of North Carolina at Chapel Hill",
                                "is_public": false,
                                "created_date": "2020-11-24T21:44:27.628053Z",
                                "updated_date": "2020-11-24T21:44:27.628055Z"
                            }
                        ],
                        "headline": {
                            "title": "Neuropsychiatry",
                            "isPublic": true
                        },
                        "facebook": null,
                        "twitter": "",
                        "linkedin": "https://www.linkedin.com/in/ryan-j-worthen-phd-59556622/",
                        "google_scholar": "https://scholar.google.com/citations?user=gAvlADUAAAAJ&hl=en",
                        "claimed": true,
                        "is_verified": false,
                        "country_code": null,
                        "created_source": "RESEARCHHUB",
                        "last_full_fetch_from_openalex": null,
                        "two_year_mean_citedness": 12.0,
                        "merged_with_author": null,
                        "added_as_editor_date": null,
                        "is_claimed": true,
                        "is_hub_editor_of": [],
                        "is_hub_editor": false,
                        "num_posts": 0,
                        "reputation": 100,
                        "reputation_v2": {
                            "hub": {
                                "id": 50498,
                                "name": "biological psychiatry",
                                "slug": "biological-psychiatry"
                            },
                            "score": 102819,
                            "percentile": 0.7507830555555556,
                            "bins": [
                                [
                                    0,
                                    1000
                                ],
                                [
                                    1000,
                                    10000
                                ],
                                [
                                    10000,
                                    100000
                                ],
                                [
                                    100000,
                                    1000000
                                ]
                            ]
                        },
                        "reputation_list": [
                            {
                                "hub": {
                                    "id": 50498,
                                    "name": "biological psychiatry",
                                    "slug": "biological-psychiatry"
                                },
                                "score": 102819,
                                "percentile": 0.7507830555555556,
                                "bins": [
                                    [
                                        0,
                                        1000
                                    ],
                                    [
                                        1000,
                                        10000
                                    ],
                                    [
                                        10000,
                                        100000
                                    ],
                                    [
                                        100000,
                                        1000000
                                    ]
                                ]
                            },
                            {
                                "hub": {
                                    "id": 75224,
                                    "name": "cellular and molecular neuroscience",
                                    "slug": "cellular-and-molecular-neuroscience"
                                },
                                "score": 24335,
                                "percentile": 0.5398194444444444,
                                "bins": [
                                    [
                                        0,
                                        1000
                                    ],
                                    [
                                        1000,
                                        10000
                                    ],
                                    [
                                        10000,
                                        100000
                                    ],
                                    [
                                        100000,
                                        1000000
                                    ]
                                ]
                            },
                            {
                                "hub": {
                                    "id": 244,
                                    "name": "cell biology",
                                    "slug": "cell-biology-1"
                                },
                                "score": 900,
                                "percentile": 0.225,
                                "bins": [
                                    [
                                        0,
                                        1000
                                    ],
                                    [
                                        1000,
                                        10000
                                    ],
                                    [
                                        10000,
                                        100000
                                    ],
                                    [
                                        100000,
                                        1000000
                                    ]
                                ]
                            }
                        ],
                        "suspended_status": {
                            "probable_spammer": true,
                            "is_suspended": false
                        },
                        "sift_link": "https://console.sift.com/users/66702?abuse_type=content_abuse",
                        "total_score": null,
                        "wallet": null,
                        "is_verified_v2": true
                    },
                    "balance": null,
                    "bookmarks": [],
                    "created_date": "2024-07-16T17:18:07.266298Z",
                    "has_seen_first_coin_modal": false,
                    "has_seen_orcid_connect_modal": false,
                    "is_suspended": false,
                    "probable_spammer": true,
                    "is_verified": false,
                    "moderator": false,
                    "reputation": 100,
                    "subscribed": null,
                    "updated_date": "2024-07-16T17:34:02.844286Z",
                    "upload_tutorial_complete": false,
                    "hub_rep": null,
                    "time_rep": null
                },
                "updated_date": "2024-08-05T14:21:02.560225Z",
                "status": "OPEN",
                "token_generated_time": null,
                "validation_attempt_count": -1,
                "validation_token": null,
                "paper": {
                    "title": "Altered Metabolism and Persistent Starvation Behaviors Caused by Reduced AMPK Function in Drosophila",
                    "id": 6694994,
                    "slug": "altered-metabolism-and-persistent-starvation-behaviors-caused-by-reduced-ampk-function-in-drosophila",
                    "primary_hub": "cellular and molecular neuroscience"
                },
                "preregistration_url": null,
                "open_data_url": null,
                "version": 2,
                "authorship": null,
                "paper_reward": {
                    "id": 106,
                    "citation_change": 99,
                    "citation_count": 99,
                    "rsc_value": 59.37228813901502,
                    "is_open_data": false,
                    "is_preregistered": false,
                    "created_date": "2024-08-05T14:21:02.558859Z",
                    "updated_date": "2024-08-05T14:21:02.558873Z",
                    "paper": 6694994,
                    "author": 1872510,
                    "distribution": null,
                    "hub_citation_value": 36
                }
            },
            {
                "case_type": "PAPER_CLAIM",
                "created_date": "2024-08-05T14:20:38.866524Z",
                "creator": 66702,
                "id": 3812,
                "moderator": {},
                "requestor": {
                    "id": 66702,
                    "author_profile": {
                        "id": 1872510,
                        "user": 66702,
                        "first_name": "Ryan J.",
                        "last_name": "Worthen, PhD",
                        "created_date": "2024-07-16T17:18:07.276447Z",
                        "updated_date": "2024-08-05T13:56:59.387448Z",
                        "description": "I completed my pre- and post-doctoral training under the mentorship of Dr. Eleonore Beurel in the Department of Psychiatry and Behavioral Sciences at the University of Miami Miller School of Medicine, investigating the neurobiological underpinnings of major depressive disorder and applying advanced techniques in cognitive and behavioral neuroscience. Utilizing the learned helplessness paradigm in mice, we developed a model to measure the effects of stress on mood and cognition, followed by the use of anti-inflammatory treatments to reverse neuroinflammation and depressive-like behavior. I am most deeply interested in the neurobiological foundations of conscious experience, including emotion, cognition, and behavior, with a focus on the potentially targetable biomolecular pathophysiology involved in the development of psychiatric disorders.",
                        "h_index": 8,
                        "i10_index": 8,
                        "profile_image": "https://storage.prod.researchhub.com/uploads/author_profile_images/2024/07/16/blob_o017bDQ",
                        "author_score": 0,
                        "university": null,
                        "orcid_id": "https://orcid.org/0000-0002-2010-5876",
                        "openalex_ids": [
                            "https://openalex.org/A5012725695"
                        ],
                        "education": [
                            {
                                "id": 8488,
                                "city": "Coral Gables",
                                "name": "University of Miami",
                                "year": {
                                    "label": "2020",
                                    "value": "2020"
                                },
                                "major": "Neuroscience",
                                "state": "FL",
                                "degree": {
                                    "label": "Doctor of Philosophy",
                                    "value": "PhD"
                                },
                                "country": "United States",
                                "summary": "Neuroscience PhD '20, University of Miami",
                                "is_public": true,
                                "created_date": "2020-11-24T21:44:27.627706Z",
                                "updated_date": "2020-11-24T21:44:27.627708Z"
                            },
                            {
                                "id": 8564,
                                "city": "",
                                "name": "University of North Carolina at Chapel Hill",
                                "year": {
                                    "label": "2008",
                                    "value": "2008"
                                },
                                "major": "Biology",
                                "state": "",
                                "degree": {
                                    "label": "Bachelor of Science",
                                    "value": "BS"
                                },
                                "country": "United States",
                                "summary": "Biology BS '08, University of North Carolina at Chapel Hill",
                                "is_public": false,
                                "created_date": "2020-11-24T21:44:27.628053Z",
                                "updated_date": "2020-11-24T21:44:27.628055Z"
                            },
                            {
                                "id": 8564,
                                "city": "",
                                "name": "University of North Carolina at Chapel Hill",
                                "year": {
                                    "label": "2008",
                                    "value": "2008"
                                },
                                "major": "Spanish",
                                "state": "",
                                "country": "United States",
                                "summary": "Spanish  '08, University of North Carolina at Chapel Hill",
                                "is_public": false,
                                "created_date": "2020-11-24T21:44:27.628053Z",
                                "updated_date": "2020-11-24T21:44:27.628055Z"
                            }
                        ],
                        "headline": {
                            "title": "Neuropsychiatry",
                            "isPublic": true
                        },
                        "facebook": null,
                        "twitter": "",
                        "linkedin": "https://www.linkedin.com/in/ryan-j-worthen-phd-59556622/",
                        "google_scholar": "https://scholar.google.com/citations?user=gAvlADUAAAAJ&hl=en",
                        "claimed": true,
                        "is_verified": false,
                        "country_code": null,
                        "created_source": "RESEARCHHUB",
                        "last_full_fetch_from_openalex": null,
                        "two_year_mean_citedness": 12.0,
                        "merged_with_author": null,
                        "added_as_editor_date": null,
                        "is_claimed": true,
                        "is_hub_editor_of": [],
                        "is_hub_editor": false,
                        "num_posts": 0,
                        "reputation": 100,
                        "reputation_v2": {
                            "hub": {
                                "id": 50498,
                                "name": "biological psychiatry",
                                "slug": "biological-psychiatry"
                            },
                            "score": 102819,
                            "percentile": 0.7507830555555556,
                            "bins": [
                                [
                                    0,
                                    1000
                                ],
                                [
                                    1000,
                                    10000
                                ],
                                [
                                    10000,
                                    100000
                                ],
                                [
                                    100000,
                                    1000000
                                ]
                            ]
                        },
                        "reputation_list": [
                            {
                                "hub": {
                                    "id": 50498,
                                    "name": "biological psychiatry",
                                    "slug": "biological-psychiatry"
                                },
                                "score": 102819,
                                "percentile": 0.7507830555555556,
                                "bins": [
                                    [
                                        0,
                                        1000
                                    ],
                                    [
                                        1000,
                                        10000
                                    ],
                                    [
                                        10000,
                                        100000
                                    ],
                                    [
                                        100000,
                                        1000000
                                    ]
                                ]
                            },
                            {
                                "hub": {
                                    "id": 75224,
                                    "name": "cellular and molecular neuroscience",
                                    "slug": "cellular-and-molecular-neuroscience"
                                },
                                "score": 24335,
                                "percentile": 0.5398194444444444,
                                "bins": [
                                    [
                                        0,
                                        1000
                                    ],
                                    [
                                        1000,
                                        10000
                                    ],
                                    [
                                        10000,
                                        100000
                                    ],
                                    [
                                        100000,
                                        1000000
                                    ]
                                ]
                            },
                            {
                                "hub": {
                                    "id": 244,
                                    "name": "cell biology",
                                    "slug": "cell-biology-1"
                                },
                                "score": 900,
                                "percentile": 0.225,
                                "bins": [
                                    [
                                        0,
                                        1000
                                    ],
                                    [
                                        1000,
                                        10000
                                    ],
                                    [
                                        10000,
                                        100000
                                    ],
                                    [
                                        100000,
                                        1000000
                                    ]
                                ]
                            }
                        ],
                        "suspended_status": {
                            "probable_spammer": true,
                            "is_suspended": false
                        },
                        "sift_link": "https://console.sift.com/users/66702?abuse_type=content_abuse",
                        "total_score": null,
                        "wallet": null,
                        "is_verified_v2": true
                    },
                    "balance": null,
                    "bookmarks": [],
                    "created_date": "2024-07-16T17:18:07.266298Z",
                    "has_seen_first_coin_modal": false,
                    "has_seen_orcid_connect_modal": false,
                    "is_suspended": false,
                    "probable_spammer": true,
                    "is_verified": false,
                    "moderator": false,
                    "reputation": 100,
                    "subscribed": null,
                    "updated_date": "2024-07-16T17:34:02.844286Z",
                    "upload_tutorial_complete": false,
                    "hub_rep": null,
                    "time_rep": null
                },
                "updated_date": "2024-08-05T14:20:38.866534Z",
                "status": "OPEN",
                "token_generated_time": null,
                "validation_attempt_count": -1,
                "validation_token": null,
                "paper": {
                    "title": "TNFα disrupts blood brain barrier integrity to maintain prolonged depressive-like behavior in mice",
                    "id": 6694991,
                    "slug": "tnf-disrupts-blood-brain-barrier-integrity-to-maintain-prolonged-depressive-like-behavior-in-mice",
                    "primary_hub": "biological psychiatry"
                },
                "preregistration_url": null,
                "open_data_url": null,
                "version": 2,
                "authorship": null,
                "paper_reward": {
                    "id": 105,
                    "citation_change": 177,
                    "citation_count": 177,
                    "rsc_value": 119.18448785059769,
                    "is_open_data": false,
                    "is_preregistered": false,
                    "created_date": "2024-08-05T14:20:38.865240Z",
                    "updated_date": "2024-08-05T14:20:38.865255Z",
                    "paper": 6694991,
                    "author": 1872510,
                    "distribution": null,
                    "hub_citation_value": 26
                }
            },
            {
                "case_type": "PAPER_CLAIM",
                "created_date": "2024-08-05T14:10:17.372627Z",
                "creator": 66702,
                "id": 3811,
                "moderator": {},
                "requestor": {
                    "id": 66702,
                    "author_profile": {
                        "id": 1872510,
                        "user": 66702,
                        "first_name": "Ryan J.",
                        "last_name": "Worthen, PhD",
                        "created_date": "2024-07-16T17:18:07.276447Z",
                        "updated_date": "2024-08-05T13:56:59.387448Z",
                        "description": "I completed my pre- and post-doctoral training under the mentorship of Dr. Eleonore Beurel in the Department of Psychiatry and Behavioral Sciences at the University of Miami Miller School of Medicine, investigating the neurobiological underpinnings of major depressive disorder and applying advanced techniques in cognitive and behavioral neuroscience. Utilizing the learned helplessness paradigm in mice, we developed a model to measure the effects of stress on mood and cognition, followed by the use of anti-inflammatory treatments to reverse neuroinflammation and depressive-like behavior. I am most deeply interested in the neurobiological foundations of conscious experience, including emotion, cognition, and behavior, with a focus on the potentially targetable biomolecular pathophysiology involved in the development of psychiatric disorders.",
                        "h_index": 8,
                        "i10_index": 8,
                        "profile_image": "https://storage.prod.researchhub.com/uploads/author_profile_images/2024/07/16/blob_o017bDQ",
                        "author_score": 0,
                        "university": null,
                        "orcid_id": "https://orcid.org/0000-0002-2010-5876",
                        "openalex_ids": [
                            "https://openalex.org/A5012725695"
                        ],
                        "education": [
                            {
                                "id": 8488,
                                "city": "Coral Gables",
                                "name": "University of Miami",
                                "year": {
                                    "label": "2020",
                                    "value": "2020"
                                },
                                "major": "Neuroscience",
                                "state": "FL",
                                "degree": {
                                    "label": "Doctor of Philosophy",
                                    "value": "PhD"
                                },
                                "country": "United States",
                                "summary": "Neuroscience PhD '20, University of Miami",
                                "is_public": true,
                                "created_date": "2020-11-24T21:44:27.627706Z",
                                "updated_date": "2020-11-24T21:44:27.627708Z"
                            },
                            {
                                "id": 8564,
                                "city": "",
                                "name": "University of North Carolina at Chapel Hill",
                                "year": {
                                    "label": "2008",
                                    "value": "2008"
                                },
                                "major": "Biology",
                                "state": "",
                                "degree": {
                                    "label": "Bachelor of Science",
                                    "value": "BS"
                                },
                                "country": "United States",
                                "summary": "Biology BS '08, University of North Carolina at Chapel Hill",
                                "is_public": false,
                                "created_date": "2020-11-24T21:44:27.628053Z",
                                "updated_date": "2020-11-24T21:44:27.628055Z"
                            },
                            {
                                "id": 8564,
                                "city": "",
                                "name": "University of North Carolina at Chapel Hill",
                                "year": {
                                    "label": "2008",
                                    "value": "2008"
                                },
                                "major": "Spanish",
                                "state": "",
                                "country": "United States",
                                "summary": "Spanish  '08, University of North Carolina at Chapel Hill",
                                "is_public": false,
                                "created_date": "2020-11-24T21:44:27.628053Z",
                                "updated_date": "2020-11-24T21:44:27.628055Z"
                            }
                        ],
                        "headline": {
                            "title": "Neuropsychiatry",
                            "isPublic": true
                        },
                        "facebook": null,
                        "twitter": "",
                        "linkedin": "https://www.linkedin.com/in/ryan-j-worthen-phd-59556622/",
                        "google_scholar": "https://scholar.google.com/citations?user=gAvlADUAAAAJ&hl=en",
                        "claimed": true,
                        "is_verified": false,
                        "country_code": null,
                        "created_source": "RESEARCHHUB",
                        "last_full_fetch_from_openalex": null,
                        "two_year_mean_citedness": 12.0,
                        "merged_with_author": null,
                        "added_as_editor_date": null,
                        "is_claimed": true,
                        "is_hub_editor_of": [],
                        "is_hub_editor": false,
                        "num_posts": 0,
                        "reputation": 100,
                        "reputation_v2": {
                            "hub": {
                                "id": 50498,
                                "name": "biological psychiatry",
                                "slug": "biological-psychiatry"
                            },
                            "score": 102819,
                            "percentile": 0.7507830555555556,
                            "bins": [
                                [
                                    0,
                                    1000
                                ],
                                [
                                    1000,
                                    10000
                                ],
                                [
                                    10000,
                                    100000
                                ],
                                [
                                    100000,
                                    1000000
                                ]
                            ]
                        },
                        "reputation_list": [
                            {
                                "hub": {
                                    "id": 50498,
                                    "name": "biological psychiatry",
                                    "slug": "biological-psychiatry"
                                },
                                "score": 102819,
                                "percentile": 0.7507830555555556,
                                "bins": [
                                    [
                                        0,
                                        1000
                                    ],
                                    [
                                        1000,
                                        10000
                                    ],
                                    [
                                        10000,
                                        100000
                                    ],
                                    [
                                        100000,
                                        1000000
                                    ]
                                ]
                            },
                            {
                                "hub": {
                                    "id": 75224,
                                    "name": "cellular and molecular neuroscience",
                                    "slug": "cellular-and-molecular-neuroscience"
                                },
                                "score": 24335,
                                "percentile": 0.5398194444444444,
                                "bins": [
                                    [
                                        0,
                                        1000
                                    ],
                                    [
                                        1000,
                                        10000
                                    ],
                                    [
                                        10000,
                                        100000
                                    ],
                                    [
                                        100000,
                                        1000000
                                    ]
                                ]
                            },
                            {
                                "hub": {
                                    "id": 244,
                                    "name": "cell biology",
                                    "slug": "cell-biology-1"
                                },
                                "score": 900,
                                "percentile": 0.225,
                                "bins": [
                                    [
                                        0,
                                        1000
                                    ],
                                    [
                                        1000,
                                        10000
                                    ],
                                    [
                                        10000,
                                        100000
                                    ],
                                    [
                                        100000,
                                        1000000
                                    ]
                                ]
                            }
                        ],
                        "suspended_status": {
                            "probable_spammer": true,
                            "is_suspended": false
                        },
                        "sift_link": "https://console.sift.com/users/66702?abuse_type=content_abuse",
                        "total_score": null,
                        "wallet": null,
                        "is_verified_v2": true
                    },
                    "balance": null,
                    "bookmarks": [],
                    "created_date": "2024-07-16T17:18:07.266298Z",
                    "has_seen_first_coin_modal": false,
                    "has_seen_orcid_connect_modal": false,
                    "is_suspended": false,
                    "probable_spammer": true,
                    "is_verified": false,
                    "moderator": false,
                    "reputation": 100,
                    "subscribed": null,
                    "updated_date": "2024-07-16T17:34:02.844286Z",
                    "upload_tutorial_complete": false,
                    "hub_rep": null,
                    "time_rep": null
                },
                "updated_date": "2024-08-05T14:10:17.372636Z",
                "status": "OPEN",
                "token_generated_time": null,
                "validation_attempt_count": -1,
                "validation_token": null,
                "paper": {
                    "title": "Inflammatory and neurodegenerative pathophysiology implicated in postpartum depression",
                    "id": 6692357,
                    "slug": "inflammatory-and-neurodegenerative-pathophysiology-implicated-in-postpartum-depression",
                    "primary_hub": "public health, environmental and occupational health"
                },
                "preregistration_url": null,
                "open_data_url": null,
                "version": 2,
                "authorship": null,
                "paper_reward": {
                    "id": 104,
                    "citation_change": 24,
                    "citation_count": 24,
                    "rsc_value": 12.764075247880541,
                    "is_open_data": false,
                    "is_preregistered": false,
                    "created_date": "2024-08-05T14:10:17.370969Z",
                    "updated_date": "2024-08-05T14:10:17.370982Z",
                    "paper": 6692357,
                    "author": 1872510,
                    "distribution": null,
                    "hub_citation_value": 203
                }
            },
            {
                "case_type": "PAPER_CLAIM",
                "created_date": "2024-08-05T14:08:11.056528Z",
                "creator": 66702,
                "id": 3810,
                "moderator": {},
                "requestor": {
                    "id": 66702,
                    "author_profile": {
                        "id": 1872510,
                        "user": 66702,
                        "first_name": "Ryan J.",
                        "last_name": "Worthen, PhD",
                        "created_date": "2024-07-16T17:18:07.276447Z",
                        "updated_date": "2024-08-05T13:56:59.387448Z",
                        "description": "I completed my pre- and post-doctoral training under the mentorship of Dr. Eleonore Beurel in the Department of Psychiatry and Behavioral Sciences at the University of Miami Miller School of Medicine, investigating the neurobiological underpinnings of major depressive disorder and applying advanced techniques in cognitive and behavioral neuroscience. Utilizing the learned helplessness paradigm in mice, we developed a model to measure the effects of stress on mood and cognition, followed by the use of anti-inflammatory treatments to reverse neuroinflammation and depressive-like behavior. I am most deeply interested in the neurobiological foundations of conscious experience, including emotion, cognition, and behavior, with a focus on the potentially targetable biomolecular pathophysiology involved in the development of psychiatric disorders.",
                        "h_index": 8,
                        "i10_index": 8,
                        "profile_image": "https://storage.prod.researchhub.com/uploads/author_profile_images/2024/07/16/blob_o017bDQ",
                        "author_score": 0,
                        "university": null,
                        "orcid_id": "https://orcid.org/0000-0002-2010-5876",
                        "openalex_ids": [
                            "https://openalex.org/A5012725695"
                        ],
                        "education": [
                            {
                                "id": 8488,
                                "city": "Coral Gables",
                                "name": "University of Miami",
                                "year": {
                                    "label": "2020",
                                    "value": "2020"
                                },
                                "major": "Neuroscience",
                                "state": "FL",
                                "degree": {
                                    "label": "Doctor of Philosophy",
                                    "value": "PhD"
                                },
                                "country": "United States",
                                "summary": "Neuroscience PhD '20, University of Miami",
                                "is_public": true,
                                "created_date": "2020-11-24T21:44:27.627706Z",
                                "updated_date": "2020-11-24T21:44:27.627708Z"
                            },
                            {
                                "id": 8564,
                                "city": "",
                                "name": "University of North Carolina at Chapel Hill",
                                "year": {
                                    "label": "2008",
                                    "value": "2008"
                                },
                                "major": "Biology",
                                "state": "",
                                "degree": {
                                    "label": "Bachelor of Science",
                                    "value": "BS"
                                },
                                "country": "United States",
                                "summary": "Biology BS '08, University of North Carolina at Chapel Hill",
                                "is_public": false,
                                "created_date": "2020-11-24T21:44:27.628053Z",
                                "updated_date": "2020-11-24T21:44:27.628055Z"
                            },
                            {
                                "id": 8564,
                                "city": "",
                                "name": "University of North Carolina at Chapel Hill",
                                "year": {
                                    "label": "2008",
                                    "value": "2008"
                                },
                                "major": "Spanish",
                                "state": "",
                                "country": "United States",
                                "summary": "Spanish  '08, University of North Carolina at Chapel Hill",
                                "is_public": false,
                                "created_date": "2020-11-24T21:44:27.628053Z",
                                "updated_date": "2020-11-24T21:44:27.628055Z"
                            }
                        ],
                        "headline": {
                            "title": "Neuropsychiatry",
                            "isPublic": true
                        },
                        "facebook": null,
                        "twitter": "",
                        "linkedin": "https://www.linkedin.com/in/ryan-j-worthen-phd-59556622/",
                        "google_scholar": "https://scholar.google.com/citations?user=gAvlADUAAAAJ&hl=en",
                        "claimed": true,
                        "is_verified": false,
                        "country_code": null,
                        "created_source": "RESEARCHHUB",
                        "last_full_fetch_from_openalex": null,
                        "two_year_mean_citedness": 12.0,
                        "merged_with_author": null,
                        "added_as_editor_date": null,
                        "is_claimed": true,
                        "is_hub_editor_of": [],
                        "is_hub_editor": false,
                        "num_posts": 0,
                        "reputation": 100,
                        "reputation_v2": {
                            "hub": {
                                "id": 50498,
                                "name": "biological psychiatry",
                                "slug": "biological-psychiatry"
                            },
                            "score": 102819,
                            "percentile": 0.7507830555555556,
                            "bins": [
                                [
                                    0,
                                    1000
                                ],
                                [
                                    1000,
                                    10000
                                ],
                                [
                                    10000,
                                    100000
                                ],
                                [
                                    100000,
                                    1000000
                                ]
                            ]
                        },
                        "reputation_list": [
                            {
                                "hub": {
                                    "id": 50498,
                                    "name": "biological psychiatry",
                                    "slug": "biological-psychiatry"
                                },
                                "score": 102819,
                                "percentile": 0.7507830555555556,
                                "bins": [
                                    [
                                        0,
                                        1000
                                    ],
                                    [
                                        1000,
                                        10000
                                    ],
                                    [
                                        10000,
                                        100000
                                    ],
                                    [
                                        100000,
                                        1000000
                                    ]
                                ]
                            },
                            {
                                "hub": {
                                    "id": 75224,
                                    "name": "cellular and molecular neuroscience",
                                    "slug": "cellular-and-molecular-neuroscience"
                                },
                                "score": 24335,
                                "percentile": 0.5398194444444444,
                                "bins": [
                                    [
                                        0,
                                        1000
                                    ],
                                    [
                                        1000,
                                        10000
                                    ],
                                    [
                                        10000,
                                        100000
                                    ],
                                    [
                                        100000,
                                        1000000
                                    ]
                                ]
                            },
                            {
                                "hub": {
                                    "id": 244,
                                    "name": "cell biology",
                                    "slug": "cell-biology-1"
                                },
                                "score": 900,
                                "percentile": 0.225,
                                "bins": [
                                    [
                                        0,
                                        1000
                                    ],
                                    [
                                        1000,
                                        10000
                                    ],
                                    [
                                        10000,
                                        100000
                                    ],
                                    [
                                        100000,
                                        1000000
                                    ]
                                ]
                            }
                        ],
                        "suspended_status": {
                            "probable_spammer": true,
                            "is_suspended": false
                        },
                        "sift_link": "https://console.sift.com/users/66702?abuse_type=content_abuse",
                        "total_score": null,
                        "wallet": null,
                        "is_verified_v2": true
                    },
                    "balance": null,
                    "bookmarks": [],
                    "created_date": "2024-07-16T17:18:07.266298Z",
                    "has_seen_first_coin_modal": false,
                    "has_seen_orcid_connect_modal": false,
                    "is_suspended": false,
                    "probable_spammer": true,
                    "is_verified": false,
                    "moderator": false,
                    "reputation": 100,
                    "subscribed": null,
                    "updated_date": "2024-07-16T17:34:02.844286Z",
                    "upload_tutorial_complete": false,
                    "hub_rep": null,
                    "time_rep": null
                },
                "updated_date": "2024-08-05T14:08:11.056541Z",
                "status": "OPEN",
                "token_generated_time": null,
                "validation_attempt_count": -1,
                "validation_token": null,
                "paper": {
                    "title": "Anti-inflammatory IL-10 administration rescues depression-associated learning and memory deficits in mice",
                    "id": 6692760,
                    "slug": "anti-inflammatory-il-10-administration-rescues-depression-associated-learning-and-memory-deficits-in-mice",
                    "primary_hub": "biological psychiatry"
                },
                "preregistration_url": null,
                "open_data_url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7443292/",
                "version": 2,
                "authorship": {
                    "id": 1965086,
                    "created_date": "2024-08-05T13:56:50.580886Z",
                    "updated_date": "2024-08-05T13:56:50.580912Z",
                    "author_position": "first",
                    "is_corresponding": false,
                    "raw_author_name": "Ryan J. Worthen",
                    "paper": 6692760,
                    "author": 1872510,
                    "institutions": [
                        144
                    ]
                },
                "paper_reward": {
                    "id": 103,
                    "citation_change": 63,
                    "citation_count": 63,
                    "rsc_value": 103.57740121399334,
                    "is_open_data": true,
                    "is_preregistered": false,
                    "created_date": "2024-08-05T14:08:11.050035Z",
                    "updated_date": "2024-08-05T14:08:11.050050Z",
                    "paper": 6692760,
                    "author": 1872510,
                    "distribution": null,
                    "hub_citation_value": 26
                }
            }
        ]
    }




    })
    .then(({ count: _count, next, results }: any): void => {




      onSuccess({
        claimCases: (results || [])
          .map((resultData: any): AuthorClaimCase | null => {
            try {
              const requestingUser = parseUser(resultData.requestor);

              const {
                created_date,
                id,
                status,
                updated_date,
                paper,
                target_author_name,
                target_paper_title,
                target_paper_doi,
                authorship,
                preregistration_url,
                open_data_url,
                paper_reward,
              } = resultData;

              return {
                caseData: {
                  createdDate: created_date,
                  id,
                  status,
                  updatedDate: updated_date,
                  paper,
                  authorship: authorship ? parseAuthorship(authorship) : null,
                  paperReward: parsePaperReward(paper_reward),
                  targetAuthorName: target_author_name,
                  targetPaperTitle: target_paper_title,
                  targetPaperDOI: target_paper_doi,
                  providedEmail: resultData.provided_email,
                  preregistrationUrl: preregistration_url,
                  openDataUrl: open_data_url,
                },
                requestor: requestingUser,
              };
            } catch (error) {
              console.error(error);
              return null;
            }
          })
          .filter((claimCase) => claimCase !== null),
        hasMore: !isEmpty(next),
        page,
      });
    })
    .catch((e) => {
      console.error(e);
      onError(e);
    });
}
