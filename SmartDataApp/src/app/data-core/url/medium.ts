import {  IUrl} from "./IUrl";

export class Picture{
    add(){
        return `Medium/Pictures`;
    }
    
    getData(id:string){
        return `Medium/Pictures/${id}.jpg`;
    }

    getJPG(jpg:string){
        return `Medium/Pictures/${jpg}`; 
    }
    

}