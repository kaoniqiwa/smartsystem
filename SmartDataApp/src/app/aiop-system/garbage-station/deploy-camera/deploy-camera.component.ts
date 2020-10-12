import { Component, OnInit, ViewChild } from '@angular/core';
import { StationChartComponent } from '../station-chart/station-chart.component';
import { DivisionStationTreeComponent } from "../division-station-tree/division-station-tree.component";
import {RegionCameraTreeComponent  } from "../region-camera-tree/region-camera-tree.component";
import { FlatNode } from '../../../shared-module/custom-tree/custom-tree';
import { DataService as TypeDataService } from "../garbage-station/business/data.service";
import { BusinessService } from "./business/business.service";
import { DataService as CameraDataService } from "./business/data.service";
@Component({
  selector: 'app-deploy-camera',
  templateUrl: './deploy-camera.component.html',
  styleUrls: ['./deploy-camera.component.styl'],
  providers: [TypeDataService,BusinessService,CameraDataService]
})
export class DeployCameraComponent implements OnInit {

  @ViewChild('stationTree')
  stationTree: DivisionStationTreeComponent;

  @ViewChild('cameraTree')
  cameraTree: RegionCameraTreeComponent;

  @ViewChild('garbageChart')
  chartComponent: StationChartComponent;

  selectDivisionClick = async (item: FlatNode, lastNode: boolean) => {
    const station = this.stationTree.dataService.garbageStations.find(x => x.Id == item.id);
    const type = await this.findStationType(station.StationType);
    if (type) {
      this.chartComponent.stationChart.changeTrashNum(type.Windows.length + '')
      this.chartComponent.stationChart.changeHouseType = type;
    }
  }

  selectCameraClick = async (item: FlatNode) => {
    this.businessService.bindingCamera = this.cameraTree.dataService.cameras.find(x=>x.Id == item.id);
  }

  bindingItemClick = (liItem:{ id: string, position: number })=>{
 
     liItem.id =this.businessService.bindingCamera ? this.businessService.bindingCamera.Id : '';
     this.businessService.bindingCamera=null
  }

  constructor(private typeDataService: TypeDataService
   ,private cameraDataService:CameraDataService
    ,private businessService:BusinessService) {
  }

  async ngOnInit() {

  }

  async findStationType(stationType: number) {
    if (this.typeDataService.types == null)
      this.typeDataService.types = await this.typeDataService.requestGarbageStationType();
    return this.typeDataService.types.find(x => x.Type == stationType);
  }

}
