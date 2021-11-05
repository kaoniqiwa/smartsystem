import { Component, Input, OnInit } from "@angular/core";
import { Division } from "src/app/data-core/model/waste-regulation/division";
import { DivisionNumberStatistic } from "src/app/data-core/model/waste-regulation/division-number-statistic";
import { GarbageStationNumberStatistic } from "src/app/data-core/model/waste-regulation/garbage-station-number-statistic";
import { StatisticSummaryViewModel } from "../statistic-summary.model";

@Component({
  selector: "app-statistic-summary-charts",
  templateUrl: "./statistic-summary-charts.component.html",
  styleUrls: ["./statistic-summary-charts.component.css"],
})
export class StatisticSummaryChartsComponent implements OnInit {
  @Input()
  DivisonStatistic: StatisticSummaryViewModel;

  @Input()
  StationStatistic: GarbageStationNumberStatistic[];

  constructor() {}
  ngOnInit() {}
}
