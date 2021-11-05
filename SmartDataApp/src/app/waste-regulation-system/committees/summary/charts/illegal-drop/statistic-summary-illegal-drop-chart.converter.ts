import { LineOption } from "src/app/common/directive/echarts/echart";
import { EventType } from "src/app/data-core/model/enum";
import { EventNumberStatistic } from "src/app/data-core/model/waste-regulation/division-event-numbers";
import { EventNumber } from "src/app/data-core/model/waste-regulation/event-number";
import { LineECharts } from "src/app/shared-module/card-component/line-echarts-card/line-echarts";
import { DropEvent } from "src/app/waste-regulation-system/index/business-card-grid/business/event-drop-history/data";
import { ICommitteesConverter } from "../../../interface/committees-converter.interface";

export class StatisticSummaryIllegalDropChartConverter {
  // Convert(input: DropEvent): LineECharts {
  //   let charts = new Array<LineECharts>();

  //   const lc = this.joinPart(new LineECharts());
  //   var enters1 = new Array<EventNumber>();
  //   for (let i = 0; i < input.datas.length; i++) {
  //     enters1.push(input.datas[i]);
  //   }
  //   lc.option.seriesData = new Array();
  //   for (const x of enters1) lc.option.seriesData.push(x.DeltaNumber);
  //   charts.push(lc);

  //   return charts;
  // }

  private joinPart(t1: LineECharts) {
    t1.title = "今日乱丢垃圾";
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
