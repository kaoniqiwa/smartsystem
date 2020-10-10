import { Component, OnInit,Input } from '@angular/core';
import { FormArray } from '@angular/forms';
import { StationChart,TrashIcon, House ,HouseModeEnum} from "./business/station-chart";
@Component({
  selector: 'hw-garbage-chart',
  templateUrl: './station-chart.component.html',
  styleUrls: ['./station-chart.component.styl'],
  providers:[StationChart]
})
export class StationChartComponent implements OnInit {
 
  @Input()
  chartMode = HouseModeEnum.TrashCamera;
 
  houseModeEnum=HouseModeEnum;
  constructor(public stationChart: StationChart) {
    this.initChart();
  }

  initChart(size: number = 4){
    this.stationChart.house = this.stationChart.createHouse(size);     
    this.stationChart.trashIcons = this.stationChart.initTrashIcon();
  }

  ngOnInit() { 
  }
 

  get insideLi1() {
    return this.stationChart.cameraPostionForm.get('insideLi1') as FormArray;
}
get insideLi2() {
  return this.stationChart.cameraPostionForm.get('insideLi2') as FormArray;
}

}
