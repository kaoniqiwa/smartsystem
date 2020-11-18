/**
 * Developer 施文斌
 * LastUpdateTime  
 */
import { Directive, Input, ElementRef, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { BarOption } from "./echart";

declare const echarts:any;

@Directive({
    selector: '[EChartBar]'
})
export class EChartBarDirective implements OnChanges {

    private ele: any;
    private echarts_:any;
    @Input('options') options: BarOption;
    constructor(private e: ElementRef, private zone: NgZone) {
        window.addEventListener("resize", () =>  this.echarts_.resize());
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (this.options) this.init();
    }

    init() {
        const checkScaleIndex = (index: number,displayScaleIndex:number[]): boolean => {
            if (displayScaleIndex.length == 0)
                return true;
            const i = displayScaleIndex.indexOf(index);
            return i > -1;
        },
         checkDataIndex = (index: number,displayDataIndex:number[]): boolean => {
            if (displayDataIndex.length == 0)
                return true;
            const i =displayDataIndex.indexOf(index);
            return i > -1;
        }
        ,series = (options: BarOption)=>{
            const objs = new Array();
            for (let i = 0; i < options.seriesData.length; i++) {              
                objs.push( {
                    name: options.seriesName[i],
                    type: 'bar',
                    barWidth: options.barWidth,
                    label: {
                        show: true,
                        position: 'top'
                    },
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                formatter: function (obj:any) {
                                    let display = checkDataIndex(obj.dataIndex,options.displayDataIndex);
                                    if (!display)
                                        return ''
                                },
                                position: "top",
                                textStyle: {
                                    fontSize: "16",
                                    color: options.color[i]
                                }
                            },
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0, color:  options.color[i]// 0% 处的颜色
                            }, {
                                offset: 1, color:  options.color2[i]  // 100% 处的颜色
                            }], false),
                        }

                    },
                    data: options.seriesData[i],
                });                
            }
            return objs;
        }
        , create = (options: BarOption) => {
            return {
                color: options.color,
                title: {       
                    subtext: options.subTitle,
                    left: 'right', 
                     subtextStyle:{
                         color:'#7A8DE6'
                     },
                     top:10
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        , shadowStyle: {
                            color: 'none'
                        }
                    }
                },
                grid: {
                    left: '0',
                    top: '20%',
                    right: '10px',
                    bottom: '10px',
                    containLabel: true
                },
                legend: {
                     data: options.legendData.data,
                     itemWidth :options.legendData.itemWidth,
                     itemHeight: options.legendData.itemHeight,
                     right:options.legendData.right,
                     orient:options.legendData.orient,
                     textStyle:{
                         color:options.legendData.color,
                         fontSize :options.legendData.fontSize
                     }
                },
                xAxis: [
                    {
                        type: 'category',
                        data: options.xAxisData,
                        axisLabel: {
                            color: '#CFD7FE',
                            fontSize: "16",
                            interval: function (index: number, value: string) {
                                return checkScaleIndex(index,options.displayScaleIndex);
                            }
                        },
                        axisTick: {        //刻度线
                            show: false,
                            lineStyle: {
                                color: 'rgb(117,134,224,0.5)'
                            }
                        },
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisTick: {        //刻度线
                            show: false
                        },
                        axisLine: {       //y轴
                            show: false
                        },
                        axisLabel: {
                            color: '#d8f4ff',
                            show: false,
                        },
                        splitLine: {
                            lineStyle: {
                                color: 'rgb(117,134,224,0.3)'
                            }
                        }
                    }
                ],
                series: series(options)
            }
        }
        this.zone.runOutsideAngular(() => {
            this.echarts_ = echarts.init(this.e.nativeElement);              
            this.echarts_.setOption(create(this.options), true);
        });
    }

    
  reSize() {
    this.zone.runOutsideAngular(() => {
      if (this.echarts_ && this.echarts_.resize)
        this.echarts_.resize();
    });
  }

}

