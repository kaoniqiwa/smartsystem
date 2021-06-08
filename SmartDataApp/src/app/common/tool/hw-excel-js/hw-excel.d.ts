 
export declare class HowellExcelJS {
    createBook():any;

    addWorksheet(workbook:any, sheetName:string):any;
    
    getWorksheet(workbook:any,sheetName:string):any;

    setCellValue(worksheet:any,cellName:string,val:string|number):void;

    mergeCells(worksheet:any,cellName:string):any;

    addImageToBook(workbook:any, base64Image:string):any;

    addImageToSheet(worksheet:any, imageId:any, cell:any):any;

     writeFile(workbook:any,filename:string,extension?:string):any;

     load(workbook:any,data:any,cb:(wk:any)=>void):void;

     getBuffer(workbook:any,cb:(buffer:any)=>void):void;
}