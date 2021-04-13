export class OrderTable{
    title:string;
    table:{
        name:string;
        subName:string;
        subNameAfter:string;
    }[];
    dropList:{
        listNodes:Array<{
            id:string;
            name:string; 
         }>;
         fontSize:string;
         defaultId:string;
         eventType:number;
    }
    dropListV1:{
        listNodes:Array<{
            id:string;
            name:string; 
         }>;
         fontSize:string;
         defaultId:string;
         eventType:number;
    }
}