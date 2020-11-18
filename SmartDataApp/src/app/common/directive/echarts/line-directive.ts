/**
 * Developer 施文斌
 * LastUpdateTime  
 */
import { Directive, Input, ElementRef, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { LineOption } from "./echart";

declare const echarts: any;

@Directive({
    selector: '[EChartLine]'
})
export class EChartLineDirective implements OnChanges {

    private ele: any;
    private echarts_: any;
    @Input('options') options: LineOption;
    constructor(private e: ElementRef, private zone: NgZone) {
        window.addEventListener("resize", () => this.echarts_.resize());
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (this.options && this.options.init)
            this.init();
        // if (this.options&&changes.options.previousValue == null) 
        //     this.init();
    }

    init() {
        const checkDataIndex = (index: number, displayDataIndex: number[]): boolean => {
            if (displayDataIndex.length == 0)
                return true;
            const i = displayDataIndex.indexOf(index);
            return i > -1;
        }, seriesConfig = (options: LineOption) => {
            if (options.moreLine == false) {
                return [{
                    data: options.seriesData,
                    type: 'line',
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                fontSize: "16",
                                color: "#fff"
                            },
                            formatter: function (obj: any) {
                                if (options.seriesLabel != null) {
                                    let display = checkDataIndex(obj.dataIndex, options.seriesLabel);
                                    if (!display)
                                        return ''
                                }
                            },
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#7586e0',
                            lineStyle: {
                                color: '#7586e0',
                                width: 4
                            },

                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0, color: '#7586e0' // 0% 处的颜色
                            }, {
                                offset: 1, color: 'rgb(117,134,224,0.5)' // 100% 处的颜色
                            }], false)
                        }
                    }
                }];
            }
            else{
                const configs = new Array();
                var i = 0;
                options.seriesData.map((x:any)=>{
                     configs.push({
                        data: x.data,
                        name:x.name,
                        type: 'line',
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                textStyle: {
                                    fontSize: "16",
                                    color: options.colors[i]
                                },
                                formatter: function (obj: any) {
                                    if (options.seriesLabel != null) {
                                        let display = checkDataIndex(obj.dataIndex, options.seriesLabel);
                                        if (!display)
                                            return ''
                                    }
                                },
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: options.colors[i],
                                lineStyle: {
                                    color: options.colors[i],
                                    width: 4
                                },
    
                            }
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0, color: options.colors[i] // 0% 处的颜色
                                }, {
                                    offset: 1, color: options.colors2[i] // 100% 处的颜色
                                }], false)
                            }
                        }
                    });
                    i+=1;
                });
                return configs;
            }
        }

        const create = (options: LineOption) => {
            return {
                grid: {
                    left: options.left,
                    top: '20%',
                    right: options.right,
                    bottom: '10px',
                    containLabel: true
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                legend: {
                    data: options.legendData.data,
                    orient:options.legendData.orient,
                    right:options.legendData.right,
                    textStyle:{
                        color:options.legendData.color,
                        fontSize :options.legendData.fontSize
                    }
               },
                // title: {       
                //     subtext: '单位(起)',
                //     left: 'right', 
                //      subtextStyle:{
                //          color:'#7A8DE6'
                //      },
                //      top:-6
                // },
                xAxis: {
                    type: 'category',
                    data: options.xAxisData,
                    axisLabel: {
                        color: '#CFD7FE',
                        fontSize: "16",
                        interval: function (index: number, value: string) {
                            return options.xAxisInterval.indexOf(index) > -1;
                        }
                    },
                    axisTick: {        //刻度线
                        show: false,
                        lineStyle: {
                            color: 'rgb(117,134,224,0.3)'
                        }
                    },
                },
                yAxis: {
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
                },
                series: seriesConfig(options)
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

