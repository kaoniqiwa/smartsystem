import { IBusiness, IBusinessData } from "src/app/common/interface/IBusiness";

export class GarbageRetentionNumberData {
  Id: string;
  Name: string;

  Time = 0;
  Count = 0;
}

export class GarbageRetentionNumberDatas
  extends Array<GarbageRetentionNumberData>
  implements IBusinessData {}
