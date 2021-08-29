import { EventEmitter, Injectable } from "@angular/core";
import { SessionUser } from "../common/tool/session-user";
import { DivisionType } from "../data-core/model/enum";

@Injectable({
  providedIn: "root",
})
export class GlobalStoreService {
  user!: SessionUser;

  // 数据内容发生改变时，通知观察者更新
  statusChange = new EventEmitter();

  private _divisionId: string;
  private _divisionType: DivisionType;

  set divisionId(id: string) {
    this._divisionId = id;
  }
  get divisionId(): string {
    return this._divisionId;
  }
  set divisionType(type: DivisionType) {
    this._divisionType = type;
  }
  get divisionType() {
    return this._divisionType;
  }

  constructor() {
    this.user = new SessionUser();
    this.divisionId = this.user.userDivision[0].Id;
    this.divisionType = this.user.userDivisionType;
  }
}
