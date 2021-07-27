import { TreeService, NodeTypeEnum } from "../../../common/tree.service";
import { GarbageStation } from "../../../../data-core/model/waste-regulation/garbage-station";
import { Division } from "../../../../data-core/model/waste-regulation/division";
import {
  TreeListMode,
  TreeNode,
} from "../../../../shared-module/custom-tree/custom-tree";
import { Injectable } from "@angular/core";
import { Region } from "src/app/data-core/model/aiop/region";

@Injectable()
export class StationTreeService extends TreeService {
  treeNode: TreeNode<GarbageStation>[] = new Array();

  constructor() {
    super();
  }

  set garbageStationModel(models: GarbageStation[]) {
    this.dataSource = [...this.dataSource, ...this.convertTreeNode(models)];
  }

  set divisionModel(models: Division[]) {
    this.dataSource = [...this.dataSource, ...this.convertTreeNode(models)];
  }

  set cityDivisionModel(models: Division[]) {
    this.dataSource = [...this.dataSource, ...this.convertTreeNode(models)];
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
