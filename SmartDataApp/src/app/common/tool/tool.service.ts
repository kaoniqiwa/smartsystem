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

  
  export function Percentage(num:number, total:number) { 
    if (num == 0 ) return 100;    
    else  if(total == 0) return 0;
    return (Math.round(num / total * 10000) / 100.00);// 小数点后两位百分比
}