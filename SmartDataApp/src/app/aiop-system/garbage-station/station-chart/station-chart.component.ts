import { Component, OnInit,Input } from '@angular/core';
import { StationChart,TrashIcon, House ,HouseModeEnum} from "./business/station-chart";
@Component({
  selector: 'hw-garbage-chart',
  templateUrl: './station-chart.component.html',
  styleUrls: ['./station-chart.component.styl'],
  providers:[StationChart]
})
export class StationChartComponent implements OnInit {
 
  @Input()
  chartMode = HouseModeEnum.Trash;
  houseModeEnum=HouseModeEnum;
  constructor(private stationChart: StationChart) {
    this.stationChart.house = this.stationChart.createHouse();     
    this.stationChart.trashIcons = this.stationChart.initTrashIcon();
  }

  ngOnInit() {
  }
}
