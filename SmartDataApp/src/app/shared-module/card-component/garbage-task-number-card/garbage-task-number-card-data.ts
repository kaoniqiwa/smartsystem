import { IViewModel } from "src/app/common/abstract/base-view";
import { IBusinessData } from "src/app/common/interface/IBusiness";

export class GarbageTaskNumberCardData {
  Id: string;
  Name: string;
  /**	Int32	总处理任务数量	O */
  TotalTaskCount = 0;
  /**	Int32	完成任务数量	O */
  CompleteTaskCount = 0;
  /**	Int32	未完成任务数量	O */
  TimeoutTaskCount = 0;
}

export class GarbageTaskNumberCardDatas implements IViewModel {
  datas: Array<GarbageTaskNumberCardData>;
}
