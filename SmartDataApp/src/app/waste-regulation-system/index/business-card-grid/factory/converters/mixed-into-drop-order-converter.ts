import { ViewsModel } from "src/app/common/abstract/base-view";
import { IConverter } from "src/app/common/interface/IConverter";
import { Language } from "src/app/common/tool/language";
import { EventType } from "src/app/data-core/model/enum";
import { OrderTable } from "src/app/shared-module/card-component/order-table-card/order-table";
import { EventDropOrderInfo } from "../../business/event-drop-order/data";

export class MixedIntoDropOrderConverter implements IConverter {
  Convert<IllegalDropOrderInfo, ViewsModel>(
    input: IllegalDropOrderInfo,
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
        Language.json.EventType.MixedInto + Language.json.rank;
      output.views[0].table = new Array();

      const sort = input.items.sort((a, b) => {
        return b.dropNum - a.dropNum;
      });
      for (const x of sort)
        output.views[0].table.push({
          id: x.id,
          name: x.division,
          subName: x.dropNum + "",
          subNameAfter: Language.json.Suffix.event,
          linkTipLabel:
            Language.json.see + Language.json.event + Language.json.record + "",
        });
      /**补空行 */
      const len = output.views[0].table.length;
      if (len < 6)
        for (let i = 0; i < 6 - len; i++)
          output.views[0].table.push({
            id: "",
            name: "-",
            subName: "0",
            subNameAfter: Language.json.Suffix.event,
            linkTipLabel:
              Language.json.see + Language.json.event + Language.json.record,
          });
      if (input.dropList)
        output.views[0].dropList = {
          listNodes: input.dropList,
          fontSize: "18px",
          defaultId: input.defaultId,
          eventType: EventType.MixedInto,
        };
    }
    return output;
  }
}
