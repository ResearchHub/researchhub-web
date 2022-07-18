import { formatDateStandard } from "../utils/dates";
import { CreatedBy, ID } from "./root_types";
import { timeTo } from "~/config/utils/dates";
import { parseCreatedBy } from "./contribution";

export enum BOUNTY_STATUS {
  OPEN = "OPEN",
  EXPIRED = "EXPIRED",
  CLOSED = "CLOSED",
}

export default class Bounty {
  _id: ID
  _createdDate: string
  _timeRemaining: string
  _createdBy: CreatedBy|null
  _amount: number
  _status: BOUNTY_STATUS

  constructor(raw: any) {
    this._id = raw.id;
    this._createdDate = formatDateStandard(raw.created_date);
    this._timeRemaining = timeTo(raw.expiration_date);
    this._createdBy = parseCreatedBy(raw.created_by);
    this._amount = parseInt(raw.amount.toFixed(0));
    this._status = raw.status;
  }

  get id():ID {
    return this.id;
  }

  get createdDate():string {
    return this._createdDate;
  }

  get timeRemaining():string {
    return this._timeRemaining;
  }

  get createdBy():CreatedBy|null {
    return this._createdBy;
  }
  
  get amount():number {
    return this._amount;
  }

  get status():BOUNTY_STATUS {
    return this._status;
  }
}