import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { StatisticGarbageCountComponent } from "../statistic-garbage-count/statistic-garbage-count.component";
import { StatisticGarbageAnalyzeComponent } from "../statistic-garbage-analyze/statistic-garbage-analyze.component";
import { BusinessManageService,ViewDivisionTypeEnum } from "../../business-manage-service";
import { GarbageFullHistorySumChartComponent } from "../garbage-full-history-sum-chart/garbage-full-history-sum-chart.component";
import { OtherViewEnum } from "../view-helper";
@Component({
  selector: 'hw-garbage-station-summary',
  templateUrl: './garbage-station-summary.component.html'
})
export class GarbageStationSummaryComponent implements OnInit {
  viewsShow = [true, false,false,false,false];
  @Input() divisionsId = '';
  @ViewChild(StatisticGarbageCountComponent)
  garbageCountComponent: StatisticGarbageCountComponent;

  @ViewChild(StatisticGarbageAnalyzeComponent)
  analyzeComponent:StatisticGarbageAnalyzeComponent;

  @ViewChild(GarbageFullHistorySumChartComponent)
  garbageAnalyzeComponent:GarbageFullHistorySumChartComponent;
  constructor(private businessManageService:BusinessManageService)
   { }

  ngOnInit() {
    if(this.businessManageService.viewDivisionType ==ViewDivisionTypeEnum.MapStation
      || this.businessManageService.viewDivisionType ==ViewDivisionTypeEnum.TableLinkChild)
      this.acceptOtherView(OtherViewEnum.chart);
  }
  acceptOtherView(val: OtherViewEnum) {  
    this.viewsShow[0] = val == OtherViewEnum.info;
    this.viewsShow[1] = val == OtherViewEnum.chart;    
    this.viewsShow[2] = val == OtherViewEnum.sumChart;
    this.viewsShow[3] = val == OtherViewEnum.analyzeChart;
    this.viewsShow[4] = val == OtherViewEnum.event;
    if (val == OtherViewEnum.chart)
      this.garbageCountComponent.defaultStation();
    else if(val == OtherViewEnum.analyzeChart)
    this.analyzeComponent.initChart();
    else if(val == OtherViewEnum.sumChart)
    this.garbageAnalyzeComponent.initView();
  }
}
 