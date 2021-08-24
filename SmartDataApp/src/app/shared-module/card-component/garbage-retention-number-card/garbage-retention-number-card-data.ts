import { IViewModel } from "src/app/common/abstract/base-view";

export class GarbageRetentionNumberCardData {
  Id: string;
  Name: string;
  Time = 0;
  Count = 0;
}

export class GarbageRetentionNumberCardDatas implements IViewModel {
  datas: Array<GarbageRetentionNumberCardData>;
}
