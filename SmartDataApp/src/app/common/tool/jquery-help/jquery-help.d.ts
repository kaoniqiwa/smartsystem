export declare function moveView(targetDomId:string,moveDomId:string,offsetX:number,offsetY:number);

export declare function domClick(domId:string);

export declare function domClickFn(domId:string,fn?:()=>void);

export declare function inputFileRead(domId:string,loadFileFn:(result: string)=>void);

export declare function scrollTopPostion(domId:string,postion:number);

export declare function enterKeyDown(fn:()=>void);

export declare function removeClass(domId:string,className?:string);

export declare function domCss(domId:string,css:any);

export declare function addClass(domId:string,className:string);

export declare function hasClassName(domId:string,className:string);

export declare function domSize(domId:string):{width:number,height:number};
 
export declare function drawRectangle(canvasId:string,point1:{x:number,y:number}
    , point2:{x:number,y:number}, point3:{x:number,y:number}, point4:{x:number,y:number});