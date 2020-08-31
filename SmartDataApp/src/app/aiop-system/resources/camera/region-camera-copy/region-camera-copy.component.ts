import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { CustomTreeComponent } from "../../../../shared-module/custom-tree/custom-tree.component";
import { CameraAIModelMgrService } from "../camera-aimodel-mgr/business/camera-aimodel-mgr.service";
import "../../../../common/string/hw-string";
import { TreeListMode, FlatNode } from '../../../../shared-module/custom-tree/custom-tree';
@Component({
  selector: 'region-camera-copy',
  templateUrl: './region-camera-copy.component.html',
  styleUrls: ['./region-camera-copy.component.styl'],
  providers: [CameraAIModelMgrService]
})
export class RegionCameraCopyComponent implements OnInit {
  @ViewChild('tree')
  tree: CustomTreeComponent;

  @Input()
  tagCameraId = "";
  @Input()
  cancelFn: () => void;
  treeMode = TreeListMode.checkedBox;

  searchTree = (text: string) => {
    const dataSource = this.mgrService.filterNodes(text);
    this.tree.clearNestedNode();
    this.tree.dataSource.data = dataSource;
    this.tree.defaultItem();
    this.tree.treeControl.expandAll();
  }
  constructor(private mgrService: CameraAIModelMgrService) {

  }

  async ngOnInit() {
    this.mgrService.regionCamera.tagCameraId = this.tagCameraId;
    /**获取区域 */
    await this.mgrService.getRegionData();
    /**区域树结构 */
    const treeNodes = this.mgrService.loadTree(this.mgrService.dataSource);
    /**区域树结构 所有最后子节点 */
    const allLastChilds = this.mgrService.allLastChilds(treeNodes);
    /**补上 最后子节点 摄像机元素*/
    for (let i = 0; i < allLastChilds.length; i++) {
      const cameras = await this.mgrService.requestRegionCamerasData(allLastChilds[i].id);
      this.mgrService.regionCamera.loadRegionCameraTree(cameras, allLastChilds[i]);
      if (allLastChilds.length - 1 == i) {
        this.mgrService.regionCamera.dataSource = treeNodes;
        this.tree.dataSource.data = treeNodes;
        // this.mgrService.regionCamera.cameraAIModelCopyTo();
      }
    }
    this.tree.treeControl.expandAll();

  }

  onSubmit() {
    const nodes = new Array<FlatNode>();
    for (let key of this.tree.flatNodeMap.keys()) {
      nodes.push(key);
    }
    this.mgrService.regionCamera.cameraAIModelCopyTo(nodes, () => {
      this.onCancel();
    });

  }
  onCancel() {
    if (this.cancelFn) this.cancelFn();
  }
}
