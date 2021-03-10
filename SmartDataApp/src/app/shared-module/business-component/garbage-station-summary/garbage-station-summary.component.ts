import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { StatisticGarbageCountComponent } from "../statistic-garbage-count/statistic-garbage-count.component";
import { StatisticGarbageAnalyzeComponent } from "../statistic-garbage-analyze/statistic-garbage-analyze.component";
import { GarbageFullHistorySumChartComponent } from "../event-history/garbage-full-history-sum-chart/garbage-full-history-sum-chart.component";
@Component({
  selector: 'hw-garbage-station-summary',
  templateUrl: './garbage-station-summary.component.html'
})
export class GarbageStationSummaryComponent implements OnInit {
  viewsShow = [true, false,false];
  @Input() divisionsId = '';
  @ViewChild(StatisticGarbageCountComponent)
  garbageCountComponent: StatisticGarbageCountComponent;

  @ViewChild(StatisticGarbageAnalyzeComponent)
  analyzeComponent:StatisticGarbageAnalyzeComponent;

  @ViewChild(GarbageFullHistorySumChartComponent)
  garbageAnalyzeComponent:GarbageFullHistorySumChartComponent;
  constructor() { }

  ngOnInit() {
  }
  acceptOtherView(val: OtherViewEnum) {  
    this.viewsShow[0] = val == OtherViewEnum.info;
    this.viewsShow[1] = val == OtherViewEnum.chart;    
    this.viewsShow[2] = val == OtherViewEnum.sumChart;
    this.viewsShow[3] = val == OtherViewEnum.analyzeChart;
    if (val == OtherViewEnum.chart)
      this.garbageCountComponent.defaultStation();
    else if(val == OtherViewEnum.analyzeChart)
    this.analyzeComponent.initChart();
    else if(val == OtherViewEnum.sumChart)
    this.garbageAnalyzeComponent.initView();
  }
}


export enum OtherViewEnum {
  chart,
  info,
  sumChart,
  analyzeChart
}