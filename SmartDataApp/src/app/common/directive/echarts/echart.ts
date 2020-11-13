export interface IEChartsData{

}

export interface IEChartOption{}

export class BarOption implements IEChartOption{
    xAxisData: IEChartsData; 
    seriesData: IEChartsData[];
    seriesName = new Array<string>();
    legendData :{data:string[],itemWidth:number,itemHeight:number
        ,right:number,color:string,fontSize:number  ,orient:string,} = {
        data:[],
        itemHeight:6,
        itemWidth:6,
        right:0,
        color:'white',
        fontSize:12,
        orient:'horizontal'
    };

    color = ['#7586e0','#3184e3','#ffba00'];
    color2 = ['rgb(117,134,224,0.5)','rgb(49,132,227,0.5)','rgb(255,186,0,0.5)'];
    displayScaleIndex:number[]=new Array();
    displayDataIndex:number[]=new Array();
    subTitle='单位(吨)';
    barWidth = 12;
}

export class LineOption implements IEChartOption{
    xAxisData: Array<IEChartsData>; 
    seriesData: Array<IEChartsData>;   
    legendData :{data:string[],right:number,color:string
        ,fontSize:number,orient:string,} = {
        data:[],
        right:0,
        color:'white',
        fontSize:12,
        orient:'horizontal'
    };
    legend:IEChartsData;
    init=true;
    right = '12px';
    left = '12px';
    /**多条 */
    moreLine = false;
    colors = ['#7586e0','#3184e3','#ffba00'];
    colors2 = ['rgb(117,134,224,0.5)','rgb(49,132,227,0.5)','rgb(255,186,0,0.5)'];
    xAxisInterval = [0,5,11,17,23]; // 
    seriesLabel=[0,3,6,9,12,15,18,21];
}

export class PieOption implements IEChartOption{
    legendData:Array<IEChartsData>; 
    seriesData:Array<IEChartsData>; 
}