import { IViewModel } from "src/app/common/abstract/base-view";
import { IBusinessData } from "src/app/common/interface/IBusiness";

export class GarbageTaskNumberCardData {
  Id: string = "";
  Name: string = "";
  /**	Int32	总处理任务数量	O */
  TotalCount = 0;
  /**	Int32	完成任务数量	O */
  UncompletedCount = 0;
  /** 垃圾滞留数量 */
  GarbageRetentionCount = 0;

  ratio = 0;
}

export class GarbageTaskNumberCardDatas implements IViewModel {
  datas: Array<GarbageTaskNumberCardData>;
}
