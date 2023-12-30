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
    .then(({ count: _count, next, results }: any): void => {
      console.log("results", results);

      onSuccess({
        claimCases: (results || []).map((resultData: any): AuthorClaimCase => {
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
          } = resultData;
          return {
            caseData: {
              createdDate: created_date,
              id,
              status,
              updatedDate: updated_date,
              paper,
              targetAuthorName: target_author_name,
              targetPaperTitle: target_paper_title,
              targetPaperDOI: target_paper_doi,
              providedEmail: resultData.provided_email,
            },
            requestor: requestingUser,
          };
        }),
        hasMore: !isEmpty(next),
        page,
      });
    })
    .catch((e) => onError(e));
}
