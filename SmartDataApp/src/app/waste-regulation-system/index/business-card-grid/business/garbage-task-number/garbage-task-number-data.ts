import { IBusiness, IBusinessData } from "src/app/common/interface/IBusiness";

export class GarbageTaskNumberData {
  Id: string;
  Name: string;
  /**	Int32	总处理任务数量	O */
  TotalTaskCount = 0;
  /**	Int32	完成任务数量	O */
  CompleteTaskCount = 0;
  /**	Int32	未完成任务数量	O */
  TimeoutTaskCount = 0;

  /** 垃圾落地事件数量 */
  GarbageDropCount = 0;
  /** 垃圾落地处置事件数量 */
  GarbageDropHandleCount = 0;
  /** 垃圾落地滞留事件数量 */
  GarbageDropTimeoutCount = 0;
}

export class GarbageTaskNumberDatas
  extends Array<GarbageTaskNumberData>
  implements IBusinessData {}
