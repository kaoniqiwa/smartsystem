/**
 * Developer 施文斌
 * LastUpdateTime  
 */
import { Directive, Input, ElementRef, NgZone, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CandlestickOption } from "./echart";

declare const echarts: any;

@Directive({
    selector: '[EChartCandlestick]'
})
export class EChartCandlestickDirective implements OnChanges, OnInit {

    private ele: any;
    private echarts_: any;
    @Input('options') options: CandlestickOption;
    constructor(private e: ElementRef, private zone: NgZone) {
        window.addEventListener("resize", () => this.echarts_.resize());
    }
    ngOnInit(): void {

    }
    ngOnChanges(changes: SimpleChanges): void {
        if (this.options)
            this.init();
    }

    init() { 
        const options1 = {
            animation: false,

            tooltip: {
                trigger: 'axis',
                formatter: '{b}',
                axisPointer: {
                    lineStyle: {
                        color: '#5e6ebf',
                        width: 1.2
                    }
                }
            }, 
            visualMap: {
                show: false,

                pieces: [{
                    gt: 0.005,
                    lte: 1,
                    color: '#CD661D'
                }, {
                    gte: 0,
                    lte: 0.005,
                    color: '#28ce38'
                }],
                seriesIndex: 0,
            },
            grid: [
                {
                    top: 20,
                    left: '40px',
                    right: '60px',
                    height: '60%',
                },
                {
                    left: '40px',
                    right: '60px',
                    top: '74%',
                    height: '10%'
                }
            ],
            xAxis: [
                {
                    type: 'category',
                    data: this.options.xAxisLine,
                    scale: true,
                    boundaryGap: false,
                    axisLine: {
                        onZero: false,
                        lineStyle: {
                            color: '#7d90bc'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgb(117,134,224,0.3)'
                        }
                    },
                    min: 'dataMin',
                    max: 'dataMax',
                    axisLabel: {
                        color: '#CFD7FE',
                        fontSize: "16",
                    },
                    axisTick: {        //刻度线

                        lineStyle: {
                            color: 'rgb(117,134,224,0.3)'
                        }
                    },
                },
                {
                    type: 'category',
                    gridIndex: 1,
                    data: this.options.xAxisBar,
                    scale: true,
                    boundaryGap: false,
                    axisLine: { show: false, onZero: false },
                    axisTick: { show: false },
                    splitLine: { show: false },
                    axisPointer: {
                        show: true,
                        type: 'none',

                    },

                    min: 'dataMin',
                    max: 'dataMax',

                    axisLabel: {
                        show: false
                    },
                }
            ],
            yAxis: [
                {
                    scale: true,
                    splitArea: {
                        show: false
                    },
                    axisTick: {        //刻度线
                        show: false
                    },

                    axisLine: {
                        show: false,
                        onZero: false,//y轴
                        lineStyle: {
                            color: '#7d90bc'
                        }
                    },
                    axisLabel: {
                        color: '#CFD7FE',
                        fontSize: "16",
                        show: false,
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgb(117,134,224,0.3)'
                        }
                    }
                },
                {
                    scale: true,
                    gridIndex: 1,
                    axisLabel: { show: false },
                    axisLine: { show: false },
                    axisTick: { show: false },
                    splitLine: { show: false },
                    axisPointer: {
                        show: false
                    }
                }
            ],
            dataZoom: [
                {
                    type: 'inside',
                    xAxisIndex: [0, 1],
                    start: 0,
                    end: 100
                },
                {
                    show: true,
                    xAxisIndex: [0, 1],
                    type: 'slider',
                    top: '84%',
                    start: 0,
                    end: 100,
                    fillerColor: 'rgb(117,134,224,0.5)',
                    borderColor: '#5e6ebf',
                    textStyle: {
                        color: '#CFD7FE',
                        fontSize: "16",
                    }
                }
            ],
            series: [{
                    name: 'theLine',
                    type: 'line',
                    data: this.options.lineData, 
                    step: 'end',
                    symbolSize: 8,
                }, {
                    name: 'theLineB',
                    type: 'line',
                    data: this.options.lineDataB,
                    symbolSize: 8,
                    itemStyle: {
                        color: 'gray'
                    }
                },
                {
                    name: 'theBar',
                    type: 'bar',
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    data: this.options.barData
                }
            ]
        }

        this.zone.runOutsideAngular(() => {
            this.echarts_ = echarts.init(this.e.nativeElement);
            this.echarts_.setOption(options1, true);

            this.echarts_.on('click', 'series.bar', (obj: any) => {
                window.event.cancelBubble = true;
                this.options.itemClick(obj);
            });
            this.echarts_.on('click', 'series.line', (obj: any) => {
                window.event.cancelBubble = true;
                this.options.itemClick(obj);
            });
            this.echarts_.getZr().on('dblclick', (obj: any) => {
                window.event.cancelBubble = true;

                const pointInPixel = [obj.offsetX, obj.offsetY]
                    , pointInGrid = this.echarts_.convertFromPixel({ seriesIndex: 0 }, pointInPixel)
                    // x轴数据的索引值
                    , xIndex = pointInGrid[0];
                // 使用getOption() 获取图表的option
                //, op = this.echarts_.getOption();

                // 获取当前点击位置要的数据
                //var xData = op.series[0].data[xIndex];  

                if (pointInGrid[1] > 0)
                    this.options.dbitemClick(this.options.xAxisLine[xIndex]);
            });

            this.echarts_.on('dataZoom', (param: any) => {
                //  console.log(param);

                this.options.dataZoomClick(param);

            });
        });
    }


    reSize() {
        this.zone.runOutsideAngular(() => {
            if (this.echarts_ && this.echarts_.resize)
                this.echarts_.resize();
        });
    }

}

