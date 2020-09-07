
import { TreeNode, FlatNode } from "../../../../shared-module/custom-tree/custom-tree";
import { Region } from "../../../../data-core/model/aiop/region";
import { FormStateEnum } from "../../../../common/tool/table-form-helper"; 
export class RegionTree {
    dataSource = new Array<TreeNode>();
    private editItem_: Region;
    private formTitle_ = '';
    selectedItemFn = (i: FlatNode) => {
        this.selectedNode_ = i;
        this.editItem = this.findRegion(i.id);
    }
    editNodeItem:(node:FlatNode,val:string)=>void;
    addTreeNode: (node: FlatNode, addNode: TreeNode,item:Region) => void;
    findRegion: (id: string) => Region;
    saveRegionForm = (success: boolean, item: Region, formState: FormStateEnum) => {
        if (formState == FormStateEnum.create && success) {
            const node = new TreeNode();
            node.checked = false;
            node.id = item.Id;
            node.name = item.Name;
            node.iconClass='howell-icon-map5';
            this.addTreeNode(this.selectedNode, node,item);
        }
        else if (formState == FormStateEnum.edit && success){
            this.editNodeItem(this.selectedNode,item.Name);
        }
    }
    
    cancelForm =()=>{
        this.editItem = this.findRegion(this.selectedNodeId);
    }
    filterNodes: (text: string) => TreeNode[];
    private selectedNode_: FlatNode;

    get editItem() {
        return this.editItem_;
    }

    set editItem(item: Region) {
        this.formTitle = '编辑 ' + item.Name;
        this.editItem_ = item;
    }

    set formTitle(title: string) {
        this.formTitle_ = title;
    }

    get formTitle() {
        return this.formTitle_;
    }

    get selectedNode() {
        return this.selectedNode_;
    }

    get delBtnState(){
        return this.selectedNode_&&this.selectedNode_.level !=0;
    }

    clearSelectedNode() {
        this.selectedNode_ = null;
    }

    get selectedNodeId() {
        return this.selectedNode_ ? this.selectedNode_.id : '';
    }

    addFormState() {
        this.formTitle = '添加' + this.formTitle.replace('编辑', '') + ' 下级区域';
        this.editItem_ = null;
    }


    loadTree(items: Region[]) {
        const addItems = (node: TreeNode, items: Region[]) => {
            for (const item of items) {
                if (node.id == item.ParentId) {
                    const node_ = new TreeNode();
                    node_.name = item.Name;
                    node_.checked = false;
                    node_.id = item.Id;
                    node_.iconClass='howell-icon-map5';
                    node.children = node.children || new Array<TreeNode>();
                    node.children.push(node_);
                    addItems(node_, items);
                }
            }
        }
        for (const item of items) {
            if (!item.ParentId) {
                const node = new TreeNode();
                node.name = item.Name;
                node.checked = false;
                node.id = item.Id;
                node.iconClass='howell-icon-earth';

                this.dataSource.push(node);
                addItems(node, items);
            }
        }        

    } 
}