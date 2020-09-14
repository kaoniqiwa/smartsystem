import { Component, OnInit } from '@angular/core';
import { EChartCardComponent  } from "../../../common/abstract/base-view";

import { BarOption, LineOption, PieOption } from "../../../common/directive/echarts/echart";
@Component({
  selector: 'hw-line-echarts-card',
  templateUrl: './line-echarts-card.component.html',
  styleUrls: ['./line-echarts-card.component.styl']
})
export class LineEChartsCardComponent extends EChartCardComponent implements OnInit {
 model:LineOption;
  constructor() {
    super();
   }

  ngOnInit() {
  }

}
