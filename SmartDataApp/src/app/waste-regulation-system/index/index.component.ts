import { Component, OnInit } from '@angular/core';
import { BarOption, LineOption, PieOption } from "../../common/directive/echarts/echart";
import { ToolService } from "../../common/tool/tool.service";
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.styl'],
  providers:[ToolService]
})
export class IndexComponent implements OnInit {

  bar = new BarOption();
  line = new LineOption();
  pie = new PieOption();
  cardSize :{ width:number,height:number};
  constructor(private toolService:ToolService) {    
    this.cardSize = {
      width: toolService.windowScreen.height/4,
      height:(toolService.windowScreen.height - 90)/3
    }
    console.log(this.cardSize);
    
    this.bar.seriesData = [
      [120, 200, 150, 80, 70, 110, 130],
      [90, 120, 60, 10, 30, 98, 60]
    ];
    this.bar.xAxisData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    this.bar.seriesName = ['干垃圾', '湿垃圾'];
    this.bar.legendData = ['干垃圾', '湿垃圾'];
    this.line.xAxisData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    this.line.seriesData = [820, 932, 901, 934, 1290, 1330, 1320];
    this.pie.legendData = ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎'];
    this.pie.seriesData = [
      { value: 335, name: '直接访问' },
      { value: 310, name: '邮件营销' },
      { value: 234, name: '联盟广告' },
      { value: 135, name: '视频广告' },
      { value: 1548, name: '搜索引擎' }
    ];
  }

  
  ngOnInit() {
    
  }

 
}
