import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { CustomTreeComponent } from "../../../../shared-module/custom-tree/custom-tree.component";
import { DataService } from "../../../garbage-station/division-station-tree/business/data-service";
import { StationTreeService } from "../../../garbage-station/division-station-tree/business/garbage-station-tree";
import { NodeTypeEnum } from '../../../common/tree.service';
import { FlatNode, TreeListMode } from '../../../../shared-module/custom-tree/custom-tree';
import { domClickFn } from '../../../../common/tool/jquery-help/jquery-help';
@Component({
  selector: 'hw-tree-drop-list',
  templateUrl: './tree-drop-list.component.html',
  styleUrls: ['./tree-drop-list.component.styl'],
  providers: [StationTreeService, DataService]
})
export class TreeDropListComponent implements OnInit {
  showBody = false;

  selectedTexts = new Array<{ id: string, text: string }>();

  @ViewChild('garbageStationTree')
  garbageStationTree: CustomTreeComponent;

  @Input()
  onlyDivisionNode = false;

  @Input()
  selectedItemFn: (item: FlatNode, lastNode: boolean) => void;

  selectedItemClick = (item: FlatNode) => {
    this.selectedTexts = new Array();
    for (let key of this.garbageStationTree.flatNodeMap.keys()) {
      if (key.checked && key.level != 0&& this.stationTreeService.isLastNode(key.id)) {     
        this.selectedTexts.push({
          id: key.id,
          text: key.name
        });
      }
    }
  }

  clearSelectedTexts(){
    this.selectedTexts=new Array();
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
    , public dataService: DataService) {
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

  async reInit() {
    if (this.dataService.divisions.length==0)
      this.dataService.divisions = await this.dataService.requestDivision();
    const ancestorDivision = this.dataService.divisions.find(x => x.ParentId == void 0);
    this.stationTreeService.divisions.items = new Array();
    this.stationTreeService.divisionModel = this.dataService.divisions;
    if (this.onlyDivisionNode) {
      const nodes = this.stationTreeService.convertTreeNode(this.stationTreeService.divisions);
      this.stationTreeService.dataSource = nodes.slice(0,5);
    }
    else { 
      if (ancestorDivision && this.dataService.garbageStations.length==0)
        this.dataService.garbageStations = await this.dataService.requestGarbageStation(ancestorDivision.Id);
      this.stationTreeService.garbageStationModel = this.dataService.garbageStations;
      this.stationTreeService.convertStationTreeNode();
    }
    this.stationTreeService.loadStationTree();
    this.garbageStationTree.dataSource.data = this.stationTreeService.treeNode; 
  }
}
