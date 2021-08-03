export class CustomExtension {}

export class TreeNode<T = any> {
  id: string;
  name: string;
  color: ColorEnum;
  checked: boolean;
  iconClass: string;
  rightClassBtn: RightButton<T>[];
  children?: TreeNode<T>[];
  data: T;
}

export class InputTreeNode<T = any> extends TreeNode<T> {
  label: string;
  inputVal: string;
  data: T;
}

/** Flat node with expandable and level information */
export class FlatNode<T = any> {
  expandable: boolean;
  name: string;
  level: number;
  checked: boolean;
  id: string;
  label: string;
  labelColor: ColorEnum;
  inputVal: string;
  iconClass: string;
  rightClassBtn: RightButton<T>[];
  checkBoxState: CheckBoxStateEnum;
  checkedChilds: number = 0;
  children: FlatNode<T>[];
  data: T;
}

export enum CheckBoxStateEnum {
  part,
  all,
  self,
}

export enum TreeListMode {
  nomal,
  rightInput,
  checkedBox,
  rightBtn,
}

export enum ColorEnum {
  "white" = "text-white",
  "lightbBlue" = "light-blue-text",
  "green" = "green-text",
}

export class RightBtn {
  cssClass: string;
  tag: string;
  constructor(cssClass: string, tag: string) {
    this.cssClass = cssClass;
    this.tag = tag;
  }
}
export class RightButton<T = any> extends RightBtn {
  cssClass: string;
  tag: string;

  private _display?: boolean;

  get display(): boolean {
    if (this._display === undefined) {
      this._display = this.display_predicate(this.data);
    }
    return this._display;
  }
  set display(v: boolean) {
    this._display = v;
  }

  click?: (t: RightButton<T>) => void;
  data?: T;

  constructor(
    cssClass: string,
    tag: string,
    private display_predicate: (t?: T) => boolean = () => true,
    data?: T
  ) {
    super(cssClass, tag);
    this.cssClass = cssClass;
    this.tag = tag;
    this.data = data;
  }
}
export interface RightButtonArgs<T = any> {
  node: FlatNode<T>;
  btn: RightButton<T>;
}
