import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { EventType, TimeUnit } from "src/app/data-core/model/enum";
import { Division } from "src/app/data-core/model/waste-regulation/division";
import { EventNumberStatistic } from "src/app/data-core/model/waste-regulation/division-event-numbers";
import { DivisionNumberStatistic } from "src/app/data-core/model/waste-regulation/division-number-statistic";
import { GarbageStationNumberStatistic } from "src/app/data-core/model/waste-regulation/garbage-station-number-statistic";
import { IEventTrigger } from "../../interface/committees-event-trigger.interface";
import { StatisticSummaryViewModel } from "../statistic-summary.model";
import { StatisticSummaryEventRatioChartViewModel } from "./event-ratio/statistic-summary-event-ratio-chart.model";
import { StatisticSummaryLineChartViewModel } from "./line-chart/statistic-summary-line-chart.model";
import { StatisticSummaryStationEventChartViewModel } from "./station-event/statistic-summary-station-event-chart.model";
import { StatisticSummaryTaskChartViewModel } from "./task-statistic/statistic-summary-task-chart.model";

@Component({
  selector: "app-statistic-summary-charts",
  templateUrl: "./statistic-summary-charts.component.html",
  styleUrls: ["./statistic-summary-charts.component.css"],
})
export class StatisticSummaryChartsComponent
  implements
    AfterViewInit,
    OnInit,
    IEventTrigger<
      | StatisticSummaryTaskChartViewModel
      | StatisticSummaryEventRatioChartViewModel
      | StatisticSummaryLineChartViewModel
      | StatisticSummaryStationEventChartViewModel[]
    >
{
  EventType = EventType;

  @Input()
  DivisonStatistic?: StatisticSummaryViewModel;

  @Input()
  StationStatistic?: GarbageStationNumberStatistic[];

  @Input()
  DivisionHistory?: EventNumberStatistic[];

  @Input()
  EventTrigger: EventEmitter<void>;

  @Output()
  OnTriggerEvent: EventEmitter<
    | StatisticSummaryTaskChartViewModel
    | StatisticSummaryEventRatioChartViewModel
    | StatisticSummaryLineChartViewModel
    | StatisticSummaryStationEventChartViewModel[]
  > = new EventEmitter();

  onTriggerEvent(
    data:
      | StatisticSummaryTaskChartViewModel
      | StatisticSummaryEventRatioChartViewModel
      | StatisticSummaryLineChartViewModel
      | StatisticSummaryStationEventChartViewModel[]
  ) {
    this.OnTriggerEvent.emit(data);
  }

  @Input()
  TimeUnit?: TimeUnit;

  constructor() {}
  ngAfterViewInit(): void {}
  ngOnInit() {}
}
