import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { CustomTreeComponent } from "../../../shared-module/custom-tree/custom-tree.component";
import { StationTreeService } from "./business/garbage-station-tree";
import { DataService } from "./business/data-service";
import { NodeTypeEnum } from '../../common/tree.service';
import { FlatNode } from '../../../shared-module/custom-tree/custom-tree';
@Component({
  selector: 'hw-division-station-tree',
  templateUrl: './division-station-tree.component.html',
  providers: [StationTreeService, DataService]
})
export class DivisionStationTreeComponent implements OnInit {

  @ViewChild('garbageStationTree')
  garbageStationTree: CustomTreeComponent;

  @Input()
  onlyDivisionNode = false;

  @Input()
  treeHeight = 'calc(100% - 20px)';

  @Input()
  selectedItemFn:(item: FlatNode,lastNode:boolean)=>void;

  selectedItemClick = (item: FlatNode)=>{
    if(this.selectedItemFn)this.selectedItemFn(item,this.stationTreeService.isLastNode(item.id));
  }


  searchTree = (text: string) => {
    const nodeType = this.onlyDivisionNode ? NodeTypeEnum.map:NodeTypeEnum.station;
    const dataSource = this.stationTreeService.filterNodes(text, nodeType);
    this.garbageStationTree.clearNestedNode();
    this.garbageStationTree.dataSource.data = dataSource;
    this.garbageStationTree.treeControl.expandAll();
  }
  constructor(private stationTreeService: StationTreeService
    , public dataService: DataService) { }

  async ngOnInit() {
    this.dataService.divisions = await this.dataService.requestDivision();
    const ancestorDivision = this.dataService.divisions.find(x => x.ParentId == void 0);
    this.stationTreeService.divisionModel = this.dataService.divisions; 
    if (this.onlyDivisionNode) {
      const nodes =this.stationTreeService.convertTreeNode(this.stationTreeService.divisions);
      this.stationTreeService.dataSource = nodes;
    }
    else {
      if (ancestorDivision)
        this.dataService.garbageStations = await this.dataService.requestGarbageStation(ancestorDivision.Id);
      this.stationTreeService.garbageStationModel = this.dataService.garbageStations;
      this.stationTreeService.convertStationTreeNode();
    } 
    this.stationTreeService.loadStationTree();
    this.garbageStationTree.dataSource.data = this.stationTreeService.treeNode;

  }

}
