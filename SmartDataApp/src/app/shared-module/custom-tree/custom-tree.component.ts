import { Component, OnInit, Input } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { TreeNode, FlatNode,TreeListMode } from "./custom-tree";
@Component({
  selector: 'hw-custom-tree',
  templateUrl: './custom-tree.component.html',
  styleUrls: ['./custom-tree.component.styl']
})
export class CustomTreeComponent implements OnInit {
  listMode = TreeListMode;
  flatNodeMap = new Map<FlatNode, TreeNode>();
  nestedNodeMap = new Map<TreeNode, FlatNode>();

  selectedItems = new Array<FlatNode>();
  @Input() selectedItemFn: (item: FlatNode,inputVal?:string) => void; 
  @Input() treeData: TreeNode[];
  @Input() mode = TreeListMode.nomal;

   ngOnInit() {
    this.dataSource.data = this.treeData;

  }
  private transformer = (node: TreeNode, level: number) => {

    const existingNode = this.nestedNodeMap.get(node);
    var flatNode = existingNode && existingNode.name == node.name
      ? existingNode
      : new FlatNode();

    flatNode.name = node.name;
    flatNode.level = level;
    if (node.children && node.children.length) flatNode.expandable = true;
    else flatNode.expandable = false;
    flatNode.checked = node.checked,
      flatNode.id = node.id
      flatNode.inputVal=node['inputVal'] ||'';
      flatNode.label=node['label'] ||'';
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this.transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  touchSpinEvent = (val:string)=>{
    setTimeout(() => {
      const item = this.selectedItems ? this.selectedItems[0] : null;
      this.selectedItemFn(item,val); 
    });
  
  }
  constructor() {

  }

  itemClick(item: FlatNode) {
    var d = this.selectedItems.pop();
    if (d) d.checked = false;
    item.checked = true;
    this.selectedItems.push(item);
    
    if (this.selectedItemFn) this.selectedItemFn(item);
  }

  getChildNodes(node: FlatNode) {
    return this.flatNodeMap.get(node);
  }

  addNewItem(node: FlatNode, addNode: TreeNode) {
    const parentNode = this.flatNodeMap.get(node);
    parentNode.children = parentNode.children || new Array<TreeNode>();
    parentNode.children.push(addNode);
    this.dataSource.data = this.treeData;
  }


  delItem(flatNode: FlatNode) {
    const del = (nodes: TreeNode[], tag: string) => {
      for (var i = nodes.length; i > 0; i--) {
        if (nodes[i - 1].id == tag)
          nodes.splice(i - 1, 1);
        else {
          if (nodes[i - 1].children)
            del(nodes[i - 1].children, tag);
        }
      }
    }, findNode = (nodes: TreeNode[], tag: string) => {
      if (nodes)
        for (const x of nodes) {
          if (x.children) {
            const index = x.children.findIndex(x => x.id == tag);
            if (index > -1)
              return true;
          }
          findNode(x.children, tag);
        }
    }
    /** 当根下无子元素 刷新 */
    var parentNode: TreeNode;
    for (const x of this.treeData) {
      const has = findNode([x], flatNode.id);
      if (has) {
        parentNode = x;
        break;
      }
    }

    del(this.treeData, flatNode.id);
    /** 当根下无子元素 刷新 */
    if (parentNode && parentNode.children.length == 0)
      this.nestedNodeMap = new Map<TreeNode, FlatNode>();
    this.dataSource.data = this.treeData;
  }

  defaultItem(id?: string) {
    for (let key of this.flatNodeMap.keys()) {
      if (id && key.id == id) { 
        this.itemClick(key);
        this.treeControl.expand(key);
        break;
      }
      else if(!id){
        this.itemClick(key);
        this.treeControl.expand(key);
        break;
      }
    }
  }

  editNode(node: FlatNode, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
    nestedNode.name = itemValue;
    this.dataSource.data = this.treeData;
  }

  clearNestedNode() {
    this.nestedNodeMap = new Map<TreeNode, FlatNode>();
    this.flatNodeMap = new Map<FlatNode, TreeNode>();
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;


}
