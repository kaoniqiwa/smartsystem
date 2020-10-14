import { Component, OnInit, ViewChild } from '@angular/core';
import { StationChartComponent } from '../station-chart/station-chart.component';
import { DivisionStationTreeComponent } from "../division-station-tree/division-station-tree.component";
import { RegionCameraTreeComponent } from "../region-camera-tree/region-camera-tree.component";
import { FlatNode } from '../../../shared-module/custom-tree/custom-tree';
import { DataService as TypeDataService } from "../garbage-station/business/data.service";
import { BusinessService } from "./business/business.service";
import { DataService as CameraDataService } from "./business/data.service";
@Component({
  selector: 'app-deploy-camera',
  templateUrl: './deploy-camera.component.html',
  styleUrls: ['./deploy-camera.component.styl'],
  providers: [TypeDataService, BusinessService, CameraDataService]
})
export class DeployCameraComponent implements OnInit {

  @ViewChild('stationTree')
  stationTree: DivisionStationTreeComponent;

  @ViewChild('cameraTree')
  cameraTree: RegionCameraTreeComponent;

  @ViewChild('garbageChart')
  chartComponent: StationChartComponent;

  showHouse = false;
  selectDivisionClick = async (item: FlatNode, lastNode: boolean) => {
    const station = this.stationTree.dataService.garbageStations.find(x => x.Id == item.id);

    if (station) {
      this.businessService.station=station;
      const type = await this.findStationType(station.StationType);
      this.showHouse = type != null;
      if (type) {
        this.chartComponent.stationChart.changeTrashNum(type.Windows.length + '')
        this.chartComponent.stationChart.changeHouseType = type;
       await  this.businessService.fillHouseCameraPostion( this.chartComponent.stationChart.house,station.Id);
       this.reloadState();
      }
    }

  }

  reloadState = ()=>{
    this.businessService.cameraNodesFn=  ()=>{
      return  this.cameraTree.findBindCameraNode(false);
    }
    this.businessService.fillCameraTreeState(this.cameraDataService.cameras);
  }

  selectCameraClick = async (item: FlatNode) => {
    this.businessService.bindItem = item;
    this.businessService.bindingCamera = this.cameraTree.dataService.cameras.find(x => x.Id == item.id);
  }

  bindingItemClick = (liItem: { id: string, name: string, position: number,no:number }) => {
    this.businessService.bindingItem(liItem);
  }


  constructor(private typeDataService: TypeDataService
    , private cameraDataService: CameraDataService
    , private businessService: BusinessService) {
    businessService.cameraDataService = cameraDataService;
  }

  async ngOnInit() {
    this.businessService.findNodeFn = (id: string) => {
      return this.cameraTree.findNode(id);
    }

  
  }

  async findStationType(stationType: number) {
    if (this.typeDataService.types == null)
      this.typeDataService.types = await this.typeDataService.requestGarbageStationType();
    return this.typeDataService.types.find(x => x.Type == stationType);
  }

}
