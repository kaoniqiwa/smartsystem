
import { TreeNode, FlatNode } from "../../../../../shared-module/custom-tree/custom-tree";
import { Region } from "../../../../../data-core/model/region";
import { RegionTreeService } from '../../../../common/region-tree.service'
export class RegionTree extends RegionTreeService {
    treeNodeSource = new Array<TreeNode>();
    selectedItemFn = (i: FlatNode) => {
        this.selectedNode_ = i;
        if (this.loadRegionCameras) this.loadRegionCameras(i.id);
    }

    loadRegionCameras: (id: string) => void;


    private selectedNode_: FlatNode;

    get selectedNode() {
        return this.selectedNode_;
    }

    clearSelectedNode() {
        this.selectedNode_ = null;
    }

    get selectedNodeId() {
        return this.selectedNode_ ? this.selectedNode_.id : '';
    }


    get isLastNode() {
        var is = false;
        const nodes = this.allLastChilds(this.treeNodeSource);
        for (const n of nodes)
            if (n.id == this.selectedNodeId)
                is = true;
        return is;
    }
}