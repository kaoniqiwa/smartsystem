import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { CustomTreeComponent } from "../../../custom-tree/custom-tree.component";
import { DataService } from "../../../../aiop-system/garbage-station/division-station-tree/business/data-service";
import { StationTreeService } from "../../../../aiop-system/garbage-station/division-station-tree/business/garbage-station-tree";
import { NodeTypeEnum } from "../../../../aiop-system/common/tree.service";
import { FlatNode, TreeListMode } from "../../../custom-tree/custom-tree";
import { domClickFn } from "../../../../common/tool/jquery-help/jquery-help";
import { GarbageStationDao } from "../../../../data-core/dao/garbage-station-dao";
import { DivisionDao } from "../../../../data-core/dao/division-dao";
import { SessionUser } from "../../../../common/tool/session-user";
import { DivisionType } from "../../../../data-core/model/enum";
@Component({
  selector: "hw-tree-drop-list-v2",
  templateUrl: "./tree-drop-list-v2.component.html",
  styleUrls: ["./tree-drop-list-v2.component.styl"],
  providers: [StationTreeService, DataService, GarbageStationDao, DivisionDao],
})
export class TreeDropListV2Component implements OnInit {
  showBody = false;

  selectedText: { id: string; text: string };

  @ViewChild("garbageStationTree")
  garbageStationTree: CustomTreeComponent;

  @Input()
  onlyDivisionNode = false;

  @Input() rightArrow = false;
  @Input() textLeft = true;
  @Input() textColor = "text-white";
  @Input() selectItemNodeMode = SelectItemNodeModeEnum.None;
  @Input() firstTitle = "";

  @Input()
  selectedItemFn: (item: { id: string; text: string }) => void;

  selectedItemClick = (item: FlatNode) => {
    const setText = (n: FlatNode) => {
      if (this.selectedText) {
        const d = this.findNode(this.selectedText.id),
          p = this.garbageStationTree.getParentNode(d);
        if (d) {
          d.checked = false;
          d.checkBoxState = null;
        }
        if (p) {
          p.checked = false;
          p.checkBoxState = null;
        }
      }
      if (item.checked)
        this.selectedText = {
          id: n.id,
          text: n.name,
        };
      else this.selectedText = null;
      this.showBody = false;
      this.selectedItemFn(this.selectedText);
    };
    if (
      (!this.onlyDivisionNode && item.iconClass == "howell-icon-garbage") ||
      (this.selectItemNodeMode == SelectItemNodeModeEnum.EndNode &&
        item.iconClass == "howell-icon-garbage")
    )
      setText(item);
    else if (this.onlyDivisionNode && item.iconClass == "howell-icon-map5")
      setText(item);
    else {
      item.checked = false;
      item.checkBoxState = null;
      this.garbageStationTree.sumChildChecked(item, item.checked);
    }
  };

  treeListMode = TreeListMode.checkedBox;

  searchTree = (text: string) => {
    const nodeType = this.onlyDivisionNode
      ? NodeTypeEnum.map
      : NodeTypeEnum.station;
    const dataSource = this.stationTreeService.filterNodes(text, nodeType);
    this.garbageStationTree.clearNestedNode();
    this.garbageStationTree.dataSource.data = dataSource;
    this.garbageStationTree.treeControl.expandAll();
  };

  user = new SessionUser();
  constructor(
    private stationTreeService: StationTreeService,
    private garbageStationDao: GarbageStationDao,
    private divisionDao: DivisionDao,
    public dataService: DataService
  ) {}

  findNode(id: string) {
    for (let key of this.garbageStationTree.flatNodeMap.keys())
      if (key.id == id) return key;
  }

  async ngOnInit() {
    domClickFn("body", () => {
      this.showBody = false;
    });
    this.reInit();
  }

  defaultItem(id: string, cb: (itemId: string) => void) {
    //console.log(this.stationTreeService.treeNode);
    if (id) this.garbageStationTree.defaultItem(id);
    else if (
      this.stationTreeService.treeNode &&
      this.stationTreeService.treeNode.length
    ) {
      if (this.onlyDivisionNode) {
        const division = this.dataService.divisions
          .filter((x) => x.DivisionType == DivisionType.Committees)
          .shift();
        this.garbageStationTree.defaultItem(division.Id);
        cb(division.Id);
      } else {
        if (this.dataService.garbageStations.length > 0) {
          this.garbageStationTree.defaultItem(
            this.dataService.garbageStations[0].Id
          );
          cb(this.dataService.garbageStations[0].Id);
        }
      }
    }
  }

  clearNestedNode() {
    this.garbageStationTree.clearNestedNode();
  }

  async reInit() {
    if (this.dataService.divisions.length == 0)
      this.dataService.divisions = await this.divisionDao.allDivisions();

    this.stationTreeService.appendDivisionModel(
      this.dataService.divisions.filter(
        (x) => x.DivisionType > DivisionType.City
      )
    );
    if (this.selectItemNodeMode == SelectItemNodeModeEnum.EndNode) {
      const nodes = this.stationTreeService.convertTreeNode(
        this.dataService.divisions
      );
      this.stationTreeService.dataSource = nodes;
      if (this.dataService.garbageStations.length == 0)
        this.dataService.garbageStations =
          await this.garbageStationDao.allGarbageStations();
      this.stationTreeService.appendGarbageStationModel(
        this.dataService.garbageStations
      );
    } else {
      //const ancestorDivision = this.dataService.divisions.find(x => x.DivisionType == DivisionType.County);
      if (this.onlyDivisionNode) {
        const nodes = this.stationTreeService.convertTreeNode(
          this.dataService.divisions
        );
        this.stationTreeService.dataSource = nodes;
      } else {
        // if (ancestorDivision && this.dataService.garbageStations.length == 0)
        //   this.dataService.garbageStations = await this.garbageStationDao.requestGarbageStation(ancestorDivision.Id);
        this.dataService.garbageStations =
          await this.garbageStationDao.allGarbageStations();
        this.stationTreeService.appendGarbageStationModel(
          this.dataService.garbageStations
        );
      }
    }
    this.stationTreeService.loadStationTree();
    this.garbageStationTree.dataSource.data = this.stationTreeService.treeNode;
    this.userDefaultLike();
  }

  userDefaultLike() {
    if (
      this.onlyDivisionNode &&
      this.user.divisions.length == 0 &&
      this.dataService.divisions.length
    ) {
      const division = this.dataService.divisions.find(
        (x) => x.DivisionType == DivisionType.Committees
      );
      this.user.divisions = [division.Id];
    } else if (
      this.onlyDivisionNode == false &&
      this.user.stations.length == 0 &&
      this.dataService.garbageStations.length
    ) {
      const station = this.dataService.garbageStations[0];
      this.user.stations = [station.Id];
    }
  }
}

export enum SelectItemNodeModeEnum {
  None,
  /**最后节点 */
  EndNode,
}
