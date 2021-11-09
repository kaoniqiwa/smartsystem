import { AfterViewInit, Component, Input, OnInit } from "@angular/core";
import { EventType, TimeUnit } from "src/app/data-core/model/enum";
import { Division } from "src/app/data-core/model/waste-regulation/division";
import { EventNumberStatistic } from "src/app/data-core/model/waste-regulation/division-event-numbers";
import { DivisionNumberStatistic } from "src/app/data-core/model/waste-regulation/division-number-statistic";
import { GarbageStationNumberStatistic } from "src/app/data-core/model/waste-regulation/garbage-station-number-statistic";
import { StatisticSummaryViewModel } from "../statistic-summary.model";

@Component({
  selector: "app-statistic-summary-charts",
  templateUrl: "./statistic-summary-charts.component.html",
  styleUrls: ["./statistic-summary-charts.component.css"],
})
export class StatisticSummaryChartsComponent implements AfterViewInit, OnInit {
  EventType = EventType;

  @Input()
  DivisonStatistic?: StatisticSummaryViewModel;

  @Input()
  StationStatistic?: GarbageStationNumberStatistic[];

  @Input()
  DivisionHistory?: EventNumberStatistic[];

  @Input()
  TimeUnit?: TimeUnit;

  constructor() {
    console.log("StatisticSummaryChartsComponent constructor");
  }
  ngAfterViewInit(): void {
    console.log("StatisticSummaryChartsComponent ngAfterViewInit");
  }
  ngOnInit() {
    console.log("StatisticSummaryChartsComponent ngOnInit");
  }
}
