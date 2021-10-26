import { EventEmitter, Injectable } from "@angular/core";
import { EnumHelper } from "../common/tool/enum-helper";
import { SessionUser } from "../common/tool/session-user";
import { DivisionType, UserResourceType } from "../data-core/model/enum";
import { User } from "../data-core/model/page";

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

  private _resourceType: UserResourceType;
  public get resourceType(): UserResourceType {
    return this._resourceType;
  }
  public set resourceType(v: UserResourceType) {
    this._resourceType = v;
  }

  constructor() {
    this.user = new SessionUser();
    this.divisionId = this.user.userDivision[0].Id;
    this.divisionType = this.user.userDivisionType;
  }

  private static _divisionId?: string;
  public static get divisionId(): string {
    if (!this._divisionId) {
      let user = new SessionUser();
      this._divisionId = user.userDivision[0].Id;
    }
    return this._divisionId;
  }
  public static set divisionId(val: string) {
    this._divisionId = val;
  }

  private static _divisionType?: DivisionType;
  public static get divisionType(): DivisionType {
    if (!this._divisionType) {
      let user = new SessionUser();
      this._divisionType = EnumHelper.Convert(
        user.userDivision[0].ResourceType
      );
    }
    return this._divisionType;
  }
  public static set divisionType(val: DivisionType) {
    this._divisionType = val;
  }

  public static get user(): SessionUser {
    return new SessionUser();
  }

  static interval = new EventEmitter();

  private static intervalHandle: NodeJS.Timer;

  static runInterval(interval: number = 1000 * 60 * 1) {
    this.intervalHandle = setInterval(() => {
      this.interval.emit();
    }, interval);
  }
  static stopInterval() {
    clearInterval(this.intervalHandle);
  }
}
