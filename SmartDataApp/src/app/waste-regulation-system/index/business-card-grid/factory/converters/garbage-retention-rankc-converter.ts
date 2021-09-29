import { ViewsModel } from "src/app/common/abstract/base-view";
import {
  GarbageRetentionRankData,
  GarbageRetentionRankDatas,
} from "src/app/shared-module/card-component/garbage-retention-rank/garbage-retention-rank.model";

export class GarbageRetentionRankcConverter {
  Convert(
    input: GarbageRetentionRankData[],
    output: ViewsModel<GarbageRetentionRankDatas>
  ) {
    if (!input) return;
    let view: GarbageRetentionRankDatas = {
      datas: input,
    };

    output.views = [view];
    return output;
  }
}
