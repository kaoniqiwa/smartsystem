import { Component, OnInit, ViewChild, Input } from '@angular/core'; 
import { CustomTreeComponent } from "../../../shared-module/custom-tree/custom-tree.component";
import { StationTreeService } from "./business/garbage-station-tree";
import { DataService } from "./business/data-service";
import { NodeTypeEnum } from '../../common/tree.service';
@Component({
  selector: 'hw-division-station-tree',
  templateUrl: './division-station-tree.component.html',
  providers: [StationTreeService, DataService]
})
export class DivisionStationTreeComponent implements OnInit {
    
  @ViewChild('garbageStationTree')
  garbageStationTree: CustomTreeComponent;

  searchTree = (text: string) => {
    const dataSource = this.stationTreeService.filterNodes(text,NodeTypeEnum.station);     
    this.garbageStationTree.clearNestedNode();
    this.garbageStationTree.dataSource.data = dataSource;
    this.garbageStationTree.treeControl.expandAll();
  }
  constructor(private stationTreeService: StationTreeService
    , private dataService: DataService) { }

  async ngOnInit() {
    this.dataService.divisions = await this.dataService.requestDivision();
    const ancestorDivision = this.dataService.divisions.find(x => x.ParentId == void 0);
    if (ancestorDivision)
      this.dataService.garbageStations = await this.dataService.requestGarbageStation(ancestorDivision.Id);
    this.stationTreeService.divisionModel = this.dataService.divisions;
    this.stationTreeService.garbageStationModel = this.dataService.garbageStations;
    this.stationTreeService.convertStationTreeNode();
    this.stationTreeService.loadStationTree();
    this.garbageStationTree.dataSource.data = this.stationTreeService.treeNode; 

  }

}
