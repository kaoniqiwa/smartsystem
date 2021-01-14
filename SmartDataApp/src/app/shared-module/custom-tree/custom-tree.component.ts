import { Component, OnInit, Input } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { TreeNode, FlatNode, TreeListMode, CheckBoxStateEnum, ColorEnum, RightBtn } from "./custom-tree";
@Component({
  selector: 'hw-custom-tree',
  templateUrl: './custom-tree.component.html',
  styleUrls: ['./custom-tree.component.styl']
})
export class CustomTreeComponent implements OnInit {
  listMode = TreeListMode;
  checkBoxState = CheckBoxStateEnum;
  flatNodeMap = new Map<FlatNode, TreeNode>();
  nestedNodeMap = new Map<TreeNode, FlatNode>();

  selectedItems = new Array<FlatNode>();
  @Input() selectedItemFn: (item: FlatNode, inputVal?: string) => void;
  @Input() checkedItemFn: (item: FlatNode) => void;
  @Input() rightBtnFn: (item: FlatNode, btn: RightBtn) => void;
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
    flatNode.iconClass = node.iconClass;
    if (node.children && node.children.length) flatNode.expandable = true;
    else flatNode.expandable = false;
    flatNode.checked = node.checked,
      flatNode.id = node.id
    flatNode.inputVal = node['inputVal'] || '';
    flatNode.label = node['label'] || '';
    flatNode.labelColor = node.color || ColorEnum.lightbBlue;
    flatNode.rightClassBtn = node.rightClassBtn;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);

    return flatNode;
  }

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this.transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: FlatNode) => node.expandable;

  touchSpinEvent = (val: string) => {
    setTimeout(() => {
      const item = this.selectedItems ? this.selectedItems[0] : null;
      this.selectedItemFn(item, val);
    });

  }
  constructor() {

  }

  getLevel = (node: FlatNode) => node.level;

  getParentNode(node: FlatNode): FlatNode | null {
    const currentLevel = this.getLevel(node);
    if (currentLevel < 1) {
      return null;
    }
    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];
      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  sumChildChecked(childNode: FlatNode, checked: boolean) {
    /**该节点下子元素 */
    //if (childNode.level == 0) return;
    const childs= this.treeControl.getDescendants(childNode);
    childs.map(x=>{
        x.checked=checked;
        var childs1= this.treeControl.getDescendants(x);

        if(childs1&&childs1.length) x.checkBoxState = checked ? this.checkBoxState.all : null;
        else x.checkBoxState = checked ? this.checkBoxState.self : null;
    });
    if(childs&&childs.length){
       childNode.checkBoxState = checked == false ? null : this.checkBoxState.all;
    }
    
    var whileFlatNode = this.getParentNode(childNode);
     
    const whileNode = ()=>{
      
      while (whileFlatNode) {
        var childsNode = this.treeControl.getDescendants(whileFlatNode);
  
        /**超过上级时 */
        if( childNode.level-1 != whileFlatNode.level)          
           childsNode= childsNode.filter(x => x.level ==  childNode.level);          
        
        if (childsNode && childsNode.length) {
          const checked = childsNode.filter(x => x.checked == false);
          if (checked.length == childsNode.length)
            whileFlatNode.checkBoxState = null;
          else if (checked.length == 0)
            whileFlatNode.checkBoxState = this.checkBoxState.all;
          else whileFlatNode.checkBoxState = this.checkBoxState.self;
          whileFlatNode =this.getParentNode(whileFlatNode) 
     
        }
        else
          whileFlatNode = null;
          whileNode();
      } 
    }
    whileNode();
  }

  get selectedItemClass() {
    return this.selectedItems.length ? this.selectedItems[0].id : null;
  }

  rightBtnClick(item: FlatNode, btn: RightBtn) {
    if (this.rightBtnFn && this.mode == TreeListMode.rightBtn) this.rightBtnFn(item, btn);
  }

  itemClick(item: FlatNode) {

    var d = this.selectedItems.pop();
    this.selectedItems.push(item);
    if (this.mode == TreeListMode.checkedBox) {
      item.checked = !item.checked;
      item.checkBoxState = item.checked == false ? null : this.checkBoxState.self;
      this.sumChildChecked(item, item.checked);
      if (this.checkedItemFn) this.checkedItemFn(item);
    }
    else if (this.mode == TreeListMode.nomal && d) {
      d.checked = false;
      item.checked = true;
    }
    if (this.selectedItemFn && this.mode != TreeListMode.checkedBox) this.selectedItemFn(item);
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
      else if (!id) {
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
}
