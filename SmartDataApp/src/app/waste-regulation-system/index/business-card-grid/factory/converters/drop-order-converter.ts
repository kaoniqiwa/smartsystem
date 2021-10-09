import { ViewsModel } from "src/app/common/abstract/base-view";
import { IConverter } from "src/app/common/interface/IConverter";
import { EventType } from "src/app/data-core/model/enum";
import { OrderTable } from "src/app/shared-module/card-component/order-table-card/order-table";
import { EventDropOrderInfo } from "../../business/event-drop-order/data";

export class DropOrderConverter implements IConverter {
  Convert<EventDropOrderInfo, ViewsModel>(
    input: EventDropOrderInfo,
    output: ViewsModel
  ): ViewsModel;
  Convert(
    input: EventDropOrderInfo,
    output: ViewsModel<OrderTable>
  ): ViewsModel<OrderTable> {
    output.views = [new OrderTable()];
    output.pageSize = 1;
    output.pageIndex = 1;
    if (input instanceof EventDropOrderInfo) {
      output.views[0].title =
        input.eventType == EventType.IllegalDrop
          ? "今日乱扔垃圾排名"
          : "今日混合投放排名";
      output.views[0].table = new Array();

      const sort = input.items.sort((a, b) => {
        return b.dropNum - a.dropNum;
      });
      for (const x of sort)
        output.views[0].table.push({
          id: x.id,
          name: x.division,
          subName: x.dropNum + "",
          subNameAfter: "起",
          linkTipLabel: "查看事件记录",
        });
      /**补空行 */
      const len = output.views[0].table.length;
      if (len < 6)
        for (let i = 0; i < 6 - len; i++)
          output.views[0].table.push({
            id: "",
            name: "-",
            subName: "0",
            subNameAfter: "起",
            linkTipLabel: "查看事件记录",
          });

      output.views[0].dropListV1 = {
        listNodes: [
          { id: "IllegalDrop", name: "乱扔垃圾" },
          { id: "MixedInto", name: "混合投放" },
        ],
        fontSize: "18px",
        defaultId: "IllegalDrop",
        eventType: input.eventType,
      };
      if (input.dropList)
        output.views[0].dropList = {
          listNodes: input.dropList,
          fontSize: "18px",
          defaultId: input.defaultId,
          eventType: input.eventType,
        };
    }
    // console.log(output);
    return output;
  }
}
