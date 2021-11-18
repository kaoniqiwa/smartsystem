import { DatePipe } from "@angular/common";
import { LineOption } from "src/app/common/directive/echarts/echart";
import { Language } from "src/app/common/tool/language";
import { EventType, TimeUnit } from "src/app/data-core/model/enum";
import { EventNumberStatistic } from "src/app/data-core/model/waste-regulation/division-event-numbers";
import { DivisionNumberStatisticV2 } from "src/app/data-core/model/waste-regulation/division-number-statistic";
import { EventNumber } from "src/app/data-core/model/waste-regulation/event-number";
import { LineECharts } from "src/app/shared-module/card-component/line-echarts-card/line-echarts";
import { DropEvent } from "src/app/waste-regulation-system/index/business-card-grid/business/event-drop-history/data";
import { ICommitteesConverter } from "../../../interface/committees-converter.interface";
import { StatisticSummaryLineChartViewModel } from "./statistic-summary-line-chart.model";

export class StatisticSummaryIllegalDropChartConverter
  implements
    ICommitteesConverter<
      EventNumberStatistic[],
      StatisticSummaryLineChartViewModel
    >
{
  Convert(
    input: EventNumberStatistic[],
    eventType: EventType,
    unit: TimeUnit,
    datePipe: DatePipe
  ): StatisticSummaryLineChartViewModel {
    let vm = new StatisticSummaryLineChartViewModel();
    vm.title = Language.EventType(eventType);
    vm.type = eventType;
    if (input.length > 0) {
      vm.xAxis = this.getXAxis(input[0].BeginTime, unit);
    }
    // 补0
    vm.data.push(0);
    for (let i = 0; i < input.length; i++) {
      const statistic = input[i];
      let number = statistic.EventNumbers.find(
        (x) => x.EventType === eventType
      );
      if (number) {
        let strDate = datePipe.transform(
          statistic.BeginTime,
          this.getDateFormat(unit)
        );
        vm.xAxis[i] = strDate ? strDate : "";

        vm.data.push(number.DeltaNumber ? number.DeltaNumber : 0);
      }
    }
    return vm;
  }

  getXAxis(date: Date, unit: TimeUnit) {
    let axis = new Array<string>();
    switch (unit) {
      case TimeUnit.Hour:
        for (let i = 0; i <= 24; i++) {
          axis.push(`${i}:00`);
        }
        break;
      case TimeUnit.Day:
        let next = new Date(date.getFullYear(), date.getMonth() + 1);
        next.setSeconds(-1);
        for (let i = 0; i <= next.getDate(); i++) {
          axis.push(`${i}日`);
        }
        break;
      default:
        break;
    }
    return axis;
  }

  getDateFormat(unit: TimeUnit) {
    switch (unit) {
      case TimeUnit.Hour:
        return "H:mm";
      case TimeUnit.Day:
        return "d日";

      default:
        return "";
    }
  }
}
