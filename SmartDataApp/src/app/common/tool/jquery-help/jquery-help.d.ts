import { EventDataObject } from "../../../data-core/model/waste-regulation/event-data-object";

export declare function moveView(targetDomId:string,moveDomId:string,offsetX:number,offsetY:number);

export declare function domClick(domId:string);

export declare function domClickFn(domId:string,fn?:()=>void);

export declare function inputFileRead(domId:string,loadFileFn:(result: string)=>void);

export declare function scrollTopPostion(domId:string,postion:number);

export declare function enterKeyDown(fn:()=>void);

export declare function removeClass(domId:string,className?:string);

export declare function domCss(domId:string,css:any,symbol?:string);

export declare function addClass(domId:string,className:string);

export declare function hasClassName(domId:string,className:string);

export declare function domSize(domId:string):{width:number,height:number};
 
export declare function drawRectangle(canvasId:string,points:EventDataObject[]
  ,size:{width:number,height:number});

export declare function clearCanvas(canvasId:string);