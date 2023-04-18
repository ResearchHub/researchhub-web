import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { captureEvent } from "~/config/utils/events";
import { ID } from "~/config/types/root_types";

export const verdictOpts = [{
  label: "Open",
  value: "OPEN",
},{
  label: "Removed",
  value: "REMOVED",
},{
  label: "Dismissed",
  value: "APPROVED",
}]

export type ApiFilters = {
  hubId?: ID,
  verdict: string
}

type Args = {
  pageUrl: string|null;
  onError?: Function;
  onSuccess: Function;
  filters: ApiFilters;
}

export default function fetchFlaggedContributions({
  pageUrl,
  onError,
  onSuccess,
  filters,
}: Args) {
  const url = pageUrl ||  API.FLAGS({ ...filters })




  const res = {
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 176,
            "item": {
              "created_by": {
                "author_profile": {
                    "id": 416,
                    "profile_image": "https://lh3.googleusercontent.com/a/AATXAJxMWwF8N8q__74Pl5_Fvp_srsuekx5iNmsB54eBURA=s96-c"
                },
                "first_name": "Kobe",
                "last_name": "Attias"
            },              
              "id": 1265,
              "thread": {
                "content_object": {
                  "id": 51,
                  "unified_document": {
                    "id": 1549,
                    "documents": [
                      {
                        "id": 51,
                        "renderable_text": "this is a new question",
                        "title": "new question",
                        "slug": "new-question"
                      }
                    ],
                    "document_type": "QUESTION"
                  }
                },
                "thread_type": "GENERIC_COMMENT"
              },
              "comment_content_json": {
                "ops": [
                  {
                    "insert": "\nvar x =5"
                  },
                  {
                    "insert": "\n",
                    "attributes": {
                      "code-block": true
                    }
                  },
                  {
                    "insert": "x +  5 = 10"
                  },
                  {
                    "insert": "\n\n",
                    "attributes": {
                      "code-block": true
                    }
                  },
                  {
                    "insert": "\n"
                  }
                ]
              }
            },






            "flagged_by": {
                "id": 8,
                "author_profile": {
                    "id": 416,
                    "profile_image": "https://lh3.googleusercontent.com/a/AATXAJxMWwF8N8q__74Pl5_Fvp_srsuekx5iNmsB54eBURA=s96-c"
                },
                "first_name": "Kobe",
                "last_name": "Attias"
            },
            "content_type": {
                "id": 118,
                "name": "rhcommentmodel"
            },
            "hubs": [
                {
                    "id": 227,
                    "name": "agronomy",
                    "slug": "agronomy"
                },
                {
                    "id": 150,
                    "name": "accelerator physics",
                    "slug": "accelerator-physics"
                }
            ],
            "verdict": null,
            "created_date": "2023-04-10T15:49:41.730447Z",
            "reason": "PLAGIARISM",
            "reason_choice": ""
        },
        {
            "id": 166,
            "item": {
              "created_by": {
                "author_profile": {
                    "id": 416,
                    "profile_image": "https://lh3.googleusercontent.com/a/AATXAJxMWwF8N8q__74Pl5_Fvp_srsuekx5iNmsB54eBURA=s96-c"
                },
                "first_name": "Kobe",
                "last_name": "Attias"
            },              
              "id": 1265,
              "thread": {
                "content_object": {
                  "id": 51,
                  "unified_document": {
                    "id": 1549,
                    "documents": [
                      {
                        "id": 51,
                        "renderable_text": "this is a new question",
                        "title": "new question",
                        "slug": "new-question"
                      }
                    ],
                    "document_type": "QUESTION"
                  }
                },
                "thread_type": "GENERIC_COMMENT"
              },
              "comment_content_json": {
                "ops": [
                  {
                    "insert": "\nvar x =5"
                  },
                  {
                    "insert": "\n",
                    "attributes": {
                      "code-block": true
                    }
                  },
                  {
                    "insert": "x +  5 = 10"
                  },
                  {
                    "insert": "\n\n",
                    "attributes": {
                      "code-block": true
                    }
                  },
                  {
                    "insert": "\n"
                  }
                ]
              }
            },
            
            
            
            
            
            
            
            
            
            "flagged_by": {
                "id": 8,
                "author_profile": {
                    "id": 416,
                    "profile_image": "https://lh3.googleusercontent.com/a/AATXAJxMWwF8N8q__74Pl5_Fvp_srsuekx5iNmsB54eBURA=s96-c"
                },
                "first_name": "Kobe",
                "last_name": "Attias"
            },
            "content_type": {
                "id": 118,
                "name": "rhcommentmodel"
            },
            "hubs": [
                {
                    "id": 227,
                    "name": "agronomy",
                    "slug": "agronomy"
                },
                {
                    "id": 150,
                    "name": "accelerator physics",
                    "slug": "accelerator-physics"
                }
            ],
            "verdict": null,
            "created_date": "2023-04-10T14:49:31.254516Z",
            "reason": "SPAM",
            "reason_choice": ""
        },
        {
            "id": 165,
            "item": {
                "id": 54,
                "created_by": {
                    "author_profile": {
                        "id": 416,
                        "profile_image": "https://lh3.googleusercontent.com/a/AATXAJxMWwF8N8q__74Pl5_Fvp_srsuekx5iNmsB54eBURA=s96-c"
                    },
                    "first_name": "Kobe",
                    "last_name": "Attias"
                },
                "unified_document": {
                    "id": 1554,
                    "documents": [
                        {
                            "id": 54,
                            "renderable_text": "This is a question",
                            "title": "This is a question",
                            "slug": "this-is-a-question"
                        }
                    ],
                    "document_type": "QUESTION"
                },
                "created_date": "2023-02-17T14:28:20.451607Z",
                "title": "This is a question",
                "slug": "this-is-a-question"
            },
            "flagged_by": {
                "id": 8,
                "author_profile": {
                    "id": 416,
                    "profile_image": "https://lh3.googleusercontent.com/a/AATXAJxMWwF8N8q__74Pl5_Fvp_srsuekx5iNmsB54eBURA=s96-c"
                },
                "first_name": "Kobe",
                "last_name": "Attias"
            },
            "content_type": {
                "id": 74,
                "name": "researchhubpost"
            },
            "hubs": [
                {
                    "id": 250,
                    "name": "art",
                    "slug": "art-1"
                }
            ],
            "verdict": null,
            "created_date": "2023-04-07T13:51:51.299015Z",
            "reason": "SPAM",
            "reason_choice": ""
        },
        // {
        //     "id": 164,
        //     "item": {
        //         "id": 348,
        //         "created_by": {
        //             "author_profile": {
        //                 "id": 416,
        //                 "profile_image": "https://lh3.googleusercontent.com/a/AATXAJxMWwF8N8q__74Pl5_Fvp_srsuekx5iNmsB54eBURA=s96-c"
        //             },
        //             "first_name": "Kobe",
        //             "last_name": "Attias"
        //         },
        //         "unified_document": {
        //             "id": 1526,
        //             "documents": [
        //                 {
        //                     "id": 36,
        //                     "renderable_text": "The standard Lorem Ipsum passage, used since the 1500s\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\"Section 1.10.32 of \"de Finibus Bonorum et Malorum\", written by Cicero in 45 BC\"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?\"1914 translation by H. Rackham\"But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?\"",
        //                     "title": "What is the",
        //                     "slug": "what-is-the"
        //                 }
        //             ],
        //             "document_type": "QUESTION"
        //         },
        //         "created_date": "2022-10-28T00:49:50.796651Z",
        //         "plain_text": "asdfdfsd",
        //         "source": "researchhub",
        //         "title": null
        //     },
        //     "flagged_by": {
        //         "id": 8,
        //         "author_profile": {
        //             "id": 416,
        //             "profile_image": "https://lh3.googleusercontent.com/a/AATXAJxMWwF8N8q__74Pl5_Fvp_srsuekx5iNmsB54eBURA=s96-c"
        //         },
        //         "first_name": "Kobe",
        //         "last_name": "Attias"
        //     },
        //     "content_type": {
        //         "id": 24,
        //         "name": "thread"
        //     },
        //     "hubs": [
        //         {
        //             "id": 150,
        //             "name": "accelerator physics",
        //             "slug": "accelerator-physics"
        //         }
        //     ],
        //     "verdict": null,
        //     "created_date": "2022-11-09T15:42:19.763785Z",
        //     "reason": "SPAM",
        //     "reason_choice": "SPAM"
        // },
        // {
        //     "id": 163,
        //     "item": {
        //         "id": 347,
        //         "created_by": {
        //             "author_profile": {
        //                 "id": 416,
        //                 "profile_image": "https://lh3.googleusercontent.com/a/AATXAJxMWwF8N8q__74Pl5_Fvp_srsuekx5iNmsB54eBURA=s96-c"
        //             },
        //             "first_name": "Kobe",
        //             "last_name": "Attias"
        //         },
        //         "unified_document": {
        //             "id": 1526,
        //             "documents": [
        //                 {
        //                     "id": 36,
        //                     "renderable_text": "The standard Lorem Ipsum passage, used since the 1500s\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\"Section 1.10.32 of \"de Finibus Bonorum et Malorum\", written by Cicero in 45 BC\"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?\"1914 translation by H. Rackham\"But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?\"",
        //                     "title": "What is the",
        //                     "slug": "what-is-the"
        //                 }
        //             ],
        //             "document_type": "QUESTION"
        //         },
        //         "created_date": "2022-10-27T23:55:41.898077Z",
        //         "plain_text": "asdfadfasasdf22222323232",
        //         "source": "researchhub",
        //         "title": null
        //     },
        //     "flagged_by": {
        //         "id": 8,
        //         "author_profile": {
        //             "id": 416,
        //             "profile_image": "https://lh3.googleusercontent.com/a/AATXAJxMWwF8N8q__74Pl5_Fvp_srsuekx5iNmsB54eBURA=s96-c"
        //         },
        //         "first_name": "Kobe",
        //         "last_name": "Attias"
        //     },
        //     "content_type": {
        //         "id": 24,
        //         "name": "thread"
        //     },
        //     "hubs": [
        //         {
        //             "id": 150,
        //             "name": "accelerator physics",
        //             "slug": "accelerator-physics"
        //         }
        //     ],
        //     "verdict": null,
        //     "created_date": "2022-11-09T14:59:16.569938Z",
        //     "reason": "SPAM",
        //     "reason_choice": "SPAM"
        // },
        // {
        //     "id": 162,
        //     "item": {
        //         "id": 310,
        //         "created_by": {
        //             "author_profile": {
        //                 "id": 416,
        //                 "profile_image": "https://lh3.googleusercontent.com/a/AATXAJxMWwF8N8q__74Pl5_Fvp_srsuekx5iNmsB54eBURA=s96-c"
        //             },
        //             "first_name": "Kobe",
        //             "last_name": "Attias"
        //         },
        //         "unified_document": {
        //             "id": 965,
        //             "documents": {
        //                 "id": 20884,
        //                 "title": "Understanding Granular Aspects of Ontology for Blockchain Databases",
        //                 "slug": "understanding-granular-aspects-of-ontology-for-blockchain-databases"
        //             },
        //             "document_type": "PAPER"
        //         },
        //         "created_date": "2022-08-18T14:20:05.320542Z",
        //         "plain_text": "creating a bounty",
        //         "source": "researchhub",
        //         "title": null
        //     },
        //     "flagged_by": {
        //         "id": 8,
        //         "author_profile": {
        //             "id": 416,
        //             "profile_image": "https://lh3.googleusercontent.com/a/AATXAJxMWwF8N8q__74Pl5_Fvp_srsuekx5iNmsB54eBURA=s96-c"
        //         },
        //         "first_name": "Kobe",
        //         "last_name": "Attias"
        //     },
        //     "content_type": {
        //         "id": 24,
        //         "name": "thread"
        //     },
        //     "hubs": [
        //         {
        //             "id": 18,
        //             "name": "computer science",
        //             "slug": "computer-science"
        //         }
        //     ],
        //     "verdict": null,
        //     "created_date": "2022-11-09T14:50:21.256910Z",
        //     "reason": "SPAM",
        //     "reason_choice": "SPAM"
        // },
        // {
        //     "id": 161,
        //     "item": {
        //         "id": 324,
        //         "created_by": {
        //             "author_profile": {
        //                 "id": 415,
        //                 "profile_image": "https://researchhub-paper-dev1.s3.amazonaws.com/uploads/author_profile_images/2021/12/09/blob?AWSAccessKeyId=AKIA3RZN3OVNNBYLSFM3&Signature=5CUnxl05xrVv7mBqk532qnk%2FNDY%3D&Expires=1682429115"
        //             },
        //             "first_name": "Kobe",
        //             "last_name": "Attias"
        //         },
        //         "unified_document": {
        //             "id": 1523,
        //             "documents": {
        //                 "id": 20941,
        //                 "title": "Effects of β-Phenylethylamine on Psychomotor, Rewarding, and Reinforcing Behaviors and Affective State: The Role of Dopamine D1 Receptors.",
        //                 "slug": "effects-of-phenylethylamine-on-psychomotor-rewarding-and-reinforcing-behaviors-and-affective-state-the-role-of-dopamine-d1-receptors"
        //             },
        //             "document_type": "PAPER"
        //         },
        //         "created_date": "2022-10-12T02:24:12.560371Z",
        //         "plain_text": "Creating a new bounty!",
        //         "source": "researchhub",
        //         "title": null
        //     },
        //     "flagged_by": {
        //         "id": 8,
        //         "author_profile": {
        //             "id": 416,
        //             "profile_image": "https://lh3.googleusercontent.com/a/AATXAJxMWwF8N8q__74Pl5_Fvp_srsuekx5iNmsB54eBURA=s96-c"
        //         },
        //         "first_name": "Kobe",
        //         "last_name": "Attias"
        //     },
        //     "content_type": {
        //         "id": 24,
        //         "name": "thread"
        //     },
        //     "hubs": [
        //         {
        //             "id": 227,
        //             "name": "agronomy",
        //             "slug": "agronomy"
        //         }
        //     ],
        //     "verdict": null,
        //     "created_date": "2022-11-09T14:49:57.711471Z",
        //     "reason": "SPAM",
        //     "reason_choice": "SPAM"
        // },
        // {
        //     "id": 160,
        //     "item": {
        //         "id": 325,
        //         "created_by": {
        //             "author_profile": {
        //                 "id": 416,
        //                 "profile_image": "https://lh3.googleusercontent.com/a/AATXAJxMWwF8N8q__74Pl5_Fvp_srsuekx5iNmsB54eBURA=s96-c"
        //             },
        //             "first_name": "Kobe",
        //             "last_name": "Attias"
        //         },
        //         "unified_document": {
        //             "id": 1523,
        //             "documents": {
        //                 "id": 20941,
        //                 "title": "Effects of β-Phenylethylamine on Psychomotor, Rewarding, and Reinforcing Behaviors and Affective State: The Role of Dopamine D1 Receptors.",
        //                 "slug": "effects-of-phenylethylamine-on-psychomotor-rewarding-and-reinforcing-behaviors-and-affective-state-the-role-of-dopamine-d1-receptors"
        //             },
        //             "document_type": "PAPER"
        //         },
        //         "created_date": "2022-10-14T18:35:05.533924Z",
        //         "plain_text": "sdfds\nsd\nfds\nfs\nfdsf",
        //         "source": "researchhub",
        //         "title": null
        //     },
        //     "flagged_by": {
        //         "id": 8,
        //         "author_profile": {
        //             "id": 416,
        //             "profile_image": "https://lh3.googleusercontent.com/a/AATXAJxMWwF8N8q__74Pl5_Fvp_srsuekx5iNmsB54eBURA=s96-c"
        //         },
        //         "first_name": "Kobe",
        //         "last_name": "Attias"
        //     },
        //     "content_type": {
        //         "id": 24,
        //         "name": "thread"
        //     },
        //     "hubs": [
        //         {
        //             "id": 227,
        //             "name": "agronomy",
        //             "slug": "agronomy"
        //         }
        //     ],
        //     "verdict": null,
        //     "created_date": "2022-11-09T14:49:49.151821Z",
        //     "reason": "SPAM",
        //     "reason_choice": "SPAM"
        // },
        {
            "id": 159,
            "item": {
                "id": 36,
                "created_by": {
                    "author_profile": {
                        "id": 416,
                        "profile_image": "https://lh3.googleusercontent.com/a/AATXAJxMWwF8N8q__74Pl5_Fvp_srsuekx5iNmsB54eBURA=s96-c"
                    },
                    "first_name": "Kobe",
                    "last_name": "Attias"
                },
                "unified_document": {
                    "id": 1526,
                    "documents": [
                        {
                            "id": 36,
                            "renderable_text": "The standard Lorem Ipsum passage, used since the 1500s\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\"Section 1.10.32 of \"de Finibus Bonorum et Malorum\", written by Cicero in 45 BC\"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?\"1914 translation by H. Rackham\"But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?\"",
                            "title": "What is the",
                            "slug": "what-is-the"
                        }
                    ],
                    "document_type": "QUESTION"
                },
                "created_date": "2022-07-21T19:31:39.036230Z",
                "title": "What is the",
                "slug": "what-is-the"
            },
            "flagged_by": {
                "id": 8,
                "author_profile": {
                    "id": 416,
                    "profile_image": "https://lh3.googleusercontent.com/a/AATXAJxMWwF8N8q__74Pl5_Fvp_srsuekx5iNmsB54eBURA=s96-c"
                },
                "first_name": "Kobe",
                "last_name": "Attias"
            },
            "content_type": {
                "id": 74,
                "name": "researchhubpost"
            },
            "hubs": [
                {
                    "id": 150,
                    "name": "accelerator physics",
                    "slug": "accelerator-physics"
                }
            ],
            "verdict": null,
            "created_date": "2022-11-09T14:49:15.860856Z",
            "reason": "SPAM",
            "reason_choice": "SPAM"
        }
    ]
}


return onSuccess(res);




  return fetch(
    url,
    API.GET_CONFIG()
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((response) => onSuccess(response))
    .catch((error) => {
      captureEvent({
        error,
        msg: "Failed to fetch flagged content",
        data: { filters, pageUrl },
      });
      onError && onError(error)
    })
}