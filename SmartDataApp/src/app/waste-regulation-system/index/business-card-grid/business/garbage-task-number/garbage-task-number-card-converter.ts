import { ViewsModel } from "src/app/common/abstract/base-view";
import { IConverter } from "src/app/common/interface/IConverter";
import {
  GarbageTaskNumberCardData,
  GarbageTaskNumberCardDatas,
} from "../../../../../shared-module/card-component/garbage-task-number-card/garbage-task-number-card-data";
import { GarbageTaskNumberDatas } from "./garbage-task-number-data";

export class GarbageTaskNumberCardConverter implements IConverter {
  Convert<GarbageTaskNumberDatas, ViewsModel>(
    input: GarbageTaskNumberDatas,
    output: ViewsModel
  ): ViewsModel;
  Convert(
    input: GarbageTaskNumberDatas,
    output: ViewsModel<GarbageTaskNumberCardDatas>
  ): ViewsModel<GarbageTaskNumberCardDatas> {
    if (!input) return;
    output.views = [new GarbageTaskNumberCardDatas()];

    output.views[0].datas = input.map((x) => {
      let data = new GarbageTaskNumberCardData();
      data.Id = x.Id;
      data.Name = x.Name;
      data.TotalCount = x.GarbageDropCount;
      data.UncompletedCount = x.GarbageDropCount - x.GarbageDropHandleCount;
      data.GarbageTimeoutCount = x.GarbageDropTimeoutCount;
      data.ratio = x.GarbageDropHandleCount / x.GarbageDropCount;
      if (Number.isNaN(data.ratio)) {
        data.ratio = 1;
      }
      data.ratio *= 100;
      return data;
    });

    return output;
  }
}
