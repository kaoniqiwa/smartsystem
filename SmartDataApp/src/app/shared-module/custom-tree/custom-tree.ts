export class TreeNode {
    id:string;
    name: string;
    checked:boolean;
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
  } 
  


  export enum TreeListMode{
     nomal,
     rightInput
  }