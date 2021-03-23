import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { CustomTreeComponent } from "../../../../custom-tree/custom-tree.component";
import { DataService } from "../../../../../aiop-system/garbage-station/division-station-tree/business/data-service";
import { StationTreeService } from "../../../../../aiop-system/garbage-station/division-station-tree/business/garbage-station-tree";
import { NodeTypeEnum } from '../../../../../aiop-system/common/tree.service';
import { FlatNode, TreeListMode } from '../../../../custom-tree/custom-tree';
import { domClickFn } from '../../../../../common/tool/jquery-help/jquery-help';
import { DivisionTypeEnum } from "../../../../../common/tool/enum-helper";
import { GarbageStationDao } from '../../../../../data-core/dao/garbage-station-dao';
import { DivisionDao } from '../../../../../data-core/dao/division-dao';
@Component({
  selector: 'hw-tree-drop-list',
  templateUrl: './tree-drop-list.component.html',
  styleUrls: ['./tree-drop-list.component.styl'],
  providers: [StationTreeService, DataService, GarbageStationDao, DivisionDao]
})
export class TreeDropListComponent implements OnInit {
  showBody = false;

  selectedTexts = new Array<{ id: string, text: string }>();

  @ViewChild('garbageStationTree')
  garbageStationTree: CustomTreeComponent;

  @Input()
  onlyDivisionNode = false;

  @Input()
  onlyCityNode = false;

  @Input()
  selectedItemFn: (item: FlatNode, lastNode: boolean) => void;

  selectedItemClick = (item: FlatNode) => {
    this.selectedTexts = new Array();
    for (let key of this.garbageStationTree.flatNodeMap.keys()) {
      if (key.checked && key.level != 0 && this.stationTreeService.isLastNode(key.id)) {
        if(this.onlyCityNode){
          this.selectedTexts.push({
            id: key.id,
            text: key.name
          });
        }
        if (!this.onlyDivisionNode && key.iconClass == "howell-icon-garbage")
          this.selectedTexts.push({
            id: key.id,
            text: key.name
          });
        else if (this.onlyDivisionNode && key.iconClass == "howell-icon-map5")
          this.selectedTexts.push({
            id: key.id,
            text: key.name
          });
      }
    }
  }

  clearSelectedTexts() {
    this.selectedTexts = new Array();
  }

  treeListMode = TreeListMode.checkedBox;

  searchTree = (text: string) => {
    const nodeType = this.onlyDivisionNode ? NodeTypeEnum.map : NodeTypeEnum.station;
    const dataSource = this.stationTreeService.filterNodes(text, nodeType);
    this.garbageStationTree.clearNestedNode();
    this.garbageStationTree.dataSource.data = dataSource;
    this.garbageStationTree.treeControl.expandAll();
  }
  constructor(private stationTreeService: StationTreeService
    , private garbageStationDao: GarbageStationDao
    , private divisionDao: DivisionDao
    , public dataService: DataService
  ) {
  }

  closeChecked(val: { id: string, text: string }) {
    const node = this.findNode(val.id), findIndex = this.selectedTexts.findIndex(x => x.id == val.id);
    node.checkBoxState = null;
    node.checked = false;
    this.selectedTexts.splice(findIndex, 1);

    const parentNode = this.garbageStationTree.getParentNode(node);
    if (parentNode) {
      const childs = this.garbageStationTree.treeControl.getDescendants(parentNode);
      if (childs.filter(x => x.checked == false).length == childs.length)
        parentNode.checkBoxState = null;
      else if (childs.filter(x => x.checked == true).length == childs.length)
        parentNode.checkBoxState = this.garbageStationTree.checkBoxState.all;
      else parentNode.checkBoxState = this.garbageStationTree.checkBoxState.self;
    }
  }

  findNode(id: string) {
    for (let key of this.garbageStationTree.flatNodeMap.keys())
      if (key.id == id)
        return key;
  }

  async ngOnInit() {
    domClickFn('body', () => {
      this.showBody = false;
    });
    this.reInit();
  }

  set defaultSearch(id: string) {
    const node = this.findNode(id);
    this.garbageStationTree.itemClick(node);
  }

  r() {
    this.garbageStationTree.clearNestedNode();
    this.stationTreeService.treeNode = new Array();
    this.garbageStationTree.dataSource.data = new Array();
  }

  async reInit() {
    if (this.dataService.divisions.length == 0)
      this.dataService.divisions = await this.divisionDao.allDivisions();
    this.stationTreeService.divisions.items = new Array();
    if (this.onlyCityNode) {
      this.stationTreeService.cityDivisionModel = this.dataService.divisions.filter(x => x.DivisionType < DivisionTypeEnum.Committees);
      const nodes = this.stationTreeService.convertTreeNode(this.stationTreeService.divisions);
      this.stationTreeService.dataSource = nodes;
    }
    else {
      const ancestorDivision = this.dataService.divisions.find(x => x.ParentId == void 0 || x.IsLeaf == false);
      // this.stationTreeService.divisions.items = new Array();
      this.stationTreeService.divisionModel = this.dataService.divisions.filter(x => x.DivisionType > DivisionTypeEnum.City);
      if (this.onlyDivisionNode) {
        const nodes = this.stationTreeService.convertTreeNode(this.stationTreeService.divisions);
        this.stationTreeService.dataSource = nodes;
      }
      else {
        if (ancestorDivision && this.dataService.garbageStations.length == 0)
          this.dataService.garbageStations = await this.garbageStationDao.requestGarbageStation(ancestorDivision.Id);
        this.stationTreeService.garbageStations.items = new Array();
        this.stationTreeService.garbageStationModel = this.dataService.garbageStations;
        this.stationTreeService.convertStationTreeNode();
      }
    }

    this.stationTreeService.loadStationTree();
    this.garbageStationTree.dataSource.data = this.stationTreeService.treeNode;
    // for (let key of this.garbageStationTree.flatNodeMap.keys())
    //   key.checked=false;
  }
}
