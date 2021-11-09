import { DivisionNumberStatisticV2 } from "src/app/data-core/model/waste-regulation/division-number-statistic";

export class StatisticSummaryViewModel extends DivisionNumberStatisticV2 {
  constructor(maxGarbageTime = 0, garde = 0) {
    super();
    this.MaxGarbageTime = maxGarbageTime;
    this.Garde = garde;
  }
  MaxGarbageTime: number;
  Garde: number;
}
