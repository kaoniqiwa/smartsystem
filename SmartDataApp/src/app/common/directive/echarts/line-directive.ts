/**
 * Developer 施文斌
 * LastUpdateTime  
 */
import { Directive, Input, ElementRef, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { LineOption } from "./echart";

declare const echarts:any;

@Directive({
    selector: '[EChartLine]'
})
export class EChartLineDirective implements OnChanges {

    private ele: any;
    private echarts_: any;
    @Input('options') options: LineOption;
    constructor(private e: ElementRef, private zone: NgZone) {
        window.addEventListener("resize", () =>  this.echarts_.resize());
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (this.options) this.init();
    }

    init() {
        const   create = (options: LineOption) => {
                return {
                    grid: {
                        left: '0',
                    top: '20%',
                    right: '10px',
                    bottom: '10px',
                        containLabel: true
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        }
                    },
                    xAxis: {
                        type: 'category',
                        data: options.xAxisData,
                        axisLabel: {
                            color: '#CFD7FE',
                            fontSize: "16",
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
                    series: [{
                        data: options.seriesData,
                        type: 'line',
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                textStyle: {
                                    fontSize: "16",
                                    color: "#fff"
                                }
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
                    }]
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

