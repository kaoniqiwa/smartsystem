import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { CustomTreeComponent } from "../../../shared-module/custom-tree/custom-tree.component";
import { StationTreeService } from "./business/garbage-station-tree";
import { DivisionTreeSerevice } from "./business/division-tree.service";
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
import { DivisionType } from "src/app/data-core/model/enum";
@Component({
  selector: "hw-division-tree",
  templateUrl: "./division-tree.component.html",
  providers: [StationTreeService, DivisionTreeSerevice],
})
export class DivisionTreeComponent implements OnInit {
  @ViewChild("garbageStationTree")
  garbageStationTree: CustomTreeComponent;

  @Input()
  onlyDivisionNode = true;

  @Input()
  treeHeight = "calc(100% - 20px - 44px)";

  @Input()
  selectedItemFn: (
    item: FlatNode<Division | GarbageStation>,
    lastNode: boolean
  ) => void;

  @Input()
  GarbageStationRightButtons: (data: GarbageStation) => RightButton[];
  @Input()
  DivisionRightButtons: (data: Division) => RightButton[];

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
  itemExpandClickedEvent: EventEmitter<FlatNode<
    Division | GarbageStation
  > | null> = new EventEmitter();

  @Output()
  TreeNodeLoadedEvent: EventEmitter<TreeNode<GarbageStation>[]> =
    new EventEmitter();

  @Output()
  PanelClickedEvent: EventEmitter<void> = new EventEmitter();

  @Input()
  treeListMode = TreeListMode.rightBtn;

  /**
   * pmx 2021-08-18
   */

  // 保持选中状态
  @Input() holdStatus: boolean = true;

  @Input() cancleWhenCollapse: boolean = false;

  @Output() itemChange = new EventEmitter<FlatNode | null>();

  searctText: string = "";

  divisions: Division[] = [];

  private _nodeIconType = new Map([
    [DivisionType.City, "howell-icon-earth"],
    [DivisionType.County, "howell-icon-map5"],
    [DivisionType.Committees, "howell-icon-map5"],
  ]);
  // 抛给 division-manage-tree
  @Output() searchChange = new EventEmitter<string>();

  constructor(
    private stationTreeService: StationTreeService,
    public dataService: DivisionTreeSerevice,
    private _divisionTreeService: DivisionTreeSerevice
  ) {}

  async ngOnInit() {
    debugger;
    this.divisions = await this._divisionTreeService.requestDivision();
    console.log("区划信息", this.divisions);

    this.dataService.divisions = this.divisions;

    const ancestorDivision = this.divisions.filter(
      (x) => x.DivisionType == DivisionType.City
    );

    // 保存区划数据
    const nodes = this.stationTreeService.convertTreeNode(
      this.divisions,
      this.DivisionRightButtons
    );
    this.stationTreeService.dataSource = nodes;

    // 如果要显示厢房，append厢房数据
    if (!this.onlyDivisionNode) {
      for (let i = 0; i < ancestorDivision.length; i++) {
        const element = ancestorDivision[i];
        let stations = await this._divisionTreeService.requestGarbageStation(
          element.Id
        );
        this.stationTreeService.appendGarbageStationModel(
          stations,
          this.GarbageStationRightButtons
        );
      }
    }

    this.stationTreeService.loadStationTree();
    this.TreeNodeLoadedEvent.emit(this.stationTreeService.treeNode);
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

  onPanelClicked() {
    if (this.PanelClickedEvent) {
      this.PanelClickedEvent.emit();
    }
  }

  itemExpandClicked(node: FlatNode<Division | GarbageStation> | null) {
    this.itemExpandClickedEvent.emit(node);
  }

  itemChangeHandler(node: FlatNode | null) {
    this.itemChange.emit(node);
  }
  /**
   *  pmx 2021-08-18
   */
  searchHandler(searctText: string) {
    debugger;
    console.log(searctText);
    this.searctText = searctText;
    const nodeType = this.onlyDivisionNode
      ? NodeTypeEnum.map
      : NodeTypeEnum.station;
    const dataSource = this.stationTreeService.filterNodes(
      this.searctText,
      nodeType
    );
    this.stationTreeService.treeNode = dataSource;
    this.garbageStationTree.clearNestedNode();
    this.garbageStationTree.dataSource.data = dataSource;

    if (searctText == "") this.garbageStationTree.treeControl.collapseAll();
    else this.garbageStationTree.treeControl.expandAll();

    this.searchChange.emit(searctText);
  }

  /**
   * 添加新区划
   * @param node
   * @param division
   */
  addItem(node: FlatNode, division: Division) {
    // 更新本地数据
    this.stationTreeService.appendDivisionModel([division]);

    // 修改树
    let parentTreeNode = this.garbageStationTree.flatToTree(node);
    let treeNode = new TreeNode();
    treeNode.name = division.Name;
    treeNode.checked = false;
    treeNode.id = division.Id;
    treeNode.data = division;
    treeNode.iconClass = this._nodeIconType.get(division.DivisionType);
    treeNode.parent = parentTreeNode ? parentTreeNode : null;

    this.garbageStationTree.addItem(node, treeNode);
  }
  /**
   *  删除区划
   * @param node
   * @param division
   */
  deleteItem(node: FlatNode, division: Division) {
    this.stationTreeService.deleteDivisionModel([division]);

    // 修改树
    this.garbageStationTree.delItem(node);
  }
  /**
   *  编辑区划
   * @param node
   * @param division
   */
  editItem(node: FlatNode, division: Division) {
    console.log(node, division);

    this.stationTreeService.editDivisionModel([division]);
    // 修改树
    this.garbageStationTree.editNode(node, division.Name, division);
  }
}
