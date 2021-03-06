import { TrashCan } from "./trashCan";
import { Camera } from "./camera";
import { Flags } from "../flags";
import { Exclude, Expose, Transform, Type } from "class-transformer";
import { Gender, StationState } from "../enum";
import { GisPoint } from "./division";
import "reflect-metadata";
import { transformDateTime } from "../transformer";
/**投放点信息 */
export class GarbageStation {
  /**垃圾房ID */
  Id: string;
  /**垃圾房名称 */
  Name: string;
  /**
   * 垃圾房类型(可选)，默认：0
   * 暂时无效，之后会用于高度，形状，室内、室外等区分
   */
  StationType?: number;

  /**描述信息(可选) */
  Description?: string;
  /**创建时间 */
  @Transform(transformDateTime)
  CreateTime: Date;

  /**更新事件 */
  @Transform(transformDateTime)
  UpdateTime: Date;
  /**GIS点位(可选) */
  GisPoint?: GisPoint;
  /**所属区划ID(可选) */
  DivisionId?: string;
  /**垃圾桶列表(可选) */
  @Type(() => TrashCan)
  TrashCans?: TrashCan[];
  /**摄像机列表(可选) */
  @Type(() => Camera)
  Cameras?: Camera[];
  /**干垃圾满溢(可选) */
  DryFull?: boolean;
  /**干垃圾满溢时间(可选) */

  @Transform(transformDateTime)
  DryFullTime?: Date;

  /**干垃圾容积(可选)，单位：L */
  DryVolume?: number;
  /**最大干垃圾容积，单位：L */
  MaxDryVolume: number = 0;
  /**湿垃圾满溢(可选) */
  WetFull?: boolean;
  /**湿垃圾满溢时间(可选) */

  @Transform(transformDateTime)
  WetFullTime?: Date;

  /**湿垃圾容积(可选)，单位：L */
  WetVolume?: number;
  /**最大湿垃圾容积，单位：L */
  MaxWetVolume: number = 0;

  @Exclude()
  private stationState = 0;
  // 垃圾厢房状态

  @Expose({ name: "StationState" })
  get StationState(): StationState {
    return this.stationState;
  }
  set StationState(val: StationState) {
    this.stationState = val;
    this.StationStateFlags = new Flags<StationState>(val);
  }

  @Exclude()
  private stationStateFlags?;
  get StationStateFlags(): Flags<StationState> | undefined {
    if (!this.stationStateFlags) {
      this.stationStateFlags = new Flags<StationState>(this.StationState);
    }
    return this.stationStateFlags;
  }
  set StationStateFlags(val: Flags<StationState> | undefined) {
    this.stationStateFlags = val;
  }

  Grade: number; //评级
  CountSchedule?: TimeRange[]; //	计数时间段

  /**
   *	地址	O
   *
   * @type {string}
   * @memberof GarbageStation
   */
  Address?: string;
  /**
   *	垃圾投放点类型	O
   *
   * @type {number}
   * @memberof GarbageStation
   */
  DumpPointType?: number;
  /**
   *	停用的事件号列表	O
   *
   * @type {number[]}
   * @memberof GarbageStation
   */
  DisableEventTypes?: number[];
  /**
   *	所属网格单元ID	O
   *
   * @type {string}
   * @memberof GarbageStation
   */
  GridCellId?: string;
  /**
   *	垃圾相关参数	O
   *
   * @type {GarbageParameters}
   * @memberof GarbageStation
   */
  GarbageParameters?: GarbageParameters;

  Members?: Member[]; //人员

  /**	String	小区名称	O */
  CommunityName?: string;
  /**	String	小区ID	O */
  CommunityId?: string;
}

export class Member {
  /**
   *	成员ID	M
   *
   * @type {string}
   * @memberof Member
   */
  Id: string;
  /**
   *	姓名	M
   *
   * @type {string}
   * @memberof Member
   */
  Name: string;
  /**
   *	性别，1-男性，2-女性	O
   *
   * @type {number}
   * @memberof Member
   */
  Gender?: Gender;
  /**
   *	手机号码	O
   *
   * @type {string}
   * @memberof Member
   */
  MobileNo?: string;
  /**
   *	描述信息	O
   *
   * @type {string}
   * @memberof Member
   */
  Note?: string;
  /**
   *	人员类型	M
   *
   * @type {number}
   * @memberof Member
   */
  MemberType: number;
  /**
   *	微信OpenId	O
   *
   * @type {string}
   * @memberof Member
   */
  WeChatOpenId?: string;
  /**
   *	所属区划ID	O
   *
   * @type {string}
   * @memberof Member
   */
  DivisionId?: string;
  /**
   *	所属网格ID 	O
   *
   * @type {string}
   * @memberof Member
   */
  GridCellId?: string;
  /**
   *	创建时间	M
   *
   * @type {(string|Date)}
   * @memberof Member
   */
  CreateTime: string | Date;
  /**
   *	更新事件	M
   *
   * @type {(string|Date)}
   * @memberof Member
   */
  UpdateTime: string | Date;
}

export class GarbageParameters {
  /**
   *	处置超时时长，单位：分钟，默认：15分钟	O
   *
   * @type {number}
   * @memberof GarbageParameters
   */
  HandleTimeout?: number;
}

export interface TimeRange {
  BeginTime: Date;
  EndTime: Date;
}

export class RecordFileUrl {
  Result: boolean;
  Url: string;
}

/**获取垃圾房列表参数 */
export class GetGarbageStationsParams {
  /**页码[1-n](可选) */
  PageIndex?: number;
  /**分页大小[1-100](可选) */
  PageSize?: number;
  /**垃圾房ID(可选) */
  Ids: string[];
  /**垃圾房名称(可选)，支持LIKE */
  Name: string;
  /**垃圾房类型(可选) */
  StationType?: number;
  /**区划ID(可选) */
  DivisionId: string;
  /**干垃圾是否满溢(可选) */
  DryFull?: boolean;
  /**湿垃圾是否满溢(可选) */
  WetFull?: boolean;
  /**祖辈ID(可选)，返回该ID下的所有子孙区划及其本身的垃圾房 */
  AncestorId: string;

  /**	Boolean	区划ID为NULL	O */
  DivisionIdNullable?: boolean;
  /**	String	网格ID	O */
  GridCellId?: string;
  /**	Boolean	网格ID为NULL	O */
  GridCellIdNullable?: boolean;
  /**	String	IMEI串号	O */
  IMEI?: string;
  /**	String	小区ID	O */
  CommunityId?: string;
  /**	String 	小区名称，支持LIKE	O */
  CommunityName?: string;
}
