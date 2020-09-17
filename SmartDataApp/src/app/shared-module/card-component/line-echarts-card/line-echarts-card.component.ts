import { Component, OnInit ,ViewChild} from '@angular/core';
import { EChartCardComponent, ViewsModel  } from "../../../common/abstract/base-view";
import { LineECharts } from "./line-echarts";
import {  EChartLineDirective} from "../../../common/directive/echarts/line-directive";
@Component({
  selector: 'hw-line-echarts-card',
  templateUrl: './line-echarts-card.component.html'
})
export class LineEChartsCardComponent extends EChartCardComponent implements OnInit {
  model:LineECharts;
  @ViewChild(EChartLineDirective) cardHost: EChartLineDirective;
  constructor() {
    super();
    this.initEchart =()=>{ 
      if(this.cardHost)this.cardHost.init(); 
    }
    this.reSizeEchart=()=>{ 
      this.cardHost.reSize(); 
    }
   }  
  ngOnInit(): void {
    if (this.loadDatas)
    this.loadDatas(new ViewsModel());
  }  
}
