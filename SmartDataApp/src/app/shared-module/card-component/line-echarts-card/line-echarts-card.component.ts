import { Component, OnInit } from '@angular/core';
import { EChartCardComponent, ViewsModel  } from "../../../common/abstract/base-view";
import { LineECharts } from "./line-echarts";
@Component({
  selector: 'hw-line-echarts-card',
  templateUrl: './line-echarts-card.component.html'
})
export class LineEChartsCardComponent extends EChartCardComponent implements OnInit {
  model:LineECharts;
  constructor() {
    super();
   }  
  ngOnInit(): void {
    if (this.loadDatas)
    this.loadDatas(new ViewsModel());
  } 

}
