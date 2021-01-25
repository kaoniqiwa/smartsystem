/**
 * Developer 施文斌
 * LastUpdateTime  
 */
import { Directive, Input, ElementRef, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { BarOptionV2 } from "./echart";

declare const echarts:any;

@Directive({
    selector: '[EChartBarV2]'
})
export class EChartBarDirectiveV2 implements OnChanges {

    private ele: any;
    private echarts_:any;
    @Input('options') options: BarOptionV2;
    constructor(private e: ElementRef, private zone: NgZone) {
        window.addEventListener("resize", () =>  this.echarts_.resize());
    }
    ngOnChanges(changes: SimpleChanges): void { 
        if (this.options) this.init();
    }

    init() {
        const series = (options: BarOptionV2)=>{
            const objs = new Array();
            for (let i = 0; i < options.seriesData.length; i++) {              
                objs.push( {
                    name: options.seriesName[i],
                    type: 'bar',
                    barMinHeight:10, 
                    barWidth: options.barWidth,
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                position:'insideTopLeft',
                                textStyle: {
                                    fontSize: "18",
                                    color: 'white'
                                },
                                padding:[-26,0,0,0],
                            }
                        }

                    },
                    data: options.seriesData[i],
                });                
            }
            return objs;
        }
        , create = (options: BarOptionV2) => {
            return {
                color: options.color,
                title: {       
                    left: 'right', 
                     subtextStyle:{
                         color:'#7A8DE6'
                     },
                     top:10
                },
                grid: {
                    left: 0,
                    top: '10px',
                    right: 0,
                    bottom: '0',
                    containLabel: true
                },
                xAxis: [ {
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
                            },
                            show: false
                        }
                    }
                ],
                yAxis: [
                    {
                      
                        type: 'category',
                        data: options.yAxisData,
                        axisLabel: {
                            color: '#CFD7FE',
                            fontSize: "18",                         
                            padding: [0, 0,6,0]
                        },
                        axisTick: {        //刻度线
                            show: false,
                            lineStyle: {
                                color: 'rgb(117,134,224,0.5)'
                            }
                        },
                        axisLine: {       //y轴
                            show: false
                        },
                    }
                ],
                series: series(options)
            }
        }
        this.zone.runOutsideAngular(() => {
            if(this.echarts_)   this.echarts_.dispose();
            this.echarts_ = echarts.init(this.e.nativeElement);    
         //console.log(JSON.stringify(create(this.options)));
            
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

