import { Component, OnInit, ViewChild } from '@angular/core';
import { RegionMgrService } from "./business/region-mgr.service";
import { CustomTreeComponent } from "../../../shared-module/custom-tree/custom-tree.component";
import { TreeNode, FlatNode } from '../../../shared-module/custom-tree/custom-tree';
import { Region } from "../../../data-core/model/region";
@Component({
  selector: 'app-region-mgr',
  templateUrl: './region-mgr.component.html',
  styleUrls: ['./region-mgr.component.styl'],
  providers: [RegionMgrService]
})
export class RegionMgrComponent implements OnInit {
  @ViewChild('tree')
  tree: CustomTreeComponent;
  searchTree = (text: string) => {
    const dataSource = this.regionMgrService.regionTree.filterNodes(text);     
    this.tree.clearNestedNode();
    this.tree.dataSource.data = dataSource;
    this.tree.defaultItem(); 
  }
  constructor(private regionMgrService: RegionMgrService) { }

  resetTreeNodes(){
    this.tree.clearNestedNode();  
    this.regionMgrService.regionTree.dataSource.pop();
    this.regionMgrService.regionTree.loadTree(this.regionMgrService.dataSource);        
    this.tree.dataSource.data = this.regionMgrService.regionTree.dataSource;     
  }

  async ngOnInit() {
    await this.regionMgrService.getRegionData();
    if (this.regionMgrService.dataSource.length == 0)
      await this.regionMgrService.addDefaultRegion();

    this.regionMgrService.regionTree.loadTree(this.regionMgrService.dataSource); 
    this.tree.dataSource.data = this.regionMgrService.regionTree.dataSource;
    this.regionMgrService.regionTree.addTreeNode = (node: FlatNode, addNode: TreeNode,item:Region) => {    
       
      this.regionMgrService.addItem = item;    
      /**当根节点无内容时更新 下拉箭头 */
      if(this.regionMgrService.noChildNodes(item.ParentId,1)){
        this.resetTreeNodes();
      
      }
      else  this.tree.addNewItem(node, addNode); 
      this.tree.defaultItem(item.ParentId);
      this.tree.treeControl.expandAll();
    }

    this.tree.defaultItem();
    this.regionMgrService.regionTree.editNodeItem = (node: FlatNode, val: string) => {
      this.tree.editNode(node, val);
    }
 
    
  }

  async delBtnClick() {
    const item= this.regionMgrService.regionTree.findRegion(this.regionMgrService.regionTree.selectedNodeId)
    const success = await this.regionMgrService.delRegionData(this.regionMgrService.regionTree.selectedNodeId);
    if (success) {
      this.tree.delItem(this.regionMgrService.regionTree.selectedNode);
   
      if(this.regionMgrService.noChildNodes(item.ParentId,0)){  
        this.resetTreeNodes();
      }
      this.regionMgrService.regionTree.clearSelectedNode();
      this.tree.defaultItem(item.ParentId); 
      this.tree.treeControl.expandAll();
    }
  }

  addBtnClick() {
    this.regionMgrService.regionTree.addFormState();
  }
}
