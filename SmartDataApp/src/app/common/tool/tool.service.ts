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