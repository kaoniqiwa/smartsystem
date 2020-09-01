export class CustomExtension{

}

export class TreeNode {
    id:string;
    name: string;
    checked:boolean;
    iconClass:string;
    children?: TreeNode[];
  }

  export class InputTreeNode extends TreeNode{
      label:string;
      inputVal:string;
  }
   
  
  /** Flat node with expandable and level information */
  export class FlatNode {
    expandable: boolean;
    name: string;
    level: number;
    checked:boolean;
    id:string;
    label:string;
    inputVal:string;
    iconClass:string;
    checkBoxState:CheckBoxStateEnum;
    checkedChilds:number = 0;

  } 
  
export enum CheckBoxStateEnum{
  part,
  all,
  self
}

  export enum TreeListMode{
     nomal,
     rightInput,
     checkedBox
  }