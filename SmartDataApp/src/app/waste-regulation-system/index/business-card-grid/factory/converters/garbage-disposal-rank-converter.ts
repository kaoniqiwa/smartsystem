import { ViewsModel } from "src/app/common/abstract/base-view";
import { IConverter } from "src/app/common/interface/IConverter";
import { IntegerDecimalNum } from "src/app/common/tool/tool.service";
import { OrderTable } from "src/app/shared-module/card-component/order-table-card/order-table";
import { StationsScoreInfo } from "../../business/garbage-disposal-rank/data";

export class GarbageDisposalRankConverter implements IConverter {
  Convert<StationsScoreInfo, ViewsModel>(
    input: StationsScoreInfo,
    output: ViewsModel
  ): ViewsModel;
  Convert(
    input: StationsScoreInfo,
    output: ViewsModel<OrderTable>
  ): ViewsModel<OrderTable> {
    output.views = [new OrderTable()];
    output.pageSize = 1;
    output.pageIndex = 1;
    if (input instanceof StationsScoreInfo) {
      output.views[0].title = "小包垃圾处置达标率排名";
      output.views[0].table = new Array();
      var i = 0;
      const sort = input.items.sort((a, b) => {
        return a.score - b.score;
      });
      for (const x of sort) {
        if (i == 100) break;
        output.views[0].table.push({
          id: x.id,
          name: x.station,
          subName: IntegerDecimalNum(x.score + ""),
          subNameAfter: x.unit,
          linkTipLabel: "查看小包垃圾处置记录",
        });
        i += 1;
      }

      /**补空行 */
      const len = output.views[0].table.length;
      if (len < 6)
        for (let i = 0; i < 6 - len; i++)
          output.views[0].table.push({
            id: "",
            name: "-",
            subName: "0",
            subNameAfter: "分",
            linkTipLabel: "查看小包垃圾处置记录",
          });
    }
    return output;
  }
}
