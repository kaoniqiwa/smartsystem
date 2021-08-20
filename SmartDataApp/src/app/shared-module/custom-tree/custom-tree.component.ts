import { Component, OnInit, Input, EventEmitter } from "@angular/core";
import { FlatTreeControl } from "@angular/cdk/tree";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from "@angular/material/tree";
import {
  TreeNode,
  FlatNode,
  TreeListMode,
  CheckBoxStateEnum,
  ColorEnum,
  RightButton,
  RightButtonArgs,
} from "./custom-tree";
import { Output } from "@angular/core";
import { Division } from "src/app/data-core/model/waste-regulation/division";
@Component({
  selector: "hw-custom-tree",
  templateUrl: "./custom-tree.component.html",
  styleUrls: ["./custom-tree.component.styl"],
})
export class CustomTreeComponent implements OnInit {
  listMode = TreeListMode;
  checkBoxState = CheckBoxStateEnum;
  flatNodeMap = new Map<FlatNode, TreeNode>();
  nestedNodeMap = new Map<TreeNode, FlatNode>();

  selectedItems = new Array<FlatNode>();

  @Input() selectedItemFn: (item: FlatNode, inputVal?: string) => void;
  @Input() checkedItemFn: (item: FlatNode) => void;
  @Output() rightBtnFn: EventEmitter<RightButtonArgs> = new EventEmitter();

  @Output()
  itemExpandClickedEvent: EventEmitter<FlatNode> = new EventEmitter();

  private _treeData: TreeNode[];
  public get treeData(): TreeNode[] {
    return this._treeData;
  }
  @Input()
  public set treeData(v: TreeNode[]) {
    this._treeData = v;
    this.dataSource.data = this._treeData;
  }
  @Input() mode = TreeListMode.nomal;

  /**
   * pmx 2021-08-18
   */

  // 保持选中状态
  @Input() holdStatus: boolean = true;

  // 当关闭的时候，取消当前节点树的选中
  @Input() cancleWhenCollapse: boolean = false;

  // 当前选中的 Item
  private _currentItem: FlatNode | null = null;

  @Output() itemChange = new EventEmitter<FlatNode>();

  ngOnInit() {
    this.dataSource.data = this.treeData;
  }
  /**
   *  将 T型 节点转换为 F型 节点
   * @param node
   * @param level
   * @param parent
   * @returns
   */
  private transformer = (node: TreeNode, level: number, parent?: FlatNode) => {
    const existingNode = this.nestedNodeMap.get(node);
    var flatNode =
      existingNode && existingNode.name == node.name
        ? existingNode
        : new FlatNode();

    flatNode.expanded = false;
    flatNode.name = node.name;
    flatNode.level = level;
    flatNode.iconClass = node.iconClass;
    if (node.children && node.children.length) flatNode.expandable = true;
    else flatNode.expandable = false;
    (flatNode.checked = node.checked), (flatNode.id = node.id);
    flatNode.inputVal = node["inputVal"] || "";
    flatNode.label = node["label"] || "";
    flatNode.labelColor = node.color || ColorEnum.lightbBlue;
    flatNode.rightClassBtn = node.rightClassBtn;
    flatNode.data = node.data;
    if (parent) {
      flatNode.parent = parent;
    }
    if (node.children) {
      flatNode.children = new Array<FlatNode>();
      node.children.map((x) => {
        let item = this.transformer(x, level + 1, flatNode);
        flatNode.children.push(item);
      });
    }

    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);

    return flatNode;
  };

  /**
   *  new FlatTreeControl(getLevel: (dataNode: T) => number,isExpandable: (dataNode: T) => boolean)
   */
  treeControl = new FlatTreeControl<FlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  /**
   *  new MatTreeFlattener(
   *                transformFunction: (node: T, level: number) => F,
   *                getLevel: (node: F) => number),
   *                isExpandable: (node: F) => boolean,
   *                getChildren: (node: T) =>Observable<T[]> | T[] | undefined | null
   *  )
   */
  treeFlattener = new MatTreeFlattener(
    this.transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: FlatNode) => node.expandable;

  touchSpinEvent = (val: string) => {
    setTimeout(() => {
      const item = this.selectedItems ? this.selectedItems[0] : null;
      this.selectedItemFn(item, val);
    });
  };
  constructor() {}

  getLevel = (node: FlatNode) => node.level;

  getParentNode(node: FlatNode): FlatNode | null {
    if (node) {
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
    }

    return null;
  }

  sumChildChecked(childNode: FlatNode, checked: boolean) {
    /**该节点下子元素 */
    //if (childNode.level == 0) return;
    const childs = this.treeControl.getDescendants(childNode);
    childs.map((x) => {
      x.checked = checked;
      var childs1 = this.treeControl.getDescendants(x);

      if (childs1 && childs1.length)
        x.checkBoxState = checked ? this.checkBoxState.all : null;
      else x.checkBoxState = checked ? this.checkBoxState.self : null;
    });
    if (childs && childs.length) {
      childNode.checkBoxState =
        checked == false ? null : this.checkBoxState.all;
    }

    var whileFlatNode = this.getParentNode(childNode);

    const whileNode = () => {
      while (whileFlatNode) {
        var childsNode = this.treeControl.getDescendants(whileFlatNode);

        /**超过上级时 */
        if (childNode.level - 1 != whileFlatNode.level)
          childsNode = childsNode.filter((x) => x.level == childNode.level);

        if (childsNode && childsNode.length) {
          const checked = childsNode.filter((x) => x.checked == false);
          if (checked.length == childsNode.length)
            whileFlatNode.checkBoxState = null;
          else if (checked.length == 0)
            whileFlatNode.checkBoxState = this.checkBoxState.all;
          else whileFlatNode.checkBoxState = this.checkBoxState.self;
          whileFlatNode = this.getParentNode(whileFlatNode);
        } else whileFlatNode = null;
        whileNode();
      }
    };
    whileNode();
  }

  itemExpandClicked(node: FlatNode) {
    const expanded: boolean = this.treeControl.isExpanded(node);
    node.expanded = expanded;

    // 抛出 toogle 的节点
    this.itemExpandClickedEvent.emit(node);

    if (!this._currentItem) return;
    if (this.cancleWhenCollapse) {
      if (!expanded) {
        console.log("当前节点", this._currentItem);
        console.log("关闭的节点", node);
        let parentNode = this._currentItem.parent;
        while (parentNode) {
          if (parentNode.id == node.id) break;
          parentNode = parentNode.parent;
        }
        if (parentNode) {
          let index = this.selectedItems.findIndex(
            (node) => node.id == this._currentItem.id
          );
          if (index > -1) this.selectedItems.splice(index, 1);
          this._currentItem = null;
          // 取消选中
          this.itemChange.emit(this._currentItem);
        }
      }
    }
  }

  get selectedItemClass() {
    return this.selectedItems.length ? this.selectedItems[0].id : null;
  }

  rightBtnClick(item: FlatNode, btn: RightButton) {
    if (btn && btn.click) {
      btn.click(btn);
    }
    if (this.rightBtnFn && this.mode == TreeListMode.rightBtn)
      this.rightBtnFn.emit({ node: item, btn: btn });
  }

  itemClick(item: FlatNode) {
    // console.log(item);
    if (this.mode == TreeListMode.checkedBox) {
      item.checked = !item.checked;
      item.checkBoxState =
        item.checked == false ? null : this.checkBoxState.self;
      this.sumChildChecked(item, item.checked);
      if (this.checkedItemFn) this.checkedItemFn(item);
    } else if (this.mode == TreeListMode.nomal && this._currentItem) {
      this._currentItem.checked = false;
      item.checked = true;
    }

    if (this.selectedItemFn && this.mode != TreeListMode.checkedBox)
      this.selectedItemFn(item);

    if (this._currentItem) {
      let index = this.selectedItems.findIndex(
        (node) => node.id == this._currentItem.id
      );
      if (index > -1) this.selectedItems.splice(index, 1);

      // 特殊操作
      if (this._currentItem.id == item.id) {
        if (!this.holdStatus) {
          this._currentItem = null;
          this.itemChange.emit(this._currentItem);
          return;
        }
      }
    }
    this.itemChange.emit(item);
    this.selectedItems.push(item);
    this._currentItem = item;
  }

  /**
   * 根据 FlatNode 获取它对应的 TreeNode
   * @param node
   * @returns
   */
  flatToTree(node: FlatNode) {
    return this.flatNodeMap.get(node);
  }

  /**
   * 添加单个节点，而不是刷新整个树
   * @param node
   * @param addNode
   */
  addItem(node: FlatNode, addNode: TreeNode) {
    let treeDdata = this.treeData;
    const parentNode = this.flatNodeMap.get(node);
    if (parentNode) {
      parentNode.children = parentNode.children || new Array<TreeNode>();
      parentNode.children.push(addNode);
      this.flatNodeMap.set(node, parentNode);
    } else {
      treeDdata.push(addNode);
    }

    this.treeData = [];
    this.treeData = treeDdata;
  }

  delItem(flatNode: FlatNode) {
    const del = (nodes: TreeNode[], tag: string) => {
        for (var i = nodes.length; i > 0; i--) {
          if (nodes[i - 1].id == tag) nodes.splice(i - 1, 1);
          else {
            if (nodes[i - 1].children) del(nodes[i - 1].children, tag);
          }
        }
      },
      findNode = (nodes: TreeNode[], tag: string) => {
        if (nodes)
          for (const x of nodes) {
            if (x.children) {
              const index = x.children.findIndex((x) => x.id == tag);
              if (index > -1) return true;
            }
            findNode(x.children, tag);
          }
      };
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
      } else if (!id) {
        this.itemClick(key);
        this.treeControl.expand(key);
        break;
      }
    }
  }

  editNode(node: FlatNode, itemValue: string, data?: Division) {
    const nestedNode = this.flatNodeMap.get(node);
    nestedNode.name = itemValue;
    if (data) {
      nestedNode.data = data;
    }
    this.dataSource.data = this.treeData;
  }

  clearNestedNode() {
    this.nestedNodeMap = new Map<TreeNode, FlatNode>();
    this.flatNodeMap = new Map<FlatNode, TreeNode>();
    this.selectedItems = [];
    this._currentItem = null;
  }

  onTreeClicked(sender: any, args: any) {
    console.log(sender);
    console.log(args);
  }
}
