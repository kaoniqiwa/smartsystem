import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { CustomTreeComponent } from "../../../../shared-module/custom-tree/custom-tree.component";
import "../../../../common/string/hw-string";
import {
  TreeListMode,
  FlatNode,
  TreeNode,
} from "../../../../shared-module/custom-tree/custom-tree";
import { CameraTableService } from "../camera-mgr/business/camera-table.service";
import { RegionTreeService } from "../../../common/region-tree.service";
import { MessageBar } from "../../../../common/tool/message-bar";
@Component({
  selector: "camera-region-move",
  templateUrl: "./camera-region-move.component.html",
  styleUrls: ["./camera-region-move.component.styl"],
})
export class CameraRegionMoveComponent implements OnInit {
  @ViewChild("tree")
  tree: CustomTreeComponent;

  @Input() cameraIds: string;

  @Input() saveFn: () => void;

  @Input()
  cancelFn: () => void;
  @Input()
  tableService: CameraTableService;
  @Input()
  treeService: RegionTreeService;
  treeMode = TreeListMode.checkedBox;
  treeDataSource: TreeNode[] = new Array();
  searchTree = (text: string) => {
    const dataSource = this.tableService.regionTree.filterNodes(text);
    if (this.tableService.regionTree.selectedNodeId) {
      dataSource.push(
        this.treeService.singleNode("未分配摄像机", "howell-icon-video")
      );
      dataSource.reverse();
    }
    this.tree.clearNestedNode();
    this.tree.dataSource.data = dataSource;
    this.tree.treeControl.expandAll();
  };
  selectedNode: FlatNode;
  selectedItemFn = (i: FlatNode) => {
    this.selectedNode = i;
  };
  constructor() {}

  get subTitle() {
    var str = "";
    const cameraNames = new Array<string>();
    for (const c of this.cameraIds) {
      const item = this.tableService.findCamera(c);
      cameraNames.push(item.Name);
    }
    str = `摄像机:(${cameraNames.length}) ${cameraNames.join(",")}`;
    return str;
  }

  async ngOnInit() {
    /**区域树结构 */
    const dataSource = this.treeService.loadTree(this.treeService.dataSource);
    if (this.tableService.regionTree.selectedNodeId) {
      dataSource.push(
        this.treeService.singleNode("未分配摄像机", "howell-icon-video")
      );
      dataSource.reverse();
    }
    this.treeDataSource = dataSource;
    this.tree.dataSource.data = dataSource;
  }

  async onSubmit() {
    if (
      (this.selectedNode && this.isLastNode) ||
      (this.selectedNode && this.selectedNode.id == "")
    ) {
      for (const c of this.cameraIds) {
        const item = this.tableService.findCamera(c);
        item.RegionId = this.selectedNode.id || null;
        await this.tableService.editCamera(item);
      }

      this.onCancel();
      MessageBar.response_success();
      this.saveFn();
    }
  }
  onCancel() {
    if (this.cancelFn) this.cancelFn();
  }
  get isLastNode() {
    var is = false;
    const nodes = this.tableService.regionTree.allLastChilds(
      this.treeDataSource
    );
    for (const n of nodes) {
      if (n.id == this.selectedNode.id) {
        is = true;
        break;
      }
    }
    return is;
  }
}
