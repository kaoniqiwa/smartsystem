export  class ExcelData{
    chart:string;
    chartTitle:string;
    titles:Array<string>;
    dataKey:Array<string>;
    fields:Array<string>;
    fieldName:Array<string>;
    chartCatStrRef:string;
    data:any;  
    dataLen:number;
    constructor(){
        this.dataLen = 9;
    }
}
/**csv 导出 标题 及 列标题key */
export const   TITLEKEY='TITLEKEY';
export const   COLNAME='COLNAME';