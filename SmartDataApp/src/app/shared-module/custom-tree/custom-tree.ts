export class CustomExtension {

}

export class TreeNode {
  id: string;
  name: string;
  color:ColorEnum;
  checked: boolean;
  iconClass: string;
  rightClassBtn: string[];
  children?: TreeNode[];
}

export class InputTreeNode extends TreeNode {
  label: string;
  inputVal: string;
}


/** Flat node with expandable and level information */
export class FlatNode {
  expandable: boolean;
  name: string;
  level: number;
  checked: boolean;
  id: string;
  label: string;
  labelColor:ColorEnum;
  inputVal: string;
  iconClass: string;
  rightClassBtn: string[];
  checkBoxState: CheckBoxStateEnum;
  checkedChilds: number = 0;

}

export enum CheckBoxStateEnum {
  part,
  all,
  self
}

export enum TreeListMode {
  nomal,
  rightInput,
  checkedBox,
  rightBtn
}

export enum ColorEnum {
  'white' = 'text-white',
  'lightbBlue' = 'light-blue-text',
  'green'='green-text'
}