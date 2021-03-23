
export class LevelListPanel{
     listNodes:ListNode[];
     last?:boolean;
}

export  class ListNode{
    id:string;
    name:string;
    parentId:string;
    head:boolean;
    last?:boolean;
    
}