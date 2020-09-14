import { Injectable } from "@angular/core";

@Injectable()
export class ToolService {
    windowScreen :{ width:number,height:number};
    constructor(){ 
        this.windowScreen = {
            width: window.screen.width,
            height:window.screen.height
        }
    }
}


export function TheDayTime(date: Date) { 
    let y = date.getFullYear(),m =date.getMonth()+1,d = date.getDate();
    return {
       begin: new Date(y,m,d,0,0,0)
       ,end :new Date(y,m,d, 23, 59, 59)
    } 
  }