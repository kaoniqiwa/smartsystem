import { HWSPlayerOptions } from "../../../common/directive/wsplayer-directive";

export class GalleryRollPage{
    items: Map<number,Gallery>;
    leftBottom:{
        text:number;
    };
    videoOptions:HWSPlayerOptions;  
    index =1;
    autoChangePage = true; 
}

export class Gallery{
    title:{ 
        state:string;
        text:string;
        id:string;
        eventNumber:number;
    };
    imgDesc:{
        src:string,
        desc:string; 
        tag:any;
        state:boolean;
    }[];     
    index =1;   
}