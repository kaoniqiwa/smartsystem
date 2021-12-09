import { ViewsModel } from "src/app/common/abstract/base-view";
import { LineOption } from "src/app/common/directive/echarts/echart";
import { IConverter } from "src/app/common/interface/IConverter";
import { Language } from "src/app/common/tool/language";
import { EventNumber } from "src/app/data-core/model/waste-regulation/event-number";
import { LineECharts } from "src/app/shared-module/card-component/line-echarts-card/line-echarts";
import { DropEvent } from "../../business/event-drop-history/data";

export class IllegalDropHistoryCardConverter implements IConverter {
  Convert<DropEvent, ViewsModel>(
    input: DropEvent,
    output: ViewsModel
  ): ViewsModel;
  Convert(
    input: DropEvent,
    output: ViewsModel<LineECharts>
  ): ViewsModel<LineECharts> {
    output.views = [];
    output.pageSize = 1;
    output.pageIndex = 1;
    const lc = this.joinPart(new LineECharts());
    var enters1 = new Array<EventNumber>();
    for (let i = 0; i < input.datas.length; i++) {
      enters1.push(input.datas[i]);
    }
    lc.option.seriesData = new Array();
    for (const x of enters1) lc.option.seriesData.push(x.DeltaNumber);
    output.views.push(lc);

    return output;
  }

  private joinPart(t1: LineECharts) {
    t1.title = Language.json.today + Language.json.EventType.IllegalDrop;
    t1.option = new LineOption();
    t1.option.xAxisData = [];
    for (let i = 1; i <= 12; i++) {
      if (i < 10) t1.option.xAxisData.push("0" + i + ":00");
      else t1.option.xAxisData.push(i + ":00");
    }
    for (let i = 13; i <= 24; i++) {
      if (i == 24) t1.option.xAxisData.push("23" + ":59");
      else t1.option.xAxisData.push(i + ":00");
    }
    return t1;
  }
}
