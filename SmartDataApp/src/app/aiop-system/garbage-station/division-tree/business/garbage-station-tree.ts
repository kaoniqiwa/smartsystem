import {
  IIsRoot,
  NodeTypeEnum,
  TreeService,
} from "../../../common/tree.service";
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
    getBtns?: (data) => RightButton[],
    isRoot?: IIsRoot
  ) {
    let result = this.convertTreeNode(models, getBtns, isRoot);
    this.dataSource = [...this.dataSource, ...result];
  }

  appendDivisionModel(
    models: Division[],
    getBtns?: (data) => RightButton[],
    isRoot?: IIsRoot
  ) {
    this.dataSource = [
      ...this.dataSource,
      ...this.convertTreeNode(models, getBtns, isRoot),
    ];
  }
  deleteDivisionModel(models: Division[]) {
    models.forEach((division) => {
      let index = this.dataSource.findIndex((dataTree) => {
        return dataTree.id == division.Id;
      });
      if (index > -1) {
        this.dataSource.splice(index, 1);
      }
    });
  }
  editDivisionModel(models: Division[]) {
    // console.log(this.dataSource);
    models.forEach((division) => {
      let dataTree = this.dataSource.find(
        (dataTree) => dataTree.id == division.Id
      );
      if (dataTree) {
        dataTree.name = division.Name;
        dataTree.data = division;
      }
    });
  }

  appendCityDivisionModel(
    models: Division[],
    getBtns?: (data) => RightButton[],
    isRoot?: IIsRoot
  ) {
    this.dataSource = [
      ...this.dataSource,
      ...this.convertTreeNode(models, getBtns, isRoot),
    ];
  }

  loadStationTree(root: boolean = false) {
    this.treeNode = this.loadTree(this.dataSource, root);
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
