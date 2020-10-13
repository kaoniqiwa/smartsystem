import { Component, OnInit, ViewChild } from '@angular/core';
import { StationChartComponent } from '../station-chart/station-chart.component';
import { DivisionStationTreeComponent } from '../division-station-tree/division-station-tree.component';
import { RegionCameraTreeComponent } from '../region-camera-tree/region-camera-tree.component';
import { FlatNode } from '../../../shared-module/custom-tree/custom-tree';
import { DataService as TypeDataService } from '../garbage-station/business/data.service';
import { DataService as CameraDataService } from './business/data.service';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-map-deploy',
  templateUrl: './map-deploy.component.html',
  styleUrls: ['./map-deploy.component.styl'],
  providers: [TypeDataService, CameraDataService]
})
export class MapDeployComponent implements OnInit {

  @ViewChild('stationTree')
  stationTree: DivisionStationTreeComponent;

  srcUrl: any;

  selectDivisionClick = async (item: FlatNode, lastNode: boolean) => {
    // const station = this.stationTree.dataService.garbageStations.find(x => x.Id == item.id);
    // const type = await this.findStationType(station.StationType);
    // if (type) {
    //   this.chartComponent.stationChart.changeTrashNum(type.Windows.length + '')
    //   this.chartComponent.stationChart.changeHouseType = type;
    // }
  }

  constructor(private typeDataService: TypeDataService,
    private cameraDataService: CameraDataService,
    private sanitizer: DomSanitizer,
  ) {
    this.srcUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.getSrc());
  }
  getSrc() {
    const host = document.location.hostname;
    const port = document.location.port;
    return 'http://' + host + ':' + port + '/amap/map_ts.html?v=20200925';
  }


  async ngOnInit() {

  }


}
