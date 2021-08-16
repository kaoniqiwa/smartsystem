import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { CustomTreeComponent } from "../../../shared-module/custom-tree/custom-tree.component";
import { StationTreeService } from "./business/garbage-station-tree";
import { DataService } from "./business/data-service";
import { NodeTypeEnum } from "../../common/tree.service";
import {
  FlatNode,
  TreeListMode,
  RightBtn,
  RightButton,
  TreeNode,
  RightButtonArgs,
} from "../../../shared-module/custom-tree/custom-tree";
import { Output, EventEmitter } from "@angular/core";
import { Division } from "../../../data-core/model/waste-regulation/division";
import { GarbageStation } from "../../../data-core/model/waste-regulation/garbage-station";
@Component({
  selector: "hw-division-station-tree",
  templateUrl: "./division-station-tree.component.html",
  providers: [StationTreeService, DataService],
})
export class DivisionStationTreeComponent implements OnInit {
  @ViewChild("garbageStationTree")
  garbageStationTree: CustomTreeComponent;

  @Input()
  onlyDivisionNode = false;

  @Input()
  treeHeight = "calc(100% - 20px)";

  @Input()
  selectedItemFn: (
    item: FlatNode<Division | GarbageStation>,
    lastNode: boolean
  ) => void;

  @Input()
  GarbageStationRightButtons: (data: GarbageStation) => RightButton[];
  @Input()
  DivisionRightButtons: (data: Division) => RightButton[];

  /***pmx start ***/
  // 保持选中状态
  @Input() holdStatus: boolean = true;

  @Output() itemChange = new EventEmitter<FlatNode>();

  /***pmx end ***/

  selectedItemClick = (item: FlatNode<Division | GarbageStation>) => {
    if (this.selectedItemFn) {
      this.selectedItemFn(item, this.stationTreeService.isLastNode(item.id));
    }
  };

  @Output()
  itemRightButtonClickedEvent: EventEmitter<RightButtonArgs> = new EventEmitter();

  rightButtonClick(args: RightButtonArgs) {
    if (this.itemRightButtonClickedEvent) {
      this.itemRightButtonClickedEvent.emit(args);
    }
  }

  @Output()
  itemExpandClickedEvent: EventEmitter<FlatNode<Division | GarbageStation>> =
    new EventEmitter();

  itemExpandClicked(node: FlatNode<Division | GarbageStation>) {
    if (this.itemExpandClickedEvent) {
      this.itemExpandClickedEvent.emit(node);
    }
  }

  @Output()
  TreeNodeLoadedEvent: EventEmitter<TreeNode<GarbageStation>[]> =
    new EventEmitter();

  @Output()
  PanelClickedEvent: EventEmitter<void> = new EventEmitter();

  @Input()
  treeListMode = TreeListMode.rightBtn;

  searchTree = (text: string) => {
    const nodeType = this.onlyDivisionNode
      ? NodeTypeEnum.map
      : NodeTypeEnum.station;
    const dataSource = this.stationTreeService.filterNodes(text, nodeType);
    this.garbageStationTree.clearNestedNode();
    this.garbageStationTree.dataSource.data = dataSource;
    this.garbageStationTree.treeControl.expandAll();
  };
  constructor(
    private stationTreeService: StationTreeService,
    public dataService: DataService
  ) {}

  async ngOnInit() {
    this.dataService.divisions = await this.dataService.requestDivision();
    const ancestorDivision = this.dataService.divisions.filter(
      (x) => !x.ParentId
    );

    this.stationTreeService.appendDivisionModel(
      this.dataService.divisions,
      this.DivisionRightButtons
    );
    if (this.onlyDivisionNode) {
      const nodes = this.stationTreeService.convertTreeNode(
        this.dataService.divisions
      );
      this.stationTreeService.dataSource = nodes;
    } else {
      if (ancestorDivision) {
        for (let i = 0; i < ancestorDivision.length; i++) {
          const element = ancestorDivision[i];
          let stations = await this.dataService.requestGarbageStation(
            element.Id
          );
          this.stationTreeService.appendGarbageStationModel(
            stations,
            this.GarbageStationRightButtons
          );
        }
      }
    }

    this.stationTreeService.loadStationTree();
    if (this.TreeNodeLoadedEvent) {
      this.TreeNodeLoadedEvent.emit(this.stationTreeService.treeNode);
    }
  }

  findNode(id: string) {
    for (const key of this.garbageStationTree.flatNodeMap.keys()) {
      if (key.id === id) {
        return key;
      }
    }
  }

  setNode(id: string, fn: (node: FlatNode<Division | GarbageStation>) => void) {
    for (const key of this.garbageStationTree.flatNodeMap.keys()) {
      if (key.id === id) {
        fn(key);
        return;
      }
    }
  }

  findBindNode(iconClass: string) {
    const nodes = new Array<FlatNode<Division | GarbageStation>>();
    for (const key of this.garbageStationTree.flatNodeMap.keys()) {
      if (key.iconClass === iconClass && key.rightClassBtn.length === 0) {
        nodes.push(key);
      }
    }
    return nodes;
  }

  addNodeRightBtn(item: {
    iconClass?: string;
    id?: string;
    btns: RightButton<Division | GarbageStation>[];
  }) {
    if (this.treeListMode === TreeListMode.rightBtn && item) {
      if (item.id) {
        let n = this.findNode(item.id);
        n.rightClassBtn = item.btns;
      }
      if (item.iconClass) {
        const nodes = this.findBindNode(item.iconClass);
        for (const n of nodes) {
          n.rightClassBtn = item.btns;
        }
      }
    }
  }
  // addItems(divisions: Division[]) {
  //   this.stationTreeService.appendDivisionModel(divisions);
  //   this.stationTreeService.loadStationTree();
  // }

  onPanelClicked() {
    if (this.PanelClickedEvent) {
      this.PanelClickedEvent.emit();
    }
  }
  itemChangeHandler(node: FlatNode) {
    this.itemChange.emit(node);
  }
}
