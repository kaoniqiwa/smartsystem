import { Type } from "@angular/compiler";
import { Injectable } from "@angular/core";
import { AiopCamera } from "../../data-core/model/aiop/camera";
import { Region } from "../../data-core/model/aiop/region";
import { DivisionType } from "../../data-core/model/enum";
import { Division } from "../../data-core/model/waste-regulation/division";
import { GarbageStation } from "../../data-core/model/waste-regulation/garbage-station";
import { GarbageStationType } from "../../data-core/model/waste-regulation/garbage-station-type";
import { ListAttribute } from "../../common/tool/table-form-helper";
import {
  TreeNode,
  RightButton,
} from "../../shared-module/custom-tree/custom-tree";

@Injectable()
export class TreeService extends ListAttribute {
  public dataSource = new Array<
    DataTreeNode<
      Division | Region | GarbageStation | GarbageStationType | AiopCamera
    >
  >();

  nodeIconType = new Map<number, string>();
  constructor() {
    super();
    this.nodeIconType.set(1, "howell-icon-earth");
    this.nodeIconType.set(2, "howell-icon-map5");
    this.nodeIconType.set(3, "howell-icon-video");
    this.nodeIconType.set(4, "howell-icon-garbage");
  }

  private convertTreeNodeByGarbageStation<T extends GarbageStation>(
    item: T,
    isRoot: boolean
  ): DataTreeNode<T> {
    const node = new DataTreeNode<T>();
    node.id = item.Id;
    node.name = item.Name;
    node.type = isRoot ? NodeTypeEnum.root : NodeTypeEnum.station;
    node.parentId = item.DivisionId;
    node.isLeaf = true;
    node.data = item;
    return node;
  }

  private convertTreeNodeByDivision<T extends Division>(
    item: T,
    isRoot: boolean
  ): DataTreeNode<T> {
    const node = new DataTreeNode<T>();
    node.id = item.Id;
    node.name = item.Name;
    node.parentId = item.ParentId;

    node.type = isRoot
      ? NodeTypeEnum.root
      : this.convertToNodeType(item.DivisionType);
    node.data = item;
    return node;
  }
  private convertTreeNodeByRegion<T extends Region>(
    item: T,
    isRoot: boolean
  ): DataTreeNode<T> {
    const node = new DataTreeNode<T>();
    node.id = item.Id;
    node.name = item.Name;
    node.parentId = item.ParentId;
    node.isLeaf = item.IsLeaf;
    node.type = isRoot
      ? NodeTypeEnum.root
      : item.IsLeaf
      ? NodeTypeEnum.map
      : NodeTypeEnum.root;
    node.data = item;
    return node;
  }
  private convertTreeNodeByGarbageStationType<T extends GarbageStationType>(
    item: T,
    isRoot: boolean
  ) {
    const node = new DataTreeNode<T>();
    node.id = item.Name;
    node.name = item.Name;
    node.isLeaf = true;
    node.type = isRoot ? NodeTypeEnum.root : NodeTypeEnum.map;
    node.data = item;
    return node;
  }
  private converTreeNodeByCamera<T extends AiopCamera>(
    item: T,
    isRoot: boolean
  ) {
    const node = new DataTreeNode<T>();
    node.id = item.Id;
    node.name = item.Name;
    node.parentId = item.RegionId;
    node.type = isRoot ? NodeTypeEnum.root : NodeTypeEnum.camera;
    node.isLeaf = true;
    node.data = item;

    return node;
  }

  convertToNodeType(type: DivisionType) {
    return type > 2 ? NodeTypeEnum.map : NodeTypeEnum.root;
  }

  convertTreeNode<
    T extends
      | Division
      | Region
      | GarbageStation
      | GarbageStationType
      | AiopCamera
  >(
    array: Array<T>,
    getBtns?: (data: T) => RightButton<T>[],
    isRoot: boolean = false
  ) {
    const nodes = new Array<DataTreeNode<T>>();

    for (const item of array) {
      let node: DataTreeNode<T>;
      if (item instanceof Division) {
        node = this.convertTreeNodeByDivision(item, isRoot);
      } else if (item instanceof Region) {
        node = this.convertTreeNodeByRegion(item, isRoot);
      } else if (item instanceof GarbageStation) {
        node = this.convertTreeNodeByGarbageStation(item, isRoot);
      } else if (item instanceof GarbageStationType) {
        node = this.convertTreeNodeByGarbageStationType(item, isRoot);
      } else if (item instanceof AiopCamera) {
        node = this.converTreeNodeByCamera(item, isRoot);
      } else {
      }
      if (getBtns) {
        node.buttons = getBtns(node.data);
        if (node.buttons) {
          for (let i = 0; i < node.buttons.length; i++) {
            node.buttons[i].data = node.data;
          }
        }
      }
      nodes.push(node);
    }
    return nodes;
  }

  loadTree(items: DataTreeNode[]) {
    const dataSource = new Array<TreeNode>();
    const addItems = (node: TreeNode, items: DataTreeNode[]) => {
      for (const item of items) {
        if (node.id == item.parentId) {
          const node_ = new TreeNode();
          node_.name = item.name;
          node_.checked = false;
          node_.id = item.id;
          node_.data = item.data;
          node_.iconClass = this.nodeIconType.get(item.type);
          node_.rightClassBtn =
            item.type == NodeTypeEnum.camera
              ? [new RightButton("howell-icon-Link", "1")]
              : [];
          if (item.buttons && item.buttons.length > 0) {
            node_.rightClassBtn = item.buttons;
          }
          node_.parent = node;
          node.children = node.children || new Array<TreeNode>();
          node.children.push(node_);
          addItems(node_, items);
        }
      }
    };
    for (const item of items) {
      if ((!item.parentId || item.type == NodeTypeEnum.root) && item.type) {
        const node = new TreeNode();
        node.data = item.data;
        node.name = item.name;
        node.checked = false;
        node.rightClassBtn =
          item.type == NodeTypeEnum.camera
            ? [new RightButton("howell-icon-Link", "1")]
            : [];
        if (item.buttons && item.buttons.length > 0) {
          node.rightClassBtn = item.buttons;
        }
        node.id = item.id;
        node.iconClass = this.nodeIconType.get(item.type);
        dataSource.push(node);
        addItems(node, items);
      }
    }

    return dataSource;
  }

  allLastChilds(treeNode: TreeNode[]) {
    var lastchildren = new Array<TreeNode>();
    const forxh = (treeNodes: TreeNode[]) => {
      for (var i = 0; i < treeNodes.length; i++) {
        var chlist = treeNodes[i];
        if (chlist.children && chlist.children.length > 0)
          forxh(chlist.children);
        else lastchildren.push(chlist);
      }
    };
    forxh(treeNode);
    return lastchildren;
  }

  filterNodes(text: string, nodeType: NodeTypeEnum) {
    let filterList = this.dataSource.filter(
      (x) => x.name.indexOf(text) > -1 && x.parentId //&& x.type == nodeType
    );

    // filterList.forEach((x) => {
    //   let children = this.dataSource.filter((y) => y.parentId == x.id);
    //   filterList = [...filterList, ...children];
    // });

    let list = new Array<DataTreeNode>();
    const findParent = (item: DataTreeNode) => {
      /**去除重复 */
      const find = this.dataSource.find((x) => x.id == item.parentId);
      if (find && find.parentId) {
        const f = filterList.find((g) => g.id == find.id);
        if (f == null) {
          const index = list.findIndex((c) => c.id == find.id);
          if (index == -1) list.push(find);
          findParent(find);
        }
      }
    };
    filterList.map((x) => findParent(x));

    const parentList = this.dataSource.filter((x) => !x.parentId);
    return this.loadTree([...filterList, ...parentList, ...list]);
  }

  noChildNodes(id: string, len: number) {
    return this.dataSource.filter((x) => x.parentId == id).length == len;
  }
}

export enum NodeTypeEnum {
  root = 1,
  map = 2,
  camera = 3,
  station = 4,
  city = 5,
}

export class DataTreeNode<T = any> {
  id: string;
  name: string;
  parentId: string;
  isLeaf: boolean;
  type: NodeTypeEnum;
  buttons: RightButton<T>[];
  data: T;
  show? = true;
  parent?: DataTreeNode<T>;
}

// export class DivisionMini extends DataTreeNode<Division> {
//   divisionType: number;
// }

// export class GarbageStationTypeMini extends DataTreeNode<GarbageStationType> {}

// export class RegionMini extends DataTreeNode<Region> {
//   regionType: number;
// }

// export class GarbageStationMini {
//   id: string;
//   name: string;
//   /**
//    * 垃圾房类型(可选)，默认：0
//    * 暂时无效，之后会用于高度，形状，室内、室外等区分
//    */
//   stationType: number;
//   /**所属区划ID(可选) */
//   divisionId: string;
// }

// export class CameraMini {
//   id: string;
//   name: string;
//   regionId: string;
// }

export class TreeNodeDatas<T> {
  items: T[];
}

// export class Divisions {
//   items: DivisionMini[];
// }

// export class Regions {
//   items: RegionMini[];
// }

// export class GarbageStations {
//   items: GarbageStationMini[];
// }

// export class Cameras {
//   items: CameraMini[];
// }

// export class GarbageStationTypes {
//   items: GarbageStationTypeMini[];
// }
