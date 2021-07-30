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

  appendGarbageStationModel(models: GarbageStation[], btns?: RightButton[]) {
    let result = this.convertTreeNode(models, btns);
    this.dataSource = [...this.dataSource, ...result];
  }

  appendDivisionModel(models: Division[], btns?: RightButton[]) {
    this.dataSource = [
      ...this.dataSource,
      ...this.convertTreeNode(models, btns),
    ];
  }

  appendCityDivisionModel(models: Division[], btns?: RightButton[]) {
    this.dataSource = [
      ...this.dataSource,
      ...this.convertTreeNode(models, btns),
    ];
  }

  loadStationTree() {
    this.treeNode = this.loadTree(this.dataSource);
  }

  isLastNode(nodeId: string) {
    var is = false;
    const nodes = this.allLastChilds(this.treeNode);
    for (const n of nodes) if (n.id == nodeId) is = true;
    return is;
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
