export declare function moveView(targetDomId:string,moveDomId:string,offsetX:number,offsetY:number);

export declare function domClick(domId:string);

export declare function domClickFn(domId:string,fn?:()=>void);

export declare function inputFileRead(domId:string,loadFileFn:(result: string)=>void);