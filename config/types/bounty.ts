import { formatDateStandard, timeTo } from "../utils/dates";
import { CreatedBy, ID } from "./root_types";
import { parseCreatedBy } from "./contribution";
import api, { generateApiUrl } from "../api";
import { Helpers } from "@quantfive/js-web-config";

export enum BOUNTY_STATUS {
  OPEN = "OPEN",
  EXPIRED = "EXPIRED",
  CLOSED = "CLOSED",
}

export const fetchBounty = ({unifiedDocId}) => {
  const url = generateApiUrl(
    `bounty`,
    `?item_object_id=${unifiedDocId}&status=OPEN`
  );
  return fetch(url, api.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((res) => {
      return res;
    });
};


export default class Bounty {
  _id: ID;
  _createdDate: string;
  _timeRemaining: string;
  _createdBy: CreatedBy | null;
  _amount: number;
  _status: BOUNTY_STATUS;

  constructor(raw: any) {
    this._id = raw.id;
    this._createdDate = formatDateStandard(raw.created_date);
    this._timeRemaining = timeTo(raw.expiration_date);
    this._createdBy = parseCreatedBy(raw.created_by);
    this._amount = parseInt(raw.amount);
    this._status = raw.status;
  }

  static createAPI({ bountyAmount, unifiedDocId }) {
    // TODO: Change hard coded value

    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const data = {
      amount: bountyAmount,
      item_content_type: "researchhubunifieddocument",
      item_object_id: unifiedDocId,
      expiration_date: thirtyDaysFromNow,
    };

    return fetch(generateApiUrl("bounty"), api.POST_CONFIG(data))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then(res => {
      return res;
    });
  }

  get id(): ID {
    return this._id;
  }

  get createdDate(): string {
    return this._createdDate;
  }

  get timeRemaining(): string {
    return this._timeRemaining;
  }

  get createdBy(): CreatedBy | null {
    return this._createdBy;
  }

  get amount(): number {
    return this._amount;
  }

  get status(): BOUNTY_STATUS {
    return this._status;
  }
}
