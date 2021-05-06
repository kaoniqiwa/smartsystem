import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { CustomTreeComponent } from '../../../shared-module/custom-tree/custom-tree.component';
import { StationTreeService } from './business/garbage-station-tree';
import { DataService } from './business/data-service';
import { NodeTypeEnum } from '../../common/tree.service';
import { FlatNode, TreeListMode, RightBtn } from '../../../shared-module/custom-tree/custom-tree';
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
  selectedItemFn: (item: FlatNode, lastNode: boolean) => void;

  selectedItemClick = (item: FlatNode) => {
    if (this.selectedItemFn) { this.selectedItemFn(item, this.stationTreeService.isLastNode(item.id)); }
  }

  @Input()
  treeListMode = TreeListMode.rightBtn;

  @Input()
  rightBtn: { iconClass: string, btns: RightBtn[] };

  @Input()
  rightBtnFn: (item: FlatNode, btn: RightBtn) => void;

  rightBtnClick = (item: FlatNode, btn: RightBtn) => {
    if (this.rightBtnFn) { this.rightBtnFn(item, btn); }
  }
  searchTree = (text: string) => {
    const nodeType = this.onlyDivisionNode ? NodeTypeEnum.map : NodeTypeEnum.station;
    const dataSource = this.stationTreeService.filterNodes(text, nodeType);
    this.garbageStationTree.clearNestedNode();
    this.garbageStationTree.dataSource.data = dataSource;
    this.garbageStationTree.treeControl.expandAll();
  }
  constructor(private stationTreeService: StationTreeService
    , public dataService: DataService) {
  }

  async ngOnInit() {

    this.dataService.divisions = await this.dataService.requestDivision();
    const ancestorDivision = this.dataService.divisions.filter(x => !x.ParentId);
    this.stationTreeService.divisionModel = this.dataService.divisions;
    if (this.onlyDivisionNode) {
      const nodes = this.stationTreeService.convertTreeNode(this.stationTreeService.divisions);
      this.stationTreeService.dataSource = nodes;
    } else {
      if (ancestorDivision) {
        for (let i = 0; i < ancestorDivision.length; i++) {
          const element = ancestorDivision[i];
          let stations = await this.dataService.requestGarbageStation(element.Id);          
          this.stationTreeService.garbageStationModel = stations;
          if(!this.dataService.garbageStations)
          {
            this.dataService.garbageStations = [];
          }
          this.dataService.garbageStations = this.dataService.garbageStations.concat(stations);          
          this.stationTreeService.convertStationTreeNode();
        }
      }
    }
    this.stationTreeService.loadStationTree();
    this.garbageStationTree.dataSource.data = this.stationTreeService.treeNode;

    this.addNodeRightBtn(this.rightBtn);
  }

  findNode(id: string) {
    for (const key of this.garbageStationTree.flatNodeMap.keys()) {
      if (key.id === id) {
        return key;
      }
    }
  }

  findBindNode(iconClass: string) {
    const nodes = new Array<FlatNode>();
    for (const key of this.garbageStationTree.flatNodeMap.keys()) {
      if (key.iconClass === iconClass && key.rightClassBtn.length === 0) {
        nodes.push(key);
      }
    }
    return nodes;
  }

  addNodeRightBtn(item: { iconClass: string, btns: RightBtn[] }) {
    if (this.treeListMode === TreeListMode.rightBtn && item) {
      const nodes = this.findBindNode(item.iconClass);
      for (const n of nodes) {
        n.rightClassBtn = item.btns;
      }
    }
  }
}
