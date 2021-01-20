import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { CustomTreeComponent } from "../../../custom-tree/custom-tree.component";
import { DataService } from "../../../../aiop-system/garbage-station/division-station-tree/business/data-service";
import { StationTreeService } from "../../../../aiop-system/garbage-station/division-station-tree/business/garbage-station-tree";
import { NodeTypeEnum } from '../../../../aiop-system/common/tree.service';
import { FlatNode, TreeListMode } from '../../../custom-tree/custom-tree';
import { domClickFn } from '../../../../common/tool/jquery-help/jquery-help';
import { DivisionTypeEnum } from "../../../../common/tool/enum-helper";
import { GarbageStationDao } from '../../../../data-core/dao/garbage-station-dao';
import { DivisionDao } from '../../../../data-core/dao/division-dao';
@Component({
  selector: 'hw-tree-drop-list-v2',
  templateUrl: './tree-drop-list-v2.component.html',
  styleUrls: ['./tree-drop-list-v2.component.styl'],
  providers: [StationTreeService, DataService, GarbageStationDao, DivisionDao]
})
export class TreeDropListV2Component implements OnInit {

  showBody = false;

  selectedText: { id: string, text: string };

  @ViewChild('garbageStationTree')
  garbageStationTree: CustomTreeComponent;

  @Input()
  onlyDivisionNode = false;

  @Input() rightArrow = false;

  @Input()
  selectedItemFn: (item:  { id: string, text: string }) => void;

  selectedItemClick = (item: FlatNode) => {
    const setText = (n: FlatNode) => {
      if (this.selectedText) {
        const d = this.findNode(this.selectedText.id), p = this.garbageStationTree.getParentNode(d);
        d.checked = false;
        d.checkBoxState = null;
        p.checked = false;
        p.checkBoxState = null;
      }
      if (item.checked)
        this.selectedText = {
          id: n.id,
          text: n.name
        }
      else this.selectedText = null;
      this.showBody = false;
      this.selectedItemFn(this.selectedText);
    }
    if (!this.onlyDivisionNode && item.iconClass == "howell-icon-garbage")
      setText(item);
    else if (this.onlyDivisionNode && item.iconClass == "howell-icon-map5") setText(item);
    else {
      item.checked = false;
      item.checkBoxState = null;
      this.garbageStationTree.sumChildChecked(item, item.checked);
    }
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

  clearNestedNode() {
    this.garbageStationTree.clearNestedNode();
  }

  async reInit() {
    if (this.dataService.divisions.length == 0)
      this.dataService.divisions = await this.divisionDao.allDivisions();
    const ancestorDivision = this.dataService.divisions.find(x =>x.DivisionType==DivisionTypeEnum.County);
    this.stationTreeService.divisions.items = new Array();
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
    this.stationTreeService.loadStationTree();
    this.garbageStationTree.dataSource.data = this.stationTreeService.treeNode;

  }

}