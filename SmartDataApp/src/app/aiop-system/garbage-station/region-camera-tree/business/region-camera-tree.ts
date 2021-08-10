import { TreeService } from "../../../common/tree.service";
import { Region } from "../../../../data-core/model/aiop/region";
import { AiopCamera } from "../../../../data-core/model/aiop/camera";
import {
  TreeListMode,
  TreeNode,
} from "../../../../shared-module/custom-tree/custom-tree";
export class RegionCameraTree extends TreeService {
  treeNode: TreeNode[] = new Array();

  regions = new Array<Region>();
  cameras = new Array<AiopCamera>();
  treeListMode = TreeListMode.rightBtn;
  constructor() {
    super();
  }

  set regionModel(models: Region[]) {
    const dao = new RegionDao();
    dao.items = models;
    this.convert(dao);
  }

  set cameraModel(models: AiopCamera[]) {
    const dao = new CameraDao();
    dao.items = models;
    this.convert(dao);
  }

  convertCameraTreeNode() {
    const nodeA = this.convertTreeNode(this.regions),
      nodeB = this.convertTreeNode(this.cameras);
    this.dataSource = [...nodeA, ...nodeB];
  }

  loadCameraTree() {
    this.treeNode = this.loadTree(this.dataSource);
  }

  convert<CameraDao>(input: CameraDao): void;
  convert<RegionDao>(input: RegionDao): void;
  convert(input: CameraDao | RegionDao) {
    if (input instanceof CameraDao) {
      for (const item of input.items) {
        this.cameras.push(item);
      }
    } else if (input instanceof RegionDao) {
      for (const item of input.items) {
        this.regions.push(item);
      }
    }
  }

  isLastNode(nodeId: string) {
    var is = false;
    const nodes = this.allLastChilds(this.treeNode);
    for (const n of nodes) if (n.id == nodeId) is = true;
    return is;
  }
}

export class CameraDao {
  items: AiopCamera[];
}

export class RegionDao {
  items: Region[];
}
