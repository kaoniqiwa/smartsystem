import { ColorEnum } from "../card-content-factory";
export class GalleryRollPage{
    items: Map<number,Gallery>;
    leftBottom:{
        color:ColorEnum;
        text:number;
    };
    index =1;
}

export class Gallery{
    title:{
        color:ColorEnum;
        text:string;
        id:string;
    };
    imgDesc:{
        src:string,
        desc:string; 
        tag:any;
        state:boolean;
    }[];     
   
}