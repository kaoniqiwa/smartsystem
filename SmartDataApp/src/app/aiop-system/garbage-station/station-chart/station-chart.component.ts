import { Component, OnInit, Input } from '@angular/core';
import { FormArray } from '@angular/forms';
import { StationChart, TrashIcon, House, HouseModeEnum } from "./business/station-chart";
@Component({
  selector: 'hw-garbage-chart',
  templateUrl: './station-chart.component.html',
  styleUrls: ['./station-chart.component.styl'],
  providers: [StationChart]
})
export class StationChartComponent implements OnInit {

  @Input()
  chartMode = HouseModeEnum.TrashCamera;

  @Input()
  maxWidth = '1100px';

  @Input()
  plusSquareFn: (liItem: { id: string, position: number }) => string;

  houseModeEnum = HouseModeEnum;
  constructor(public stationChart: StationChart) {
    this.initChart();
  }

  initChart(size: number = 4) {
    this.stationChart.house = this.stationChart.createHouse(size);
    this.stationChart.trashIcons = this.stationChart.initTrashIcon();
  }

  ngOnInit() { 
  }


  get insideLi1() {
    return this.stationChart.cameraPostionForm.get('insideLi1') as FormArray;
  }
  // get insideLi2() {
  //   return this.stationChart.cameraPostionForm.get('insideLi2') as FormArray;
  // }

  plusSquareClick(liItem: { id: string,name:string, position: number,no:number }) {
    this.plusSquareFn(liItem);
  }

}
