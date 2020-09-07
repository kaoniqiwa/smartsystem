import { Camera } from "../../../../../data-core/model/aiop/camera";
import { TreeNode,FlatNode } from "../../../../../shared-module/custom-tree/custom-tree";
 
export class RegionCamera {

    dataSource = new Array<TreeNode>();
    readonly treeTypeTage = '_camera';
    tagCameraId = "";
    cameraAIModelCopyToFn: (tagCameraId: string, targetCameraId: string[]) => Promise<boolean>;
    loadRegionCameraTree(cameras: Camera[], treeNode: TreeNode) {

        treeNode.children = treeNode.children || new Array<TreeNode>();
        cameras.map(x => {
            const node_ = new TreeNode();
            node_.name = x.Name;
            node_.checked = false;
            node_.iconClass='howell-icon-video';
            node_.id = x.Id + this.treeTypeTage;
            treeNode.children.push(node_);
        });

    }

    cameraAIModelCopyTo(allCameraNodes: FlatNode[],callBack:()=>void) {
        const targetCameraIds = new Array<string>();
         
        allCameraNodes.filter(c => c.checked && c.id.indexOf(this.treeTypeTage) > -1).map(x => {
           
            const cameraId = x.id.replace(this.treeTypeTage, '');
            if (cameraId != this.tagCameraId)
                targetCameraIds.push(cameraId);
        });
       
        if(this.tagCameraId&&targetCameraIds.length)
           {
               const success = this.cameraAIModelCopyToFn(this.tagCameraId,targetCameraIds);
               if(success)callBack();
           } 
    }

}