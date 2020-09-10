export interface IEChartsData{

}

export interface IEChartOption{}

export class BarOption implements IEChartOption{
    xAxisData: IEChartsData; 
    seriesData: IEChartsData[];
    seriesName = new Array<string>();
    legendData = new Array<string>();
    color = ['#3283e5', '#FEBD00', '#4cabce', '#e5323e'];
    color2 = ['rgb(50,131,229,0.5)','rgb(254,189,0,0.5)']
    displayScaleIndex:number[]=new Array();
    displayDataIndex:number[]=new Array();
}

export class LineOption implements IEChartOption{
    xAxisData: IEChartsData; 
    seriesData: IEChartsData;   
}

export class PieOption implements IEChartOption{
    legendData: IEChartsData; 
    seriesData: IEChartsData;   
}