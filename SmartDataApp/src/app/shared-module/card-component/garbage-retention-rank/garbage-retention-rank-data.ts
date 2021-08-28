import { IViewModel } from "src/app/common/abstract/base-view";
import { IBusinessData } from "src/app/common/interface/IBusiness";
import { DivisionNumberStatistic } from "src/app/data-core/model/waste-regulation/division-number-statistic";
import { GarbageStationNumberStatistic } from "src/app/data-core/model/waste-regulation/garbage-station-number-statistic";

// 视图需要的数据结构
export interface GarbageRetentionRankData extends IBusinessData {
  id: string;
  name: string;
  time: string;
  count: number;
}

export class GarbageRetentionNumberCardDatas implements IViewModel {
  datas: Array<GarbageRetentionRankData>;
}

export interface GarbageRetentionRankDatas {
  datas: GarbageRetentionRankData[];
}
