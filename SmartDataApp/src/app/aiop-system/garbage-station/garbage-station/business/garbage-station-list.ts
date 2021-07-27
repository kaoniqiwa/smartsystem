import { DataService } from "./data.service";
import { DataTreeNode, TreeService } from "../../../common/tree.service";
import { GarbageStationTypeMini } from "../../../common/tree.service";
import { GarbageStationType } from "../../../../data-core/model/waste-regulation/garbage-station-type";
import { MessageBar } from "../../../../common/tool/message-bar";
export class GarbageStationList extends TreeService {
  selectedNode: DataTreeNode;
  subTitle = "创建垃圾厢房";
  msg = new MessageBar();
  firstWindowNumText = 4;
  firstNameText = "";
  constructor(private dataService: DataService) {
    super();
  }

  async loadList() {
    await this.getGarbageStationType();
    this.getTreeNode();
    this.firstNode();
  }

  getTreeNode() {
    const nodes = this.convertTreeNode(this.dataService.types);
    for (var n of nodes) {
      (n as StationTypeTree).show = true;
    }
    this.dataSource = nodes;
  }

  firstNode() {
    /**初始化 第一 */
    if (this.dataSource.length) {
      this.selectedNode = this.dataSource[0];
      this.subTitle = this.dataSource[0].name;
      this.firstNameText = this.dataSource[0].name;
      this.firstWindowNumText = this.dataService.types[0].Windows.length;
    }
  }

  selectNode(node: DataTreeNode) {
    this.selectedNode = node;
    this.subTitle = node.name;
    this.firstNameText = node.name;
    this.firstWindowNumText = this.dataService.types.find(
      (x) => x.Type + "" == node.id
    ).Windows.length;
  }

  clearFirsNode() {
    this.selectedNode = null;
    this.subTitle = "创建垃圾厢房";
    this.firstNameText = "";
    this.firstWindowNumText = 4;
  }

  addTreeNode(item: GarbageStationType) {
    const nodes = this.convertTreeNode([item]);
    for (var n of nodes) (n as StationTypeTree).show = true;
    this.dataSource = [...this.dataSource, ...nodes];
  }

  async delTreeNode(id: string) {
    const success = await this.dataService.delGarbageStationType(id);
    if (success) {
      this.msg.response_success();
      const index = this.dataSource.findIndex((x) => x.id == id);
      this.dataSource.splice(index, 1);
      if (this.dataSource.length) this.selectedNode = this.dataSource[0];
    }
  }

  async getGarbageStationType() {
    const types = await this.dataService.requestGarbageStationType();

    this.dataService.types = types;
  }
}

export class StationTypeTree extends DataTreeNode<GarbageStationType> {
  show = true;
}
