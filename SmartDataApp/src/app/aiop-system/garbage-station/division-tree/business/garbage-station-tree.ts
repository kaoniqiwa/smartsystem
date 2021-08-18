import { TreeService } from "../../../common/tree.service";
import { GarbageStation } from "../../../../data-core/model/waste-regulation/garbage-station";
import { Division } from "../../../../data-core/model/waste-regulation/division";
import {
  RightButton,
  TreeNode,
} from "../../../../shared-module/custom-tree/custom-tree";
import { Injectable } from "@angular/core";

@Injectable()
export class StationTreeService extends TreeService {
  treeNode: TreeNode<GarbageStation>[] = new Array();

  constructor() {
    super();
  }

  appendGarbageStationModel(
    models: GarbageStation[],
    getBtns?: (data) => RightButton[]
  ) {
    let result = this.convertTreeNode(models, getBtns);
    this.dataSource = [...this.dataSource, ...result];
  }

  appendDivisionModel(models: Division[], getBtns?: (data) => RightButton[]) {
    this.dataSource = [
      ...this.dataSource,
      ...this.convertTreeNode(models, getBtns),
    ];
  }

  appendCityDivisionModel(
    models: Division[],
    getBtns?: (data) => RightButton[]
  ) {
    this.dataSource = [
      ...this.dataSource,
      ...this.convertTreeNode(models, getBtns),
    ];
  }

  loadStationTree() {
    this.treeNode = this.loadTree(this.dataSource);
  }

  isLastNode(nodeId: string) {
    const nodes = this.allLastChilds(this.treeNode);
    for (const n of nodes) if (n.id == nodeId) return true;
    return false;
  }
}

// export class GarbageStationDao {
//   items: GarbageStation[];
// }

// export class RegionDao {
//   items: Division[];
// }

// export class CityRegionDao {
//   items: Division[];
// }
