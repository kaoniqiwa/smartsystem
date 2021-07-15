import { TrashCan } from "./trashCan";
import { Camera } from "./camera";
import { Flags } from "src/app/common/tool/flags";
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
  Description: string;
  /**创建时间 */
  CreateTime: Date | string;
  /**更新事件 */
  UpdateTime: Date | string;
  /**GIS点位(可选) */
  GisPoint: any;
  /**所属区划ID(可选) */
  DivisionId: string;
  /**垃圾桶列表(可选) */
  TrashCans: TrashCan[];
  /**摄像机列表(可选) */
  Cameras: Camera[];
  /**干垃圾满溢(可选) */
  DryFull?: boolean;
  /**干垃圾满溢时间(可选) */
  DryFullTime?: Date | string;
  /**干垃圾容积(可选)，单位：L */
  DryVolume?: number;
  /**最大干垃圾容积，单位：L */
  MaxDryVolume: number;
  /**湿垃圾满溢(可选) */
  WetFull?: boolean;
  /**湿垃圾满溢时间(可选) */
  WetFullTime?: Date | string;
  /**湿垃圾容积(可选)，单位：L */
  WetVolume?: number;
  /**最大湿垃圾容积，单位：L */
  MaxWetVolume: number;

  // 垃圾厢房状态
  StationState: Flags<StationState> = new Flags(0);

  Grade: number; //评级
  CountSchedule: TimeRange[]; //	计数时间段

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

  Members: Member[]; //人员
}

/**
 * 垃圾房状态
 *
 * @export
 * @enum {number}
 */
export enum StationState {
  /**
   *	满溢	1
   */
  Full = 1,
  /**
   *	异常	2
   */
  Error = 2,
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

export enum Gender {
  /**
   *  男
   */
  Male = 1,
  /**
   *  女
   */
  Female = 2,
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
  BeginTime: Date | string;
  EndTime: Date | string;
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
}
